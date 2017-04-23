import React, { Component } from 'react';
import config from 'config';

class Footer extends Component {
  render() {
    const { homepage, version } = config;
    return (
      <footer className="app-footer">
        <a href={homepage}>Kanca</a> &copy; 2017 Hellowin.&nbsp;|&nbsp;
        <a href="https://hellowin.github.io/kanca/privacypolicy.html" target="_blank">Privacy Policy</a>
        {version ? <span>&nbsp;|&nbsp;{version}</span> : ''}
        <span className="float-right">Powered by <a href="http://coreui.io">CoreUI</a></span>
      </footer>
    )
  }
}

export default Footer;
