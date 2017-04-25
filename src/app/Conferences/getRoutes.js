import React from 'react';
import Route from 'react-router/lib/Route';
import IndexRoute from 'react-router/lib/IndexRoute';

import getIdRoutes from './[id]/getRoutes';

import Conferences from './Conferences';

const idRoute = getIdRoutes();

export default () => <Route>
  <Route path=":conferenceId">
    {idRoute}
  </Route>
  <IndexRoute component={Conferences} />
</Route>;
