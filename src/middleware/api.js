import superAgent from 'superagent'
import Promise, { using } from 'bluebird'

import config from '../config'
import { camelizeKeys } from 'humps'

export const CALL_API = Symbol('CALL_API');
export const CHAIN_API = Symbol('CHAIN_API');

export default ({ dispatch, getState }) => next => action => {
  if (action[CALL_API]) {
    return dispatch({
      [CHAIN_API]: [
        ()=> action
      ]
    })
  }

  let resolve, reject;
  let deferred = new Promise(function(res, rej){
    [resolve, reject] = [res, rej];
  });

  if (! action[CHAIN_API]) {
    return next(action)
  }

  let promiseCreators = action[CHAIN_API].map((apiActionCreator)=> {
    return createRequestPromise(apiActionCreator, next, getState, dispatch)
  });

  let overall = promiseCreators.reduce((promise, creator)=> {
    return promise.then((body)=> {
      return creator(body)
    })
  }, Promise.resolve());

  overall.finally(()=> {
    resolve();
  }).catch(()=> {});

  return deferred;
}

function isObject(value){
  let type = typeof value;
  return !!value && (type === 'object' || type === 'function');
}

function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in older versions of Chrome and Safari which return 'function' for regexes
  // and Safari 8 which returns 'object' for typed array constructors.
  return isObject(value) && Object.prototype.toString.call(value) === '[object Function]';
}

function actionWith (action, toMerge) {
  let ret = Object.assign({}, action, toMerge);
  delete ret[CALL_API];
  return ret;
}

function createRequestPromise (apiActionCreator, next, getState, dispatch) {
  return (prevBody)=> {
    let apiAction = apiActionCreator(prevBody);
    let resolve, reject;
    let deferred = new Promise(function(res, rej){
      [resolve, reject] = [res, rej];
    });
    let params = extractParams(apiAction[CALL_API]);

    superAgent[params.method](params.url)
      .send(params.body)
      .query(params.query)
      .end((err, res)=> {
        if (err) {
          if ( params.errorType ) {
            dispatch(actionWith(apiAction, {
              type: params.errorType,
              error: err
            }))
          }

          if (isFunction(params.afterError)) {
            params.afterError({ getState })
          }
          reject(err);
        } else {
          let resBody = camelizeKeys(res.body);
          dispatch(actionWith(apiAction, {
            type: params.successType,
            response: resBody
          }));

          if (isFunction(params.afterSuccess)) {
            params.afterSuccess({ getState })
          }
          resolve(resBody);
        }
      });

    return deferred;
  }
}

function extractParams (callApi) {
  let {
    method,
    path,
    query,
    body,
    successType,
    errorType,
    afterSuccess,
    afterError
  } = callApi;

  let url = `${config.API_BASE_URL}${path}`;

  return {
    method,
    url,
    query,
    body,
    successType,
    errorType,
    afterSuccess,
    afterError
  };
}
