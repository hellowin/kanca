import React, { Component } from 'react';
import { connect } from 'react-redux';
import NavLink from './NavLink';
import uuid from 'uuid';

import loc from 'infra/service/location';

const mapStateToProps = state => ({
  location: state.routing.locationBeforeTransitions,
  feeds: state.group.feeds,
});

class Sidebar extends Component {

  handleClick(e) {
    e.preventDefault();
    e.target.parentElement.classList.toggle('open');
  }

  activeRoute(routeName) {
    return this.props.location.pathname.indexOf(routeName) > -1 ? 'nav-item nav-dropdown open' : 'nav-item nav-dropdown';
  }

  render() {
    const { feeds } = this.props;

    return (

      <div className="sidebar">
        <nav className="sidebar-nav">
          <ul className="nav">
            
            <li className={this.activeRoute("/group")}>
              <a className="nav-link nav-dropdown-toggle" href="#" onClick={this.handleClick.bind(this)}><i className="icon-people"></i> Group</a>
              <ul className="nav-dropdown-items">
                <li className="nav-item">
                  <NavLink className="nav-link" to={loc.getUrl('/group/selection')}>Selection</NavLink>
                </li>
                {feeds.length > 0 ? <li className="nav-item">
                  <NavLink className="nav-link" to={loc.getUrl('/group/feed')}>Feed</NavLink>
                </li> : ''}
              </ul>
            </li>

            {feeds.length > 0 ? <li className={this.activeRoute("/metric")}>
              <a className="nav-link nav-dropdown-toggle" href="#" onClick={this.handleClick.bind(this)}><i className="icon-graph"></i> Metric</a>
              <ul className="nav-dropdown-items">
                <li className="nav-item">
                  <NavLink className="nav-link" to={loc.getUrl('/metric/summary')}>Summary</NavLink>
                </li>
                {feeds.length > 0 && [
                  <li className="nav-item" key={uuid.v4()}>
                    <NavLink className="nav-link" to={loc.getUrl('/metric/posts')}>Posts</NavLink>
                  </li>,
                  <li className="nav-item" key={uuid.v4()}>
                    <NavLink className="nav-link" to={loc.getUrl('/metric/comments')}>Comments</NavLink>
                  </li>,
                  <li className="nav-item" key={uuid.v4()}>
                  <NavLink className="nav-link" to={loc.getUrl('/metric/members')}>Members</NavLink>
                  </li>
                ]}
              </ul>
            </li> : ''}

          </ul>
        </nav>
      </div>
    )
  }
}

export default connect(mapStateToProps)(Sidebar);
