import path from 'path';
import webpack from 'webpack';
import WebpackChunkHash from 'webpack-chunk-hash';
import Config from 'webpack-config';

const { buildDestination: dest } = require('../../package.json');

export default new Config().extend('conf/[target]/webpack.base.config.js').merge({
  output: {
    filename: '[name]-[hash].js'
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.join(process.cwd(), dest, 'dll', '[name]-[hash].manifest.json'),
      name: '[name]_lib'
    }),
    new WebpackChunkHash({ algorithm: 'md5' }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    })
  ]
});
