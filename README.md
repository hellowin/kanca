# Kanca

[![Build Status](https://travis-ci.org/hellowin/kanca.svg?branch=master)](https://travis-ci.org/hellowin/kanca)
[![codecov](https://codecov.io/gh/hellowin/kanca/branch/master/graph/badge.svg)](https://codecov.io/gh/hellowin/kanca)
[![Known Vulnerabilities](https://snyk.io/test/github/hellowin/kanca/badge.svg)](https://snyk.io/test/github/hellowin/kanca)
[![bitHound Overall Score](https://www.bithound.io/github/hellowin/kanca/badges/score.svg)](https://www.bithound.io/github/hellowin/kanca)
[![bitHound Dependencies](https://www.bithound.io/github/hellowin/kanca/badges/dependencies.svg)](https://www.bithound.io/github/hellowin/kanca/master/dependencies/npm)
[![bitHound Dev Dependencies](https://www.bithound.io/github/hellowin/kanca/badges/devDependencies.svg)](https://www.bithound.io/github/hellowin/kanca/master/dependencies/npm)
[![bitHound Code](https://www.bithound.io/github/hellowin/kanca/badges/code.svg)](https://www.bithound.io/github/hellowin/kanca)

Kanca is an application to analyze `Facebook Group` activity. Its key features are:

- **Open sourced**, as you can see here.
- **Fully client side**, hosted on GitHub pages (zero cost, no data persisted on server).
- Analyze user FB group feed behavior like most active users, most liked posts, etc.
- Analyze FB group user engagement like new users, user retention, etc.

# Local Development

## Requirements

1. Node.js 6+
2. Facebook Developer's Application, create it at [https://developers.facebook.com](https://developers.facebook.com) for free

## Installation

1. Go to project root directory, copy `.env.template` to `.env` (edit it as you need, look at description below)
2. Install its dependencies `$ npm install` or `$ yarn install`

## Development

1. Run `$ npm start`
2. Open browser at `http://localhost:3000`

## Environment Variable Explanation

- `NODE_PATH` default is `src`, this is `Create React App` standard to mark directories as our node.js modules.
- `REACT_APP_FB_APP_ID` it's Facebook Developer's Application ID, look at your application dashboard on https://developers.facebook.com.
- `REACT_APP_URL_PREFIX` default is `/kanca`, it's used as a `url prefix`, mostly used if we published as project page at GitHub pages.
- `REACT_APP_FEED_PAGES` default is `10`, it's used to set how many pages of group feed do we want to fetch by default.

# Roadmap

To track development progress and roadmap, follow this [GitHub Project](https://github.com/hellowin/kanca/projects).

# License

[MIT](https://github.com/hellowin/kanca/blob/master/LICENSE)