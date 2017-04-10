import React from 'react';
import logo from './logo.svg';
import { connect } from 'react-redux';
import 'office-ui-fabric-react/dist/css/fabric.css';
import Button from 'infra/component/Button';
import userRepo from 'infra/repo/user';

const mapStateToProps = state => ({
  profile: state.user.profile,
});

const Header = props => {
  const { profile } = props;
  const name = profile.name;
  const namePlaceholder = name ? <span>Welcome, <b>{name}</b></span> : '';

  return (
    <div>
      <div className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h2>Welcome to Facebook Group Analytics</h2>
      </div>
      <div className="ms-Grid-row">
        <div className="ms-Grid-col ms-u-md12" style={{ textAlign: 'right', height: '55px', padding: '10px', backgroundColor: '#eee' }}>
          {namePlaceholder}
          &nbsp;<Button onClick={() => userRepo.logout()}>Logout</Button>
        </div>
      </div>
    </div>
  );
}

export default connect(mapStateToProps)(Header);
