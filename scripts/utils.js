const cp = require('child_process');
const os = require('os');

let npm = 'npm';
if (os.platform() === 'win32') npm = 'npm.cmd';

function getNpm() {
  return npm;
}

function sleep(timer) {
  return new Promise(resolve => setTimeout(resolve, timer));
}

const SLEEP_TIME = Number(process.env.SLEEP_TIME) || 0;

exports.getNpm = getNpm;

exports.getUniqCommandRunner = function getUniqCommandRunner(COMMAND, ARGS, OPTIONS, log = console.log) {
  const waiters = [];
  let promise = Promise.resolve();
  let firstRun = true;
  return function () {
    let command = COMMAND;
    if (command === 'npm') command = getNpm();
    waiters.push((resolve) => {
      log(`start "${command} ${ARGS.join(' ')}"`);
      cp.spawn(command, ARGS, OPTIONS)
        .once('close', () => {
          log('end');
          resolve();
        });
    });
    promise.then(() => {
      if (!waiters.length) return;
      const last = waiters.pop();
      waiters.length = 0;
      if (firstRun) {
        firstRun = false;
        promise = new Promise(last);
      } else {
        promise = sleep(SLEEP_TIME).then(() => new Promise(last));
      }
    });
  };
};

exports.sleep = sleep;
