import { createStore, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
import apiMiddleware from '../middleware/api'
import createLogger from 'redux-logger'
import rootReducer from '../reducers'
//import { routerMiddleware } from 'react-router-redux'

const composeEnhancers = (function(){
  if (process.env.ON_SERVER === false && process.env.NODE_ENV !== 'production'){
    if (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
      return window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
    }
  }
  return compose;
}());

const devTools = (function(){
  if (process.env.ON_SERVER === false && process.env.NODE_ENV !== 'production'){
    if (!window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
      if (window.devToolsExtension){
        return window.devToolsExtension();
      }
    }
  }
  return arg=>arg;
}());

const logger = createLogger({
  level: 'info',
  collapsed: false,
  logger: console,
  predicate: (getState, action) => true,
  actionTransformer: (action) => (Object.assign({}, action, {
    type: String(action.type)
  }))
});

const createStoreWithMiddleware = function(rootReducer, initialState){
  return createStore(rootReducer, initialState, composeEnhancers(
    applyMiddleware(thunkMiddleware, apiMiddleware, logger),
    devTools
    )
  );
};

export default function configureStore(initialState) {
  const store = createStoreWithMiddleware(rootReducer, initialState);

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers'); // eslint-disable-line global-require
      store.replaceReducer(nextRootReducer)
    })
  }

  return store;
}

//export function applyMiddleware (store, ...middleware){
//  return applyMiddle(...middleware)(store);
//}
