/** @flow */
import { Map } from 'immutable';

import * as ActionType from '../actions';

const defaultState = Map({
  conferences: {},
  users: {},
});

export default function (state: Map<string, *> = defaultState, action: Object): Map<string, *> {
  switch (action.type) {
    case ActionType.LOAD_CONFERENCE_DETAIL:
      return state.setIn(['conferences', action.conferenceId, 'loading'], true);

    case ActionType.LOADED_CONFERENCE_DETAIL:
      return state.updateIn(['conferences', action.conferenceId], state => state.merge({ ...action.response, loading: false }));

    case ActionType.LOADED_CONFERENCE_USER:
      return state.merge({ user: action.response });

    default:
      return state;
  }
}
