import React from 'react';
import { connect } from 'react-redux';
import userRepo from 'infra/repo/user';
import Button from 'infra/component/Button';
import loc from 'infra/service/location';

const mapStateToProps = state => ({
  loggedIn: state.user.loggedIn,
});

class Login extends React.Component {

  componentWillMount() {
    const { loggedIn } = this.props;

    if (loggedIn) loc.push('/');
  }

  componentWillReceiveProps(nextProps) {
    const { loggedIn } = nextProps;

    if (loggedIn) loc.push('/');
  }

  render() {
    return (
      <div style={{ padding: '30px 0px' }}>
        <Button onClick={() => userRepo.login()}>Login</Button>
      </div>
    );
  }

}

export default connect(mapStateToProps)(Login);
