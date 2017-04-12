import React from 'react';
import './app.css';
import Header from 'domain/layout/component/Header';
import Sidebar from 'domain/layout/component/Sidebar';
import Aside from 'domain/layout/component/Aside';
import Footer from 'domain/layout/component/Footer';
import 'office-ui-fabric-react/dist/css/fabric.css';
import { connect } from 'react-redux';
import Auth from 'domain/user/component/auth';

const mapStateToProps = state => ({
  profile: state.user.profile,
  pathname: state.routing.locationBeforeTransitions.pathname,
});

class App extends React.Component {

  render() {
    const children = this.props.children;

    return (
      <Auth>
        <div className="app">
          <Header />
          <div className="app-body">
            <Sidebar />
            <main className="main">
              <div className="container-fluid">
                {children}
              </div>
            </main>
            <Aside />
          </div>
          <Footer />
        </div>
      </Auth>
    );
  }

}

App.propTypes = {
  profile: React.PropTypes.object,
  pathname: React.PropTypes.string,
  children: React.PropTypes.node,
};

export default connect(mapStateToProps)(App);
