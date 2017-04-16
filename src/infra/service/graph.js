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
  
  fetchForward(url: string, pages: number = 10, currentPage: number = 1) {
    return this.fetch(currentPage === 1 ? url : this.next)
      .then(() => {
        if (this.next && currentPage < pages) {
          return this.fetchForward(url, pages, currentPage + 1);
        } else {
          return this.data;
        }
      });
  }
  
  getCommentBatch(postIds: string[], accessToken: string) {
    const commentUrl = postIds.map(id => ({
      method: 'GET',
      relative_url: `${id}/comments?summary=1&filter=toplevel&fields=parent.fields(id),comments.summary(true),message,from,likes`,
    }));
    
    return fetch('https://graph.facebook.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          batch: commentUrl,
          access_token: accessToken,
        }),
      })
      .then(res => res.json())
      .then(data => {
        const comments = {};
        data.forEach((datum, index) => {
          comments[postIds[index]] = JSON.parse(datum.body).data;
        });

        return comments;
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
  const url = `/${groupId}/feed?fields=created_time,id,message,updated_time,caption,story,description,from,link,name,picture,status_type,type,shares,permalink_url,likes.limit(10)&limit=10`;
  const list = new GraphList();
  return list.fetchForward(url, pages);
};

const getFeedComments = (commentId: string, accessToken: string): Promise<any> => {
  const url = `/${commentId}/comments?summary=1&filter=stream`;
  const list = new GraphList();
  
  return list.fetchForward(url);
};

const batchComments = (postIds: string[], accessToken: string) => {
  const list = new GraphList();

  return list.getCommentBatch(postIds, accessToken);
}

export default {
  login,
  logout,
  getLoginStatus,
  getUser,
  getGroup,
  getGroupFeed,
  getFeedComments,
  batchComments,
};
