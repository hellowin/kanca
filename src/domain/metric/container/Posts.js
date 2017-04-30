// @flow
import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment-timezone';

import Form, { FormTypes, withForm } from 'infra/component/Form';
import Card from 'infra/component/Card';
import type { FormObject } from 'infra/component/Form';

import timeRangeMetricer, { timeSeriesMetric as timeSeriesMetricer, extractDateRangeFromPosts } from '../service/timeRangeMetric';
import type { TimeRangeMetric } from '../service/timeRangeMetric';
import PostsTimeSeries from '../component/PostsTimeSeries';
import PostActivityTop from '../component/PostActivityTop';
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
          <PostsTimeSeries title="Posts" metrics={metrics} show={[
            { column: 'totalPosts', label: 'Total Posts' },
            { column: 'usersPosts', label: 'Unique User Posts' },
          ]} />
        </div>

        <div className="col-md-6">
          <Pie metric={metric} type="postsPerDay" />
          <WordCloud metric={metric} type="posts" />
          <PostActivityTop metric={metric} type="likes" title="Posts Likes" subTitle="Top 10 most liked posts." />
        </div>

        <div className="col-md-6">
          <Pie metric={metric} type="postsPerTrihours" />
          <UserActivityTop metric={metric} type="posts" title="Posts" subTitle="Top 10 user posts count." />
          <PostActivityTop metric={metric} type="shares" title="Posts Shares" subTitle="Top 10 most shared posts." />
        </div>

      </div>
    );
  }
}

export default connect(mapStateToProps)(withForm(PostsMetricPage, setDefaultData));
