"use strict";
require('babel-register');
const net = require('net');

const getPort = (function () {
  let portrange = 45032;
  return function getPort(cb) {
    const port = portrange;
    portrange += 1;
    const server = net.createServer();
    server.listen(port, function(err) {
      server.once('close', function() {
        cb(port);
      });
      server.close();
    });
    server.on('error', function(err) {
      getPort(cb);
    });
  };
}());

getPort(function(port) {
  const MOCK_PORT = port;
  require('./mock-server').start({ MOCK_PORT });
  require('./dev-server').start({ MOCK_PORT });
});

