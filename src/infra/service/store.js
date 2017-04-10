import { createStore } from 'redux';
import reducer from './reducer';

const factory = (preloadedState) => createStore(
  reducer,
  preloadedState,
  window.devToolsExtension && window.devToolsExtension()
);

const store = factory();

export default store;
