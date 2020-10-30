# powergiver app



Staging | Develop
--- | ---
https://staging-admin.buzzn.io | https://develop-admin.buzzn.io
[ ![Codeship Status for buzzn/admin-app](https://app.codeship.com/projects/8496d700-bdef-0134-4fd0-0e29162056f7/status?branch=master)](https://app.codeship.com/projects/196093) | [ ![Codeship Status for buzzn/admin-app](https://app.codeship.com/projects/8496d700-bdef-0134-4fd0-0e29162056f7/status?branch=develop)](https://app.codeship.com/projects/196093)

App structure:

Each module (feature) can be reused as a separate small app. So later it can be pushed to separate repository and used as a npm package or as a sub repo.
For example:
```
app            --> our application
|-components   --> application view components, reusable within this app
|-index.js     --> app entrance
|-index.html
|-reducers     --> app reducers (can be file or folder, depends on how many reducers are in the app)
|-actions      --> app actions and constants, can be a file or folder
|-sagas        --> app sagas, can be a file or folder
|-...          --> some misc files like config.js
|-meters       --> module
  |-index.js   --> export
  |-reducers
  |-actions
  |-sagas
  |-api
```

- Styles are stored within components/styles in a separate files and included in components. Migration to styled-components is not finished.
- Application state tree (redux tree) should be flat.
- Good rule for the module action types is to use prefix, for example: `buzzn_admin/PROFILE_LOADED`, but exported constant should be named without prefix: `PROFILE_LOADED`
- Each module should know as little as possible about other modules or app structure. There can be an exception ofc. For example we can make a convention about app config reducer path and use it directly to minimize boilerplate code.
- buzzn-style repo is not used correctly right now. Initial idea was to extract all view-only components there and create storybooks for them. And to simplify code management lerna.js or yarn workspaces can be used.
- validation is based on swagger.json rules. On app load rules are fetched and based on `validation_rules_list.js` each module receives rules obj as an action. If there is a form field that is connected to validation rules, but there is no such riles in loaded json, then form will crash. It's done intentionally to prevent silent failures and broken validation.

To run local dev server:

- clone this repository
- install latest node.js LTS
- install yarn (https://yarnpkg.com/lang/en/docs/install or `brew install yarn --without-node` if you're using mac)
- run `yarn`
- run `yarn run dev-server`
- open in browser `http://localhost:2999`

To run tests:

- run `yarn run test`

To run typecheck:

- run `yarn run typecheck`

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
nvm install 10.15.3
npm i -g yarn cross-env rimraf @babel/cli @babel/core
yarn
yarn upgrade @buzzn/i18n
npm rebuild node-sass
```

- test pipeline commands:

```shell
yarn run typecheck
yarn run test
if [ "$CI_BRANCH" == "DEV-58-traiff-change" ]; then export NODE_ENV="staging"; elif [ "$CI_BRANCH" == "master" ]; then export NODE_ENV="staging"; elif [ "$CI_BRANCH" == "master" ]; then export NODE_ENV="staging"; npm run build; elif [ "$CI_BRANCH" == "develop" ]; then export NODE_ENV="develop"; npm run build; else export NODE_ENV="production"; npm run build; fi;
```

To use linter:

- install eslint globally `sudo npm i -g eslint`
- add eslint plugin to your favorite editor
