import path from 'path';

import webpack from 'webpack';
import Config from 'webpack-config';

import ExtractTextPlugin from 'extract-text-webpack-plugin';
import WebpackChunkHash from 'webpack-chunk-hash';
import FaviconsWebpackPlugin from 'favicons-webpack-plugin';

import ClientChunkMapPlugin from './ClientChunkMapPlugin';

export default new Config().extend('conf/[target]/webpack.base.config.js').merge({
  output: {
    filename: 'app-[chunkhash].js',
  },
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            'css-loader?sourceMap&importLoaders=4&modules=true&localIdentName=[path][name]__[hash:base64:5]__[local]',
            'postcss-loader?sourceMap&importLoaders=3',
            'csso-loader?sourceMap&importLoaders=2',
            'resolve-url-loader?importLoaders=1',
            'sass-loader?sourceMap',
          ],
        }),
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            'css-loader?sourceMap&importLoaders=4',
            'postcss-loader?sourceMap&importLoaders=3',
            'csso-loader?sourceMap&importLoaders=2',
            'resolve-url-loader?importLoaders=1',
            'sass-loader?sourceMap',
          ],
        }),
      },
    ],
  },
  plugins: [
    new FaviconsWebpackPlugin({
      logo: path.join(process.cwd(), 'src/assets/favicon.png'),
      emitStats: true,
      title: 'Usummit',
      statsFilename: 'iconstats-[chunkhash].json',
      inject: true,
    }),
    new webpack.HashedModuleIdsPlugin(),
    new WebpackChunkHash(),
    new ExtractTextPlugin('app-[chunkhash].css'),
    new ClientChunkMapPlugin(),
  ],
});

