// @flow
import _ from 'lodash';
import moment from 'moment-timezone';
import postsMetricer from './postsMetric';
import usersMetricer from './usersMetric';
import type { PostsMetric } from './postsMetric';
import type { UsersMetric } from './usersMetric';

export type TimeRangeMetric = {
  dateStart: Date,
  dateEnd: Date,
  postsMetric: PostsMetric,
  usersMetric: UsersMetric,
}

export default (dateStart: Date, dateEnd: Date, posts: Post[], members: Member[], comments: Comment[]): TimeRangeMetric => {
  // pick date
  const filteredPosts = posts.filter(post => new Date(post.created_time) >= dateStart && new Date(post.created_time) < dateEnd);
  const filteredComments = comments.filter(comm => new Date(comm.created_time) >= dateStart && new Date(comm.created_time) < dateEnd);
  
  // calculate metrics
  const postsMetric = postsMetricer(filteredPosts);
  const usersMetric = usersMetricer(members, filteredPosts, filteredComments);

  return {
    dateStart,
    dateEnd,
    postsMetric,
    usersMetric,
  };
};

export const extractDateRangeFromPosts = (posts: Post[], granularity: moment.unitOfTime.Base): { dateStart: Date, dateEnd: Date } => {
  const start: Date = new Date((_.sortBy(posts, 'created_time')[0] || {}).created_time);
  const end: Date = new Date((_.sortBy(posts, 'created_time').reverse()[0] || {}).created_time);
  const startOf = moment(start).startOf(granularity);
  const endOf = moment(end).endOf(granularity);
  return {
    dateStart: startOf.toDate(),
    dateEnd: endOf.toDate(),
  };
};
