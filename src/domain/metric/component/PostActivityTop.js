// @flow
import React from 'react';
import Card from 'infra/component/Card';
import PostSummary from './PostSummary';
import type { TimeRangeMetric } from '../service/timeRangeMetric';

type PostTop = {
  total: number,
  percent: number,
}

const getPosts = (metric: TimeRangeMetric, type: string): PostTop[] => {
  switch (type) {
    case 'likes':
      return metric.postsMetric.sortByLikesCount().slice(0, 10)
        .map(post => ({ ...post, total: post.likesCount, percent: +((post.likesCount/metric.postsMetric.totalLikes())*100).toFixed(2) }));
    case 'shares':
    default:
      return metric.postsMetric.sortBySharesCount().slice(0, 10)
        .map(post => ({ ...post, total: post.sharesCount, percent: +((post.sharesCount/metric.postsMetric.totalShares())*100).toFixed(2) }));
  }
}

class UserActivityTop extends React.Component {

  props: {
    metric: TimeRangeMetric,
    type: string,
    title: string,
    subTitle: string,
  }

  render() {
    const { metric, type, title, subTitle } = this.props;

    return (
      <Card>
        <h4 className="card-title">{title}</h4>
        <p>{subTitle}</p>
        <ul className="list-group">
          {getPosts(metric, type).filter(post => post.total > 0).map((post, key) => {
            // use same style for now
            return <PostSummary {...post} />;
          })}
        </ul>
      </Card>
    );
  }
}

export default UserActivityTop;
