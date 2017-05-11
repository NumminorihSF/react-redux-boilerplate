"use strict";
require('babel-register');
const net = require('net');
const localtunnel = require('localtunnel');

const config = require('../../src/config').default || require('../../src/config');

const REAL_API_BASE_URL = config.API_BASE_URL;

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

require('./dll').start();


getPort(function(BASE_PORT) {
  const tunnel = localtunnel(BASE_PORT, {}, function(err, tunnel) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    const API_BASE_URL = tunnel.url;

    console.log(`========================================`);
    console.log(`========================================`);
    console.log(`========================================`);
    console.log(`GO TO ${API_BASE_URL}`);
    console.log(`========================================`);
    console.log(`========================================`);
    console.log(`========================================`);

    getPort(function(PROXY_PORT) {
      require('./proxy').start({ API_BASE_URL: REAL_API_BASE_URL, BASE_PORT, PROXY_PORT });
      require('./webpack-server').start({ API_BASE_URL, BASE_PORT, PROXY_PORT });
    });
  });

  tunnel.on('close', function(){
    process.exit();
  });
});
