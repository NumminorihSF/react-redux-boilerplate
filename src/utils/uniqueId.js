/** @flow */
const defaultPrefix = 'application_id__';
let increment = 1;

export default function uniqueId(prefix: string = defaultPrefix) {
  return `${prefix}${Date.now()}_${increment++}`;
}

