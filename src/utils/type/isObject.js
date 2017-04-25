/** @flow */
/**
 * Check if argument is an instance of Object.
 */
export default function isObject(arg: mixed) {
  return Object.prototype.toString.call(arg) === '[object Object]';
}
