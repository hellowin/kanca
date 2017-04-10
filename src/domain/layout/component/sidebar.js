import React from 'react';
import { Nav } from 'office-ui-fabric-react/lib/Nav';
import './sidebar.css';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

const mapStateToProps = state => ({
  profile: state.user.profile,
  pathname: state.routing.locationBeforeTransitions.pathname,
});

class Sidebar extends React.Component {

  onClick(event, element) {
    event.preventDefault();
    browserHistory.push(element.link);
  }

  render() {
    const pathname = this.props.pathname;
    const groups = [
      {
        links:
        [
          { name: 'Dashboard', link: '/dashboard', key: '/dashboard' },
        ]
      }
    ];

    return (
      <div className="sidebar">
        <Nav
          groups={groups}
          expandedStateText={ 'expanded' }
          collapsedStateText={ 'collapsed' }
          selectedKey={pathname}
          onLinkClick={this.onClick.bind(this)}
        />
      </div>
    );
  }

}

Sidebar.propTypes = {
  profile: React.PropTypes.object,
  pathname: React.PropTypes.string,
};

export default connect(mapStateToProps)(Sidebar);
