/** @flow */

export default function deepFreeze(smth: *) {
  if (smth) {
    if (typeof smth === 'object') {
      if (smth instanceof RegExp) return smth;
      Object.freeze(smth);
      Object.keys(smth).forEach(key => deepFreeze(smth[key]));
    }
  }
  return smth;
}
