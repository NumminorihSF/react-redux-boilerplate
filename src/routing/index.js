/**
 * Created by numminorihsf on 25.10.16.
 */
import React from "react";
import Router from "react-router/lib/Router";
import Route from "react-router/lib/Route";
import IndexRoute from "react-router/lib/IndexRoute";
import IndexRedirect from "react-router/lib/IndexRedirect";

import { syncHistoryWithStore } from 'react-router-redux'

import App from '../containers/App';
import Users from '../containers/Users';
import User from '../containers/User';
import Questions from '../containers/Questions';
import Question from '../containers/Question';
import Intro from '../containers/Intro';


const syncOpts = {
  selectLocationState(state) {
    return state.routing.toJS();
  }
}

export default function(history, store) {
  return (
    <Router history={syncHistoryWithStore(history, store, syncOpts)}>
      <Route path="/" component={App}>
        <Route path="questions" component={Questions} />
        <Route path="questions/:id" component={Question} />

        <Route path="users">
          <Route path=":id" component={User} />
          <IndexRoute component={Users}/>
        </Route>

        <IndexRoute component={Intro} />
      </Route>
    </Router>
  );
}
