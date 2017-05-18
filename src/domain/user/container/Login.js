import React from 'react';
import MediaQuery from 'react-responsive';
import userRepo from 'infra/repo/user';
import styles from './Login.style';
import githubLogo from 'img/github-logo.png';
import kancaLogo from 'img/logo.png';
import facebookLoginImg from 'img/facebook-login-button.png';

const Login = (props: Object) => {
  return (
    <div style={styles.container}>
        <MediaQuery minDeviceWidth={320} maxWidthDevice={736} minWidth={320} maxWidth={736}>
          {(matches) => {
            return (
              <div>
                <div style={styles.header}>
                  <a href="https://hellowin.github.io/kanca" style={styles.siteName}>Kanca</a>
                  <a href="https://github.com/hellowin/kanca">
                    <img src={githubLogo} alt="github-logo" style={styles.logoGithub} />
                  </a>
                </div>
                <div style={styles.content}>
                  <img src={kancaLogo} alt="logo"/>
                  <span style={styles.description}>An app to analyze Facebook Group activity</span>
                  <img
                    src={facebookLoginImg}
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

export default Login;
