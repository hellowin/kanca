// @flow
import React from 'react';
import _ from 'lodash';
import C3 from 'infra/component/C3';
import Card from 'infra/component/Card';
import moment from 'moment-timezone';

import type { TimeRangeMetric } from '../service/timeRangeMetric'

export const PieTypes = {
  ACTIVITIES_PERDAY: 'ACTIVITIES_PERDAY',
  ACTIVITIES_PERTRIHOUR: 'ACTIVITIES_PERTRIHOUR',
  POSTS_PERDAY: 'POSTS_PERDAY',
  POSTS_PERHOUR: 'POSTS_PERHOUR',
  POSTS_PERTRIHOUR: 'POSTS_PERTRIHOUR',
  COMMENTS_PERDAY: 'COMMENTS_PERDAY',
  COMMENTS_PERHOUR: 'COMMENTS_PERHOUR',
  COMMENTS_PERTRIHOUR: 'COMMENTS_PERTRIHOUR',
};

declare type PieType = $Keys<typeof PieTypes>

const trihourlyRename = (arr) => {
  return arr.map(tri => {
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
}

const calculate = (type: PieType, metric: TimeRangeMetric): { key: string, value: number }[] => {
  switch (type) {
    case PieTypes.POSTS_PERDAY:
      return metric.postsMetric.postsByDays().map(pos => ({ key: pos.day, value: pos.postsMetric.totalPosts() }));
    case PieTypes.POSTS_PERHOUR:
      return metric.postsMetric.postsByHours().map(pos => ({ key: pos.hour, value: pos.postsMetric.totalPosts() }));
    case PieTypes.POSTS_PERTRIHOUR:
      const postTrihourly: { [string]: { key: string, value: number } } = {};
      metric.postsMetric.postsByHours().map(pos => ({ key: pos.trihourly, value: pos.postsMetric.totalPosts() }))
        .forEach(det => {
          if (!postTrihourly[det.key]) postTrihourly[det.key] = { key: det.key, value: 0 };
          postTrihourly[det.key].value += det.value;
        });
      return trihourlyRename(_.values(postTrihourly));
    case PieTypes.COMMENTS_PERDAY:
      return metric.commentsMetric.commentsByDays().map(pos => ({ key: pos.day, value: pos.commentsMetric.totalComments() }));
    case PieTypes.COMMENTS_PERHOUR:
      return metric.commentsMetric.commentsByHours().map(pos => ({ key: pos.hour, value: pos.commentsMetric.totalComments() }));
    case PieTypes.COMMENTS_PERTRIHOUR:
      const commentTrihourly: { [string]: { key: string, value: number } } = {};
      metric.commentsMetric.commentsByHours().map(pos => ({ key: pos.trihourly, value: pos.commentsMetric.totalComments() }))
        .forEach(det => {
          if (!commentTrihourly[det.key]) commentTrihourly[det.key] = { key: det.key, value: 0 };
          commentTrihourly[det.key].value += det.value;
        });
      return trihourlyRename(_.values(commentTrihourly));
    case PieTypes.ACTIVITIES_PERDAY:
      const commentActs: { key: string, value: number }[] = metric.commentsMetric.commentsByDays().map(pos => ({ key: pos.day, value: pos.commentsMetric.totalComments() }));
      const postActs: { key: string, value: number }[] = metric.postsMetric.postsByDays().map(pos => ({ key: pos.day, value: pos.postsMetric.totalComments() }));
      const acts: { [string]: { key: string, value: number } } = {};
      [...commentActs, ...postActs].forEach(act => {
        if (!acts[act.key]) acts[act.key] = { key: act.key, value: 0 };
        acts[act.key].value += act.value;
      });
      return _.values(acts);
    case PieTypes.ACTIVITIES_PERTRIHOUR:
      const actTrihourly: { [string]: { key: string, value: number } } = {};
      metric.postsMetric.postsByHours().map(pos => ({ key: pos.trihourly, value: pos.postsMetric.totalPosts() }))
        .forEach(det => {
          if (!actTrihourly[det.key]) actTrihourly[det.key] = { key: det.key, value: 0 };
          actTrihourly[det.key].value += det.value;
        });
      metric.commentsMetric.commentsByHours().map(pos => ({ key: pos.trihourly, value: pos.commentsMetric.totalComments() }))
        .forEach(det => {
          if (!actTrihourly[det.key]) actTrihourly[det.key] = { key: det.key, value: 0 };
          actTrihourly[det.key].value += det.value;
        });
      return trihourlyRename(_.values(actTrihourly));
    default:
      return [];
  }
}

const generateTitle = (type: PieType): string => {
  switch (type) {
    case PieTypes.ACTIVITIES_PERDAY:
      return 'Activities per Day';
    case PieTypes.ACTIVITIES_PERTRIHOUR:
      return 'Activities per Trihour';
    case PieTypes.POSTS_PERDAY:
      return 'Posts per Day';
    case PieTypes.POSTS_PERHOUR:
      return 'Posts per Hour';
    case PieTypes.POSTS_PERTRIHOUR:
      return 'Posts per Trihour';
    case PieTypes.COMMENTS_PERDAY:
      return 'Comments per Hour';
    case PieTypes.COMMENTS_PERHOUR:
      return 'Comments per Hour';
    case PieTypes.COMMENTS_PERTRIHOUR:
      return 'Comments per Trihour';
    default:
      return '';
  }
}

class PostsPie extends React.Component {

  props: {
    metric: TimeRangeMetric,
    type: PieType,
  }

  render() {
    const { metric, type } = this.props;

    const dateEnd = moment(metric.dateEnd);
    const dateStart = moment(metric.dateStart);
    let fixDateStart;
    if (dateEnd.isSame(dateStart, 'd') && dateEnd.isSame(dateStart, 'M') && dateEnd.isSame(dateStart, 'y')) {
      fixDateStart = null;
    } else if (dateEnd.isSame(dateStart, 'M') && dateEnd.isSame(dateStart, 'y')) {
      fixDateStart = dateStart.clone().format('ddd, DD');
    } else if (dateEnd.isSame(dateStart, 'y')) {
      fixDateStart = dateStart.clone().format('ddd, DD MMM');
    } else {
      fixDateStart = dateStart.clone().format('ddd, DD MMM YYYY');
    }
    const fixDateEnd = dateEnd.clone().format('ddd, DD MMM YYYY');
    const date = fixDateStart ? `${fixDateStart} - ${fixDateEnd}` : fixDateEnd;

    const columns = calculate(type, metric).map(col => [col.key, col.value]);

    const config = {
      data: {
        columns,
        type: 'pie',
      },
      tooltip: {
        format: {
          value: function (value, ratio, id) {
            return `${value} (${(ratio * 100).toFixed(2)}%)`;
          }
        }
      }
    };

    const id = `id-${(Math.random() * 1000000000000000000).toFixed(0)}`

    return (
      <Card>
        <div className="row">
          <div className="col-12 text-center">
            <h5>{generateTitle(type)}</h5>
            {date}
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
