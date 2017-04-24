import React, { Component } from 'react';
import { connect } from 'react-redux';
import loc from 'infra/service/location';

const mapStateToProps = state => ({
  location: state.routing.locationBeforeTransitions,
  feeds: state.group.feeds,
});

const goTo = path => e => {
  e.preventDefault();
  loc.push(path);
}

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
                  <a href="" className="nav-link" onClick={goTo('/group/selection')}>Selection</a>
                </li>
                {feeds.length > 0 ? <li className="nav-item">
                  <a href="" className="nav-link" onClick={goTo('/group/feed')}>Feed</a>
                </li> : ''}
              </ul>
            </li>

            {feeds.length > 0 ? <li className={this.activeRoute("/metric")}>
              <a className="nav-link nav-dropdown-toggle" href="#" onClick={this.handleClick.bind(this)}><i className="icon-graph"></i> Metric</a>
              <ul className="nav-dropdown-items">
                <li className="nav-item">
                  <a href="" className="nav-link" onClick={goTo('/metric/summary')}>Summary</a>
                </li>
                <li className="nav-item">
                  <a href="" className="nav-link" onClick={goTo('/metric/time-series')}>Time Series</a>
                </li>
              </ul>
            </li> : ''}

          </ul>
        </nav>
      </div>
    )
  }
}

export default connect(mapStateToProps)(Sidebar);
