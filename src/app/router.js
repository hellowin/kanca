import React from 'react';
import { Router, Route, browserHistory, Redirect, IndexRedirect } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import store from '../infra/service/store';
import config from 'config';

// containers
import App from './app';
import Login from '../domain/user/container/login';
import Profile from '../domain/user/container/profile';
import ChartDashboard from '../domain/chart/container/dashboard';

const history = syncHistoryWithStore(browserHistory, store);

const prefix = config.urlPrefix;

const RouterComp = props => (
  <Router history={history}>
    <Route path={prefix} component={App}>
      <IndexRedirect to="dashboard" />
      <Route path="profile" component={Profile} />
      <Route path="dashboard" component={ChartDashboard} />
    </Route>
    <Route path={prefix + '/login'} component={Login} />
    <Redirect from="*" to={prefix} />
  </Router>
);

export default RouterComp;
