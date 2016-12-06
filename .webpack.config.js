"use strict";
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
const isDevServerMode = process.env.NODE_ENV === 'dev-server';
const getStyleLoaders = ()=> {
    if (process.env.NODE_ENV === 'dev-server') {
        return 'style!css!postcss!csso!sass';
    }
    return ExtractTextPlugin.extract([
        'css-loader?importLoaders=3',
        'postcss-loader?importLoaders=2',
        'csso-loader?importLoaders=1',
        'sass-loader'
    ]);
};

const ChunkCreator = function() {
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
};

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
      'immutable',
      'react-router-redux',
      'bluebird',
      'redux-logger',
      'redux-thunk',
      'superagent',
      'redux',
      'react-dom',
      'humps'
    ]

  },

  output: {
    filename: 'app.js',
    path: path.join(__dirname, dest, 'public'),
    publicPath: '/public/',
    chunkFilename: "[name].js"
  },

  debug: true,
  plugins: [
    new webpack.DefinePlugin(define),
    new webpack.optimize.DedupePlugin(),
    new webpack.NoErrorsPlugin(),
    new HtmlWebpackPlugin({template: './src/index.html'})
  ],
  module: {
    loaders: [
      {
        test: /\.s?css$/,
        loader: getStyleLoaders()
      },
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel'
      },
      { test: /\.woff(\?.*)?$/,  loader: "file-loader?prefix=assets/fonts/&name=fonts/[name].[ext]&limit=10000&mimetype=application/font-woff" },
      { test: /\.woff2(\?.*)?$/, loader: "file-loader?prefix=assets/fonts/&name=fonts/[name].[ext]&limit=10000&mimetype=application/font-woff2" },
      { test: /\.ttf(\?.*)?$/,   loader: "file-loader?prefix=assets/fonts/&name=fonts/[name].[ext]&limit=10000&mimetype=application/octet-stream" },
      { test: /\.eot(\?.*)?$/,   loader: "file-loader?prefix=assets/fonts/&name=/fonts/[name].[ext]" },
      { test: /\.svg(\?.*)?$/,   loader: "file-loader?prefix=assets/fonts/&name=fonts/[name].[ext]&limit=10000&mimetype=image/svg+xml" },
      { test: /\.png(\?.*)?$/,   loader: "file-loader?prefix=img/&name=img/[name].[ext]&limit=10000&mimetype=image/png" }
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
  postcss: () => [autoprefixer],
  eslint: {
    configFile: path.join(__dirname, '.eslintrc.yml')
  }
};

if (isDevServerMode){
  config.entry.app = config.entry.app.concat([
      'webpack-dev-server/client',
      'webpack/hot/only-dev-server'
  ]);

  config.plugins = config.plugins.concat([
    new webpack.HotModuleReplacementPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'vendor.js'
    }),
    new ExtractTextPlugin("app.css"),
    function() {
      this.plugin("watch-run", function(w, cb) {
        return require('child_process').exec('npm run test:ci', function(err, stdout, stderr){
          if (err) {
            console.error('Tests are failed');
            console.log(stdout);
          }
          else console.log('Tests are completed');
          cb(null);
        });
      });
    }
  ]);

  config.output.publicPath = 'http://localhost:3000/';
  config.module.preLoaders = [
    {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'eslint'
    }
  ];
}
else if (isDebugMode) {

  config.plugins = config.plugins.concat([
    new webpack.HotModuleReplacementPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'vendor.js'
    }),
    new ExtractTextPlugin("app.css"),
    function() {
      this.plugin("watch-run", function(w, cb) {
        return require('child_process').exec('npm run test:ci', function(err, stdout, stderr){
          if (err) {
            console.error('Tests are failed');
            console.log(stdout);
          }
          else console.log('Tests are completed');
          cb(null);
        });
      });
    },
    ChunkCreator
  ]);

  config.output.publicPath = 'http://localhost:3000/';
  config.module.preLoaders = [
    {
      test: /\.jsx?$/,
      exclude: /(node_modules|bower_components)/,
      loader: 'eslint'
    }
  ];
  config.module.loaders[1].query = {
    "env": {
      "development": {
        "presets": ["react-hmre"]
      }
    }
  }
}
else {
  config.output.filename = 'app-[hash].js';

  config.plugins = config.plugins.concat([
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: '[name]-[hash].js'
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new ExtractTextPlugin("app-[hash].css"),
    ChunkCreator
  ])
}
module.exports = config;
