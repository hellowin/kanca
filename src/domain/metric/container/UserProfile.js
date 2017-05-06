// @flow
import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import moment from 'moment-timezone';

import Card from 'infra/component/Card';
import Form, { FormTypes, withForm } from 'infra/component/Form';
import type { FormObject } from 'infra/component/Form';

import timeRangeMetricer, { timeSeriesMetric as timeSeriesMetricer, extractDateRangeFromPosts } from '../service/timeRangeMetric';
import type { TimeRangeMetric } from '../service/timeRangeMetric';
import usersMetricer from '../service/usersMetric';
import type { UserMetric }  from '../service/userMetric';
import LineChart, { LineChartTypes } from '../component/LineChart';
import Pie, { PieTypes } from '../component/Pie';
import WordCloud from '../component/WordCloud';

const mapStateToProps = state => ({
  feeds: state.group.feeds,
  members: state.group.members,
  comments: state.group.comments,
  profile: state.user.profile,
});

const setDefaultData = props => {
  const { feeds } = props;
    const { dateEnd } = extractDateRangeFromPosts(feeds, 'd');
    const dateStart = moment(dateEnd).startOf('M').toDate();

    return {
      dateStart,
      dateEnd,
    };
}

class MetricSummary extends React.Component {

  state: {
    data: {
      dateStart: Date,
      dateEnd: Date,
    },
  }

  onFormChange: Function

  render() {
    const { feeds, members, comments, profile } = this.props;
    const { data } = this.state;
    const userMetric: UserMetric = usersMetricer(members, feeds, comments).getById(profile.facebookId);
    if (!userMetric) return <div>Wait...</div>

    const mems: Member[] = userMetric.member ? [userMetric.member] : [];
    const metric: TimeRangeMetric = timeRangeMetricer(data.dateStart, data.dateEnd, userMetric.posts, mems, userMetric.comments);
    const metrics: TimeRangeMetric[] = timeSeriesMetricer(data.dateStart, data.dateEnd, 'd', userMetric.posts, mems, userMetric.comments);

    const profileForms = [
      { type: FormTypes.TEXT, label: 'Name', value: profile.name, disabled: true, col: 6 },
      { type: FormTypes.TEXT, label: 'Email', value: profile.email, disabled: true, col: 6 },
    ];

    const forms: FormObject[] = [
      { type: FormTypes.DATE, label: 'Date start', value: data.dateStart, model: 'dateStart', col: 6 },
      { type: FormTypes.DATE, label: 'Date end', value: data.dateEnd, model: 'dateEnd', col: 6 },
    ];

    return (
      <div className="row">

        <div className="col-md-12">
          <Card>
            <div className="row">
              <div className="col-md-12">
                <Form forms={profileForms} />
              </div>
            </div>
          </Card>
        </div>

        <div className="col-md-12">
          <Card>
            <div className="row">
              <div className="col-md-6">
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
        </div>

        <div className="col-md-6">
          <Pie metric={metric} type={PieTypes.ACTIVITIES_PERDAY} />
          <Card>
            <p>Time range {moment(data.dateStart).format('YYYY-MM-DD HH:mm:ss')} - {moment(data.dateEnd).format('YYYY-MM-DD HH:mm:ss')}</p>
            <p>Total posts: {userMetric.postsCount}</p>
            <p>Total posts shares: {userMetric.postsSharesCount}</p>
            <p>Total posts likes: {userMetric.postsLikesCount}</p>
            <p>Total comments: {userMetric.commentsCount}</p>
            <p>Total score: {userMetric.getScore()}</p>
          </Card>
        </div>

        <div className="col-md-6">
          <Pie metric={metric} type={PieTypes.ACTIVITIES_PERTRIHOUR} />
          <WordCloud title="Word cloud posts" metric={metric} type="posts" />
        </div>

      </div>
    );
  }

}

export default connect(mapStateToProps)(withForm(MetricSummary, setDefaultData));
