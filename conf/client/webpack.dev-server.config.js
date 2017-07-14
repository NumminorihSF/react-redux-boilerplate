import os from 'os';
import webpack from 'webpack';
import Config from 'webpack-config';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

import StylelintRunner from './StylelintRunner';
import TestRunner from './TestRunner';
import FlowRunner from './FlowRunner';
import getLintRule from './getLintRule';


const mutate = (config) => {
  delete config.entry.app;
  config.module.rules = config.module.rules.filter(rule => !rule.test || rule.test.source !== '\\.jsx?$');

  return config;
};


const define = {
  'process.env.ACTIVATION_CODE': JSON.stringify(process.env.ACTIVATION_CODE),
  'process.env.USER': JSON.stringify(os.userInfo().username),
  'process.env.REVISION': JSON.stringify(process.env.REVISION),
  'process.env.BRANCH': JSON.stringify(process.env.BRANCH),
  'process.env.OS_TYPE': JSON.stringify(os.type()),
};

export default new Config().extend({ 'conf/[target]/webpack.base.config.js': mutate }).merge({
  devtool: process.env.SOURCE_MAPS || 'eval-source-map',
  entry: {
    app: [
      'babel-polyfill',
      './src/client.js',
      'webpack-dev-server/client',
      'webpack/hot/only-dev-server',
    ],
  },
  output: {
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '[path][name]__[hash:base64:5]__[local]',
              sourceMap: true,
            },
          },
          {
            loader: 'resolve-url-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              outputStyle: 'expanded',
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'resolve-url-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              outputStyle: 'expanded',
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          {
            loader: 'babel-loader',
            query: {
              cacheDirectory: true,
              retainLines: true,
            },
          },
        ],
      },
      ...(getLintRule()),
    ],
  },
  plugins: [
    new webpack.DefinePlugin(define),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new ExtractTextPlugin('app.css'),
    new TestRunner(),
    new FlowRunner(),
    new StylelintRunner(),
  ],
});

