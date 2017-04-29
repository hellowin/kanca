// @flow
import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import moment from 'moment-timezone';

import { extractDateRangeFromPosts, timeSeriesMetric as timeSeriesMetricer } from '../service/timeRangeMetric';
import type { TimeRangeMetric } from '../service/timeRangeMetric';

import PostsTimeSeries from '../component/PostsTimeSeries';
import Form, { FormTypes, withForm } from 'infra/component/Form';
import type { FormObject } from 'infra/component/Form';

const mapStateToProps = state => ({
  feeds: state.group.feeds,
  members: state.group.members,
  comments: state.group.comments,
});

const setDefaultData = props => {
  const { feeds } = props;
  const { dateEnd } = extractDateRangeFromPosts(feeds, 'd');
  const dateStart = moment(dateEnd).add(-1, 'month').toDate();

  return {
    dateStart,
    dateEnd,
    granularity: 'd',
  };
}

class MetricSummary extends React.Component {

  onFormChange: Function

  state: {
    data: {
      dateStart: Date,
      dateEnd: Date,
      granularity: string,
    },
  }

  render() {
    const { feeds, members, comments } = this.props;
    const { data } = this.state;
    const metrics: TimeRangeMetric[] = timeSeriesMetricer(data.dateStart, data.dateEnd, data.granularity, feeds, members, comments);

    const forms: FormObject[] = [
      { type: FormTypes.DATE, label: 'Date start', value: data.dateStart, model: 'dateStart', col: 4 },
      { type: FormTypes.DATE, label: 'Date end', value: data.dateStart, model: 'dateEnd', col: 4 },
      { type: FormTypes.SELECT, label: 'Granularity', value: data.granularity, model: 'granularity', col: 4, selectOptions: [
        { text: 'Daily', value: 'd' },
        { text: 'Weekly', value: 'w' },
        { text: 'Monthly', value: 'M' },
        { text: 'Annually', value: 'y' },
      ] },
    ];

    return (
      <div className="row">

        <div className="col-md-12">
          <div className="card">
            <div className="card-block">
              <Form forms={forms} onChange={this.onFormChange} />
            </div>
          </div>
        </div>

        <div className="col-md-12">
          <h4>Summary</h4>
        </div>

        <div className="col-md-12">
          <div className="card">
            <div className="card-block">
              <PostsTimeSeries title="Posts" metrics={metrics} show={[
                { column: 'totalPosts', label: 'Total Posts' },
                { column: 'usersPosts', label: 'Unique User Posts' },
              ]} />
            </div>
          </div>
        </div>

        <div className="col-md-12">
          <div className="card">
            <div className="card-block">
              <PostsTimeSeries title="Comments" metrics={metrics} show={[
                { column: 'totalComments', label: 'Total Comments' },
                { column: 'usersComments', label: 'Unique User Comments' },
              ]} />
            </div>
          </div>
        </div>

      </div>
    );
  }

}

export default connect(mapStateToProps)(withForm(MetricSummary, setDefaultData));
