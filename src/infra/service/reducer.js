import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

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
  members: [],
}, action) => {
  switch (action.type) {
    case 'GROUP_SET':
      return { ...state, ...action.data };
    default:
      return { ...state };
  }
};

export default combineReducers({
  user,
  group,
  routing: routerReducer,
});
