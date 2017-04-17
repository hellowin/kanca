// @flow
import store from 'infra/service/store';
import action from 'infra/service/action';
import graph from 'infra/service/graph';
import config from 'config';

const userRepo = {

  selectGroup(groupId: string): Promise<any> {
    store.dispatch(action.groupSet({ loading: true, selected: {} }));
    let group;
    return graph.getGroup(groupId)
      .then(res => (group = res))
      .then(() => store.dispatch(action.groupSet({ selected: group })))
      .then(() => userRepo.fetchFeeds(group.id, config.feedPages));
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
    let members;
  
    return graph.getGroupFeed(groupId, pages).then(res => (feeds = res))
      .then(() => graph.getGroupMembers(groupId, pages)).then(res => (members = res))
      .then(() => store.dispatch(action.groupSet({ feeds, members, loading: false })));
  },

};

export default userRepo;
