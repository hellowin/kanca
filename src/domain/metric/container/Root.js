// @flow
import React from 'react';
import { connect } from 'react-redux';
import loc from 'infra/service/location';
import Loading from 'infra/component/Loading';

const mapStateToProps = state => ({
  feeds: state.group.feeds,
  loading: state.group.loading,
});

const checkMetricAvailability = props => {
  const { feeds } = props;
  if (feeds.length < 1) loc.push('/');
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
