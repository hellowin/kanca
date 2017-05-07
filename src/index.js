// @flow
import React from 'react';
import ReactDOM from 'react-dom';
import Router from 'app/Router';
import 'index.css';
import { Provider } from 'react-redux';
import store from 'infra/service/store';
import config from 'config';

// initialize Facebook WebSDK
window.fbAsyncInit = function() {
  window.FB.init({
    appId: config.FBAppID,
    version: 'v2.9',
  });
  window.FB.AppEvents.logPageView();

  // Google Analytics
  window.ga('create', config.GAID, 'auto');
  window.ga('send', 'pageview');

  // initialize React application
  ReactDOM.render(
    <Provider store={store}>
      <Router />
    </Provider>,
    document.getElementById('root')
  );
};

(function(d, s, id){
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) {return;}
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/en_US/sdk.js";
  (fjs.parentNode || {}).appendChild(js);
}(document, 'script', 'facebook-jssdk'));
