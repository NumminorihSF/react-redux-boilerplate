/** @flow */
/**
 * Check if argument is an instance of Function.
 * @returns {boolean}
 */
export default function isFunction(arg: mixed): boolean {
  return Object.prototype.toString.call(arg) === '[object Function]';
}
