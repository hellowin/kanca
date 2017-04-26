// @flow
import _ from 'lodash';

const get = (url: string): Promise<any> => new Promise((resolve, reject) => {
  window.FB.api(url, fbRes => {
    if (fbRes.error) return reject(new Error(`${fbRes.error.code} - ${fbRes.error.message}` || fbRes.error));
    return resolve(fbRes);
  });
});

class GraphList {

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

}

const login = () => new Promise((resolve, reject) => {
  window.FB.login(response => {
    if (response.authResponse) {
      resolve(response);
    } else {
      reject(new Error('User cancelled login or did not fully authorize.'));
    }
  }, { scope: 'public_profile, email, user_managed_groups' });
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

const getUserManagedGroups = (): Promise<Group[]> => get('/me/groups?fields=id,name,privacy,cover,description,owner&limit=100')
  .then(res => {
    const rawGroups = res.data;
    if (rawGroups.length < 1) return [];

    const groups: Group[] = rawGroups.map(raw => ({
      id: raw.id,
      name: raw.name,
      privacy: raw.privacy,
      cover: (raw.cover || {}).source,
      description: raw.description,
      owner: raw.owner,
    }));

    return groups;
  });

const getGroup = (groupId: string): Promise<Group> => get(`/${groupId}?fields=id,name,privacy,cover,description,owner`)
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

const getGroupFeed = (groupId: string, pages: number): Promise<{}[]> => {
  const url = `/${groupId}/feed?fields=created_time,id,message,updated_time,caption,story,description,from,link,name,picture,status_type,type,shares,permalink_url,likes.limit(100),comments.limit(100){id,from,message,created_time,likes.limit(100),comments.limit(100){id,from,message,created_time,likes.limit(100)}}&limit=100`;
  const list = new GraphList();
  return list.fetchForward(url, pages);
};

const getGroupComments = (posts: Object[]): Promise<any> => {
  // currently just put existing comments without fetching next page
  const firstComments = [];
  const secondComments = [];
  // get post with comments
  posts.forEach(post => {
    const comments = ((post.comments || {}).data || []).map(comment => ({
      parent: post.id,
      hierarchy: 0,
      ...comment,
    }));
    if (comments) firstComments.push(...comments);
  });
  // get second comments
  firstComments.forEach(com => {
    const comments = ((com.comments || {}).data || []).map(comment => ({
      parent: com.id,
      hierarchy: 1,
      ...comment,
    }));
    if (comments) secondComments.push(...comments);
  });

  const comments = [...firstComments.map(com => _.omit(com, 'comments')), ...secondComments];

  return Promise.resolve(comments);
};

const getGroupMembers = (groupId: string, pages: number): Promise<{}[]> => {
  const url = `/${groupId}/members?fields=id,name,administrator,picture&limit=100`;
  const list = new GraphList();
  return list.fetchForward(url, pages);
};

export default {
  login,
  logout,
  getLoginStatus,
  getUser,
  getGroup,
  getUserManagedGroups,
  getGroupFeed,
  getGroupComments,
  getGroupMembers,
};
