// @flow
import { browserHistory } from 'react-router';
import config from 'config';

export const push = (to: string) => browserHistory.push(config.getUrl + to);
export const getUrl = (to: string) => `${config.getUrl}${to}`;

export default {
  push,
  getUrl,
};
