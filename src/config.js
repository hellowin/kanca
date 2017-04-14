export default {
  env: process.env.NODE_ENV,
  FBAppID: process.env.REACT_APP_FB_APP_ID,
  FBAppToken: process.env.REACT_APP_FB_APP_TOKEN,
  homepage: 'https://hellowin.github.io/kanca/',
  urlPrefix: process.env.REACT_APP_URL_PREFIX,
  feedPages: process.env.REACT_APP_FEED_PAGES || 10,
};
