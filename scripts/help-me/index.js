"use strict";
require('babel-register');
const net = require('net');
const localtunnel = require('localtunnel');

const config = require('../../src/config').default || require('../../src/config');

const TEMP_API_PREFIX = '/---api-prefix-to-prevent-url-collisions---';
const REAL_API_BASE_URL = config.constants.API.BASE_URL;

const REAL_EXTRA_URL = config.constants.API.EXTRA_URL;
const EXTRA_TEMP_API_PREFIXES = Object.keys(REAL_EXTRA_URL)
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


getPort(function(BASE_PORT) {
  const tunnel = localtunnel(BASE_PORT, {}, function(err, tunnel) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    const API_BASE_URL = tunnel.url;
    const EXTRA_URL = Object.keys(REAL_EXTRA_URL)
      .reduce((res, key) => Object.assign({}, res, { [key]: API_BASE_URL }), {});

    const displayLink = () => {
      console.log(`========================================`);
      console.log(`========================================`);
      console.log(`========================================`);
      console.log(`GO TO ${API_BASE_URL}`);
      console.log(`========================================`);
      console.log(`========================================`);
      console.log(`========================================`);
      setTimeout(displayLink, 30000);
    };

    displayLink();

    getPort(function(PROXY_PORT) {
      require('./proxy').start({ API_BASE_URL: REAL_API_BASE_URL, EXTRA_URL: REAL_EXTRA_URL, EXTRA_TEMP_API_PREFIXES, BASE_PORT, PROXY_PORT, TEMP_API_PREFIX });
      require('./webpack-server').start({ API_BASE_URL, EXTRA_URL, EXTRA_TEMP_API_PREFIXES, BASE_PORT, PROXY_PORT, TEMP_API_PREFIX });
    });
  });

  tunnel.on('close', function(){
    process.emit('SIGINT');
  });
});
