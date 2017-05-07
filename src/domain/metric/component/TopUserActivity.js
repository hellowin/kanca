// @flow
import React from 'react';
import Card from 'infra/component/Card';
import { timeRangeToString } from 'infra/service/util';
import type { TimeRangeMetric } from '../service/timeRangeMetric';

type UserTop = {
  name: string,
  picture: string,
  url?: string,
  total: number,
  percent: number,
}

export const TopUserActivityTypes = {
  SCORE: 'SCORE',
  POSTS: 'POSTS',
  COMMENTS: 'COMMENTS',
  POSTS_SHARES: 'POSTS_SHARES',
  POSTS_LIKES: 'POSTS_LIKES',
};

export type TopUserActivityType = $Keys<typeof TopUserActivityTypes>

const getUsers = (metric: TimeRangeMetric, type: TopUserActivityType): UserTop[] => {
  switch (type) {
    case TopUserActivityTypes.SCORE:
      return metric.usersMetric.userMetrics.sort((a, b) => b.getScore() - a.getScore()).slice(0, 10)
        .map(user => ({ ...user, total: user.getScore(), percent: +((user.getScore()/metric.usersMetric.userMetrics.map(usr => usr.getScore()).reduce((pre, cur) => pre + cur, 0))*100).toFixed(2) }));
    case TopUserActivityTypes.POSTS:
      return metric.usersMetric.sortByPostsCount().slice(0, 10)
        .map(user => ({ ...user, total: user.postsCount, percent: +((user.postsCount/metric.postsMetric.totalPosts())*100).toFixed(2) }));
    case TopUserActivityTypes.COMMENTS:
      return metric.usersMetric.sortByCommentsCount().slice(0, 10)
        .map(user => ({ ...user, total: user.commentsCount, percent: +((user.commentsCount/metric.postsMetric.totalComments())*100).toFixed(2) }));
    case TopUserActivityTypes.POSTS_SHARES:
      return metric.usersMetric.sortByPostsSharesCount().slice(0, 10)
        .map(user => ({ ...user, total: user.postsSharesCount, percent: +((user.postsSharesCount/metric.postsMetric.totalShares())*100).toFixed(2) }));
    case TopUserActivityTypes.POSTS_LIKES:
    default:
      return metric.usersMetric.sortByPostsLikesCount().slice(0, 10)
        .map(user => ({ ...user, total: user.postsLikesCount, percent: +((user.postsLikesCount/metric.postsMetric.totalLikes())*100).toFixed(2) }));
  }
}

const generateTitle = (type: TopUserActivityType): { title: string, subTitle: string } => {
  switch (type) {
    case TopUserActivityTypes.SCORE:
      return { title: 'Top User Activity by Score', subTitle: 'Top 10 user activity by score' };
    case TopUserActivityTypes.POSTS:
      return { title: 'Top User Activity by Posts', subTitle: 'Top 10 user activity by number of posts' };
    case TopUserActivityTypes.COMMENTS:
      return { title: 'Top User Activity by Comments', subTitle: 'Top 10 user activity by number of comments' };
    case TopUserActivityTypes.POSTS_LIKES:
      return { title: 'Top User Activity by Posts Likes', subTitle: 'Top 10 user activity by number of likes received on posts' };
    case TopUserActivityTypes.POSTS_SHARES:
      return { title: 'Top User Activity by Posts Shares', subTitle: 'Top 10 user activity by number of posts shares' };
    default:
      return { title: 'Top User Activity', subTitle: 'Top 10 user activity' };
  }
}

class TopUserActivity extends React.Component {

  props: {
    metric: TimeRangeMetric,
    type: TopUserActivityType,
  }

  render() {
    const { metric, type } = this.props;

    return (
      <Card title={generateTitle(type).title}>
        <p>{generateTitle(type).subTitle}, time range {timeRangeToString(metric.dateStart, metric.dateEnd)}.</p>

        <ul className="list-group">
          {getUsers(metric, type).filter(user => user.total > 0).map((user, key) => {
            switch (key) {
              case 0:
                return (
                  <li key={key} className="list-group-item">
                    <div className="col-12" style={{ margin: '0 -15px' }}>
                      {user.picture ? <img alt="user pic" src={user.picture} className="mr-1 mb-1" style={{ float: 'left', width: '50px' }} /> : ''}
                      <a href={user.url} target="_blank"><h4>{user.name}</h4></a>
                      <span>Total {type.toLowerCase()} {user.total} - {user.percent ? `${user.percent}%` : ''}</span>
                    </div>
                  </li>
                );
              case 1:
                return (
                  <li key={key} className="list-group-item">
                    <div className="col-12" style={{ margin: '0 -15px' }}>
                      {user.picture ? <img alt="user pic" src={user.picture} className="mr-1 mb-1" style={{ float: 'left', width: '45px' }} /> : ''}
                      <a href={user.url} target="_blank"><h5>{user.name}</h5></a>
                      <span>Total {type.toLowerCase()} {user.total} - {user.percent ? `${user.percent}%` : ''}</span>
                    </div>
                  </li>
                );
              case 2:
                return (
                  <li key={key} className="list-group-item">
                    <div className="col-12" style={{ margin: '0 -15px' }}>
                      {user.picture ? <img alt="user pic" src={user.picture} className="mr-1 mb-1" style={{ float: 'left', width: '40px' }} /> : ''}
                      <a href={user.url} target="_blank"><h6>{user.name}</h6></a>
                      <span>Total {type.toLowerCase()} {user.total} - {user.percent ? `${user.percent}%` : ''}</span>
                    </div>
                  </li>
                );
              default:
                return (
                  <li key={key} className="list-group-item">
                    <a href={user.url} target="_blank">{user.name}</a>: {user.total} - {user.percent ? `${user.percent}%` : ''}
                  </li>
                );
            }
          })}
        </ul>
      </Card>
    );
  }
}

export default TopUserActivity;
