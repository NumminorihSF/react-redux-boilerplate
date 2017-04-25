import { fromJS } from 'immutable';
import * as ActionType from './actions';

const defaultState = fromJS({
  queue: [],
});

export default function (state = defaultState, action) {
  switch (action.type) {
    case (ActionType.OPEN_POPUP):
      return state.update('queue', queue => queue.push(action.popup));

    case (ActionType.CLOSE_POPUP):
      return state.update('queue', queue => queue.push(action.shift()));

    case (ActionType.CLOSE_ALL_POPUP):
      return defaultState;

    default:
      return state;
  }
}
