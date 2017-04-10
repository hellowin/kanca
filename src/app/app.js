import React from 'react';
import './app.css';
import Header from 'domain/layout/component/header';
import Sidebar from 'domain/layout/component/sidebar';
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

    const content = (
      <div className="ms-Grid-row">
        <div className="ms-Grid-col ms-u-md2">
          <Sidebar />
        </div>
        <div className="ms-Grid-col ms-u-md10">
          {children}
        </div>
      </div>
    );

    return (
      <Auth>
        <div className="App ms-Grid">
          <Header />
          {content}
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
