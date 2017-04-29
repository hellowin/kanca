// @flow
import commentMetric from './commentMetric';
import _ from 'lodash';
import moment from 'moment-timezone';
import type { CommentMetric } from './commentMetric';

export type CommentsMetric = {
  commentMetrics: CommentMetric[],
  dateStart(): Date,
  dateEnd(): Date,
  totalComments(): number,
  totalUsers(): number,
  totalLikes(): number,
  sortByLikesCount(): CommentMetric[],
  commentsByDays(): { day: string, commentMetrics: CommentMetric[], commentsMetric: CommentsMetric }[],
  commentsByHours(): { hour: string, trihourly: string, commentMetrics: CommentMetric[], commentsMetric: CommentsMetric }[],
  wordCount(): { word: string, count: number }[],
}

const commentsMetric = (comments: Comment[]): CommentsMetric => {
  const commentMetrics: CommentMetric[] = commentMetric(comments);
  const commentsByDays = () => {
    const days = {};
    commentMetrics.forEach(met => {
      const day = moment(met.createdTime).format('dddd');
      if (!days[day]) days[day] = { day, commentMetrics: [] };
      days[day].commentMetrics.push(met);
    });
    return _.values(days).map(day => ({
      ...day,
      commentsMetric: commentsMetric(day.commentMetrics.map(me => me.comment)),
    }));
  };
  const commentsByHours = () => {
    const hours = {};
    commentMetrics.forEach(met => {
      const hour = moment(met.createdTime).format('HH');
      let trihourly = Math.ceil(parseInt(hour, 10)/3) + '';
      // handle 00:00 AM
      if (trihourly === '0') trihourly = '1';

      if (!hours[hour]) hours[hour] = { hour, trihourly, commentMetrics: [] };
      hours[hour].commentMetrics.push(met);
    });
    return _.values(hours).map(hour => ({
      ...hour,
      commentsMetric: commentsMetric(hour.commentMetrics.map(me => me.comment)),
    }));
  };
  const wordCount = () => {
    const count: { [string]: { word: string, count: number } } = {};
    commentMetrics.forEach(pos => {
      const words = _.words(pos.text);
      words.forEach(word => {
        if (!count[word]) count[word] = { word, count: 0 };
        count[word].count += 1;
      });
    });
    return _.values(count);
  };

  return {
    commentMetrics,
    dateStart: () => _.sortBy(commentMetrics, 'createdTime')[0].createdTime,
    dateEnd: () => _.sortBy(commentMetrics, 'createdTime').reverse()[0].createdTime,
    totalComments: () => commentMetrics.length,
    totalUsers: () => new Set(commentMetrics.map(com => com.from.id)).size,
    totalLikes: () => commentMetrics.map(com => com.likesCount).reduce((pre, cur) => pre + cur, 0),
    sortByLikesCount: () => _.sortBy(commentMetrics, 'likesCount').reverse(),
    commentsByDays,
    commentsByHours,
    wordCount,
  };
};

export default commentsMetric;
