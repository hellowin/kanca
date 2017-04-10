import React from 'react';
import { connect } from 'react-redux';
import 'office-ui-fabric-react/dist/css/fabric.css';

const mapStateToProps = state => ({
  profile: state.user.profile,
});

class Dashboard extends React.Component {

  render() {
    return (
      <div className="ms-Grid-row">
        <div className="ms-Grid-col ms-u-md12">
          <div>Ini dashboard</div>
        </div>
      </div>
    );
  }

}

export default connect(mapStateToProps)(Dashboard);
