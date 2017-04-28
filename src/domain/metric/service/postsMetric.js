// @flow
import postMetric from './postMetric';
import _ from 'lodash';
import type { PostMetric } from './postMetric';

export type PostsMetric = {
  postMetrics: PostMetric[],
  dateStart(): Date,
  dateEnd(): Date,
  totalPosts(): number,
  totalComments(): number,
  totalShares(): number,
  sortBySharesCount(): PostMetric[],
  totalLikes(): number,
  sortByLikesCount(): PostMetric[],
}

export default (posts: Post[]): PostsMetric => {
  const postMetrics = postMetric(posts);

  return {
    postMetrics,
    dateStart: () => _.sortBy(postMetrics, 'createdTime')[0].createdTime,
    dateEnd: () => _.sortBy(postMetrics, 'createdTime').reverse()[0].createdTime,
    totalPosts: () => postMetrics.length,
    totalComments: () => postMetrics.map(post => (post || {}).commentsCount).reduce((pre, cur) => pre + cur, 0),
    totalShares: () => postMetrics.map(post => (post || {}).sharesCount).reduce((pre, cur) => pre + cur, 0),
    sortBySharesCount: () => _.sortBy(postMetrics, 'sharesCount').reverse(),
    totalLikes: () => postMetrics.map(post => (post || {}).likesCount).reduce((pre, cur) => pre + cur, 0),
    sortByLikesCount: () => _.sortBy(postMetrics, 'likesCount').reverse(),
  };
}
