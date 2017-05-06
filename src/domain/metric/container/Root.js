// @flow
import React from 'react';
import { connect } from 'react-redux';
import loc from 'infra/service/location';
import Loading from 'infra/component/Loading';
import MetricRoute from './Route';

export const Route = MetricRoute;

const mapStateToProps = state => ({
  loggedIn: state.user.loggedIn,
  posts: state.group.feeds,
  comments: state.group.comments,
  members: state.group.members,
  loading: state.group.loading,
});

const checkMetricAvailability = props => {
  const { loggedIn, loading, posts, comments, members } = props;
  if (!loggedIn && !loading && posts.length < 1 && comments.length < 1 && members.length < 1) loc.push('/welcome');
}

class Metric extends React.Component {

  componentDidMount() {
    checkMetricAvailability(this.props);
  }

  componentWillReceiveProps(nextProps) {
    checkMetricAvailability(nextProps);
  }

  render(){
    const { loading, children } = this.props;

    return !loading ? children : <Loading />;
  }

}

export default connect(mapStateToProps)(Metric);
