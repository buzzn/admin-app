# powergiver app

Staging | Develop
--- | ---
https://staging-admin.buzzn.io | https://develop-admin.buzzn.io
[ ![Codeship Status for buzzn/admin-app](https://app.codeship.com/projects/8496d700-bdef-0134-4fd0-0e29162056f7/status?branch=master)](https://app.codeship.com/projects/196093) | [ ![Codeship Status for buzzn/admin-app](https://app.codeship.com/projects/8496d700-bdef-0134-4fd0-0e29162056f7/status?branch=develop)](https://app.codeship.com/projects/196093)

To run local dev server:

- clone this repository
- install node.js 10.8.0
- install yarn (https://yarnpkg.com/lang/en/docs/install or `brew install yarn --without-node` if you're using mac)
- run `yarn`
- run `npm rebuild node-sass`
- run `yarn run dev-server`
- open in browser `http://localhost:2999`

To run tests:

- run `yarn run test`

To run storybook server:

- run `yarn run storybook`
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

```shell
nvm install 10.8.0
npm i -g yarn cross-env rimraf @babel/cli @babel/core
yarn
yarn upgrade @buzzn/i18n
npm rebuild node-sass
```

- test pipeline commands:

```shell
yarn run typecheck
yarn run test
if [ "$CI_BRANCH" == "master" ]; then export NODE_ENV="staging"; npm run build; elif [ "$CI_BRANCH" == "develop" ]; then export NODE_ENV="develop"; npm run build; else export NODE_ENV="production"; npm run build; fi;
```

To use linter:

- install eslint globally `sudo npm i -g eslint`
- add eslint plugin to your favorite editor
