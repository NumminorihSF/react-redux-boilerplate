"use strict";
require('babel-register');
const path = require('path');
const cp = require('child_process');
const url = require('url');

const moment = require('moment');
const watch = require('watch');

const { getNpm } = require('../utils');
const config = require('../../src/config');

const MODULE_NAME = '[MOCK_SERVER]';
const FORMAT = '\\[hh:mm:ss\\]';
const COMMAND = getNpm();
const ARGS = ['run', 'mock:server'];


const log = (string, ...rest) => {
  console.log(`${moment().format(FORMAT)} ${MODULE_NAME} - ${string}`, ...rest);
};

module.exports.start = function( { MOCK_PORT }){
  log(`spawn "${COMMAND} ${ARGS}"`);

  const OPTIONS = {
    stdio: ['pipe', process.stdout, process.stderr],
    env: Object.assign({}, process.env, {
      PORT: MOCK_PORT,
    }),
  };

  const webpack = cp.spawn(COMMAND, ARGS, OPTIONS);
  log(`run mock-server on port ${MOCK_PORT}`);

  webpack.on('close', (code) => {
    console.log(`mock process exited with code ${code}`);
    setImmediate(() => process.exit(code));
  });
  process.on('beforeExit', () => {
    webpack.close();
    webpack.kill();
  })
};
