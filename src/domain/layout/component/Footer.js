// @flow
import React, { Component } from 'react';
import config from 'config';

class Footer extends Component {
  render() {
    const { homepage, version } = config;
    const { starCount } = this.props;
    
    return (
      <footer className="app-footer">
        <div className="row align-self-center">
          <div className="col-md-8">
            <a href={homepage}>Kanca</a> &copy; 2017 Hellowin.&nbsp;|&nbsp;
            <a href="https://hellowin.github.io/kanca/privacypolicy.html" target="_blank">Privacy Policy</a>
            {version ? <span>&nbsp;|&nbsp;{version}</span> : ''}
            &nbsp;|&nbsp;
            <a
              className="btn btn-secondary btn-sm"
              href="https://github.com/hellowin/kanca"
              id="gh-button"
              style={{
                borderRadius: '3px',
                backgroundColor: '#eee',
                backgroundImage: 'linear-gradient(to bottom, #fafbfc, #e4ebf0)',
                padding: '0px 5px'
              }}
            >
              <span className="fa fa-github" />
              <span className="font-xs font-weight-bold">&nbsp;Star</span>
            </a>
            <a
              href="https://github.com/hellowin/kanca/stargazers"
              className="btn btn-secondary btn-sm gh-count"
              id="gh-count"
              style={{
                borderRadius: '3px',
                backgroundColor: '#eff3f6',
                padding: '0px 5px',
                borderColor: '1px solid #d4d4d4',
                marginLeft: '5px',
                position: 'relative',
              }}
            >
              <span className="font-xs font-weight-bold">{starCount}</span>
            </a>
          </div>
          <div className="col-md-4">
            <span className="float-right">Powered by <a href="http://coreui.io">CoreUI</a></span>
          </div>
        </div>
      </footer>
    )
  }
}

export default Footer;
