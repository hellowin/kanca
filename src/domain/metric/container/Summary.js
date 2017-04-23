import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import moment from 'moment-timezone';

import timeRangeMetricer, { extractDateRangeFromPosts } from '../service/timeRangeMetric';
import type { TimeRangeMetric } from '../service/timeRangeMetric';

import PostSummary from '../component/PostSummary';

const mapStateToProps = state => ({
  feeds: state.group.feeds,
  members: state.group.members,
});

class MetricSummary extends React.Component {

  state = {
    data: {
      dateStart: Date,
      dateEnd: Date,
    },
  }

  constructor(props) {
    super(props);

    this.onFormChange = this.onFormChange.bind(this);

    const { feeds } = props;
    const { dateStart, dateEnd } = extractDateRangeFromPosts(feeds, 'd');

    this.state = {
      data: {
        dateStart,
        dateEnd,
      },
    }
  }

  onFormChange(key) {
    return e => {
      const { data } = this.state;
      let value = e.target.value;
      if (key === 'dateStart' || key === 'dateEnd') value = new Date(value);
      data[key] = value;
      this.setState({ data });
    }
  }

  render() {
    const { feeds, members } = this.props;
    const { data } = this.state;
    const metric: TimeRangeMetric = timeRangeMetricer(data.dateStart, data.dateEnd, feeds, members);

    return (
      <div className="row">

        <div className="col-md-12">
          <div className="card">
            <div className="card-block">
              <form className="form-inline">
                <label className="col-form-label mr-1">Date range</label>
                <input className="form-control mr-1" type="date" value={moment(data.dateStart).format('YYYY-MM-DD')} onChange={this.onFormChange('dateStart')} />
                <input className="form-control mr-1" type="date" value={moment(data.dateEnd).format('YYYY-MM-DD')} onChange={this.onFormChange('dateEnd')} />
                <button className="btn btn-primary" type="submit">Refresh</button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-md-12">
          <h4>Summary</h4>
        </div>

        <div className="col-md-6">
          <div className="card">
            <div className="card-block">
              {feeds.length > 0 ? <p>Time range {moment(data.dateStart).format('YYYY-MM-DD HH:mm:ss')} - {moment(data.dateEnd).format('YYYY-MM-DD HH:mm:ss')}</p> : ''}
              <p>Total posts: {metric.postsMetric.totalPosts}</p>
              <p>Total posts shares: {metric.postsMetric.totalPostsShares}</p>
              <p>Total posts likes: {metric.postsMetric.totalPostsLikes}</p>
              <p>Total posts comments: {metric.postsMetric.totalPostsComments}</p>
              <p>Total members: {members.length}</p>
              <p>Total unique member posting: {metric.postsMetric.uniqueUserPosts}</p>
              <p>User post engagement: {metric.postsMetric.postEngagement} %<br />(total unique user posting / total member)</p>
            </div>
          </div>
        </div>

        <div className="col-md-12">
          <h4>User Activity</h4>
        </div>

        <div className="col-md-4">
          <div className="card">
            <div className="card-block">
              <h4 className="card-title">Posts Count</h4>
              <p>Top 10 user posts count.</p>
              <ul className="list-group">
                {_.sortBy(metric.userMetrics, 'postsCount').reverse().slice(0, 10).map((user, key) => (<li key={key} className="list-group-item">{user.name}: {user.postsCount} - {((user.postsCount/metric.postsMetric.totalPosts)*100).toFixed(2)}%</li>))}
              </ul>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card">
            <div className="card-block">
              <h4 className="card-title">Shares Count</h4>
              <p>Top 10 user posts shares count.</p>
              <ul className="list-group">
                {_.sortBy(metric.userMetrics, 'postsSharesCount').reverse().slice(0, 10).map((user, key) => (<li key={key} className="list-group-item">{user.name}: {user.postsSharesCount} - {((user.postsSharesCount/metric.postsMetric.totalPostsShares)*100).toFixed(2)}%</li>))}
              </ul>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card">
            <div className="card-block">
              <h4 className="card-title">Likes Count</h4>
              <p>Top 10 user posts likes count.</p>
              <ul className="list-group">
                {_.sortBy(metric.userMetrics, 'postsLikesCount').reverse().slice(0, 10).map((user, key) => (<li key={key} className="list-group-item">{user.name}: {user.postsLikesCount} - {((user.postsLikesCount/metric.postsMetric.totalPostsLikes)*100).toFixed(2)}%</li>))}
              </ul>
            </div>
          </div>
        </div>

        <div className="col-md-12">
          <h4>Post Activity</h4>
        </div>

        <div className="col-md-6">
          <div className="card">
            <div className="card-block">
              <h4 className="card-title">Shares Count</h4>
              <p>Top 10 posts with most shares count.</p>
              <ul className="list-group">
                {_.sortBy(metric.postsMetric.postMetrics, 'sharesCount').reverse().slice(0, 10).map((post, key) => (<PostSummary key={key} {...post} />))}
              </ul>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card">
            <div className="card-block">
              <h4 className="card-title">Likes Count</h4>
              <p>Top 10 posts with most likes count.</p>
              <ul className="list-group">
                {_.sortBy(metric.postsMetric.postMetrics, 'likesCount').reverse().slice(0, 10).map((post, key) => (<PostSummary key={key} {...post} />))}
              </ul>
            </div>
          </div>
        </div>

      </div>
    );
  }

}

export default connect(mapStateToProps)(MetricSummary);
