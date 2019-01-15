const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const StatsPlugin = require('stats-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const GenerateJsonPlugin = require('generate-json-webpack-plugin');

const buildDate = new Date().valueOf();

module.exports = {
  entry: {
    app: [
      '@babel/polyfill',
      'core-js/fn/array/flat-map',
      'bootstrap-loader',
      'whatwg-fetch',
      './app/index.production.js',
    ],
  },
  output: {
    path: path.resolve(__dirname, 'build/public/assets'),
    publicPath: '/assets/',
    filename: '[name]-bundle-[contenthash].min.js',
    chunkFilename: '[name]-bundle-[contenthash].min.js',
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx|js)$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
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
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: Infinity,
      minSize: 0,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            // get the name. E.g. node_modules/packageName/not/this/part.js
            // or node_modules/packageName
            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];

            // npm package names are URL-safe, but some servers don't like @ symbols
            return `npm.${packageName.replace('@', '')}`;
          },
        },
      },
    },
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.buildDate': buildDate,
    }),
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
      chunksSortMode: 'none',
    }),
    new StatsPlugin('webpack.stats.json', {
      source: false,
      modules: true,
    }),
    new FaviconsWebpackPlugin('./favicon.png'),
    new GenerateJsonPlugin('version.json', { buildDate }),
  ],
};
