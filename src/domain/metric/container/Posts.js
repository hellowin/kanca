// @flow
import React from 'react';
import { connect } from 'react-redux';
import Loading from 'infra/component/Loading';
import timeRangeMetricer, { extractDateRangeFromPosts } from '../service/timeRangeMetric';
import type { TimeRangeMetric } from '../service/timeRangeMetric';
import PostActivityTop from '../component/PostActivityTop';

const mapStateToProps = state => ({
  loading: state.group.loading,
  members: state.group.members,
  posts: state.group.feeds,
  comments: state.group.comments,
});

const GroupMembers = props => {
  const { loading, members, posts, comments } = props;

  const { dateStart, dateEnd } = extractDateRangeFromPosts(posts, 'd');
  const metric: TimeRangeMetric = timeRangeMetricer(dateStart, dateEnd, posts, members, comments);

  return !loading ? (
    <div className="row">
      
      <div className="col-md-12">
        <h4>Posts Activity</h4>
      </div>

      <div className="col-md-6">
          <PostActivityTop metric={metric} type="likes" title="Posts Likes" subTitle="Top 10 most liked posts." />
      </div>

      <div className="col-md-6">
        <PostActivityTop metric={metric} type="shares" title="Posts Shares" subTitle="Top 10 most shared posts." />
      </div>

    </div>
  ) : <Loading />;
};

export default connect(mapStateToProps)(GroupMembers);
