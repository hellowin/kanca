// @flow
import userMetric from './userMetric';
import postMetric from './postMetric';
import _ from 'lodash';
import type { PostMetric } from './postMetric';

export type PostsMetric = {
  dateStart: Date,
  dateEnd: Date,
  totalPosts: number,
  totalPostsShares: number,
  totalPostsLikes: number,
  totalPostsComments: number,
  uniqueUserPosts: number,
  postEngagement: number,
  postMetrics: PostMetric[],
}

export default (posts: Post[], members: Member[]): PostsMetric => {
  const userCounted = userMetric(posts);
  const postMetrics = postMetric(posts);

  const dateStart: Date = new Date((_.sortBy(posts, 'created_time')[0] || {}).created_time);
  const dateEnd: Date = new Date((_.sortBy(posts, 'created_time').reverse()[0] || {}).created_time);

  const totalPosts = posts.length;
  const totalPostsShares = postMetrics.map(post => (post || {}).sharesCount).reduce((pre, cur) => pre + cur, 0);
  const totalPostsLikes = postMetrics.map(post => (post || {}).likesCount).reduce((pre, cur) => pre + cur, 0);
  const totalPostsComments = postMetrics.map(post => (post || {}).commentsCount).reduce((pre, cur) => pre + cur, 0);

  const uniqueUserPosts = userCounted.length;
  const totalMembers = members.length;
  const postEngagement = +((uniqueUserPosts / totalMembers) * 100).toFixed(2);

  return {
    dateStart,
    dateEnd,
    totalPosts,
    totalPostsShares,
    totalPostsLikes,
    totalPostsComments,
    uniqueUserPosts,
    postEngagement,
    postMetrics,
  };
}
