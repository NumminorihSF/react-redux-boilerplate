/** @flow */
let getURLTargeted;

const isCli = !(typeof process !== 'undefined' && process.versions && process.versions.node);

if (isCli) {
  // eslint-disable-next-line global-require
  getURLTargeted = (require('./getURL.client').default: Function);
} else {
  // eslint-disable-next-line global-require
  getURLTargeted = (require('./getURL.server').default: Function);
}

export default function getURL(stringToParse: string): window.URL {
  return getURLTargeted(stringToParse);
}
