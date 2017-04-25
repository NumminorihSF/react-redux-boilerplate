import webpack from 'webpack';
import Config from 'webpack-config';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

import TestRunner from './TestRunner';
import FlowRunner from './FlowRunner';
import getLintRule from './getLintRule';

const mutate = config => {
  delete config.entry.app;
  config.module.rules = config.module.rules.filter(rule => !rule.test || rule.test.source !== '\\.jsx?$');

  return config;
};

export default new Config().extend({ 'conf/[target]/webpack.base.config.js': mutate }).merge({
  devtool: 'eval-source-map',
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
          'style-loader',
          'css-loader?modules=true&localIdentName=[path][name]__[local]--[hash:base64:5]',
          'resolve-url-loader',
          'sass-loader?outputStyle=expanded&sourceMap',
        ],
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          'resolve-url-loader?sourceMap=true',
          'sass-loader?outputStyle=expanded&sourceMap',
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
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new ExtractTextPlugin('app.css'),
    new TestRunner(),
    new FlowRunner(),
  ],
});

