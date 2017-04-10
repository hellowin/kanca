import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

const user = (state = {
  loggedIn: false,
  login: {},
  profile: {
    id: '',
    name: '',
    email: '',
  },
}, action) => {
  switch (action.type) {
    case 'USER_SET':
      return { ...state, ...action.data };
    default:
      return { ...state };
  }
};

export default combineReducers({
  user,
  routing: routerReducer,
});
