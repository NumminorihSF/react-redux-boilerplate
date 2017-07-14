require('babel-register');
const path = require('path');

const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

const configModule = require(path.join(process.cwd(), 'conf', 'webpack.config.babel'));
const config = configModule.default || configModule;
const port = process.env.PORT || 3000;

const TEMP_API_PREFIX = process.env.TEMP_API_PREFIX || '';
const prefixes = Object.keys(process.env)
  .filter(key => key.startsWith('EXTRA_TEMP_API_PREFIXES_'))
  .reduce((res, key) =>
    Object.assign({}, res, { [key.replace('EXTRA_TEMP_API_PREFIXES_', '')]: process.env[key] }), {});

const getProxyOptions = () => ({
  target: `http://127.0.0.1:${process.env.PROXY_PORT || 3001}`,
  secure: false,
  onProxyRes: function onProxyRes(proxyRes, req) {
    delete proxyRes.headers['Access-Control-Allow-Origin'];
    proxyRes.headers['Access-Control-Allow-Origin'] = `${req.protocol}://${req.hostname}`;
  },
});

const proxies = Object.keys(prefixes).reduce((proxs, prefix) => {
  const result = {
    [prefixes[prefix]]: getProxyOptions(),
  };
  return Object.assign({}, proxs, result);
}, { [TEMP_API_PREFIX]: getProxyOptions() });

new WebpackDevServer(webpack(config), {
  proxy: proxies,
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: true,
  compress: true,
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
}).listen(port, '127.0.0.1', function (err) {
  if (err) {
    console.log(err);
  }

  console.log('Webpack dev server is listening at localhost:' + port);
});
