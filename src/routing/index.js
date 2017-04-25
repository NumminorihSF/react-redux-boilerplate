/** @flow */
import type { History } from 'react-router';
import React from 'react';
import Router from 'react-router/lib/Router';
import { wrapRouter } from 'opbeat-react';

import getRoutes from 'app/getRoutes';

const OpbeatRouter = wrapRouter(Router);
const routes = getRoutes();


export default function (history: History) {
  return (
    <OpbeatRouter history={history}>
      {routes}
    </OpbeatRouter>
  );
}
