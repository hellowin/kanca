// @flow
import React from 'react';
import PropTypes from 'prop-types';
import './app.css';
import Header from 'domain/layout/component/Header';
import Sidebar from 'domain/layout/component/Sidebar';
import Footer from 'domain/layout/component/Footer';
import { connect } from 'react-redux';
import Auth from 'domain/user/component/Auth';
import { githubStar } from 'infra/service/util';
import groupRepo from 'infra/repo/group';
import loc from 'infra/service/location';
import { syncToPromise } from 'infra/service/util';

const mapStateToProps = state => ({
  loggedIn: state.user.loggedIn,
  profile: state.user.profile,
  pathname: state.routing.locationBeforeTransitions.pathname,
});

class App extends React.Component {
  state: {
    starCount: number,
  };
  
  constructor() {
    super();
    
    this.state = {
      starCount: 0,
    };
  }
  
  componentDidMount() {
    if (this.props.loggedIn) {
      githubStar()
        .then(response => {
          this.setState({
            starCount: response.stargazers_count,
          });
        })
        .then(() => syncToPromise(() => {
          groupRepo.restoreGroup();
        }))
        .then(() => {
          loc.push('/metric/summary');
        });
    }
  }

  render() {
    const children = this.props.children;

    return (
      <Auth>
        <div className="app">
          <Header />
          <div className="app-body">
            <Sidebar />
            <main className="main" style={{ paddingTop: '20px' }}>
              <div className="container-fluid">
                {children}
              </div>
            </main>
          </div>
          <Footer starCount={this.state.starCount} />
        </div>
      </Auth>
    );
  }

}

App.propTypes = {
  profile: PropTypes.object,
  pathname: PropTypes.string,
  children: PropTypes.node,
};

export default connect(mapStateToProps)(App);
