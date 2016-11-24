var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');
var port = process.env.PORT || 3000;
var path = require('path');

new WebpackDevServer(webpack(config), {
  proxy: {
    '/api': {
      target: process.env.API_BASE_URL,
      secure: false
    }
  },
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: true,
  compress: true,
  headers: {'Access-Control-Allow-Origin': '*'},
  inline: true,
  lazy: false,
  contentBase: path.join(__dirname, 'src'),
  staticOptions: {
    '/assets': {},
    '/public': {}
  },
  stats: {
    colors: true,
    hash: true,
    timings: true,
    chunks: false
  }
}).listen(port, 'localhost', function (err) {
  if (err) {
    console.log(err)
  }

  console.log('Webpack dev server is listening at localhost:' + port)
});
