import React from 'react';
import { Router, Route, browserHistory, Redirect, IndexRedirect } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import store from 'infra/service/store';
import config from 'config';

// containers
import App from './App';
import Login from 'domain/user/container/Login';
import UserProfile from 'domain/user/container/Profile';
import Group from 'domain/group/container/Root';
import GroupWelcome from 'domain/group/container/Welcome';
import GroupSelection from 'domain/group/container/Selection';
import GroupFeed from 'domain/group/container/Feed';
import Metric from 'domain/metric/container/Root';
import MetricSummary from 'domain/metric/container/Summary';
import MetricTimeSeries from 'domain/metric/container/TimeSeries';

const history = syncHistoryWithStore(browserHistory, store);

const prefix = config.urlPrefix;

const RouterComp = props => (
  <Router history={history}>
    <Route path={prefix} component={App}>
      <IndexRedirect to="welcome" />
      <Route path="welcome" component={GroupWelcome} />
      <Route path="user/profile" component={UserProfile} />

      <Route path="group" component={Group}>
        <Route path="selection" component={GroupSelection} />
        <Route path="feed" component={GroupFeed} />
      </Route>

      <Route path="metric" component={Metric}>
        <Route path="summary" component={MetricSummary} />
        <Route path="time-series" component={MetricTimeSeries} />
      </Route>
    </Route>
    <Route path={prefix + '/login'} component={Login} />
    <Redirect from="*" to={prefix} />
  </Router>
);

export default RouterComp;
