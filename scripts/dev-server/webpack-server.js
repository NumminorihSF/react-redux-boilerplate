require('babel-register');
const cp = require('child_process');

const moment = require('moment');

const { getNpm } = require('../utils');

const MODULE_NAME = '[WEBPACK_DEV_SERVER]';
const FORMAT = '\\[hh:mm:ss\\]';
const COMMAND = getNpm();
const ARGS = ['run', '_dev:server'];


const log = (string, ...rest) => {
  console.log(`${moment().format(FORMAT)} ${MODULE_NAME} - ${string}`, ...rest);
};

const logErr = (string, ...rest) => {
  console.error(`${moment().format(FORMAT)} ${MODULE_NAME} - ${string}`, ...rest);
};

module.exports.start = function ({ BASE_PORT, PROXY_PORT }) {
  log(`spawn "${COMMAND} ${ARGS}"`);

  const OPTIONS = {
    stdio: ['pipe', process.stdout, process.stderr],
    env: Object.assign({}, process.env, {
      PROXY_PORT,
      API_BASE_URL: `http://127.0.0.1:${BASE_PORT}`,
    }),
  };

  const webpack = cp.spawn(COMMAND, ARGS, OPTIONS);
  log(`run webpack-dev-server on port ${PROXY_PORT}`);

  webpack.on('error', (err) => {
    logErr(err);
    process.exit(1);
  });
  webpack.on('close', (code) => {
    console.log(`webpack process exited with code ${code}`);
    setImmediate(() => process.exit(code));
  });

  process.on('beforeExit', () => {
    webpack.close();
    webpack.kill();
  });
};
