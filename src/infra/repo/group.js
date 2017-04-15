// @flow
import store from 'infra/service/store';
import action from 'infra/service/action';
import graph from 'infra/service/graph';

const userRepo = {

  selectGroup(groupId: string): Promise<any> {
    store.dispatch(action.groupSet({ loading: true }));
    let group;
    return graph.getGroup(groupId)
      .then(res => (group = res))
      .then(() => {
        store.dispatch(action.groupSet({ selected: group, loading: false }));
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
  },

  fetchFeeds(groupId: string, pages: number): Promise<any> {
    store.dispatch(action.groupSet({ loading: true, feeds: [] }));
    let feeds;
  
    return graph.getGroupFeed(groupId, pages)
      .then(res => (feeds = res))
      .then(() => {
        userRepo.fetchComments(feeds);
      })
      .then(() => {
        store.dispatch(action.groupSet({ feeds, loading: false }));
      });
  },
  
  fetchComments(feeds: Object[]): void {
    store.dispatch(action.groupSet({ loading: true }));
    const { user } = store.getState();
    
    feeds.forEach((feed: Object) => {
      graph.getFeedComments(feed.id, user.login.authResponse.accessToken)
        .then(comments => {
          store.dispatch(action.commentSet({
            postId: feed.id,
            comments,
            loading: false
          }));
        });
    });
  }

};

export default userRepo;
