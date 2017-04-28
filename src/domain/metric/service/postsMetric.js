// @flow
import postMetric from './postMetric';
import _ from 'lodash';
import type { PostMetric } from './postMetric';

export type PostsMetric = {
  postMetrics: PostMetric[],
  dateStart(): Date,
  dateEnd(): Date,
  totalPosts(): number,
  totalUsers(): number,
  totalComments(): number,
  totalPostsShares(): number,
  totalPostsLikes(): number,
}

export default (posts: Post[]): PostsMetric => {
  const postMetrics = postMetric(posts);

  return {
    postMetrics,
    dateStart: () => _.sortBy(postMetrics, 'createdTime')[0].createdTime,
    dateEnd: () => _.sortBy(postMetrics, 'createdTime').reverse()[0].createdTime,
    totalPosts: () => postMetrics.length,
    totalUsers: () => new Set(postMetrics.map(post => (post.from || {}).id).filter(x => x)).size,
    totalComments: () => postMetrics.map(post => (post || {}).commentsCount).reduce((pre, cur) => pre + cur, 0),
    totalPostsShares: () => postMetrics.map(post => (post || {}).sharesCount).reduce((pre, cur) => pre + cur, 0),
    totalPostsLikes: () => postMetrics.map(post => (post || {}).likesCount).reduce((pre, cur) => pre + cur, 0),
  };
}
