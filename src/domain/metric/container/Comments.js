// @flow
import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment-timezone';

import Form, { FormTypes, withForm } from 'infra/component/Form';
import Card from 'infra/component/Card';
import type { FormObject } from 'infra/component/Form';

import timeRangeMetricer, { timeSeriesMetric as timeSeriesMetricer, extractDateRangeFromPosts } from '../service/timeRangeMetric';
import type { TimeRangeMetric } from '../service/timeRangeMetric';
import LineChart, { LineChartTypes } from '../component/LineChart';
import CommentActivityTop from '../component/CommentActivityTop';
import UserActivityTop from '../component/UserActivityTop';
import Pie from '../component/Pie';
import WordCloud from '../component/WordCloud';

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
    const metrics: TimeRangeMetric[] = timeSeriesMetricer(data.dateStart, data.dateEnd, data.granularity, posts, members, comments);
    const metric: TimeRangeMetric = timeRangeMetricer(data.dateStart, data.dateEnd, posts, members, comments);

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
          <LineChart title="Comments" metrics={metrics} show={[
            { column: LineChartTypes.TOTAL_COMMENTS, label: 'Total Comments' },
            { column: LineChartTypes.USERS_COMMENTS, label: 'Unique User Comments' },
          ]} />
        </div>

        <div className="col-md-6">
          <Pie metric={metric} type="commentsPerDay" />
          <WordCloud metric={metric} type="comments" />
          <CommentActivityTop metric={metric} type="likes" title="Comments Likes" subTitle="Top 10 most liked comments." />
        </div>

        <div className="col-md-6">
          <Pie metric={metric} type="commentsPerTrihours" />
          <UserActivityTop metric={metric} type="comments" title="Comments" subTitle="Top 10 user posts count." />
        </div>

      </div>
    );
  }
}

export default connect(mapStateToProps)(withForm(CommentsMetricPage, setDefaultData));
