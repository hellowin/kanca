// @flow
import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

const mapStateToProps = state => ({
  feeds: state.group.feeds,
});

const count = (feeds: {}[]): { userId: string, userName: string, user: { id: string, name: string }, postsCount: number, postsSharesCount: number, postsLikesCount: number }[] => {
  // create user posts mapping
  const users = {};
  _.each(feeds, feed => {
    const userId = feed.from.id;

    // create empty user posts mapping
    if (!users[userId]) users[userId] = { userId, user: feed.from, posts: [] };
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

class UserActivity extends React.Component {

  render() {
    const { feeds } = this.props;
    const userMetric = count(feeds);

    return (
      <div className="row">
        <div className="col-md-4">
          <pre>{JSON.stringify(userMetric.map(user => ({ userId: user.user.id, userName: user.user.name, postsCount: user.postsCount, postsSharesCount: user.postsSharesCount, postsLikesCount: user.postsLikesCount })), null, 2)}</pre>          
        </div>
      </div>
    );
  }

}

export default connect(mapStateToProps)(UserActivity);
