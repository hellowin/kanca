import React from 'react';

import UserActivity from '../component/UserActivity';

class MetricFeed extends React.Component {

  render() {
    return (
      <div className="row">
        <div className="col-md-12">
          <h1 className="h3">Feed Metric</h1>
          <UserActivity />
        </div>
      </div>
    );
  }

}

export default MetricFeed;
