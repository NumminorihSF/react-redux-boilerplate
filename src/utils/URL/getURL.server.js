/** @flow */
const url = require('url');

export default function getURL(stringToParse: string): URL {
  return (url.parse(stringToParse): any);
}

