"use strict";
const fs = require('fs');
const path = require('path');
const cp = require('child_process');

const moment = require('moment');
const watch = require('watch');

const { getNpm } = require('../utils');

const MODULE_NAME = '[DLL]';
const FORMAT = '\\[hh:mm:ss\\]';
const COMMAND = `${getNpm()} run build:target:dll`;


const log = (string, ...rest) => {
  console.log(`${moment().format(FORMAT)} ${MODULE_NAME} - ${string}`, ...rest);
};



const rebuild = (() => {
  let waiters = [];
  let promise = Promise.resolve();
  return function(){
    waiters.push(function(resolve){
      log(`start "${COMMAND}"`);
      cp.exec(COMMAND, {
        cwd: process.cwd()
      },function (error) {
        resolve();
        if (error) {
          console.error(``);
          console.error(error);
        }
        log('end');
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

module.exports.start = function() {
  watch.watchTree(path.join(__dirname, '../../node_modules'), { ignoreDotFiles: true }, rebuild);
};
