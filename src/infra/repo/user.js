// @flow
import store from 'infra/service/store';
import action from 'infra/service/action';
import graph from 'infra/service/graph';

const userRepo = {

  login() {
    let login;
    let profile;
    return graph.login()
      .then(res => (login = res))
      .then(() => graph.getUser())
      .then(res => (profile = res))
      .then(() => {
        store.dispatch(action.userSet({ profile, login, loggedIn: true }))
      });
  },

  logout() {
    const profile = {
      facebookId: '',
      name: '',
      email: '',
    };
    return graph.logout()
      .then(() => store.dispatch(action.userSet({ profile, login: {}, loggedIn: false })));
    
  },

  checkLoginStatus() {
    let login;
    let profile;
    const emptyProfile = {
      facebookId: '',
      name: '',
      email: '',
    };
    return graph.getLoginStatus()
      .then(res => (login = res))
      .then(() => graph.getUser())
      .then(res => (profile = res))
      .then(() => store.dispatch(action.userSet({ profile, login, loggedIn: true })))
      .catch(err => store.dispatch(action.userSet({ profile: emptyProfile, login: {}, loggedIn: false })));
  },

};

export default userRepo;
