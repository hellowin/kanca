// @flow

const get = (url: string): Promise<any> => new Promise((resolve, reject) => {
  window.FB.api(url, fbRes => {
    if (fbRes.error) return reject(new Error(`${fbRes.error.code} - ${fbRes.error.message}` || fbRes.error));
    return resolve(fbRes);
  });
});

const getWithToken = (url: string, accessToken: string): Promise<any> => new Promise((resolve, reject) => {
  window.FB.api(url, fbRes => {
    if (fbRes.error) return reject(new Error(`${fbRes.error.code} - ${fbRes.error.message}` || fbRes.error));
    return resolve(fbRes);
  }, { access_token: accessToken });
});

class GraphList {

  url: string;
  data: {}[] = [];
  next: string = '';
  previous: string = '';

  fetch(url: string) {
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
  
  fetchWithToken(url: string, accessToken: string) {
    return getWithToken(url, accessToken)
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

  fetchForward(url: string, accessToken: string = '', pages: number = 10, currentPage: number = 1) {
    if (accessToken) {
      return this.fetchWithToken(currentPage === 1 ? url : this.next, accessToken)
        .then(() => {
          if (this.next && currentPage < pages) {
            return this.fetchForward(url, accessToken, pages, currentPage + 1);
          } else {
            return this.data;
          }
        });
    }
    
    return this.fetch(currentPage === 1 ? url : this.next)
      .then(() => {
        if (this.next && currentPage < pages) {
          return this.fetchForward(url, '', pages, currentPage + 1);
        } else {
          return this.data;
        }
      });
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
});

const getLoginStatus = () => new Promise((resolve, reject) => {
  window.FB.getLoginStatus((response) => {
    if (response.status === 'connected') {
      resolve(response);
    } else {
      reject(new Error('User not connected.'))
    }
  });
});

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
  const list = new GraphList();
  return list.fetchForward(url, '', pages);
};

const getFeedComments = (commentId: string, accessToken: string): Promise<any> => {
  const url = `/${commentId}/comments`;
  const list = new GraphList();
  
  return list.fetchForward(url, accessToken);
};

export default {
  login,
  logout,
  getLoginStatus,
  getUser,
  getGroup,
  getGroupFeed,
  getFeedComments,
};
