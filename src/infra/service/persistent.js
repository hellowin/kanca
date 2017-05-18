// @flow
import st from 'store';
import { syncToPromise } from 'infra/service/util';

export const set = (key: string, value: any): Promise<*> => syncToPromise(() => {
  st.set(key, value);
})

export const get = (key: string): Promise<any> => syncToPromise(() => {
  return st.get(key);
})

export default {
  set,
  get,
}
