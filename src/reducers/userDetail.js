import * as ActionType from '../actions/users'
import Immutable from 'immutable'

let defaultState = Immutable.fromJS({});

export default function(state = defaultState, action) {
  switch(action.type) {
    case ActionType.LOADED_USER_DETAIL:
      return state.merge(action.response);

    default:
      return state;
  }
}
