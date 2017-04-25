// @flow
import React, { Component } from 'react';
import { Dropdown, DropdownMenu, DropdownItem } from 'reactstrap';
import { connect } from 'react-redux';
import moment from 'moment-timezone';
import userRepo from 'infra/repo/user';
import groupRepo from 'infra/repo/group';
import loc from 'infra/service/location';

const mapStateToProps = state => ({
  loading: state.user.loading,
  profile: state.user.profile,
  group: state.group.selected,
  updatedTime: state.group.updatedTime,
});

class Header extends Component {

  state: {
    dropdownOpen: boolean,
    deltaTime: string,
    diffTime: number,
  }

  getTime: Function
  toggle: Function
  intervalTime: any

  constructor(props) {
    super(props);

    this.getTime = this.getTime.bind(this);
    this.toggle = this.toggle.bind(this);

    const { updatedTime } = props;
    this.getTime(updatedTime);

    this.state = {
      dropdownOpen: false,
      deltaTime: moment(new Date(updatedTime)).toNow(),
      diffTime: moment(new Date(updatedTime)).diff(moment()),
    };
  }

  getTime(updatedTime) {
    clearInterval(this.intervalTime);
    this.intervalTime = setInterval(() => {
      const deltaTime = moment(new Date(updatedTime)).toNow();
      const diffTime = moment(new Date(updatedTime)).diff(moment());
      this.setState({ deltaTime, diffTime });
    }, 5000);
  }

  componentWillReceiveProps(nextProps) {
    const { updatedTime } = nextProps;
    this.getTime(updatedTime);
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  sidebarToggle(e) {
    e.preventDefault();
    (document.body || {}).classList.toggle('sidebar-hidden');
  }

  mobileSidebarToggle(e) {
    e.preventDefault();
    (document.body || {}).classList.toggle('sidebar-mobile-show');
  }

  asideToggle(e) {
    e.preventDefault();
    (document.body || {}).classList.toggle('aside-menu-hidden');
  }

  render() {
    const { profile, loading, group } = this.props;
    const { deltaTime, diffTime } = this.state;
    const refreshTime = diffTime + 15 * 60000 < 0; // 15 minutes

    return (
      <header className="app-header navbar" style={{ paddingRight: '15px' }}>
        <button className="navbar-toggler mobile-sidebar-toggler hidden-lg-up" onClick={this.mobileSidebarToggle} type="button">&#9776;</button>
        <a className="navbar-brand" href="#"></a>
        <ul className="nav navbar-nav hidden-md-down">
          <li className="nav-item">
            <a className="nav-link navbar-toggler sidebar-toggler" onClick={this.sidebarToggle} href="#">&#9776;</a>
          </li>
          {group ? (<li className="nav-item">
            <span>Selected Group: <b>{group.name}</b> | Updated {deltaTime} ago {refreshTime ? <span> | <button className="btn btn-primary btn-sm" style={{ cursor: 'pointer' }} onClick={() => groupRepo.refreshGroup()}>Refresh</button></span> : ''} </span>
          </li>) : ''}
        </ul>
        {!loading ? (<ul className="nav navbar-nav ml-auto">
          <li className="nav-item">
            <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
              <a onClick={this.toggle} className="nav-link dropdown-toggle nav-link" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded={this.state.dropdownOpen}>
                <img src={profile.picture} className="img-avatar" alt={profile.name}/>
                <span className="hidden-md-down">{profile.name}</span>
              </a>

              <DropdownMenu className="dropdown-menu-right">
                <DropdownItem header className="text-center"><strong>Account</strong></DropdownItem>

                <DropdownItem onClick={() => loc.push('/user/profile')}><i className="fa fa-user"></i> Profile</DropdownItem>
                <DropdownItem onClick={() => userRepo.logout()}><i className="fa fa-lock"></i> Logout</DropdownItem>

              </DropdownMenu>
            </Dropdown>
          </li>
          {/*<li className="nav-item hidden-md-down">
            <a className="nav-link navbar-toggler aside-menu-toggler" onClick={this.asideToggle} href="#">&#9776;</a>
          </li>*/}
        </ul>) : '' }
      </header>
    )
  }
}

export default connect(mapStateToProps)(Header);
