// @flow
import React, { Component } from 'react';
import { Dropdown, DropdownMenu, DropdownItem } from 'reactstrap';
import { connect } from 'react-redux';
import userRepo from 'infra/repo/user';
import loc from 'infra/service/location';
import GroupStatus from './GroupStatus';

const mapStateToProps = state => ({
  loading: state.user.loading,
  profile: state.user.profile,
});

class Header extends Component {

  state: {
    dropdownOpen: boolean,
  }

  toggle: Function

  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);

    this.state = {
      dropdownOpen: false,
    };
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
    const { profile, loading } = this.props;

    return (
      <header className="app-header navbar" style={{ paddingRight: '15px' }}>
        <button className="navbar-toggler mobile-sidebar-toggler d-lg-none" onClick={this.mobileSidebarToggle} type="button">&#9776;</button>
        <a className="navbar-brand" href="#"></a>
        <ul className="nav navbar-nav d-md-down-none">
          <li className="nav-item">
            <a className="nav-link navbar-toggler sidebar-toggler" onClick={this.sidebarToggle} href="#">&#9776;</a>
          </li>
          <li className="nav-item">
            <GroupStatus />
          </li>
        </ul>
        {!loading ? (<ul className="nav navbar-nav ml-auto">
          <li className="nav-item">
            <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
              <a onClick={this.toggle} className="nav-link dropdown-toggle nav-link" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded={this.state.dropdownOpen}>
                <img src={profile.picture} className="img-avatar" alt={profile.name}/>
                <span className="d-md-down-none">{profile.name}</span>
              </a>

              <DropdownMenu className="dropdown-menu-right">
                <DropdownItem header className="text-center"><strong>Account</strong></DropdownItem>

                <DropdownItem onClick={() => loc.push('/metric/user-profile')}><i className="fa fa-user"></i> Profile</DropdownItem>
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
