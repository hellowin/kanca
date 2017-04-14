// @flow

const get = (url: string): Promise<any> => new Promise((resolve, reject) => {
  window.FB.api(url, fbRes => {
    if (fbRes.error) return reject(new Error(`${fbRes.error.code} - ${fbRes.error.message}` || fbRes.error));
    return resolve(fbRes);
  });
});

class GraphList {

  url: string;
  data: {}[] = [];
  next: string = '';
  previous: string = '';

  constructor(url: string) {
    this.url = url;
  }

  fetch(url) {
    return get(url)
      .then(res => {
        this.data = [...this.data, ...res.data];
        if (res.paging) {
          this.previous = res.paging.previous;
          this.next = res.paging.next;
        } else {
          this.previous = '';
          this.next = '';
        }
      });
  }

  fetchForward(pages: number = 10, currentPage: number = 0) {
    return this.fetch(this.url)
      .then(() => {
        if (this.next && currentPage < pages) {
          return this.fetchForward(pages, currentPage + 1);
        } else {
          return this.data;
        }
      })
  }

}

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

const getGroupFeed = (groupId: string, pages: number): Promise<any> => {
  const url = `/${groupId}/feed?fields=created_time,id,message,updated_time,caption,story,description,from,link,name,picture,status_type,type,shares,permalink_url,likes.limit(100)&limit=100`;
  const list = new GraphList(url);
  return list.fetchForward(pages);
};

export default {
  login,
  logout,
  getLoginStatus,
  getUser,
  getGroup,
  getGroupFeed,
};