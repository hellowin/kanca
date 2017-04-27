// @flow
import React from 'react';
import Card from 'infra/component/Card';
import type { TimeRangeMetric } from '../service/timeRangeMetric';

type UserTop = {
  name: string,
  picture: string,
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
          {getUsers(metric, type).filter(user => user.total > 0).map((user, key) => {
            switch (key) {
              case 0:
                return (
                  <li key={key} className="list-group-item">
                    <div className="col-12">
                      {user.picture ? <img alt="user pic" src={user.picture} className="mr-1 mb-1" style={{ float: 'left', width: '70px' }} /> : ''}
                      <h4>{user.name}</h4>
                      <span>Total {type} {user.total} - {user.percent ? `${user.percent}%` : ''}</span>
                    </div>
                  </li>
                );
              case 1:
                return (
                  <li key={key} className="list-group-item">
                    <div className="col-12">
                      {user.picture ? <img alt="user pic" src={user.picture} className="mr-1 mb-1" style={{ float: 'left', width: '60px' }} /> : ''}
                      <h5>{user.name}</h5>
                      <span>Total {type} {user.total} - {user.percent ? `${user.percent}%` : ''}</span>
                    </div>
                  </li>
                );
              case 2:
                return (
                  <li key={key} className="list-group-item">
                    <div className="col-12">
                      {user.picture ? <img alt="user pic" src={user.picture} className="mr-1 mb-1" style={{ float: 'left', width: '50px' }} /> : ''}
                      <h6>{user.name}</h6>
                      <span>Total {type} {user.total} - {user.percent ? `${user.percent}%` : ''}</span>
                    </div>
                  </li>
                );
              default:
                return (
                  <li key={key} className="list-group-item">
                    {user.name}: {user.total} - {user.percent ? `${user.percent}%` : ''}
                  </li>
                );
            }
          })}
        </ul>
      </Card>
    );
  }
}

export default UserActivityTop;
