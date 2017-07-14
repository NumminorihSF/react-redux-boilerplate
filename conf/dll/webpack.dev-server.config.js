import path from 'path';
import webpack from 'webpack';
import Config from 'webpack-config';

const { buildDestination: dest } = require('../../package.json');

export default new Config().extend('conf/[target]/webpack.base.config.js').merge({
  cache: true,
  output: {
    filename: '[name].js',
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.join(process.cwd(), dest, 'dll', '[name].manifest.json'),
      name: '[name]_lib',
    }),
  ],
});
