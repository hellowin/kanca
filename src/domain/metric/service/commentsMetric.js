// @flow
import commentMetric from './commentMetric';
import _ from 'lodash';
import type { CommentMetric } from './commentMetric';

export type CommentsMetric = {
  commentMetrics: CommentMetric[],
  dateStart(): Date,
  dateEnd(): Date,
  totalComments(): number,
  totalUsers(): number,
  totalLikes(): number,
  sortByLikesCount(): CommentMetric[],
}

export default (comments: Comment[]): CommentsMetric => {
  const commentMetrics: CommentMetric[] = commentMetric(comments);

  return {
    commentMetrics,
    dateStart: () => _.sortBy(commentMetrics, 'createdTime')[0].createdTime,
    dateEnd: () => _.sortBy(commentMetrics, 'createdTime').reverse()[0].createdTime,
    totalComments: () => commentMetrics.length,
    totalUsers: () => new Set(commentMetrics.map(com => com.from.id)).size,
    totalLikes: () => commentMetrics.map(com => com.likesCount).reduce((pre, cur) => pre + cur, 0),
    sortByLikesCount: () => _.sortBy(commentMetrics, 'likesCount').reverse(),
  };
};
