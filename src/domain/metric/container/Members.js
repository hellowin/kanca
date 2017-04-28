// @flow
import React from 'react';
import { connect } from 'react-redux';
import Member from '../component/Member';
import Loading from 'infra/component/Loading';
import Pagination from 'infra/component/Pagination';
import usersMetricer from '../service/usersMetric';

const mapStateToProps = state => ({
  loading: state.group.loading,
  members: state.group.members,
  posts: state.group.feed,
  comments: state.group.comments,
});

const GroupMembers = props => {
  const { loading, members, posts, comments } = props;

  const metric = usersMetricer(members, posts, comments);

  return !loading ? (
    <div>
      <h1 className="h3">Group Members</h1>
      <Pagination list={metric.userMetrics} ChildNode={Member} />
    </div>
  ) : <Loading />;
};

export default connect(mapStateToProps)(GroupMembers);
