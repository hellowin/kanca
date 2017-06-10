// @flow
import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment-timezone';

import Form, { FormTypes, withForm } from 'infra/component/Form';
import Card from 'infra/component/Card';
import type { FormObject } from 'infra/component/Form';

import timeRangeMetricer, { extractDateRangeFromPosts } from '../service/timeRangeMetric';
import type { TimeRangeMetric } from '../service/timeRangeMetric';
import LineChart, { LineChartTypes } from '../component/LineChart';
import CommentActivityTop from '../component/CommentActivityTop';
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

class CommentsMetricPage extends React.Component {


  props: {
    data: {
      dateStart: Date,
      dateEnd: Date,
      granularity: string,
    },
    onFormChange: Function,
  }

  render() {
    const { members, posts, comments, data, onFormChange } = this.props;
    const metric: TimeRangeMetric = timeRangeMetricer(data.dateStart, data.dateEnd, posts, members, comments);
    const metrics: TimeRangeMetric[] = metric.getTimeSeries(data.granularity)

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
            <Form forms={forms} onChange={onFormChange} />
          </Card>
        </div>

        <div className="col-12">
          <LineChart title="Comments" metrics={metrics} show={[
            { column: LineChartTypes.TOTAL_COMMENTS, label: 'Total Comments' },
            { column: LineChartTypes.USERS_COMMENTS, label: 'Unique User Comments' },
          ]} />
        </div>

        <div className="col-md-6">
          <Pie metric={metric} type={PieTypes.COMMENTS_PERDAY} />
          <WordCloud metric={metric} type={WordCloudTypes.COMMENTS} />
          <CommentActivityTop metric={metric} type="likes" title="Comments Likes" subTitle="Top 10 most liked comments." />
        </div>

        <div className="col-md-6">
          <Pie metric={metric} type={PieTypes.COMMENTS_PERTRIHOUR} />
          <TopUserActivity metric={metric} type={TopUserActivityTypes.COMMENTS} title="Comments" subTitle="Top 10 user posts count." />
        </div>

      </div>
    );
  }
}

export default connect(mapStateToProps)(withForm(setDefaultData)(CommentsMetricPage));
