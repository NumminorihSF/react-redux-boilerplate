/** @flow */
import { combineReducers } from 'redux-immutable';
import { reducer as form } from 'redux-form/immutable';

import app from 'app/reducer';

import routing from './routing';

export default combineReducers({
  form,
  app,
  routing,
});
