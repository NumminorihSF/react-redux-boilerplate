const path = require('path');

const moment = require('moment');
const watch = require('watch'); // eslint-disable-line import/no-extraneous-dependencies

const { getUniqCommandRunner } = require('./utils');

const MODULE_NAME = '[STYLELINT]';
const FORMAT = '\\[hh:mm:ss\\]';
const [COMMAND, ...scriptArgs] = require('../package.json').scripts.stylelint.split(' ');
const ARGS = [...scriptArgs, ...process.argv.slice(2)];

const OPTIONS = {
  stdio: ['pipe', process.stdout, process.stderr],
};

const log = (string, ...rest) => {
  console.log(`${moment().format(FORMAT)} ${MODULE_NAME} - ${string}`, ...rest);
};


const run = getUniqCommandRunner(COMMAND, ARGS, OPTIONS, log);

watch.watchTree(path.join(__dirname, '../src'), { ignoreDotFiles: true }, run);
