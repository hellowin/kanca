// @flow
import store from 'infra/service/store';
import action from 'infra/service/action';
import graph from 'infra/service/graph';

const userRepo = {

  setGroup(groupId: string): Promise<any> {
    store.dispatch(action.groupSet({ loading: true }));
    let group;
    return graph.getGroup(groupId)
      .then(res => (group = res))
      .then(() => {
        store.dispatch(action.groupSet({ ...group, loading: false }));
      });
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
  }

};

export default userRepo;
