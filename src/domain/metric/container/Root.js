// @flow
import React from 'react';
import { connect } from 'react-redux';
import loc from 'infra/service/location';

const mapStateToProps = state => ({
  feeds: state.group.feeds,
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
    const { children } = this.props;

    return children;
  }

}

export default connect(mapStateToProps)(Metric);
