// @flow
import React from 'react';
import moment from 'moment-timezone';
import C3 from 'infra/component/C3';

import type { TimeRangeMetric } from '../service/timeRangeMetric'

class PostsTimeSeries extends React.Component {

  props: {
    metrics: TimeRangeMetric[],
  }

  render() {
    const { metrics } = this.props;

    const dates = metrics.map(met => moment(met.dateStart).format('YYYY-MM-DD'));
    const totalPosts = metrics.map(met => met.postsMetric.totalPosts);
    const usersPosts = metrics.map(met => met.usersMetric.uniqueUsersPosts().length);

    const config = {
      data: {
        x: 'Date',
        columns: [
          ['Date', ...dates],
          ['Total Posts', ...totalPosts],
          ['Unique User Posts', ...usersPosts],
        ],
      },
      axis: {
        x: {
          type: 'timeseries',
          tick: {
            format: '%Y-%m-%d'
          },
        },
      },
    };

    return <C3 id="posts-time-series" config={config} />;
  };

}

export default PostsTimeSeries;
