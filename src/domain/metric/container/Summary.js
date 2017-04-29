// @flow
import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import moment from 'moment-timezone';

import timeRangeMetricer, { extractDateRangeFromPosts } from '../service/timeRangeMetric';
import type { TimeRangeMetric } from '../service/timeRangeMetric';

import UserActivityTop from '../component/UserActivityTop';
import PostActivityTop from '../component/PostActivityTop';
import CommentActivityTop from '../component/CommentActivityTop';
import Pie from '../component/Pie';
import Card from 'infra/component/Card';
import Form, { FormTypes, withForm } from 'infra/component/Form';
import type { FormObject } from 'infra/component/Form';

const mapStateToProps = state => ({
  feeds: state.group.feeds,
  members: state.group.members,
  comments: state.group.comments,
});

const setDefaultData = props => {
  const { feeds } = props;
    const { dateStart, dateEnd } = extractDateRangeFromPosts(feeds, 'd');

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
  autoPickDate: Function

  constructor(props) {
    super(props);

    this.autoPickDate = this.autoPickDate.bind(this);
  }

  autoPickDate(name: string) {
    return e => {
      e.preventDefault();
      const { feeds } = this.props;
      const { data } = this.state;

      let date: { dateStart: Date, dateEnd: Date } = extractDateRangeFromPosts(feeds, 'd');
      switch (name) {
        case 'thisWeek':
          date = {
            dateStart: moment().startOf('w').toDate(),
            dateEnd: moment().toDate(),
          };
          break;
        case 'lastWeek':
          date = {
            dateStart: moment().add(-1, 'w').startOf('w').toDate(),
            dateEnd: moment().add(-1, 'w').endOf('w').toDate(),
          };
          break;
        case 'thisMonth':
          date = {
            dateStart: moment().startOf('M').toDate(),
            dateEnd: moment().toDate(),
          };
          break;
        case 'lastMonth':
          date = {
            dateStart: moment().add(-1, 'M').startOf('M').toDate(),
            dateEnd: moment().add(-1, 'M').endOf('M').toDate(),
          };
          break;
        case 'totalTime':
        default:
          date = extractDateRangeFromPosts(feeds, 'd');
      }
      
      data.dateStart = date.dateStart;
      data.dateEnd = date.dateEnd;
      this.setState({ data });
    };
  }

  render() {
    const { feeds, members, comments } = this.props;
    const { data } = this.state;
    const metric: TimeRangeMetric = timeRangeMetricer(data.dateStart, data.dateEnd, feeds, members, comments);
    
    const forms: FormObject[] = [
      { type: FormTypes.DATE, label: 'Date start', value: data.dateStart, model: 'dateStart', col: 6 },
      { type: FormTypes.DATE, label: 'Date end', value: data.dateEnd, model: 'dateEnd', col: 6 },
    ];

    return (
      <div className="row">

        <div className="col-md-12">
          <Card>
            <div className="row">
              <div className="col-md-6">
                <Form forms={forms} onChange={this.onFormChange} />
              </div>
              <div className="col-md-6">
                <button className="btn btn-primary mr-1 mb-1" style={{ cursor: 'pointer' }} onClick={this.autoPickDate('thisWeek')}>This Week</button>
                <button className="btn btn-primary mr-1 mb-1" style={{ cursor: 'pointer' }} onClick={this.autoPickDate('lastWeek')}>Last Week</button>
                <button className="btn btn-primary mr-1 mb-1" style={{ cursor: 'pointer' }} onClick={this.autoPickDate('thisMonth')}>This Month</button>
                <button className="btn btn-primary mr-1 mb-1" style={{ cursor: 'pointer' }} onClick={this.autoPickDate('lastMonth')}>Last Month</button>
                <button className="btn btn-primary mr-1 mb-1" style={{ cursor: 'pointer' }} onClick={this.autoPickDate('totalTime')}>Total Time</button>
              </div>
            </div>
          </Card>
        </div>

        <div className="col-md-12">
          <h4>Summary</h4>
        </div>

        <div className="col-md-6">
          <div className="card">
            <div className="card-block">
              <p>Time range {moment(data.dateStart).format('YYYY-MM-DD HH:mm:ss')} - {moment(data.dateEnd).format('YYYY-MM-DD HH:mm:ss')}</p>
              <p>Total posts: {metric.postsMetric.totalPosts()}</p>
              <p>Total posts shares: {metric.postsMetric.totalShares()}</p>
              <p>Total posts likes: {metric.postsMetric.totalLikes()}</p>
              <p>Total comments: {metric.commentsMetric.totalComments()}</p>
              <p>Total members: {metric.usersMetric.totalMembers()}</p>
              <p>Total unique member posting: {metric.usersMetric.uniqueUsersPosts().length}</p>
              <p>Total unique member commenting: {metric.usersMetric.uniqueUsersComments().length}</p>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <Pie title="Activity by day" metric={metric} type="activitiesPerDay" />
          <Pie title="Activity by 3 hourly" metric={metric} type="activitiesPerTrihours" />
        </div>

        <div className="col-md-12">
          <h4>User Activity</h4>
        </div>

        <div className="col-md-6">
          <UserActivityTop metric={metric} type="posts" title="Posts" subTitle="Top 10 user posts count." />
        </div>

        <div className="col-md-6">
          <UserActivityTop metric={metric} type="comments" title="Comments" subTitle="Top 10 user comments count." />
        </div>

        <div className="col-md-6">
          <UserActivityTop metric={metric} type="posts-shares" title="Posts Shares" subTitle="Top 10 number of shares received by user posts." />
        </div>

        <div className="col-md-6">
          <UserActivityTop metric={metric} type="posts-likes" title="Posts Likes" subTitle="Top 10 number of likes received by user posts." />
        </div>

        <div className="col-md-12">
          <h4>Post Activity</h4>
        </div>

        <div className="col-md-6">
          <PostActivityTop metric={metric} type="likes" title="Posts Likes" subTitle="Top 10 most liked posts." />
        </div>

        <div className="col-md-6">
          <PostActivityTop metric={metric} type="shares" title="Posts Shares" subTitle="Top 10 most shared posts." />
        </div>

        <div className="col-md-6">
          <Pie title="Posts by day" metric={metric} type="postsPerDay" />
          <Pie title="Posts by hour" metric={metric} type="postsPerHours" />
          <Pie title="Posts by 3 hours" metric={metric} type="postsPerTrihours" />
        </div>

        <div className="col-md-12">
          <h4>Comment Activity</h4>
        </div>

        <div className="col-md-6">
          <CommentActivityTop metric={metric} type="likes" title="Comment Likes" subTitle="Top 10 most liked comments." />
        </div>

        <div className="col-md-6">
          <Pie title="Comments by day" metric={metric} type="commentsPerDay" />
          <Pie title="Comments by hour" metric={metric} type="commentsPerHours" />
          <Pie title="Comments by 3 hours" metric={metric} type="commentsPerTrihours" />
        </div>

      </div>
    );
  }

}

export default connect(mapStateToProps)(withForm(MetricSummary, setDefaultData));
