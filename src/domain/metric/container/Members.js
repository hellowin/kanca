// @flow
import React from 'react';
import { connect } from 'react-redux';

import Loading from 'infra/component/Loading';
import Card from 'infra/component/Card';
import Pagination from 'infra/component/Pagination';

import Member from '../component/Member';
import usersMetricer from '../service/usersMetric';

const mapStateToProps = state => ({
  members: state.group.members,
  posts: state.group.feeds,
  comments: state.group.comments,
});

const MembersMetricPage = props => {
  const { members, posts, comments } = props;

  const metric = usersMetricer(members, posts, comments);

  return (
    <div class="row">

      <div className="col-12">
        <h1 className="h3 mb-1">Members Summary</h1>
      </div>

      <div className="col-12">
        <Card>
          <div>Total members: {metric.totalMembers()}</div>
          <div>Total members who posts: {metric.uniqueUsersPosts().length}</div>
          <div>Total members who comments: {metric.uniqueUsersComments().length}</div>
        </Card>
      </div>

      <div className="col-12">
        <h1 className="h3 mb-1">Group Members</h1>
      </div>

      <div className="col-12">
        <Pagination list={metric.userMetrics} ChildNode={Member} />
      </div>

    </div>
  );
};

export default connect(mapStateToProps)(MembersMetricPage);
