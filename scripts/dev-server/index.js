"use strict";
require('babel-register');
const net = require('net');

const config = require('../../src/config').default || require('../../src/config');

const TEMP_API_PREFIX = '/---api-prefix-to-prevent-url-collisions---';

const API_BASE_URL = config.constants.API.BASE_URL;
const EXTRA_URL = config.constants.API.EXTRA_URL;
const BASE_PORT = process.env.PORT || 3000;
const EXTRA_TEMP_API_PREFIXES = Object.keys(EXTRA_URL)
  .reduce((res, key) => Object.assign({}, res, { [key]: `${TEMP_API_PREFIX}-${encodeURIComponent(key)}---` }), {});

const getPort = (function(){
  let portrange = 45032;
  return function getPort (cb) {
    const port = portrange;
    portrange += 1;
    let server = net.createServer();
    server.listen(port, function (err) {
      server.once('close', function () {
        cb(port);
      });
      server.close();
    });
    server.on('error', function (err) {
      getPort(cb);
    });
  }
})();

getPort(function(port){
  const PROXY_PORT = port;
  require('./proxy').start({ API_BASE_URL, EXTRA_URL, EXTRA_TEMP_API_PREFIXES, BASE_PORT, PROXY_PORT, TEMP_API_PREFIX });
  require('./webpack-server').start({ API_BASE_URL, EXTRA_URL, EXTRA_TEMP_API_PREFIXES, BASE_PORT, PROXY_PORT, TEMP_API_PREFIX });
});



