import * as ActionType from '../actions/users'
import Immutable from 'immutable'

let defaultState = Immutable.fromJS([]);
function usersReducer (state = defaultState, action) {
  switch(action.type) {
    case ActionType.LOADED_USERS:
      return Immutable.fromJS(action.response);

    default:
      return state;
  }
}

export default usersReducer;
