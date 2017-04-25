/** @flow */
import { Map } from 'immutable';

import * as ActionType from '../actions';

const defaultState = Map({
  data: [],
  pagination: {
    start: 0,
    end: 0,
    page: 0,
    size: 50,
  },
});

function conferencesReducer(state: Map<string, *> = defaultState, action: Object): Map<string, *> {
  switch (action.type) {
    case ActionType.LOADED_CONFERENCES:
      return state.merge({ data: action.response });

    default:
      return state;
  }
}

export default conferencesReducer;
