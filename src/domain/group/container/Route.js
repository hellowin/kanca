// @flow
import React from 'react';
import { Route } from 'react-router';

import Group from './Root';
import GroupSelection from './Selection';
import GroupFeed from './Feed';

export default (
  <Route path="group" component={Group}>
    <Route path="selection" component={GroupSelection} />
    <Route path="feed" component={GroupFeed} />
  </Route>
);
