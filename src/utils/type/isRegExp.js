/** @flow */
/**
 * Check if argument is an instance of RegExp.
 */
export default function isRegExp(arg: mixed) {
  return Object.prototype.toString.call(arg) === '[object RegExp]';
}
