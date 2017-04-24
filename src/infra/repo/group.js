// @flow
import store from 'infra/service/store';
import action from 'infra/service/action';
import graph from 'infra/service/graph';
import config from 'config';
import st from 'store';
import _ from 'lodash';

const groupRepo = {

  selectGroup(groupId: string): Promise<any> {
    store.dispatch(action.groupSet({ loading: true, selected: {} }));
    let group;
    return graph.getGroup(groupId)
      .then(res => (group = res))
      .then(() => {
        // store on local storage
        st.set('group.selected', group);
        // store on redux
        store.dispatch(action.groupSet({ selected: group }));
      })
      .then(() => groupRepo.fetchFeeds(group.id, config.feedPages));
  },

  addInput(group: {}) {
    const inputs = [...store.getState().group.inputs, group];
    store.dispatch(action.groupSet({ inputs }));
  },

  fetchFeatures(groupIds: string[]): Promise<any> {
    store.dispatch(action.groupSet({ loading: true }));
    const features = [];
    const promises = groupIds.map(id => graph.getGroup(id)
      .then(res => features.push(res))
      .catch(console.log));
    
    return Promise.all(promises)
      .then(() => {
        store.dispatch(action.groupSet({ features, loading: false }));
      });
  },

  fetchFeeds(groupId: string, pages: number): Promise<any> {
    store.dispatch(action.groupSet({ loading: true, feeds: [] }));
    let feeds;
    let comments;
    let members;
  
    return graph.getGroupFeed(groupId, pages).then(res => (feeds = res))
      .then(() => graph.getGroupMembers(groupId, pages)).then(res => (members = res))
      .then(() => graph.getGroupComments(feeds).then(res => (comments = res)))
      .then(() => {
        // store on local storage
        st.set('group.feeds', feeds);
        st.set('group.comments', comments);
        st.set('group.members', members);
        // store on redux
        store.dispatch(action.groupSet({ feeds, comments, members, loading: false }));
      });
  },

  restoreGroup() {
    store.dispatch(action.groupSet({ loading: true }));
    const selected = st.get('group.selected') || {};
    const feeds = st.get('group.feeds') || [];
    const comments = st.get('group.comments') || [];
    const members = st.get('group.members') || [];
    store.dispatch(action.groupSet({ selected, feeds, comments, members, loading: false }));
  },

};

export default groupRepo;
