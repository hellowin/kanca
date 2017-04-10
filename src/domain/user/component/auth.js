import React from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import userRepo from 'infra/repo/user';

const mapStateToProps = state => ({
  loggedIn: state.user.loggedIn,
});

class Auth extends React.Component {

  componentDidMount() {
    userRepo.checkLoginStatus();
  }

  componentWillReceiveProps(nextProps) {
    const { loggedIn } = nextProps;

    if (!loggedIn) browserHistory.push('/login');
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