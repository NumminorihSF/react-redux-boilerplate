/**
 * Created by numminorihsf on 24.10.16.
 */
import React from 'react'
import ReactDOM from 'react-dom'
import browserHistory from 'react-router/lib/browserHistory'

import configureStore from './store/configureStore'
import createRoutes from './routing/index'
import { Provider } from 'react-redux'
import Immutable from 'immutable'
import { routerMiddleware } from 'react-router-redux'
import { syncHistoryWithStore } from 'react-router-redux'

//import './styles/style.scss'

let reduxState = {};
if (window.__REDUX_STATE__) {
  try {
    let plain = JSON.parse(decodeURIComponent(__REDUX_STATE__));
    Object.keys(plain).forEach((key)=> {
      reduxState[key] = Immutable.fromJS(plain[key]);
    })
  } catch (e) {
    console.warn('Error in ReduxState parse. Use empty state.', e);
  }
}

const store = configureStore(reduxState);



const syncOpts = {
  selectLocationState(state) {
    return state.routing.toJS();
  }
}

ReactDOM.render((
  <Provider store={store}>
    { createRoutes(syncHistoryWithStore(browserHistory, store, syncOpts)) }
  </Provider>
), document.getElementById('root'));
