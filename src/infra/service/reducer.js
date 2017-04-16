import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import update from 'immutability-helper';

const user = (state = {
  loading: false,
  loggedIn: false,
  login: {},
  profile: {
    id: '',
    name: '',
    email: '',
    picture: '',
  },
}, action) => {
  switch (action.type) {
    case 'USER_SET':
      return { ...state, ...action.data };
    default:
      return { ...state };
  }
};

const group = (state = {
  loading: false,
  inputs: [],
  features: [],
  selected: {},
  feeds: [],
  comments: {},
}, action) => {
  switch (action.type) {
    case 'GROUP_SET':
      return { ...state, ...action.data };
    case 'GROUP_COMMENT_SET':
      // Little hack! Immutable can't update undefined key
      // Need to refactor it later
      if (!state.comments[state.selected.id]) {
        state.comments[state.selected.id] = {};
      }
      
      return update(state, {
        comments: {
          [state.selected.id]: {
            $apply: currentGroupId => update(currentGroupId, {
              data: {
                $set: action.data.comments,
              }
            })
          }
        }
      });
    default:
      return { ...state };
  }
};

export default combineReducers({
  user,
  group,
  routing: routerReducer,
});
