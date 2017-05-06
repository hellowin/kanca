// @flow
import React from 'react';
import { connect } from 'react-redux';
import loc from 'infra/service/location';
import groupRepo from 'infra/repo/group';

const mapStateToProps = state => ({
  profile: state.user.profile,
});

const goTo = path => e => {
  e.preventDefault();
  loc.push(path);
}

class Dashboard extends React.Component {

  componentDidMount() {
    groupRepo.restoreGroup();
  }

  render() {
    const { profile } = this.props;

    return (
      <div className="row">
        <div className="col-md-12" style={{ textAlign: 'center' }}>
          <h1 className="display-4">Welcome to Kanca</h1>
        </div>
        <div className="col-md-6 offset-md-3">
          <p>Welcome {profile.name}, Kanca is open sourced application to analyze Facebook Group.</p>
          <p>Start to analyzing group by selecting a group in <a href="#" onClick={goTo('/group/selection')}>Group Selection</a> page.</p>
        </div>
      </div>
    );
  }

}

export default connect(mapStateToProps)(Dashboard);
