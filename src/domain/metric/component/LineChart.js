// @flow
import React from 'react';
import moment from 'moment-timezone';
import C3 from 'infra/component/C3';
import Card from 'infra/component/Card';

import type { TimeRangeMetric } from '../service/timeRangeMetric'

const defaultShow = [
  { column: 'totalPosts', label: 'Total Posts' },
  { column: 'usersPosts', label: 'Unique User Posts' },
];

export const LineChartTypes = {
  TOTAL_POSTS: 'TOTAL_POSTS',
  USERS_POSTS: 'USERS_POSTS',
  TOTAL_COMMENTS: 'TOTAL_COMMENTS',
  USERS_COMMENTS: 'USERS_COMMENTS',
};

declare type LineChartType = $Keys<typeof LineChartTypes>

const calculate = (column: LineChartType, metrics: TimeRangeMetric[]): number[] => {
  switch (column) {
    case LineChartTypes.TOTAL_POSTS:
      return metrics.map(met => met.postsMetric.totalPosts());
    case LineChartTypes.USERS_POSTS:
      return metrics.map(met => met.usersMetric.uniqueUsersPosts().length);
    case LineChartTypes.TOTAL_COMMENTS:
      return metrics.map(met => met.postsMetric.totalComments());
    case LineChartTypes.USERS_COMMENTS:
      return metrics.map(met => met.usersMetric.uniqueUsersComments().length);
    default:
      return [];
  }
}

class PostsTimeSeries extends React.Component {

  props: {
    title: string,
    metrics: TimeRangeMetric[],
    show: {
      column: LineChartType,
      label: string,
    }[],
  }

  render() {
    const { metrics, show, title } = this.props;

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
            format: d => moment(d).format('ddd, DD MMM YYYY'),
          },
        },
      },
    };

    const id = `id-${(Math.random() * 1000000000000000000).toFixed(0)}`

    return (
      <Card title={title}>
        <div className="row">
          <div className="col-12" style={{ overflowX: 'auto', overflowY: 'none' }}>
            <div style={{ minWidth: '1000px' }}>
              <C3 id={id} config={config} />
            </div>
          </div>
        </div>
      </Card>
    );
  };

}

export default PostsTimeSeries;
