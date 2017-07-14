import path from 'path';

import webpack from 'webpack';
import Config from 'webpack-config';

import HtmlWebpackPlugin from 'html-webpack-plugin';
import AddAssetHtmlPlugin from 'add-asset-html-webpack-plugin';

import dllConfig from '../dll/webpack.base.config';

const { buildDestination: dest } = require('../../package.json');

const chunkMap = require(path.join(process.cwd(), dest, 'dll', 'chunk-map.json'));

const urls = Object.keys(process.env)
  .filter(key => key.startsWith('EXTRA_URL_'))
  .reduce((result, key) => Object.assign({}, result, { [key]: JSON.stringify(process.env[key]) }), {});

const define = {
  'process.env.OPBEAT_APP_ID': JSON.stringify(process.env.OPBEAT_APP_ID),
  'process.env.OPBEAT_ORG_ID': JSON.stringify(process.env.OPBEAT_ORG_ID),
  'process.env.BING_API_KEY': JSON.stringify(process.env.BING_API_KEY),
  'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  'process.env': Object.assign({
    NODE_ENV: JSON.stringify(process.env.NODE_ENV),
    API_BASE_URL: JSON.stringify(process.env.API_BASE_URL || null),
    ON_SERVER: 'false',
    RUN_TYPE: JSON.stringify('client'),
    BING_API_KEY: JSON.stringify(process.env.BING_API_KEY),
    OPBEAT_ORG_ID: JSON.stringify(process.env.OPBEAT_ORG_ID),
    OPBEAT_APP_ID: JSON.stringify(process.env.OPBEAT_APP_ID),
  }, urls),
  OPBEAT_ORG_ID: JSON.stringify(process.env.OPBEAT_ORG_ID),
  OPBEAT_APP_ID: JSON.stringify(process.env.OPBEAT_APP_ID),
  NODE_ENV: JSON.stringify(process.env.NODE_ENV),
  ON_SERVER: 'false',
  RUN_TYPE: JSON.stringify('client'),
  GLOBAL: 'window',
  global: 'window',
};


const dllPlugins = Object.keys(dllConfig.entry).map((entry) => {
  const entryName = chunkMap[entry];
  return new webpack.DllReferencePlugin({
    context: '.',
    manifest: require(path.join(process.cwd(), dest, 'dll', `${entryName}.manifest.json`)),
  });
});

const dllAssetsPlugins = Object.keys(dllConfig.entry).map((entry) => {
  const entryName = chunkMap[entry];
  return new AddAssetHtmlPlugin({
    filepath: require.resolve(path.join(process.cwd(), dest, 'dll', `${entryName}.js`)),
  });
});

export default new Config().merge({
  devtool: 'source-map',
  resolve: {
    modules: [path.resolve(process.cwd(), 'src'), 'node_modules'],
  },
  entry: {
    app: [
      'babel-polyfill',
      './src/client.js',
    ],
  },

  output: {
    filename: 'app.js',
    path: path.join(process.cwd(), dest, 'public'),
    publicPath: '/public/',
    chunkFilename: '[name].js',
  },

  plugins: [
    ...dllPlugins,
    new webpack.LoaderOptionsPlugin({
      debug: true,
    }),
    new webpack.DefinePlugin(define),
    new webpack.NoEmitOnErrorsPlugin(),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      chunksSortMode: 'dependency',
    }),
    ...dllAssetsPlugins,
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          'babel-loader',
        ],
      },
      {
        test: /\.woff(\?.*)?$/,
        loader: 'file-loader?prefix=assets/fonts/&name=fonts/[name].[ext]&limit=10000&mimetype=application/font-woff',
      },
      {
        test: /\.woff2(\?.*)?$/,
        loader: 'file-loader?prefix=assets/fonts/&name=fonts/[name].[ext]&limit=10000&mimetype=application/font-woff2',
      },
      {
        test: /\.ttf(\?.*)?$/,
        loader: 'file-loader?prefix=assets/fonts/&name=fonts/[name].[ext]&limit=10000&mimetype=application/octet-stream',
      },
      {
        test: /\.eot(\?.*)?$/,
        loader: 'file-loader?prefix=assets/fonts/&name=/fonts/[name].[ext]',
      },
      {
        test: /\.svg(\?.*)?$/,
        loader: 'file-loader?prefix=assets/fonts/&name=fonts/[name].[ext]&limit=10000&mimetype=image/svg+xml',
      },
      {
        test: /\.png(\?.*)?$/,
        loader: 'file-loader?prefix=img/&name=img/[name].[ext]&limit=10000&mimetype=image/png',
      },
      {
        test: /\.jpe?g(\?.*)?$/,
        loader: 'file-loader?prefix=img/&name=img/[name].[ext]&limit=10000&mimetype=image/jpeg',
      },
      {
        test: /\.gif(\?.*)?$/,
        loader: 'file-loader?prefix=img/&name=img/[name].[ext]&limit=10000&mimetype=image/gif',
      },
    ],
  },
});
