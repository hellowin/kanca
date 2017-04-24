// @flow
import React from 'react';
import moment from 'moment-timezone';
import C3 from 'infra/component/C3';

import type { TimeRangeMetric } from '../service/timeRangeMetric'

const defaultShow = [
  { column: 'totalPosts', label: 'Total Posts' },
  { column: 'usersPosts', label: 'Unique User Posts' },
];

const calculate = (column: string, metrics: TimeRangeMetric[]): number[] => {
  switch (column) {
    case 'totalPosts':
      return metrics.map(met => met.postsMetric.totalPosts);
    case 'usersPosts':
      return metrics.map(met => met.usersMetric.uniqueUsersPosts().length);
    case 'totalComments':
      return metrics.map(met => met.postsMetric.totalComments);
    case 'usersComments':
      return metrics.map(met => met.usersMetric.uniqueUsersComments().length);
    default:
      return [];
  }
}

class PostsTimeSeries extends React.Component {

  props: {
    metrics: TimeRangeMetric[],
    show: {
      column: 'totalPosts' | 'usersPosts' | 'totalComments' | 'usersComments',
      label: string,
    }[],
  }

  render() {
    const { metrics, show } = this.props;

    const fixShow = show || defaultShow;

    const dates = metrics.map(met => moment(met.dateStart).format('YYYY-MM-DD'));

    const showColumns = fixShow.map(fix => [fix.label, ...calculate(fix.column, metrics)])

    const config = {
      data: {
        x: 'Date',
        columns: [
          ['Date', ...dates],
          ...showColumns,
        ],
      },
      axis: {
        x: {
          type: 'timeseries',
          tick: {
            format: d => moment(d).format('ddd, DD MMM YY'),
          },
        },
      },
    };

    const id = `id-${(Math.random() * 1000000000000000000).toFixed(0)}`

    return <C3 id={id} config={config} />;
  };

}

export default PostsTimeSeries;
