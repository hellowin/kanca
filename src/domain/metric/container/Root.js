// @flow
import React from 'react';
import { connect } from 'react-redux';
import loc from 'infra/service/location';
import Loading from 'infra/component/Loading';
import MetricRoute from './Route';

export const Route = MetricRoute;

const mapStateToProps = state => ({
  loggedIn: state.user.loggedIn,
  feeds: state.group.feeds,
  comments: state.group.comments,
  members: state.group.members,
  loading: state.group.loading,
});

const checkMetricAvailability = props => {
  const { loggedIn, loading, feeds, comments, members } = props;
  if (!loggedIn && !loading && feeds.length < 1 && comments.length < 1 && members.length < 1) loc.push('/welcome');
}

class Metric extends React.Component {

  componentDidMount() {
    checkMetricAvailability(this.props);
  }

  componentWillReceiveProps(nextProps) {
    checkMetricAvailability(nextProps);
  }

  render(){
    const { loggedIn, loading, children, feeds, comments, members } = this.props;
    console.log(feeds, comments, members);

    return !loggedIn && !loading && feeds.length > 0 && comments.length > 0 && members.length > 0 ? children : <Loading />;
  }

}

export default connect(mapStateToProps)(Metric);
