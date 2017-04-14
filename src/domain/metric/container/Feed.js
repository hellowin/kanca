import React from 'react';
import { connect } from 'react-redux';

const mapStateToProps = state => ({
  feeds: state.group.feeds,
});

class Dashboard extends React.Component {

  render() {
    return (
      <div className="row">
        <div className="col-md-12">
          <h1 className="h3">Feed Metric</h1>
        </div>
      </div>
    );
  }

}

export default connect(mapStateToProps)(Dashboard);
