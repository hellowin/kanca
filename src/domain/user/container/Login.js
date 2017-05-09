import React from 'react';
import { connect } from 'react-redux';
import MediaQuery from 'react-responsive';
import userRepo from 'infra/repo/user';
import loc from 'infra/service/location';
import styles from './Login.style';
import config from 'config';

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
    const prefix = config.env !== 'development' ? config.urlPrefix : '';

    return (
      <div style={styles.container}>
          <MediaQuery minDeviceWidth={320} maxWidthDevice={736} minWidth={320} maxWidth={736}>
            {(matches) => {
              return (
                <div>
                  <div style={styles.header}>
                    <a href="https://hellowin.github.io/kanca" style={styles.siteName}>Kanca</a>
                    <a href="https://github.com/hellowin/kanca">
                      <img src={`${prefix}/img/github-logo.png`} alt="github-logo" style={styles.logoGithub}/>
                    </a>
                  </div>
                  <div style={styles.content}>
                    <img src={`${prefix}/img/logo.png`} alt="logo"/>
                    <span style={styles.description}>An app to analyze Facebook Group activity</span>
                    <img
                      src={`${prefix}/img/facebook-login-button.png`}
                      alt="facebook-login-button"
                      style={styles.loginBtn}
                      onClick={() => userRepo.login()}
                    />
                  </div>
                </div>
              )
            }}
          </MediaQuery>
      </div>
    );
  }

}

export default connect(mapStateToProps)(Login);
