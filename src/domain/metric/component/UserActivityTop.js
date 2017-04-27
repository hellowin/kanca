// @flow
import React from 'react';
import Card from 'infra/component/Card';
import type { TimeRangeMetric } from '../service/timeRangeMetric';

type UserTop = {
  name: string,
  total: number,
  percent: number,
}

const getUsers = (metric: TimeRangeMetric, type: string): UserTop[] => {
  switch (type) {
    case 'posts':
      return metric.usersMetric.sortByPostsCount().slice(0, 10)
        .map(user => ({ ...user, total: user.postsCount, percent: +((user.postsCount/metric.postsMetric.totalPosts())*100).toFixed(2) }));
    case 'comments':
      return metric.usersMetric.sortByCommentsCount().slice(0, 10)
        .map(user => ({ ...user, total: user.commentsCount, percent: +((user.commentsCount/metric.postsMetric.totalComments())*100).toFixed(2) }));
    case 'posts-shares':
      return metric.usersMetric.sortByPostsSharesCount().slice(0, 10)
        .map(user => ({ ...user, total: user.postsSharesCount, percent: +((user.postsSharesCount/metric.postsMetric.totalPostsShares())*100).toFixed(2) }));
    case 'posts-likes':
    default:
      return metric.usersMetric.sortByPostsLikesCount().slice(0, 10)
        .map(user => ({ ...user, total: user.postsLikesCount, percent: +((user.postsLikesCount/metric.postsMetric.totalPostsLikes())*100).toFixed(2) }));
  }
}

class UserActivityTop extends React.Component {

  props: {
    metric: TimeRangeMetric,
    type: string,
    title: string,
    subTitle: string,
  }

  render() {
    const { metric, type, title, subTitle } = this.props;

    return (
      <Card>
        <h4 className="card-title">{title}</h4>
        <p>{subTitle}</p>
        <ul className="list-group">
          {getUsers(metric, type).filter(user => user.total > 0).map((user, key) => 
            (<li key={key} className="list-group-item">{user.name}: {user.total} - {user.percent ? `${user.percent}%` : ''}</li>)
          )}
        </ul>
      </Card>
    );
  }
}

export default UserActivityTop;
