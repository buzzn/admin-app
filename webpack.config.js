const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  devtool: 'sourcemap',
  devServer: {
    historyApiFallback: true,
  },
  entry: [
    'babel-polyfill',
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
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: [['es2015', { modules: false }], 'stage-0', 'react'],
          plugins: ['react-hot-loader/babel'],
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
        test: /\.(eot|ttf|svg|gif|png)(\?[\s\S]+)?$/,
        loader: 'file-loader',
      },
    ],
  },
  resolve: {
    modules: [path.resolve(__dirname, 'app'), 'node_modules'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'app/index.html',
      filename: 'index.html',
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
  ],
};
