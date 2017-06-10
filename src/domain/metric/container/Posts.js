// @flow
import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment-timezone';

import Form, { FormTypes, withForm } from 'infra/component/Form';
import type { FormObject } from 'infra/component/Form';
import Card from 'infra/component/Card';

import timeRangeMetricer, { extractDateRangeFromPosts } from '../service/timeRangeMetric';
import type { TimeRangeMetric } from '../service/timeRangeMetric';
import LineChart, { LineChartTypes } from '../component/LineChart';
import TopPostActivity, { TopPostActivityTypes } from '../component/TopPostActivity';
import TopUserActivity, { TopUserActivityTypes } from '../component/TopUserActivity';
import Pie, { PieTypes } from '../component/Pie';
import WordCloud, { WordCloudTypes } from '../component/WordCloud';

const mapStateToProps = state => ({
  members: state.group.members,
  posts: state.group.feeds,
  comments: state.group.comments,
});

const setDefaultData = props => {
  const { posts } = props;
  const { dateEnd } = extractDateRangeFromPosts(posts, 'd');
  const dateStart = moment(dateEnd).startOf('M').toDate();

  return {
    dateStart,
    dateEnd,
    granularity: 'd',
  };
};

class PostsMetricPage extends React.Component {

  onFormChange: Function

  state: {
    data: {
      dateStart: Date,
      dateEnd: Date,
      granularity: string,
    },
  }

  render() {
    const { members, posts, comments } = this.props;
    const { data } = this.state;
    const metric: TimeRangeMetric = timeRangeMetricer(data.dateStart, data.dateEnd, posts, members, comments);
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
          <Card>
            <Form forms={forms} onChange={this.onFormChange} />
          </Card>
        </div>

        <div className="col-12">
          <LineChart title="Posts" metrics={metrics} show={[
            { column: LineChartTypes.TOTAL_POSTS, label: 'Total Posts' },
            { column: LineChartTypes.USERS_POSTS, label: 'Unique User Posts' },
          ]} />
        </div>

        <div className="col-md-6">
          <Pie metric={metric} type={PieTypes.POSTS_PERDAY} />
          <WordCloud metric={metric} type={WordCloudTypes.POSTS} />
          <TopPostActivity metric={metric} type={TopPostActivityTypes.LIKES} />
        </div>

        <div className="col-md-6">
          <Pie metric={metric} type={PieTypes.POSTS_PERTRIHOUR} />
          <TopUserActivity metric={metric} type={TopUserActivityTypes.POSTS} title="Posts" subTitle="Top 10 user posts count." />
          <TopPostActivity metric={metric} type={TopPostActivityTypes.SHARES} />
        </div>

      </div>
    );
  }
}

export default connect(mapStateToProps)(withForm(setDefaultData)(PostsMetricPage));
