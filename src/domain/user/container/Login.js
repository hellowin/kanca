import React from 'react';
import MediaQuery from 'react-responsive';
import userRepo from 'infra/repo/user';
import styles from './Login.style';
import kancaLogo from 'img/logo.png';

const Login = () => {
  return (
    <div style={styles.container}>
        <MediaQuery minDeviceWidth={320} maxWidthDevice={736} minWidth={320} maxWidth={736}>
          {(matches) => {
            return (
              <div>
                <a href="https://github.com/hellowin/kanca">
                  <img
                    style={{ position: 'absolute', top: 0, right: 0, border: 0 }}
                    src="https://camo.githubusercontent.com/38ef81f8aca64bb9a64448d0d70f1308ef5341ab/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f72696768745f6461726b626c75655f3132313632312e706e67"
                    alt="Fork me on GitHub"
                    data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_right_darkblue_121621.png"
                  />
                </a>
                <div style={styles.content}>
                  <img src={kancaLogo} alt="logo"/>
                  <span style={styles.description}>An app to analyze Facebook Group activity</span>
                  <button type="button" className="btn btn-facebook" onClick={() => userRepo.login()} style={{ cursor: 'pointer' }}>
                    <span>Login by Facebook</span>
                  </button>
                </div>
              </div>
            )
          }}
        </MediaQuery>
    </div>
  );
}

export default Login;
