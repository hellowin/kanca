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
  getTimeSeries(granularity: moment.unitOfTime.Base): TimeRangeMetric[],
}

export const timeRangeMetric = (dateStart: Date, dateEnd: Date, posts: Post[], members: Member[], comments: Comment[]): TimeRangeMetric => {
  // pick date
  const filteredPosts = posts.filter(post => moment(post.created_time) >= dateStart && moment(post.created_time) < dateEnd);
  const filteredComments = comments.filter(comm => moment(comm.created_time) >= dateStart && moment(comm.created_time) < dateEnd);
  
  // calculate metrics
  const postsMetric = postsMetricer(filteredPosts);
  const commentsMetric = commentsMetricer(filteredComments);
  const usersMetric = usersMetricer(members, filteredPosts, filteredComments);

  // time series
  const getTimeSeries = (granularity: moment.unitOfTime.Base): TimeRangeMetric[] => {
    // handle wrong input
    if (granularity === undefined || granularity === null) return [];

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
      })
      cursor.add(1, granularity);
    }

    // calculate each time series
    const results: TimeRangeMetric[] = timeSeries.map(({ dateStart, dateEnd }) => timeRangeMetric(dateStart, dateEnd, posts, members, comments));

    return results;
  };

  return {
    dateStart,
    dateEnd,
    postsMetric,
    commentsMetric,
    usersMetric,
    getTimeSeries,
  };
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

export const extractDateRangeFromComments = (comments: Comment[], granularity: moment.unitOfTime.Base): { dateStart: Date, dateEnd: Date } => {
  const start: string = (_.sortBy(comments, 'created_time')[0] || {}).created_time;
  const end: string = (_.sortBy(comments, 'created_time').reverse()[0] || {}).created_time;
  const startOf = moment(start).startOf(granularity);
  const endOf = moment(end).endOf(granularity);
  return {
    dateStart: startOf.toDate(),
    dateEnd: endOf.toDate(),
  };
};

export const extractDateRange = (posts: Post[], comments: Comment[], granularity: moment.unitOfTime.Base): { dateStart: Date, dateEnd: Date } => {
  const post = extractDateRangeFromPosts(posts, granularity);
  const comment = extractDateRangeFromComments(comments, granularity);

  const dateStart = post.dateStart.valueOf() < comment.dateStart.valueOf() ? post.dateStart : comment.dateStart;
  const dateEnd = post.dateEnd.valueOf() > comment.dateEnd.valueOf() ? post.dateEnd : comment.dateEnd;

  return {
    dateStart,
    dateEnd,
  };
};

export default timeRangeMetric;
