// @flow
import React from 'react';
import { Router, Route, browserHistory, Redirect, IndexRedirect } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import config from 'config';
import store from 'infra/service/store';

// containers
import App from './App';
import Login from 'domain/user/container/Login';
import Welcome from './Welcome';
import { Route as GroupRoute } from 'domain/group/container/Root';
import { Route as MetricRoute } from 'domain/metric/container/Root';

const history = syncHistoryWithStore(browserHistory, store);

const prefix = config.urlPrefix;

const RouterComp = () => (
  <Router history={history}>
    <Route path={prefix} component={App}>
      <IndexRedirect to="welcome" />
      <Route path="welcome" component={Welcome} />
      {GroupRoute}
      {MetricRoute}
    </Route>
    <Route path={prefix + '/login'} component={Login} />
    <Redirect from="*" to={prefix} />
  </Router>
);

export default RouterComp;
