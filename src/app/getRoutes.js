/** @flow */
import React from 'react';
import Route from 'react-router/lib/Route';
import IndexRoute from 'react-router/lib/IndexRoute';

import App from './App';
import SiteMap from './SiteMap';

export default () => (
  <Route path="/" component={App}>

    <IndexRoute component={SiteMap} />
  </Route>
);
