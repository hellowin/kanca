import React from 'react';
import { connect } from 'react-redux';
import userRepo from 'infra/repo/user';
import loc from 'infra/service/location';
import Loading from 'infra/component/Loading';
import PropTypes from 'prop-types';

const mapStateToProps = state => ({
  loading: state.user.loading,
  loggedIn: state.user.loggedIn,
});

class Auth extends React.Component {

  componentDidMount() {
    userRepo.checkLoginStatus();
  }

  componentWillReceiveProps(nextProps) {
    const { loggedIn, loading } = nextProps;

    if (!loading && !loggedIn) loc.push('/login');
  }

  render() {
    const { loading, children } = this.props;
    return !loading ? children : <div style={{ paddingTop: '50px' }}><Loading /></div>;
  }

}

Auth.propTypes = {
  children: PropTypes.node,
  loggedIn: PropTypes.bool,
}

export default connect(mapStateToProps)(Auth);