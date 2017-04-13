// @flow
import store from 'infra/service/store';
import action from 'infra/service/action';
import graph from 'infra/service/graph';

const userRepo = {

  fetchGroup(groupId: string) {
    store.dispatch(action.groupSet({ loading: true }));
    let group;
    return graph.getGroup(groupId)
      .then(res => (group = res))
      .then(() => {
        store.dispatch(action.groupSet({ ...group, loading: false }));
      });
  },

};

export default userRepo;
