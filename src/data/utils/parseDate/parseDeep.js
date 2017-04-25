/** @flow */
import parseDate from './parseDate';
import parseDeepObject, { setMainParser } from './parseDeepObject';

export default function parseDeep(something: mixed) {
  if (!something) {
    return something;
  } else if (typeof something === 'string') {
    return parseDate(something);
  } else if (Array.isArray(something)) {
    return something.map(parseDeep);
  } else if (typeof something === 'object') {
    return parseDeepObject(something);
  }

  return something;
}

setMainParser(parseDeep);
