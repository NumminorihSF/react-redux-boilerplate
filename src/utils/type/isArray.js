/** @flow */
/**
 * Checks if argument is an instance of Array.
 */
export default function isArray(arg: mixed) {
  return Object.prototype.toString.call(arg) === '[object Array]';
}
