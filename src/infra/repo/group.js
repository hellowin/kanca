// @flow
import store from 'infra/service/store';
import action from 'infra/service/action';
import graph from 'infra/service/graph';
import config from 'config';
import st from '../service/persistent';
import _ from 'lodash';
import moment from 'moment-timezone';
import { reportError } from 'infra/service/reporter';

const groupRepo = {

  selectGroup(groupId: string): Promise<any> {
    store.dispatch(action.groupSet({ loading: true, selected: {}, updatedTime: new Date() }));
    let group;
    return graph.getGroup(groupId)
      .then(res => (group = res))
      .then(() => {
        const updatedTime = new Date();
        // store on redux
        store.dispatch(action.groupSet({ updatedTime, selected: group }));
        // store on local storage
        return Promise.all([
          st.set('group.selected', group),
          st.set('group.updatedTime', updatedTime),
        ]);
      })
      .then(() => groupRepo.fetchFeeds(group.id, config.feedPages));
  },

  refreshGroup(): Promise<any> {
    const groupId = store.getState().group.selected.id;
    return this.selectGroup(groupId);
  },

  addInput(group: Object) {
    const oldInputs = store.getState().group.inputs;
    const uniqueInputs = {};
    oldInputs.forEach(input => {
      if (!uniqueInputs[input.id]) uniqueInputs[input.id] = input;
    });
    const groupId: string = (group || {}).id;
    if (groupId) uniqueInputs[groupId] = group;
    const inputs = _.values(uniqueInputs);

    // store on local storage
    st.set('group.inputs', inputs)
      .then(() => {
        // store on redux
        store.dispatch(action.groupSet({ inputs }));
      });
  },

  fetchFeatures(groupIds: string[]): Promise<any> {
    store.dispatch(action.groupSet({ error: null, loading: true, features: [], manages: [] }));
    const features = [];
    let manages = [];

    const promises = groupIds.map(id => graph.getGroup(id)
      .then(res => features.push(res))
      .catch(reportError));
    
    return Promise.all(promises)
      .then(() => graph.getUserManagedGroups())
      .then(res => (manages = res))
      .then(() => {
        store.dispatch(action.groupSet({ features, manages, loading: false }));
      })
      .catch(err => {
        reportError(err);
        store.dispatch(action.groupSet({ error: err, loading: false }));
      });
  },

  fetchFeeds(groupId: string, pages: number): Promise<any> {
    store.dispatch(action.groupSet({ error: null, loading: true, feeds: [], comments: [], members: [] }));
    let feeds;
    let comments;
    let members;
  
    return graph.getGroupFeed(groupId, pages).then(res => (feeds = res))
      .then(() => graph.getGroupMembers(groupId, pages)).then(res => (members = res))
      .then(() => graph.getGroupComments(feeds).then(res => (comments = res)))
      .then(() => {
        // store on redux
        store.dispatch(action.groupSet({ feeds, comments, members, loading: false }));
        // store on local storage
        return Promise.all([
          st.set('group.feeds', feeds),
          st.set('group.comments', comments),
          st.set('group.members', members),
        ]);
      })
      .catch(err => {
        reportError(err);
        store.dispatch(action.groupSet({ error: err, loading: false }));
      });
  },

  restoreGroup() {
    try {
      store.dispatch(action.groupSet({ loading: true }));
      Promise.all([
        st.get('group.inputs') || Promise.resolve([]),
        st.get('group.selected') || Promise.resolve({}),
        st.get('group.updatedTime') || Promise.resolve(null),
        st.get('group.feeds') || Promise.resolve([]),
        st.get('group.comments') || Promise.resolve([]),
        st.get('group.members') || Promise.resolve([]),
      ])
        .then(([inputs, selected, updatedTime, feeds, comments, members]) => {
          if (updatedTime && moment(updatedTime).isValid()) updatedTime = moment(updatedTime).toDate();
          store.dispatch(action.groupSet({ inputs, selected, updatedTime, feeds, comments, members, loading: false }));
        });
    } catch (err) {
      reportError(err);
    }
  },

};

export default groupRepo;
