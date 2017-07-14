/** @flow */
/** @module middleware */
import type { Store, Middleware } from 'redux';

import superAgent from 'superagent';
import Promise from 'bluebird';
import config from 'config';
import { camelizeKeys, decamelizeKeys } from 'humps';

import { getCookieHeader, getCookieSetter, setCookie, setCookieHeader, isFunction } from './utils';

import createQueue, { AbortingError } from './queue';
import save from './save';

const { constants }: { constants: any } = config;
const { API } = constants;
const { BASE_URL, EXTRA_URL } = API;
const requestsQueue = createQueue();

const CASE_TRANSFORM = 'caseTransform';
const DEFAULT_KEY = 'DEFAULT';
const BASES = {
  ...EXTRA_URL,
  [DEFAULT_KEY]: BASE_URL,
};

export const BASE = Object.keys(BASES).reduce((res, key) => ({ ...res, [key]: key }), {});

/** @typedef {Object} CallApi */
/** @typedef {Object} MiddlewareApi.ChainApi */

/**
 * Dispatching event with object with such key generates 1 API request.
 * Value of CALL_API key should be an object with fields.
 * Fields available:
 * @param method {String} - HTTP method (GET, POST, PUT, ...)
 * @param cookie {Object} - pass an src/client/cookie module from client
 * @param path {String} - HTTP url pathname (remember, that middleware append BASE_URL env before this pathname)
 * @param query {Object} - query object
 * @param body {Object|String} - HTTP request's body.
 * @param startType {String|Symbol} - ActionType to dispatch before api call. Action object will be:
 *    ` { type: params.startType, url : params.url , query : params.query} ` There url is full url.
 * @param beforeStart {Function} - Function to call before api call.
 * @param successType {String|Symbol} - ActionType to dispatch on success api call. Action object will be:
 *    ` { type: params.successType, response : responseBody} `
 * @param errorType {String|Symbol} - ActionType to dispatch on error api call. Action object will be:
 *    ` { type: params.successType, error : anErrorObject} `
 * @param afterSuccess {Function} - Function to call then api call succeeds.
 * @param afterError {Function} - Function to call then api call errors.
 *
 *
 * @example
 *     export function loadQuestions() {
 *       return {
 *         [CALL_API]: {
 *           method: 'get',
 *           path: '/api/questions',
 *           successType: LOADED_QUESTIONS
 *         }
 *       }
 *     }
 * @type {Symbol}
 */
export const CALL_API = Symbol('CALL_API');

/**
 * Dispatching event with object with such key generates many chained API request.
 * Value of CHAIN_API key should be an array with functions returning CALL_API actions.
 * Every function will got previous response's body as an argument.
 *
 * @example
 *     export function loadQuestionDetail ({ id, history }) {
 *      return {
 *        [CHAIN_API]: [
 *          ()=> {
 *            return {
 *              [CALL_API]: {
 *                method: 'get',
 *                path: `/api/questions/${id}`,
 *                startType: LOAD_QUESTION_DETAIL,
 *                successType: LOADED_QUESTION_DETAIL,
 *                afterError: ()=> {
 *                  history.push('/')
 *                }
 *              }
 *            }
 *          },
 *          (question) => {
 *            return {
 *              [CALL_API]: {
 *                method: 'get',
 *                path: `/api/users/${question.userId}`,
 *                successType: LOADED_QUESTION_USER
 *              }
 *            }
 *          }
 *        ]
 *      }
 *    }
 */
export const CHAIN_API = Symbol('CHAIN_API');

const IS_CALL_API_ORIGINAL = Symbol('IS_CALL_API_ORIGINAL');

const globalErrorTypes = [];
const globalAfterErrors = [];
const middlewareErrorTypes = [];

class ApiError {
  name: string;
  message: string;
  stack: string;
  // static prototype: Object

  constructor(error: Error) {
    this.name = this.constructor.name;
    this.message = error.message;
    this.stack = error.stack;
  }
}

const a: any = ApiError;
a.prototype = Object.create(Error.prototype);


function extractParams(callApi) {
  const {
    method,
    cookie,
    path,
    query,
    body,
    startType,
    beforeStart,
    successType,
    errorType,
    afterSuccess,
    afterError,
    maxCount,
    dislodging = false,
    base = DEFAULT_KEY,
    ...changeableParams
  } = callApi;
  let {
    // eslint-disable-next-line no-use-before-define
    unifier = defaultUnifier(callApi),
  } = changeableParams;

  const url = `${BASES[base]}${path}`;
  const cookieHeader = getCookieHeader(cookie);
  const setCookie = getCookieSetter(url, cookie);

  if (unifier instanceof Function) unifier = unifier(callApi);

  return {
    ...changeableParams,
    method: method.toLowerCase(),
    url,
    cookieHeader,
    setCookie,
    query,
    body,
    startType,
    beforeStart,
    successType,
    errorType,
    afterSuccess,
    afterError,
    unifier,
    maxCount,
    dislodging,
  };
}

function getRequestObject({ params }) {
  const { headers = {}, download = false, [CASE_TRANSFORM]: caseTransform = false } = params;
  const tempReq:any = Object.keys(headers).reduce(
    (innerReq: any, header) => innerReq.set(header, headers[header]),
    setCookieHeader(superAgent[params.method](params.url), params),
  );
  let req = tempReq;
  if (download) {
    req = tempReq.responseType('blob');
  }
  // If body is formdata, don't decamlize
  if (Object.prototype.toString.call(params.body) === '[object FormData]') {
    return req.send(params.body);
  }
  if (caseTransform) {
    return req.send(decamelizeKeys(params.body));
  }
  return req.send(params.body);
}

