const path = require('path');

module.exports = async ({ config, mode }) => {
  config.module.rules = config.module.rules.concat([
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

  config.resolve.modules.push(path.resolve(__dirname, '../app'));
  config.resolve.extensions = config.resolve.extensions.concat(['.ts', '.tsx', '.js', '.json']);
  config.resolve.alias.moment$ = 'moment/moment.js';

  config.entry.manager = ['@babel/polyfill', 'bootstrap-loader'].concat(config.entry.manager);
  config.entry.preview = ['@babel/polyfill', 'bootstrap-loader'].concat(config.entry.preview);

  return config;
};
