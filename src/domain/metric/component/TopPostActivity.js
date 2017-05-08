// @flow
import React from 'react';
import Card from 'infra/component/Card';
import PostSummary from './PostSummary';
import type { TimeRangeMetric } from '../service/timeRangeMetric';
import { PostMetric } from '../service/postMetric';
import uuid from 'uuid';
import { timeRangeToString } from 'infra/service/util';

class PostTop extends PostMetric {
  total: number
  percent: number
  key: string

  constructor(post: Post, total: number, percent: number) {
    super(post);

    this.key = uuid.v4()
    this.total = total;
    this.percent = percent;
  }
}

export const TopPostActivityTypes = {
  LIKES: 'LIKES',
  SHARES: 'SHARES',
  SCORE: 'SCORE',
};

export type TopPostActivityType = $Keys<typeof TopPostActivityTypes>

const getPosts = (metric: TimeRangeMetric, type: TopPostActivityType): PostTop[] => {
  switch (type) {
    case TopPostActivityTypes.SCORE:
      return metric.postsMetric.postMetrics.sort((a, b) => b.getScore() - a.getScore()).slice(0, 10)
        .map(post => new PostTop(post.post, post.getScore(), +((post.getScore()/metric.postsMetric.postMetrics.map(po => po.getScore()).reduce((pre, cur) => pre + cur, 0))*100).toFixed(2)));
    case TopPostActivityTypes.LIKES:
      return metric.postsMetric.sortByLikesCount().slice(0, 10)
        .map(post => new PostTop(post.post, post.likesCount, +((post.likesCount/metric.postsMetric.totalLikes())*100).toFixed(2)));
    case TopPostActivityTypes.SHARES:
    default:
      return metric.postsMetric.sortBySharesCount().slice(0, 10)
        .map(post => new PostTop(post.post, post.sharesCount, +((post.sharesCount/metric.postsMetric.totalShares())*100).toFixed(2)));
  }
}

const generateTitle = (type: TopPostActivityType): { title: string, subTitle: string} => {
  switch (type) {
    case TopPostActivityTypes.SCORE:
      return { title: 'Top Posts Activity by Score', subTitle: 'Top 10 posts by its number of likes, shares, and comments' };
    case TopPostActivityTypes.SHARES:
      return { title: 'Top Posts Activity by Shares', subTitle: 'Top 10 posts by its number of shares' };
    case TopPostActivityTypes.LIKES:
      return { title: 'Top Posts Activity by Likes', subTitle: 'Top 10 posts by its number of likes' };
    default:
      return { title: 'Top Posts Activity', subTitle: 'Top 10 Posts Activity' };
  }
}

class TopPostActivity extends React.Component {

  props: {
    metric: TimeRangeMetric,
    type: TopPostActivityType,
  }

  render() {
    const { metric, type } = this.props;

    return (
      <Card title={generateTitle(type).title}>
        <p>{generateTitle(type).subTitle}, time range {timeRangeToString(metric.dateStart, metric.dateEnd)}.</p>
        <ul className="list-group">
          {getPosts(metric, type).filter(post => post.total > 0).map((post) => {
            // use same style for now
            // can't use JSX, if we destruct this, it will become not valid `PostMetric` type
            return React.createElement(PostSummary, post);
          })}
        </ul>
      </Card>
    );
  }
}

export default TopPostActivity;
