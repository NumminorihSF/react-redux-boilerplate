const cp = require('child_process');
const path = require('path');

const moment = require('moment');
const { getNpm } = require('./utils');

const MODULE_NAME = '[LINT]';
const FORMAT = '\\[hh:mm:ss\\]';

const OPTIONS = {
  stdio: ['pipe', process.stdout, process.stderr],
};

const log = (string, ...rest) => {
  console.log(`${moment().format(FORMAT)} ${MODULE_NAME} - ${string}`, ...rest);
};

const checkBranch = () => {
  if (process.env.SKIP_PREPUSH) return process.exit(0);
  return Promise.resolve();
};

const buildDll = () => {
  const COMMAND = getNpm();
  const ARGS = ['run', 'build:target:dll'];
  return new Promise((resolve) => {
    log(`start "${COMMAND} ${ARGS.join(' ')}"`);
    cp.spawn(COMMAND, ARGS, OPTIONS)
      .once('exit', (code) => {
        log('end');
        if (code !== 0) {
          process.exit(code);
        } else {
          resolve();
        }
      });
  });
};

const buildDllIfNeed = () => new Promise((resolve) => {
  require(path.join(__dirname, '../build/dll/chunk-map.json'));
  resolve();
}).catch(err => {
  console.warn(err);
  log('Try build dll');
  return buildDll();
});


const beforeTypeCheck = () => {
  const COMMAND = getNpm();
  const ARGS = ['run', 'flow:prepare'];
  return new Promise((resolve) => {
    log(`start "${COMMAND} ${ARGS.join(' ')}"`);
    cp.spawn(COMMAND, ARGS, OPTIONS)
      .once('exit', (code) => {
        log('end');
        if (code !== 0) {
          process.exit(code);
        } else {
          resolve();
        }
      });
  });
};

const typeCheck = () => {
  const COMMAND = getNpm();
  const ARGS = ['run', 'flow'];
  return new Promise((resolve) => {
    log(`start "${COMMAND} ${ARGS.join(' ')}"`);
    cp.spawn(COMMAND, ARGS, OPTIONS)
      .once('exit', (code) => {
        log('end');
        if (code !== 0) {
          process.exit(code);
        } else {
          resolve();
        }
      });
  });
};

const lint = () => {
  const COMMAND = getNpm();
  const ARGS = ['run', 'lint'];
  return new Promise((resolve) => {
    log(`start "${COMMAND} ${ARGS.join(' ')}"`);
    cp.spawn(COMMAND, ARGS, OPTIONS)
      .once('exit', (code) => {
        log('end');
        if (code !== 0) {
          process.exit(code);
        } else {
          resolve();
        }
      });
  });
};

const stylelint = () => {
  const COMMAND = getNpm();
  const ARGS = ['run', 'stylelint'];
  return new Promise((resolve) => {
    log(`start "${COMMAND} ${ARGS.join(' ')}"`);
    cp.spawn(COMMAND, ARGS, OPTIONS)
      .once('exit', (code) => {
        log('end');
        if (code !== 0) {
          process.exit(code);
        } else {
          resolve();
        }
      });
  });
};

const test = () => {
  const COMMAND = getNpm();
  const ARGS = ['run', 'test'];
  return new Promise((resolve) => {
    log(`start "${COMMAND} ${ARGS.join(' ')}"`);
    cp.spawn(COMMAND, ARGS, OPTIONS)
      .once('exit', (code) => {
        log('end');
        if (code !== 0) {
          process.exit(code);
        } else {
          resolve();
        }
      });
  });
};

checkBranch()
  .then(buildDllIfNeed)
  .then(lint)
  .then(stylelint)
  .then(test);
