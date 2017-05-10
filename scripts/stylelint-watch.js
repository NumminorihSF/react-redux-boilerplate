"use strict";
const fs = require('fs');
const path = require('path');
const cp = require('child_process');

const moment = require('moment');
const watch = require('watch');

const { getNpm } = require('./utils');

const MODULE_NAME = '[STYLELINT]';
const FORMAT = '\\[hh:mm:ss\\]';
const [ COMMAND, ...scriptArgs ] = require('../package.json').scripts.stylelint.split(' ');
const ARGS = [...scriptArgs, ...process.argv.slice(2)];

const OPTIONS = {
  stdio: ['pipe', process.stdout, process.stderr]
};

const log = (string, ...rest) => {
  console.log(`${moment().format(FORMAT)} ${MODULE_NAME} - ${string}`, ...rest);
};


const stylelint = (() => {
  let waiters = [];
  let promise = Promise.resolve();
  return function(){
    let command = COMMAND;
    if (command === 'npm') command = getNpm();
    waiters.push(function(resolve){
      log(`start "${command} ${ARGS.join(' ')}"`);
      cp.spawn(command, ARGS, OPTIONS)
        .once('close', function(){
          log('end');
          resolve();
        });
    });
    promise.then(function(){
      if (waiters.length){
        const last = waiters.pop();
        waiters.length = 0;
        return promise = new Promise(last);
      }
    });
  }
})();

watch.watchTree(path.join(__dirname, '../src'), { ignoreDotFiles: true }, stylelint);


