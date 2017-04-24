// @flow
import _ from 'lodash';
import userMetricer from './userMetric';
import type { UserMetric } from './userMetric';

export type UsersMetric = {
  userMetrics: UserMetric[],
  uniqueUsersPosts(): UserMetric[],
  uniqueUsersComments(): UserMetric[],
  sortByPostsCount(): UserMetric[],
  sortByCommentsCount(): UserMetric[],
  sortByPostsLikesCount(): UserMetric[],
  sortByPostsSharesCount(): UserMetric[],
}

export default (members: Member[], posts: Post[], comments: Comment[]): UsersMetric => {
  const userMetrics: UserMetric[] = userMetricer(members, posts, comments);

  return {
    userMetrics,
    uniqueUsersPosts: () => userMetrics.filter(met => met.postsCount !== 0),
    uniqueUsersComments: () => userMetrics.filter(met => met.commentsCount !== 0),
    sortByPostsCount: () => _.sortBy(userMetrics, 'postsCount').reverse(),
    sortByCommentsCount: () => _.sortBy(userMetrics, 'commentsCount').reverse(),
    sortByPostsLikesCount: () => _.sortBy(userMetrics, 'postsLikesCount').reverse(),
    sortByPostsSharesCount: () => _.sortBy(userMetrics, 'postsSharesCount').reverse(),
  };
};
