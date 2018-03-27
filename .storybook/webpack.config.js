const path = require('path');
const genDefaultConfig = require('@storybook/react/dist/server/config/defaults/webpack.config.js');

module.exports = (baseConfig, env) => {
  const config = genDefaultConfig(baseConfig, env);

  config.module.rules = config.module.rules.concat([
    {
      test: /\.scss$/,
      loaders: ['style-loader', 'css-loader', 'sass-loader'],
      include: path.resolve(__dirname, '../'),
    },
    {
      test: /\.(ts|tsx|js)$/,
      exclude: /(node_modules|bower_components)/,
      loader: 'babel-loader',
      query: {
        presets: [
          [
            '@babel/env',
            {
              targets: {
                browsers: ['last 2 versions', 'safari >= 7'],
                modules: false,
                debug: true,
              },
            },
          ],
          '@babel/stage-3',
          '@babel/react',
          '@babel/typescript',
        ],
        plugins: [
          'react-hot-loader/babel',
          '@babel/plugin-proposal-object-rest-spread',
          '@babel/plugin-proposal-class-properties',
          '@babel/plugin-syntax-class-properties',
          '@babel/plugin-syntax-object-rest-spread',
        ],
      },
    },
  ]);

  config.resolve.modules.push(path.resolve(__dirname, '../app'));
  config.resolve.extensions = config.resolve.extensions.concat(['.ts', '.tsx', '.js', '.json']);
  config.resolve.alias.moment$ = 'moment/moment.js';

  config.entry.manager = ['babel-polyfill', 'bootstrap-loader'].concat(config.entry.manager);
  config.entry.preview = ['babel-polyfill', 'bootstrap-loader'].concat(config.entry.preview);

  return config;
};
