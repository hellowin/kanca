// @flow
import React from 'react';
import Card from 'infra/component/Card';
import { extractDateRange } from '../service/timeRangeMetric';
import type { TimeRangeMetric } from '../service/timeRangeMetric';
import { timeRangeToString } from 'infra/service/util';

class UserProfileSummary extends React.Component {

  props: {
    metric: TimeRangeMetric,
    userId: string,
  }

  render () {
    const { metric, userId } = this.props;
    const userMetric = metric.usersMetric.getById(userId);

    const { dateStart, dateEnd } = extractDateRange(userMetric.posts, userMetric.comments, 'd');
    const dateString = timeRangeToString(dateStart, dateEnd);

    return (
      <Card title="User Summary">
        <p>{dateString}</p>
        <dl>
          <dt><i className="fa fa-pencil-square-o mr-1" />Posts</dt>
          <dd>
            Total: {userMetric.postsCount}<br />
            Likes: {userMetric.postsLikesCount}<br />
            Shares: {userMetric.postsSharesCount}<br />
          </dd>

          <dt><i className="fa fa-commenting mr-1" />Comments</dt>
          <dd>
            Total: {userMetric.commentsCount}
          </dd>

          <dt><i className="fa fa-star mr-1" />Score</dt>
          <dd>
            Total: {userMetric.getScore()}
          </dd>

        </dl>
      </Card>
    );
  }

}

export default UserProfileSummary;
