// @flow
import React from 'react';
import { connect } from 'react-redux';
import Loading from 'infra/component/Loading';
import timeRangeMetricer, { extractDateRangeFromPosts } from '../service/timeRangeMetric';
import type { TimeRangeMetric } from '../service/timeRangeMetric';
import CommentActivityTop from '../component/CommentActivityTop';

const mapStateToProps = state => ({
  loading: state.group.loading,
  members: state.group.members,
  posts: state.group.feeds,
  comments: state.group.comments,
});

const CommentsMetricPage = props => {
  const { loading, members, posts, comments } = props;

  const { dateStart, dateEnd } = extractDateRangeFromPosts(posts, 'd');
  const metric: TimeRangeMetric = timeRangeMetricer(dateStart, dateEnd, posts, members, comments);

  return !loading ? (
    <div className="row">
      
      <div className="col-md-12">
        <h4>Comment Activity</h4>
      </div>

      <div className="col-md-6">
          <CommentActivityTop metric={metric} type="likes" title="Posts Likes" subTitle="Top 10 most liked posts." />
      </div>

    </div>
  ) : <Loading />;
};

export default connect(mapStateToProps)(CommentsMetricPage);
