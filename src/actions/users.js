import { CALL_API, CHAIN_API } from '../middleware/api'

export const LOADED_USERS = Symbol('LOADED_USERS');
export function loadUsers() {
  return {
    [CALL_API]: {
      method: 'get',
      path: '/api/users',
      successType: LOADED_USERS
    }
  }
}

export const LOADED_USER_DETAIL = Symbol('LOADED_USER_DETAIL');
export function loadUserDetail ({ id, history }) {
  return {
    [CALL_API]: {
      method: 'get',
      path: `/api/users/${id}`,
      successType: LOADED_USER_DETAIL,
      afterError: ()=> {
        history.push('/')
      }
    }
  }
}
