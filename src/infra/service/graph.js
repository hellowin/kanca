// @flow

const get = (url: string): Promise<any> => new Promise((resolve, reject) => {
  window.FB.api(url, fbRes => {
    if (fbRes.error) return reject(new Error(fbRes.error.message || fbRes.error));
    return resolve(fbRes);
  });
});

const login = () => new Promise((resolve, reject) => {
  window.FB.login(response => {
    if (response.authResponse) {
      resolve(response);
    } else {
      reject(new Error('User cancelled login or did not fully authorize.'));
    }
  }, { scope: 'public_profile, email' });
});

const logout = () => new Promise((resolve) => {
  window.FB.logout();
  resolve(true);
})

const getLoginStatus = () => new Promise((resolve, reject) => {
  window.FB.getLoginStatus((response) => {
    if (response.status === 'connected') {
      resolve(response);
    } else {
      reject(new Error('User not connected.'))
    }
  });
})

const getUser = () => get('/me?fields=id,name,email,picture')
  .then(res => {
    const user: UserProfile = {
      facebookId: res.id,
      name: res.name,
      email: res.email,
      picture: res.picture.data.url,
    };
    return user;
  });

const getGroup = (groupId: string) => get(`/${groupId}?fields=id,name,privacy,cover,description,owner`)
  .then(res => {
    const group: Group = {
      id: res.id,
      name: res.name,
      privacy: res.privacy,
      cover: res.cover.source,
      description: res.description,
      owner: {
        id: res.owner.id,
        name: res.owner.name,
      },
    }
    return group;
  });

export default {
  login,
  logout,
  getLoginStatus,
  getUser,
  getGroup,
};