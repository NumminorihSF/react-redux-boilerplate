import Immutable from 'immutable'
import { LOCATION_CHANGE } from 'react-router-redux'

const defaultState = Immutable.fromJS({
  locationBeforeTransitions: null
});

export default (state = defaultState, action) => {
  switch (action.type) {
    case LOCATION_CHANGE:
      return state.merge({
        locationBeforeTransitions: action.payload
      });

    default:
      return state;
  }
};
