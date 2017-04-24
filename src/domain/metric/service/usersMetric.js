// @flow
import _ from 'lodash';
import userMetricer from './userMetric';
import type { UserMetric } from './userMetric';

export type UsersMetric = {
  totalMembers: number,
  userMetrics: UserMetric[],
  uniqueUsersPosts(): UserMetric[],
  uniqueUsersComments(): UserMetric[],
  uniqueUsersPostsLikes(): UserMetric[],
  uniqueUsersPostsShares(): UserMetric[],
  sortByPostsCount(): UserMetric[],
  sortByCommentsCount(): UserMetric[],
  sortByPostsLikesCount(): UserMetric[],
  sortByPostsSharesCount(): UserMetric[],
}

export default (members: Member[], posts: Post[], comments: Comment[]): UsersMetric => {
  const totalMembers = members.length;
  const userMetrics: UserMetric[] = userMetricer(members, posts, comments);

  return {
    totalMembers,
    userMetrics,
    uniqueUsersPosts: () => userMetrics.filter(met => met.postsCount !== 0),
    uniqueUsersComments: () => userMetrics.filter(met => met.commentsCount !== 0),
    uniqueUsersPostsLikes: () => userMetrics.filter(met => met.postsLikesCount !== 0),
    uniqueUsersPostsShares: () => userMetrics.filter(met => met.postsSharesCount !== 0),
    sortByPostsCount: () => _.sortBy(userMetrics, 'postsCount').reverse(),
    sortByCommentsCount: () => _.sortBy(userMetrics, 'commentsCount').reverse(),
    sortByPostsLikesCount: () => _.sortBy(userMetrics, 'postsLikesCount').reverse(),
    sortByPostsSharesCount: () => _.sortBy(userMetrics, 'postsSharesCount').reverse(),
  };
};
