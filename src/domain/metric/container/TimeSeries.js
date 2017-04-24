// @flow
import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import moment from 'moment-timezone';

import { extractDateRangeFromPosts, timeSeriesMetric as timeSeriesMetricer } from '../service/timeRangeMetric';
import type { TimeRangeMetric } from '../service/timeRangeMetric';

import PostsTimeSeries from '../component/PostsTimeSeries';

const mapStateToProps = state => ({
  feeds: state.group.feeds,
  members: state.group.members,
  comments: state.group.comments,
});

class MetricSummary extends React.Component {

  state: {
    data: {
      dateStart: Date,
      dateEnd: Date,
      granularity: string,
    },
  }

  onFormChange: Function

  constructor(props) {
    super(props);

    this.onFormChange = this.onFormChange.bind(this);

    const { feeds } = props;
    const { dateEnd } = extractDateRangeFromPosts(feeds, 'd');
    const dateStart = moment(dateEnd).add(-1, 'month').toDate();

    this.state = {
      data: {
        dateStart,
        dateEnd,
        granularity: 'd',
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
    const { feeds, members, comments } = this.props;
    const { data } = this.state;
    const metrics: TimeRangeMetric[] = timeSeriesMetricer(data.dateStart, data.dateEnd, data.granularity, feeds, members, comments);

    return (
      <div className="row">

        <div className="col-md-12">
          <div className="card">
            <div className="card-block">
              <form className="form-inline">
                <label className="col-form-label mr-1">Date range</label>
                <input className="form-control mr-1" type="date" value={moment(data.dateStart).format('YYYY-MM-DD')} onChange={this.onFormChange('dateStart')} />
                <input className="form-control mr-1" type="date" value={moment(data.dateEnd).format('YYYY-MM-DD')} onChange={this.onFormChange('dateEnd')} />
                <select className="form-control mr-1" onChange={this.onFormChange('granularity')} selected={data.granularity}>
                  <option value="d">Daily</option>
                  <option value="w">Weekly</option>
                  <option value="M">Monthly</option>
                  <option value="y">Annually</option>
                </select>
              </form>
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

export default connect(mapStateToProps)(MetricSummary);
