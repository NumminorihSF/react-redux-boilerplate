require('babel-register');
const path = require('path');
const url = require('url');

const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

const configModule = require(path.join(process.cwd(), 'conf', 'webpack.config.babel'));
const config = configModule.default || configModule;
const port = process.env.PORT || 3000;

new WebpackDevServer(webpack(config), {
  proxy: {
    '/api': {
      target: `http://127.0.0.1:${process.env.PROXY_PORT || 3001}`,
    },
  },
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: true,
  disableHostCheck: true,
  compress: true,
  headers: { 'Access-Control-Allow-Origin': '*' },
  inline: true,
  lazy: false,
  contentBase: path.join(process.cwd(), 'src'),
  staticOptions: {
    '/assets': {},
    '/public': {},
  },
  setup: function (app) {
    app.use(function (req, res, next) {
      if (!/\/assets/.test(req.path)) return next();
      if (/^\/assets/.test(req.path)) return next();
      if (/^\/public/.test(req.path)) return next();
      return res.redirect(req.path.replace(/^.*\/assets/, '/assets'));
    });
  },
  stats: {
    colors: true,
    hash: true,
    timings: true,
    chunks: false,
  },
}).listen(port, '0.0.0.0', function (err) {
  if (err) {
    console.log(err);
  }

  console.log('Webpack dev server is listening at localhost:' + port);
}).on('connect', console.log);
