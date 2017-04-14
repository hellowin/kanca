import React from 'react';
import { Router, Route, browserHistory, Redirect, IndexRedirect } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import store from 'infra/service/store';
import config from 'config';

// containers
import App from './app';
import Login from 'domain/user/container/login';
import UserProfile from 'domain/user/container/profile';
import GroupWelcome from 'domain/group/container/Welcome';
import GroupSelection from 'domain/group/container/Selection';
import GroupFeed from 'domain/group/container/Feed';
import ChartDashboard from 'domain/chart/container/dashboard';

const history = syncHistoryWithStore(browserHistory, store);

const prefix = config.urlPrefix;

const RouterComp = props => (
  <Router history={history}>
    <Route path={prefix} component={App}>
      <IndexRedirect to="welcome" />
      <Route path="welcome" component={GroupWelcome} />
      <Route path="chart/dashboard" component={ChartDashboard} />
      <Route path="user/profile" component={UserProfile} />
      <Route path="group/selection" component={GroupSelection} />
      <Route path="group/feed" component={GroupFeed} />
    </Route>
    <Route path={prefix + '/login'} component={Login} />
    <Redirect from="*" to={prefix} />
  </Router>
);

export default RouterComp;
