const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

module.exports = {
  devtool: 'sourcemap',
  devServer: { historyApiFallback: true },
  entry: [
    '@babel/polyfill',
    'bootstrap-loader',
    'react-hot-loader/patch',
    'webpack/hot/only-dev-server',
    'whatwg-fetch',
    './app/index.development.js',
  ],
  output: {
    path: path.resolve(__dirname, 'build'),
    publicPath: '/',
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx|js)$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: [
            [
              '@babel/preset-env',
              {
                targets: { browsers: ['last 2 versions', 'safari >= 7'] },
                modules: false,
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
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader', options: { sourceMap: true } },
          { loader: 'css-loader', options: { sourceMap: true } },
          { loader: 'postcss-loader', options: { sourceMap: true } },
        ],
      },
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
        test: /\.woff?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?limit=10000&mimetype=application/font-woff&name=[path][name].[ext]',
      },
      {
        test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?limit=10000&mimetype=application/font-woff2&name=[path][name].[ext]',
      },
      {
        test: /\.(eot|ttf|svg|gif|png|jpg)(\?[\s\S]+)?$/,
        loader: 'file-loader',
      },
    ],
  },
  resolve: {
    modules: [path.resolve(__dirname, 'node_modules'), path.resolve(__dirname, 'app'), 'node_modules'],
    extensions: ['.ts', '.tsx', '.js', '.json'],
    alias: { moment$: 'moment/moment.js' },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'app/index.html',
      filename: 'index.html',
    }),
    new webpack.DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify('development') }),
    new FaviconsWebpackPlugin('./favicon.png'),
  ],
};
