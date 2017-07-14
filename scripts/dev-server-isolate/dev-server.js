"use strict";
require('babel-register');
const path = require('path');
const cp = require('child_process');
const url = require('url');

const moment = require('moment');
const watch = require('watch');

const { getNpm } = require('../utils');
const config = require('../../src/config');

const MODULE_NAME = '[DEV_SERVER]';
const FORMAT = '\\[hh:mm:ss\\]';
const COMMAND = getNpm();
const ARGS = ['run', 'dev:server'];


const log = (string, ...rest) => {
  console.log(`${moment().format(FORMAT)} ${MODULE_NAME} - ${string}`, ...rest);
};

module.exports.start = function({ MOCK_PORT }) {
  log(`spawn "${COMMAND} ${ARGS}"`);

  const OPTIONS = {
    stdio: ['pipe', process.stdout, process.stderr],
    env: Object.assign({}, process.env, {
      API_BASE_URL: `http://127.0.0.1:${MOCK_PORT}/`,
    }),
  };

  const devServer = cp.spawn(COMMAND, ARGS, OPTIONS);

  devServer.on('close', (code) => {
    console.log(`dev:server process exited with code ${code}`);
    setImmediate(() => process.exit(code));
  });

  process.on('beforeExit', () => {
    devServer.close();
    devServer.kill();
  })
};
