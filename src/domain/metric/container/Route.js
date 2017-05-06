// @flow
import React from 'react';
import { Route } from 'react-router';

import Metric from './Root';
import MetricSummary from './Summary';
import MetricPosts from './Posts';
import MetricComments from './Comments';
import MetricMembers from './Members';
import MetricUserProfile from './UserProfile';

export default (
  <Route path="metric" component={Metric}>
    <Route path="summary" component={MetricSummary} />
    <Route path="members" component={MetricMembers} />
    <Route path="posts" component={MetricPosts} />
    <Route path="comments" component={MetricComments} />
    <Route path="user-profile" component={MetricUserProfile} />
  </Route>
);
