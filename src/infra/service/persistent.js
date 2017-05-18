// @flow
import st from 'store';

export const set = (key: string, value: any) => {
  st.set(key, value);
}

export const get = (key: string): any => {
  return st.get(key);
}

export default {
  set,
  get,
}
