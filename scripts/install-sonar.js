const fs = require('fs');
const path = require('path');
const cp = require('child_process');
const repo = require(path.join(__dirname, '../package.json'));

const rules = [
  /\beslint\b/,
  /\bsonar\b/,
  /\bsonarqube\b/,
];

if (!('devDependencies' in repo)) {
  throw new Error('Need devDependencies to run this script.');
}

const deps = Object.keys(repo.devDependencies)
  .filter(function(dependency){
    return rules.some(function(rule) {
      return rule.test(dependency);
    });
  })
  .map(function(dependency) {
    return `${dependency}@${repo.devDependencies[dependency]}`;
  })
  .join(' ');

const command = `npm install ${deps}`;

console.log(`run "${command}"`);

const child = cp.exec(command);
process.on('beforeExit', () => child.kill());

