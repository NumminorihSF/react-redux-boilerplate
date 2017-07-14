/** @flow */
import { fromJS, Map } from 'immutable';

import * as ActionType from './actions';

const defaultState = fromJS({
  backUrl: '/',
});

export default function reducer(state: Map<string, *> = defaultState, action: Object): Map<string, *> {
  switch (action.type) {
    case ActionType.USER_SET_BACK_URL:
      return state.set('backUrl', `${action.pathname}${action.search}`);

    default:
      return state;
  }
}