function actionWith(action, toMerge) {
  const ret = Object.assign({}, action, toMerge);
  delete ret[CALL_API];
  delete ret[CHAIN_API];
  return ret;
}

function performPreStart({ dispatch, params, apiAction, getState }) {
  if (params.startType) {
    dispatch(actionWith(apiAction, {
      type: params.startType,
      url: params.url,
      query: params.query,
    }));
  }

  if (isFunction(params.beforeStart)) {
    params.beforeStart({ dispatch, getState });
  }
}

function performError({ dispatch, err, params, apiAction, getState, resBody, reject, response }) {
  const tempErr = new ApiError(err);
  {
    const { cookieHeader, ...requestParams } = params;
    globalAfterErrors.map(cb => cb({ dispatch, getState, response, resBody }));

    if (!params.skipGlobalErrorHandler) {
      globalErrorTypes.map(type => dispatch(actionWith(apiAction, {
        requestParams,
        type,
        response,
        resBody,
      })));
    }
  }
  if (params.errorType) {
    dispatch(actionWith(apiAction, {
      ...params.errorParams,
      type: params.errorType,
      error: tempErr,
      response: resBody,
    }));
  }

  if (isFunction(params.afterError)) {
    params.afterError({ dispatch, getState, response, resBody });
  }
  reject(err);
}
function performSuccess({ dispatch, params, apiAction, getState, resBody, resolve, response }) {
  setCookie(response, params.setCookie);

  if (params.successType) {
    dispatch(actionWith(apiAction, {
      ...params.successParams,
      type: params.successType,
      response: resBody,
    }));
  }

  if (isFunction(params.afterSuccess)) {
    params.afterSuccess({ getState, dispatch, response: resBody });
  }
  resolve(resBody);
}

function createRequestPromise(apiActionCreator, next, getState, dispatch) {
  return (prevBody) => {
    const apiAction = apiActionCreator(prevBody);
    if (apiAction[CHAIN_API]) {
      const promiseCreators = apiAction[CHAIN_API].map(
        apiActionCreator => createRequestPromise(apiActionCreator, next, getState, dispatch),
      );
      return promiseCreators.reduce(
        (promise, creator) => promise.then(body => creator(body)),
        Promise.resolve(prevBody),
      );
    }
    let resolveRequest;
    let rejectRequest;
    const deferred = new Promise((res, rej) => {
      [resolveRequest, rejectRequest] = [res, rej];
    });
    const params = extractParams(apiAction[CALL_API]);

    requestsQueue.push(params.unifier, params.maxCount, (error) => {
      if (error) return rejectRequest(error);
      let request;
      const prom = new Promise((resolve, reject) => {
        const baseOptions = { dispatch, params, apiAction, getState };
        performPreStart({ ...baseOptions });

        request = getRequestObject({ params })
          .withCredentials()
          .query(params.query)
          .end((err, response) => {
            const baseAfterResp = { ...baseOptions, response };
            if (params.download) save(response);

            let resBody;
            if (response && response.body) {
              resBody = params[CASE_TRANSFORM] ? camelizeKeys(response.body) : response.body;
            }

            if (err) {
              const error = err instanceof Error ? err : new Error(err);
              return performError({ ...baseAfterResp, err: error, resBody, reject });
            }

            return performSuccess({ ...baseAfterResp, resBody, resolve });
          });
      })
        .then(resolveRequest)
        .catch(rejectRequest);

      return {
        abort: () => request.abort(),
        then: cb => prom.then(cb),
        catch: cb => prom.catch(cb),
      };
    }, params.dislodging);

    return deferred;
  };
}

export default ({ dispatch, getState }: Store<mixed, Object>) =>
  (next: Middleware<mixed, Object>) =>
    (action: Object) => {
      if (!action) return next(action);
      if (action[CALL_API]) {
        action[CALL_API][IS_CALL_API_ORIGINAL] = true; // eslint-disable-line no-param-reassign
        const nextAction: any = {};
        nextAction[CHAIN_API] = [
          () => action,
        ];
        return dispatch(nextAction);
      }

      if (!action[CHAIN_API]) {
        return next(action);
      }

      let resolve;
      const deferred = new Promise((res) => {
        [resolve] = [res];
      });

      const promiseCreators = action[CHAIN_API].map(
        apiActionCreator => createRequestPromise(apiActionCreator, next, getState, dispatch),
      );

      const overall = promiseCreators.reduce(
        (promise, creator) => promise.then(body => creator(body)),
        Promise.resolve(),
      );

      overall.finally(() => {
        resolve();
      }).catch((error) => {
        if (error instanceof ApiError) return;
        if (error instanceof AbortingError) return;
        middlewareErrorTypes.map(type => dispatch(actionWith(action, {
          error,
          type,
        })));
      });

      return deferred;
    };


export function addGlobalErrorType(type: string | Symbol) {
  if (globalErrorTypes.indexOf(type) === -1) {
    globalErrorTypes.push(type);
  }
}
export function addGlobalAfterError(cb: Function) {
  if (globalAfterErrors.indexOf(cb) === -1) {
    globalAfterErrors.push(cb);
  }
}

export function addMiddlewareErrorType(type: string | Symbol) {
  if (middlewareErrorTypes.indexOf(type) === -1) {
    middlewareErrorTypes.push(type);
  }
}

const defaultUnifier: Function = (function () {
  let increment = 1;
  const defaultPrefix = '__default__';
  return function getDefaultUnifier(params): string {
    if (!params[IS_CALL_API_ORIGINAL]) return `${defaultPrefix}${increment++}`;
    if (params.method && params.method.toLowerCase() !== 'get') {
      return `NOT_GET (${params.method}) ${defaultPrefix}${increment++}`;
    }
    return `${params.method} ${params.path} ${JSON.stringify(params.query)}`;
  };
}());
