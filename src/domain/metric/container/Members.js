// @flow
import React from 'react';
import { connect } from 'react-redux';
import Member from '../component/Member';
import Loading from 'infra/component/Loading';
import Card from 'infra/component/Card';
import Pagination from 'infra/component/Pagination';
import usersMetricer from '../service/usersMetric';


const mapStateToProps = state => ({
  loading: state.group.loading,
  members: state.group.members,
  posts: state.group.feeds,
  comments: state.group.comments,
});

const MembersMetricPage = props => {
  const { loading, members, posts, comments } = props;

  const metric = usersMetricer(members, posts, comments);

  return !loading ? (
    <div>
      <h1 className="h3 mb-1">Members Summary</h1>
      <Card>
        <div>Total members: {metric.totalMembers()}</div>
        <div>Total members posts: {metric.uniqueUsersPosts().length}</div>
        <div>Total members comments: {metric.uniqueUsersComments().length}</div>
      </Card>
      <h1 className="h3 mb-1">Group Members</h1>
      <Pagination list={metric.userMetrics} ChildNode={Member} />
    </div>
  ) : <Loading />;
};

export default connect(mapStateToProps)(MembersMetricPage);
