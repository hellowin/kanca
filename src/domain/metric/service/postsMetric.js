// @flow
import postMetric from './postMetric';
import _ from 'lodash';
import moment from 'moment-timezone';
import type { PostMetric } from './postMetric';

export type PostsMetric = {
  postMetrics: PostMetric[],
  dateStart(): Date,
  dateEnd(): Date,
  totalPosts(): number,
  totalUsers(): number,
  totalComments(): number,
  totalShares(): number,
  sortBySharesCount(): PostMetric[],
  totalLikes(): number,
  sortByLikesCount(): PostMetric[],
  postsByDays(): { day: string, postMetrics: PostMetric[], postsMetric: PostsMetric }[],
  postsByHours(): { hour: string, trihourly: string, postMetrics: PostMetric[], postsMetric: PostsMetric }[],
  wordCount(): { word: string, count: number }[],
}

const postsMetric = (posts: Post[]): PostsMetric => {
  const postMetrics = postMetric(posts);
  const postsByDays = () => {
    const days = {};
    postMetrics.forEach(met => {
      const day = moment(met.createdTime).format('dddd');
      if (!days[day]) days[day] = { day, postMetrics: [] };
      days[day].postMetrics.push(met);
    });
    return _.values(days).map(day => ({
      ...day,
      postsMetric: postsMetric(day.postMetrics.map(me => me.post)),
    }));
  };
  const postsByHours = () => {
    const hours = {};
    postMetrics.forEach(met => {
      const hour = moment(met.createdTime).format('HH');
      let trihourly = Math.ceil(parseInt(hour, 10)/3) + '';
      // handle 00:00 AM
      if (trihourly === '0') trihourly = '1';

      if (!hours[hour]) hours[hour] = { hour, trihourly, postMetrics: [] };
      hours[hour].postMetrics.push(met);
    });
    return _.values(hours).map(hour => ({
      ...hour,
      postsMetric: postsMetric(hour.postMetrics.map(me => me.post)),
    }));
  };
  const wordCount = () => {
    const count: { [string]: { word: string, count: number } } = {};
    postMetrics.forEach(pos => {
      const words = _.words(pos.text);
      words.forEach(word => {
        if (!count[word]) count[word] = { word, count: 0 };
        count[word].count += 1;
      });
    });
    return _.sortBy(_.values(count), 'count').reverse().slice(0, 500);
  };

  return {
    postMetrics,
    dateStart: () => _.sortBy(postMetrics, 'createdTime')[0].createdTime,
    dateEnd: () => _.sortBy(postMetrics, 'createdTime').reverse()[0].createdTime,
    totalPosts: () => postMetrics.length,
    totalUsers: () => new Set(postMetrics.map(post => (post.from || {}).id).filter(x => x)).size,
    totalComments: () => postMetrics.map(post => (post || {}).commentsCount).reduce((pre, cur) => pre + cur, 0),
    totalShares: () => postMetrics.map(post => (post || {}).sharesCount).reduce((pre, cur) => pre + cur, 0),
    sortBySharesCount: () => _.sortBy(postMetrics, 'sharesCount').reverse(),
    totalLikes: () => postMetrics.map(post => (post || {}).likesCount).reduce((pre, cur) => pre + cur, 0),
    sortByLikesCount: () => _.sortBy(postMetrics, 'likesCount').reverse(),
    postsByDays,
    postsByHours,
    wordCount,
  };
}

export default postsMetric;
