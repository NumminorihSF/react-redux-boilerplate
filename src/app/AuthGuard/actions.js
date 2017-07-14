/** @flow */
import { CALL_API } from 'store/middleware/api';

export function checkAuth({ afterError, afterSuccess }: { afterSuccess: Function, afterError: Function }): Object {
  const result: any = {};
  result[CALL_API] = {
    method: 'get',
    path: '/path-to-check-auth',
    unifier: 'checkAuth',
    afterSuccess,
    afterError,
  };

  return result;
}


export const USER_SET_BACK_URL = Symbol('USER_SET_BACK_URL');

export function setBackUrl({ pathname, search }: { pathname: string, search: string }): Object {
  return {
    type: USER_SET_BACK_URL,
    pathname,
    search,
  };
}
