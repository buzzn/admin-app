const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const StatsPlugin = require('stats-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

module.exports = {
  entry: { app: ['@babel/polyfill', 'bootstrap-loader', 'whatwg-fetch', './app/index.production.js'] },
  output: {
    path: path.resolve(__dirname, 'build/public/assets'),
    publicPath: '/assets/',
    filename: '[name]-bundle-[chunkhash].min.js',
    chunkFilename: '[name]-bundle-[chunkhash].min.js',
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
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
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
  optimization: { splitChunks: { chunks: 'all' } },
  plugins: [
    new webpack.DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV) }),
    new webpack.ProvidePlugin({ 'window.Tether': 'tether' }),
    new webpack.HashedModuleIdsPlugin({}),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
      options: {
        context: __dirname,
        output: { path: path.resolve(__dirname, 'build/public/assets') },
      },
    }),
    new HtmlWebpackPlugin({
      template: 'app/index.html',
      filename: '../index.html',
    }),
    new StatsPlugin('webpack.stats.json', {
      source: false,
      modules: true,
    }),
    new FaviconsWebpackPlugin('./favicon.png'),
  ],
};
