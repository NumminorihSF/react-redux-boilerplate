"use strict";
require('babel-register');
const net = require('net');

const config = require('../../src/config').default || require('../../src/config');

const API_BASE_URL = config.API_BASE_URL;
const BASE_PORT = process.env.PORT || 3000;

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
getPort(function(port){
  const PROXY_PORT = port;
  require('./proxy').start({ API_BASE_URL, BASE_PORT, PROXY_PORT });
  require('./webpack-server').start({ API_BASE_URL, BASE_PORT, PROXY_PORT });
});



