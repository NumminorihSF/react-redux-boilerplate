/** @flow */
import { Map } from 'immutable';

import { LOCATION_CHANGE } from 'react-router-redux';

const defaultState = Map({
  locationBeforeTransitions: null,
});

export default (state: Map<string, *> = defaultState, action: Object): Map<string, *> => {
  switch (action.type) {
    case LOCATION_CHANGE:
      return state.merge({
        locationBeforeTransitions: action.payload,
      });

    default:
      return state;
  }
};
