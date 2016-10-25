/**
 * Created by numminorihsf on 25.10.16.
 */
import React from "react";
import Router from "react-router/lib/Router";
import Route from "react-router/lib/Route";
import IndexRoute from "react-router/lib/IndexRoute";
import IndexRedirect from "react-router/lib/IndexRedirect";

import App from '../containers/App';
import Questions from '../containers/Questions';
import Question from '../containers/Question';
import Intro from '../containers/Intro';

export default function(history) {
  return (
    <Router history={history}>
      <Route path="/" component={App}>
        <Route path="questions" component={Questions} />
        <Route path="questions/:id" component={Question} />
        <IndexRoute component={Intro} />
      </Route>
    </Router>
  )
}

