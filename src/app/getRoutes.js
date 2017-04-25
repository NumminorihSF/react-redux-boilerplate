/** @flow */
import React from 'react';
import Route from 'react-router/lib/Route';
import IndexRoute from 'react-router/lib/IndexRoute';

import App from './App';
import SiteMap from './SiteMap';

import getConferencesRoutes from './Conferences/getRoutes';

const conferencesRoutes = getConferencesRoutes();

export default () => (
  <Route path="/" component={App}>

    <Route path="conferences">
      {conferencesRoutes}
    </Route>


    <IndexRoute component={SiteMap} />
  </Route>
);
