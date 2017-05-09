// @flow
import { browserHistory } from 'react-router';
import config from 'config';

export const push = (to: string) => browserHistory.push(config.urlPrefix + to);
export const getUrl = (to: string) => `${config.urlPrefix}${to}`;

export default {
  push,
  getUrl,
};
