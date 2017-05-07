// @flow
import React from 'react';
import Card from 'infra/component/Card';
import { timeRangeToString } from 'infra/service/util';
import type { TimeRangeMetric } from '../service/timeRangeMetric';

type TimeRangeSummaryProps = {
  metric: TimeRangeMetric,
}

class TimeRangeSummary extends React.Component<*, TimeRangeSummaryProps, *> {

  props: TimeRangeSummaryProps

  render() {
    const { metric } = this.props;

    return (
      <Card title={`Time Range Summary, ${timeRangeToString(metric.dateStart, metric.dateEnd)}`}>
        <div className="row">

          <div className="col-md-4">
            <div className="callout callout-info">
              <small className="text-muted">Total posts</small>
              <br />
              <strong className="h4">{metric.postsMetric.totalPosts()}</strong>
            </div>
            <p>
              Shares: {metric.postsMetric.totalShares()}
              <br />
              Likes: {metric.postsMetric.totalLikes()}
            </p>
          </div>

          <div className="col-md-4">
            <div className="callout callout-warning">
              <small className="text-muted">Total comments</small>
              <br />
              <strong className="h4">{metric.postsMetric.totalComments()}</strong>
            </div>
            <p>
              Likes: {metric.commentsMetric.totalLikes()}
            </p>
          </div>

          <div className="col-md-4">
            <div className="callout callout-danger">
              <small className="text-muted">Total members</small>
              <br />
              <strong className="h4">{metric.usersMetric.totalMembers()}</strong>
            </div>
            <p>
              Member posting: {metric.usersMetric.uniqueUsersPosts().length}
              <br />
              Member commenting: {metric.usersMetric.uniqueUsersComments().length}
            </p>
          </div>

        </div>
      </Card>
    );
  }

}

export default TimeRangeSummary;
