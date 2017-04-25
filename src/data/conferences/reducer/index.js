/** @flow */
import { combineReducers } from 'redux-immutable';

import list from './list';
import details from './details';

export default combineReducers({
  list,
  details,
});
