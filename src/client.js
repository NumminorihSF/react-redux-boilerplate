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

ReactDOM.render((
  <Provider store={store}>
    { createRoutes(browserHistory) }
  </Provider>
), document.getElementById('root'));
