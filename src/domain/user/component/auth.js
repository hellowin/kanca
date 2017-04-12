import React from 'react';
import { connect } from 'react-redux';
import userRepo from 'infra/repo/user';
import loc from 'infra/service/location';

const mapStateToProps = state => ({
  loggedIn: state.user.loggedIn,
});

class Auth extends React.Component {

  componentDidMount() {
    userRepo.checkLoginStatus();
  }

  componentWillReceiveProps(nextProps) {
    const { loggedIn } = nextProps;

    if (!loggedIn) loc.push('/login');
  }

  render() {
    const { children } = this.props;
    return children;
  }

}

Auth.propTypes = {
  children: React.PropTypes.node,
  loggedIn: React.PropTypes.bool,
}

export default connect(mapStateToProps)(Auth);