# powergiver app

Staging | Develop
--- | ---
https://staging-admin.buzzn.io | https://develop-admin.buzzn.io
[ ![Codeship Status for buzzn/admin-app](https://app.codeship.com/projects/8496d700-bdef-0134-4fd0-0e29162056f7/status?branch=master)](https://app.codeship.com/projects/196093) | [ ![Codeship Status for buzzn/admin-app](https://app.codeship.com/projects/8496d700-bdef-0134-4fd0-0e29162056f7/status?branch=develop)](https://app.codeship.com/projects/196093)

To run local dev server:
- clone this repository
- install node.js 8.9.0
- run `sudo npm i -g webpack`
- run `npm i`
- run `npm rebuild node-sass`
- run `npm run dev-server`
- open in browser `http://localhost:2999`

To run tests:
- run `yarn run test`

To run storybook server:
- run `npm run storybook`
- open in browser `http://localhost:9001`

Installed storybook addons:
- [Actions](https://github.com/storybooks/storybook/tree/master/addons/actions)
- [Story links](https://github.com/storybooks/storybook/tree/master/addons/links)
- [Knobs](https://github.com/storybooks/storybook/tree/master/addons/knobs)
- [Router](https://github.com/gvaldambrini/storybook-router)
- [Backgrounds](https://github.com/storybooks/addon-backgrounds)
- [intl](https://github.com/truffls/storybook-addon-intl)

How to build automatically on codeship:
- setup commands:
```
nvm install 8.9.0
npm i -g cross-env rimraf babel-cli
npm i
npm rebuild node-sass
```
- test pipeline commands:
```
npm run test
npm run flow
# uncomment when we will use production
# if [ "$CI_BRANCH" == "master" ]; then export NODE_ENV="staging"; npm run build; else export NODE_ENV="production"; npm run build; fi;
export NODE_ENV="staging"
npm run build
```

To use linter:
- install eslint globally `sudo npm i -g eslint`
- add eslint plugin to your favorite editor

To use flow type:
- install flow
- run `npm run flow` or just `flow`
- or use editor plugin
