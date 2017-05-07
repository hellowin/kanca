// @flow
import _ from 'lodash';
import moment from 'moment-timezone';
import postsMetricer from './postsMetric';
import type { PostsMetric } from './postsMetric';
import commentsMetricer from './commentsMetric';
import type { CommentsMetric } from './commentsMetric';
import usersMetricer from './usersMetric';
import type { UsersMetric } from './usersMetric';

export type TimeRangeMetric = {
  dateStart: Date,
  dateEnd: Date,
  postsMetric: PostsMetric,
  commentsMetric: CommentsMetric,
  usersMetric: UsersMetric,
}

export const timeRangeMetric = (dateStart: Date, dateEnd: Date, posts: Post[], members: Member[], comments: Comment[]): TimeRangeMetric => {
  // pick date
  const filteredPosts = posts.filter(post => moment(post.created_time) >= dateStart && moment(post.created_time) < dateEnd);
  const filteredComments = comments.filter(comm => moment(comm.created_time) >= dateStart && moment(comm.created_time) < dateEnd);
  
  // calculate metrics
  const postsMetric = postsMetricer(filteredPosts);
  const commentsMetric = commentsMetricer(filteredComments);
  const usersMetric = usersMetricer(members, filteredPosts, filteredComments);

  return {
    dateStart,
    dateEnd,
    postsMetric,
    commentsMetric,
    usersMetric,
  };
};

export const timeSeriesMetric = (dateStart: Date, dateEnd: Date, granularity: moment.unitOfTime.Base, posts: Post[], members: Member[], comments: Comment[]): TimeRangeMetric[] => {
  // define start and end time
  const start = moment(dateStart).startOf(granularity);
  const end = moment(dateEnd).endOf(granularity);

  // create list of start and end of granularity
  const cursor = start.clone();
  const timeSeries: {dateStart: Date, dateEnd: Date}[] = [];
  while (cursor.valueOf() < end.valueOf()) {
    timeSeries.push({
      dateStart: cursor.clone(),
      dateEnd: cursor.clone().endOf(granularity),
    });
    
    cursor.add(1, granularity);
  }

  // calculate each time series
  const results: TimeRangeMetric[] = timeSeries.map(({ dateStart, dateEnd }) => timeRangeMetric(dateStart, dateEnd, posts, members, comments));

  return results;
};

export const extractDateRangeFromPosts = (posts: Post[], granularity: moment.unitOfTime.Base): { dateStart: Date, dateEnd: Date } => {
  const start: string = (_.sortBy(posts, 'created_time')[0] || {}).created_time;
  const end: string = (_.sortBy(posts, 'created_time').reverse()[0] || {}).created_time;
  const startOf = moment(start).startOf(granularity);
  const endOf = moment(end).endOf(granularity);
  return {
    dateStart: startOf.toDate(),
    dateEnd: endOf.toDate(),
  };
};

export default timeRangeMetric;
