// @flow
import React from 'react';
import Card from 'infra/component/Card';
import PostSummary from './PostSummary';
import type { TimeRangeMetric } from '../service/timeRangeMetric';
import type { CommentMetric } from '../service/commentMetric';

type CommentTop = CommentMetric & {
  total: number,
  percent: number,
}

const getComments = (metric: TimeRangeMetric, type: string): CommentTop[] => {
  switch (type) {
    case 'likes':
    default:
      return metric.commentsMetric.sortByLikesCount().slice(0, 10)
        .map(comm => ({ ...comm, total: comm.likesCount, percent: +((comm.likesCount/metric.commentsMetric.totalLikes())*100).toFixed(2) }));
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
          {getComments(metric, type).filter(comm => comm.total > 0).map((comm, key) => (
            <li key={key} className="list-group-item">
              {comm.text}: {comm.total} - {comm.percent ? `${comm.percent}%` : ''}
            </li>
          ))}
        </ul>
      </Card>
    );
  }
}

export default UserActivityTop;
