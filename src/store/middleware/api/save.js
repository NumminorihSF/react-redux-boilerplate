/** @flow */
let saveTargeted;

const isCli = !(typeof process !== 'undefined' && process.versions && process.versions.node);

if (isCli) {
  // eslint-disable-next-line global-require
  saveTargeted = (require('./save.client').default: Function);
} else {
  // eslint-disable-next-line no-unused-vars
  saveTargeted = response => console.warn('not implemented');
}

export default function save(response: Object): void {
  saveTargeted(response);
}

