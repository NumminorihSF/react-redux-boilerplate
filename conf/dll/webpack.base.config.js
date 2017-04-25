import path from 'path';
import webpack from 'webpack';
import Config from 'webpack-config';
import ChunkMapPlugin from './ChunkMapPlugin';

const { buildDestination: dest } = require('../../package.json');

const define = {
  'process.env': {
    NODE_ENV: JSON.stringify(process.env.NODE_ENV),
    API_BASE_URL: JSON.stringify(process.env.API_BASE_URL || null),
    ON_SERVER: 'false',
    RUN_TYPE: JSON.stringify('client'),
    OPBEAT_ORG_ID: JSON.stringify(process.env.OPBEAT_ORG_ID),
    OPBEAT_APP_ID: JSON.stringify(process.env.OPBEAT_APP_ID),
  },
  'process.env.OPBEAT_APP_ID': JSON.stringify(process.env.OPBEAT_APP_ID),
  'NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  'ON_SERVER': 'false',
  'RUN_TYPE': JSON.stringify('client'),
  'GLOBAL': 'window',
  'global': 'window'
};


export default new Config().merge({
  devtool: 'source-map',
  entry: {
    react: [
      'react',
      'react-dom',
      'classnames',
    ],
    router: [
      'react-router',
      'react-helmet',
      'react-router-redux',
    ],
    components: [
      'react-select',
      'react-bootstrap-table',
      'react-portal',
    ],
    redux: [
      'redux',
      'redux-form',
      'redux-immutable',
      'redux-logger',
      'redux-thunk',
    ],
    rest: [
      'immutable',
      'bluebird',
      'superagent',
      'underscore',
      'moment',
      'humps',
      'reselect',
    ],
  },

  output: {
    filename: '[name].js',
    path: path.join(process.cwd(), dest, 'dll'),
    chunkFilename: "[name]-[hash].js",
    library: '[name]_lib'
  },

  plugins: [
    new webpack.LoaderOptionsPlugin({
      debug: true
    }),
    new webpack.DefinePlugin(define),
    new webpack.NoEmitOnErrorsPlugin(),
    new ChunkMapPlugin()
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel'
      }
    ]
  }
});
