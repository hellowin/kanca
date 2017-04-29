// @flow
import React from 'react';
import _ from 'lodash';
import C3 from 'infra/component/C3';
import Card from 'infra/component/Card';

import type { TimeRangeMetric } from '../service/timeRangeMetric'

const calculate = (type: string, metric: TimeRangeMetric): { key: string, value: number }[] => {
  switch (type) {
    case 'postsPerDay':
      return metric.postsMetric.postsByDays().map(pos => ({ key: pos.day, value: pos.postsMetric.totalPosts() }));
    case 'postsPerHours':
      return metric.postsMetric.postsByHours().map(pos => ({ key: pos.hour, value: pos.postsMetric.totalPosts() }));
    case 'postsPerTrihours':
      const trihourly: { [string]: { key: string, value: number } } = {};
      metric.postsMetric.postsByHours().map(pos => ({ key: pos.trihourly, value: pos.postsMetric.totalPosts() }))
        .forEach(det => {
          if (!trihourly[det.key]) trihourly[det.key] = { key: det.key, value: 0 };
          trihourly[det.key].value += det.value;
        });
      return _.values(trihourly).map(tri => {
        switch (tri.key) {
          case '1':
            return { key: '00:00-03:00', value: tri.value };
          case '2':
            return { key: '03:00-06:00', value: tri.value };
          case '3':
            return { key: '06:00-09:00', value: tri.value };
          case '4':
            return { key: '09:00-12:00', value: tri.value };
          case '5':
            return { key: '12:00-15:00', value: tri.value };
          case '6':
            return { key: '15:00-18:00', value: tri.value };
          case '7':
            return { key: '18:00-21:00', value: tri.value };
          case '8':
            return { key: '21:00-00:00', value: tri.value };
          default:
            return { key: 'error', value: tri.value };
        }
      });
    default:
      return [];
  }
}

class PostsPie extends React.Component {

  props: {
    title: string,
    metric: TimeRangeMetric,
    type: 'postsPerDay' | 'postsPerHours' | 'postsPerTrihours',
  }

  render() {
    const { metric, type, title } = this.props;

    const fixType = type || 'postsPerDay';

    const columns = calculate(fixType, metric).map(col => [col.key, col.value]);

    const config = {
      data: {
        columns,
        type: 'pie',
      },
    };

    const id = `id-${(Math.random() * 1000000000000000000).toFixed(0)}`

    return (
      <Card>
        <div className="row">
          <div className="col-12 text-center">
            {title ? <h5>{title}</h5> : ''}
          </div>
          <div className="col-12">
            <C3 id={id} config={config} />
          </div>
        </div>
      </Card>
    );
  };

}

export default PostsPie;
