// @flow
import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import moment from 'moment-timezone';

import Card from 'infra/component/Card';
import Form, { FormTypes, withForm } from 'infra/component/Form';
import type { FormObject } from 'infra/component/Form';

import timeRangeMetricer, { extractDateRangeFromPosts } from '../service/timeRangeMetric';
import type { TimeRangeMetric } from '../service/timeRangeMetric';
import LineChart, { LineChartTypes } from '../component/LineChart';
import Pie, { PieTypes } from '../component/Pie';
import WordCloud, { WordCloudTypes } from '../component/WordCloud';
import TopUserActivity, { TopUserActivityTypes } from '../component/TopUserActivity';
import TopPostActivity, { TopPostActivityTypes } from '../component/TopPostActivity';
import TimeRangeSummary from '../component/TimeRangeSummary';
import FancyButton from '../component/FancyButton';

const mapStateToProps = state => ({
  feeds: state.group.feeds,
  members: state.group.members,
  comments: state.group.comments,
});

const setDefaultData = props => {
  const { feeds } = props;
    const { dateEnd } = extractDateRangeFromPosts(feeds, 'd');
    const dateStart = moment(dateEnd).startOf('M').toDate();

    return {
      dateStart,
      dateEnd,
      granularity: 'd',
    };
}

class MetricSummary extends React.Component {

  state: {
    data: {
      dateStart: Date,
      dateEnd: Date,
      granularity: moment.unitOfTime.Base,
    },
  }

  onFormChange: Function

  render() {
    const { feeds, members, comments } = this.props;
    const { data } = this.state;
    const metric: TimeRangeMetric = timeRangeMetricer(data.dateStart, data.dateEnd, feeds, members, comments);
    const metrics: TimeRangeMetric[] = metric.getTimeSeries(data.granularity);
    
    const forms: FormObject[] = [
      { type: FormTypes.DATE, label: 'Date start', value: data.dateStart, model: 'dateStart', col: 4 },
      { type: FormTypes.DATE, label: 'Date end', value: data.dateEnd, model: 'dateEnd', col: 4 },
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
          <div className="row">

            <div className="col-md-3">
              <FancyButton title="Posts" subTitle="Posts metric details" icon="fa fa-edit" target="/metric/posts" />
            </div>

            <div className="col-md-3">
              <FancyButton title="Comments" subTitle="Comments metric details" icon="fa fa-comments" target="/metric/comments" />
            </div>

            <div className="col-md-3">
              <FancyButton title="Members" subTitle="Members metric details" icon="fa fa-users" target="/metric/members" />
            </div>

            <div className="col-md-3">
              <FancyButton title="My Profile" subTitle="User metric details" icon="fa fa-user" target="/metric/user-profile" />
            </div>

          </div>
        </div>

        <div className="col-md-12">
          <Card title="Options">
            <div className="row">
              <div className="col-md-12">
                <Form forms={forms} onChange={this.onFormChange} />
              </div>
            </div>
          </Card>
        </div>

        <div className="col-md-12">
          <LineChart title="Group Activities" metrics={metrics} show={[
            { column: LineChartTypes.TOTAL_POSTS, label: 'Total Posts' },
            { column: LineChartTypes.USERS_POSTS, label: 'Unique User Posts' },
            { column: LineChartTypes.TOTAL_COMMENTS, label: 'Total Comments' },
            { column: LineChartTypes.USERS_COMMENTS, label: 'Unique User Comments' },
          ]} />
          <TimeRangeSummary metric={metric} />
        </div>

        <div className="col-md-6">
          <Pie metric={metric} type={PieTypes.ACTIVITIES_PERDAY} />
          <TopUserActivity metric={metric} type={TopUserActivityTypes.SCORE} />
        </div>

        <div className="col-md-6">
          <Pie metric={metric} type={PieTypes.ACTIVITIES_PERTRIHOUR} />
          <WordCloud metric={metric} type={WordCloudTypes.ALL} />
          <TopPostActivity metric={metric} type={TopPostActivityTypes.SCORE} />
        </div>

      </div>
    );
  }

}

export default connect(mapStateToProps)(withForm(MetricSummary, setDefaultData));
