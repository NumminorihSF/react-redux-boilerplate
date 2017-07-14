/** @flow */
import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import rootReducer from 'reducers/rootReducer';
// import { routerMiddleware } from 'react-router-redux'
import { createOpbeatMiddleware } from 'opbeat-react/redux';

import apiMiddleware from './middleware/api';
import lazyTransformToJS from './lazyTransformToJS';

const actionSanitizer = (action) => {
  const type = String(action.type);
  return { ...action, type };
};

/* eslint-disable no-underscore-dangle */
const composeEnhancers = (function getComposeEnhancers() {
  if (process.env.ON_SERVER === false && process.env.NODE_ENV !== 'production') {
    if (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
      return window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        serialize: true,
        actionSanitizer,
      });
    }
  }
  return compose;
}());

const devTools = (function getDevTools() {
  if (process.env.ON_SERVER === false && process.env.NODE_ENV !== 'production') {
    if (!window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
      if (window.devToolsExtension) {
        return window.devToolsExtension({
          actionSanitizer,
        });
      }
    }
  }
  return arg => arg;
}());
/* eslint-enable no-underscore-dangle */

const logger = createLogger({
  level: 'info',
  collapsed: false,
  logger: console,
  predicate: () => (process.env.NODE_ENV !== 'production'),
  stateTransformer: lazyTransformToJS,
  actionTransformer: actionSanitizer,
});

const createStoreWithMiddleware = function createStoreWithMiddleware(reducer, initialState) {
  return createStore(reducer, initialState, composeEnhancers(
    applyMiddleware(
      thunkMiddleware,
      apiMiddleware,
      logger,
      createOpbeatMiddleware(),
    ),
    devTools,
    ),
  );
};

export default function configureStore(initialState: any) {
  const store = createStoreWithMiddleware(rootReducer, initialState);

  if (module.hot) {
    const hot: any = module.hot;
    hot.accept('../reducers/rootReducer', () => {
      const nextRootReducer = require('../reducers/rootReducer').default; // eslint-disable-line global-require
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}
