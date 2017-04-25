/** @flow */
import type { Map } from 'immutable';
import { combineReducers } from 'redux-immutable';
import { reducer as rootFormReducer } from 'redux-form/immutable';

import app from 'app/reducer';
import conferences from 'data/conferences';

import routing from './routing';

const treeReducer = combineReducers({
  app,
  conferences,
  routing,
});

const order = [
  rootFormReducer,
  treeReducer,
];

export default function rootReducer(state: Map<string, *>, action: Object): Map<string, *> {
  return order.reduce((currentState, reducer) => reducer(currentState, action), state);
}

