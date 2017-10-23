# powergiver app

Staging | Develop
--- | ---
https://staging-admin.buzzn.io | https://develop-admin.buzzn.io
[ ![Codeship Status for buzzn/admin-app](https://app.codeship.com/projects/8496d700-bdef-0134-4fd0-0e29162056f7/status?branch=master)](https://app.codeship.com/projects/196093) | [ ![Codeship Status for buzzn/admin-app](https://app.codeship.com/projects/8496d700-bdef-0134-4fd0-0e29162056f7/status?branch=develop)](https://app.codeship.com/projects/196093)

To run local dev server:
- clone this repository
- install node.js 6.xx
- run `sudo npm i -g yarn webpack`
- run `yarn`
- run `npm i`
- run `npm rebuild node-sass`
- run `yarn run dev-server`
- open in browser `http://localhost:2999`

To run tests:
- run `sudo npm i -g mocha`
- run `yarn run test`

How to build automatically on codeship:
- setup commands:
```
nvm install 6.7.0
npm cache clean
npm i -g yarn cross-env rimraf
yarn
npm rebuild node-sass
```
- test pipeline commands:
```
yarn run test
yarn run build
```

To use linter:
- install eslint globally `sudo npm i -g eslint`
- add eslint plugin to your favorite editor
