// @flow
import _ from 'lodash';

export type UserMetric = {
  id: string,
  name: string,
  postsCount: number,
  postsSharesCount: number,
  postsLikesCount: number,
}

export default (feeds: Post[]): UserMetric[] => {
  // create user posts mapping
  const users = {};
  _.each(feeds, feed => {
    const userId = (feed.from || {}).id;

    // create empty user posts mapping
    if (!users[userId] && feed.from) users[userId] = { id: feed.from.id, name: feed.from.name, posts: [] };
    users[userId].posts.push(feed);
  });

  // calculate per user basis
  _.each(users, user => {
    user.postsCount = user.posts.length;
    user.postsSharesCount = 0;
    user.postsLikesCount = 0;
    _.each(user.posts, post => {
      if (post.shares && post.shares.count) user.postsSharesCount += post.shares.count;
      if (post.likes && post.likes.data && post.likes.data.length) user.postsLikesCount += post.likes.data.length;
    });
  });

  return _.values(users);
};