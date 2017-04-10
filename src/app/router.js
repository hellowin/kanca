import React from 'react';
import { Router, Route, browserHistory, Redirect, IndexRedirect } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import store from '../infra/service/store';

// containers
import App from './app';
import Login from '../domain/user/container/login';
import Profile from '../domain/user/container/profile';
import ChartDashboard from '../domain/chart/container/dashboard';

const history = syncHistoryWithStore(browserHistory, store);

const RouterComp = props => (
  <Router history={history}>
    <Route path="/" component={App}>
      <IndexRedirect to="dashboard" />
      <Route path="profile" component={Profile} />
      <Route path="dashboard" component={ChartDashboard} />
    </Route>
    <Route path="/login" component={Login} />
    <Redirect from="*" to="/" />
  </Router>
);

export default RouterComp;
