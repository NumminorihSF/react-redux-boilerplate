/**
 * Created by numminorihsf on 24.10.16.
 */
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const autoprefixer = require('autoprefixer');
const path = require('path');
const fs = require('fs');
require('assets-webpack-plugin');

const { browsers: BROWSERS = [], buildDestination: dest} = require('./package.json');

const define = {
  'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  'process.env.API_BASE_URL': JSON.stringify(process.env.API_BASE_URL || null),
  'NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  'ON_SERVER': 'false',
  'GLOBAL': 'window',
  'global': 'window',
  'process.env.ON_SERVER': 'false'
};
const isDebugMode = !(process.env.NODE_ENV === 'production');

const config = {
  devtool: 'source-map',
  entry: {
    app :[
      `./src/client.js`
    ],
    vendor: [
      'react',
      'react-router',
      'react-helmet',
      'react-redux',
      'react-router-redux',
      'bluebird',
      'redux-logger',
      'redux-thunk',
      'superagent',
      'redux',
      'react-dom'
    ]

  },

  output: {
    filename: 'app.js',
    path: path.join(__dirname, dest, 'public'),
    publicPath: '/public',
    chunkFilename: "[name].js"
  },

  debug: true,
  plugins: [
    new webpack.DefinePlugin(define),
    new webpack.optimize.OccurrenceOrderPlugin(false),
    new webpack.optimize.DedupePlugin(),
    new webpack.NoErrorsPlugin(),
    new HtmlWebpackPlugin({template: './src/index.html'})
  ],
  module: {
    loaders: [
      {
        test: /\.s?css$/,
        loader: ExtractTextPlugin.extract([
          'css-loader',
          'sass-loader',
          'csso-loader',
          'postcss-loader'
        ])
      },
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel'
      }
    ],
    postLoaders: [
      {
        test: /\.jsx?$/,
        //exclude: /\/(node_modules|bower_components)\//,
        loader: 'autopolyfiller-loader',
        query: {
          browsers: BROWSERS }
      }
    ]
  },
  postcss: () => [autoprefixer]
};

if (isDebugMode) {
  config.entry.app = config.entry.app.concat([
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/only-dev-server'
  ]);

  config.plugins = config.plugins.concat([
    new webpack.HotModuleReplacementPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'vendor.js'
    }),
    new ExtractTextPlugin("app.css")
  ]);

  config.output.publicPath = 'http://localhost:3000/';
  config.module.loaders[1].query = {
    "env": {
      "development": {
        "presets": ["react-hmre"]
      }
    }
  }
} else {
  config.output.filename = 'app-[hash].js';

  config.plugins = config.plugins.concat([
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: '[name]-[hash].js'
    }),
    new webpack.optimize.UglifyJsPlugin({
      warnings: true
    }),
    new ExtractTextPlugin("app-[hash].css"),
    function() {
      var getExt = function(name){
        return name.match(/\..*?$/)[0];
      };
      this.plugin("done", function(stats) {
        let json = {};
        stats.compilation.chunks.forEach(function(chunk){
          chunk.files.forEach((file)=>{
            json[chunk.name + getExt(file)] = file;
            json[chunk.id + getExt(file)] = file;
            chunk.ids.forEach((id)=>{json[id + getExt(file)] = file});
          });
        });
        fs.writeFile(path.join(__dirname, dest, 'chunk-map.json'), JSON.stringify(json, null, 2));
      });
    }
  ])
}
module.exports = config;