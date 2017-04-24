// @flow
import _ from 'lodash';

export type UserMetric = {
  id: string,
  name: string,
  picture: string,
  posts: Post[],
  comments: Comment[],
  postsCount: number,
  commentsCount: number,
  postsSharesCount: number,
  postsLikesCount: number,
}

const userFactory = (id: string, name: string, picture: string): UserMetric => ({
  id,
  name,
  picture,
  posts: [],
  comments: [],
  postsCount: 0,
  commentsCount: 0,
  postsSharesCount: 0,
  postsLikesCount: 0,
});

export default (members: Member[], posts: Post[], comments: Comment[]): UserMetric[] => {
  // create user mapping
  const users = {};
  _.each(members, member => {
    const id = member.id;
    const name = member.name;
    const picture = member.picture.data.url;
    const user = userFactory(id, name, picture);
    users.push(user);
  });
  
  // create user posts mapping
  _.each(posts, feed => {
    const userId = (feed.from || {}).id;
    // create empty user posts mapping
    if (feed.from) users[userId].posts.push(feed);
  });

  // create user comments mapping
  _.each(comments, comment => {
    const userId = (comment.from || {}).id;
    // create empty user posts mapping
    if (comment.from) users[userId].comments.push(comment);
  });

  // calculate per user basis
  _.each(users, user => {
    user.postsCount = user.posts.length;
    user.postsSharesCount = 0;
    user.postsLikesCount = 0;
    user.commentsCount = user.comments.length;
    _.each(user.posts, post => {
      if (post.shares && post.shares.count) user.postsSharesCount += post.shares.count;
      if (post.likes && post.likes.data && post.likes.data.length) user.postsLikesCount += post.likes.data.length;
    });
  });

  return _.values(users);
};