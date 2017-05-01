// @flow
import Bugsnag from 'bugsnag-js';
import config from 'config';

Bugsnag.apiKey = config.bugsnagAPIKey;

export const reportError = (err: Error) => Bugsnag.notifyException(err);

export default {
  reportError,
};
