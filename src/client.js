/** @flow */
import 'opbeat';
import 'ric';
import React from 'react';
import ReactDOM from 'react-dom';
import browserHistory from 'react-router/lib/browserHistory';
import { Provider } from 'react-redux';
import { Map } from 'immutable';
import { syncHistoryWithStore } from 'react-router-redux';

import configureStore from './store/configureStore';
import createRoutes from './routing/index';

if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line global-require, import/no-extraneous-dependencies
  window.Perf = require('react-addons-perf');
}

const store = configureStore(Map());

const AppContainer = ({ children }) => children;

const syncOpts = {
  selectLocationState(state) {
    return state.get('routing').toJS();
  },
};


const render = function (child) {
  const root = document.getElementById('root');
  ReactDOM.unmountComponentAtNode(root);

  ReactDOM.render((
    <AppContainer>
      <Provider store={store}>
        {child}
      </Provider>
    </AppContainer>
  ), root);
};

render(createRoutes(syncHistoryWithStore(browserHistory, store, syncOpts)));

if (typeof module.hot === 'object' && module.hot !== null) {
  if (typeof module.hot.accept === 'function') {
    module.hot.accept([
      './app/getRoutes',
      './routing',
    ], () => {
      setImmediate(() => {
        const createNextRoutes = require('./routing/index').default; // eslint-disable-line global-require
        render(createNextRoutes(syncHistoryWithStore(browserHistory, store, syncOpts)));
      });
    });
  }
}
