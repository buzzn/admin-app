const path = require('path');

module.exports = (baseConfig, env, defaultConfig) => {
  defaultConfig.module.rules = defaultConfig.module.rules.concat([
    {
      test: /\.scss$/,
      use: [
        { loader: 'style-loader', options: { sourceMap: true } },
        { loader: 'css-loader', options: { sourceMap: true } },
        { loader: 'sass-loader', options: { sourceMap: true } },
        { loader: 'postcss-loader', options: { sourceMap: true } },
      ],
    },
    {
      test: /\.(ts|tsx|js)$/,
      exclude: /(node_modules|bower_components)/,
      loader: 'babel-loader',
    },
  ]);

  defaultConfig.resolve.modules.push(path.resolve(__dirname, '../app'));
  defaultConfig.resolve.extensions = defaultConfig.resolve.extensions.concat(['.ts', '.tsx', '.js', '.json']);
  defaultConfig.resolve.alias.moment$ = 'moment/moment.js';

  defaultConfig.entry.manager = ['@babel/polyfill', 'bootstrap-loader'].concat(defaultConfig.entry.manager);
  defaultConfig.entry.preview = ['@babel/polyfill', 'bootstrap-loader'].concat(defaultConfig.entry.preview);

  return defaultConfig;
};
