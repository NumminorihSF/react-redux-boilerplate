import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import apiMiddleware from '../middleware/api'
import createLogger from 'redux-logger'
import rootReducer from '../reducers'
//import { routerMiddleware } from 'react-router-redux'


const logger = createLogger({
  level: 'info',
  collapsed: false,
  logger: console,
  predicate: (getState, action) => true,
  actionTransformer: (action) => (Object.assign({}, action, {
    type: String(action.type)
  }))
});

const createStoreWithMiddleware = applyMiddleware(
//  routerMiddleware,
  thunkMiddleware,
  apiMiddleware,
  logger
)(createStore);

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
