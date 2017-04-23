import React from 'react';
import { connect } from 'react-redux';
import userRepo from 'infra/repo/user';
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
      <div className="container" style={{ marginTop: '100px' }}>
        <div className="row justify-content-center">
          <div className="col-8">
            <div className="card-group mb-0">
              <div className="card p-2">
                <div className="card-block text-center">
                  <div>
                    <h2>Login</h2>
                    <p>Welcome to Kanca. Open source Facebook Group Analytics.</p>
                    <button type="button" className="btn btn-primary active mt-1" onClick={() => userRepo.login()} style={{ cursor: 'pointer' }}>Login by Facebook</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

}

export default connect(mapStateToProps)(Login);
