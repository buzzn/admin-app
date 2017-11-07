const path = require('path');
const genDefaultConfig = require('@storybook/react/dist/server/config/defaults/webpack.config.js');

module.exports = (baseConfig, env) => {
  const config = genDefaultConfig(baseConfig, env);

  config.module.rules.push({
    test: /\.scss$/,
    loaders: ["style-loader", "css-loader", "sass-loader"],
    include: path.resolve(__dirname, '../')
  });

  config.resolve.modules.push(path.resolve(__dirname, '../app'));
  config.resolve.alias.moment$ = 'moment/moment.js';

  config.entry.manager = ['babel-polyfill', 'bootstrap-loader'].concat(config.entry.manager);
  config.entry.preview = ['babel-polyfill', 'bootstrap-loader'].concat(config.entry.preview);

  return config;
};
