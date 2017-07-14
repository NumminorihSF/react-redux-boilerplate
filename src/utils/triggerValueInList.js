/** @flow */
import { List } from 'immutable';

import noop from './noop';

function plainValue(valueFromList, valueToCheck) {
  return valueFromList === valueToCheck;
}

function has(list, filter, value) {
  return list.some(v => filter(v, value));
}

function append(list, value) {
  if (Array.isArray(list)) return list.concat(value);
  return list.push(value);
}

const performMultiValueCheck = (function (isProd) {
  if (isProd) return noop;
  return function (list, filter, value) {
    let existCount = 0;
    list.forEach((localValue) => {
      if (filter(localValue, value)) {
        existCount++;
        if (existCount > 1) throw new Error('List has multi equal values.');
      }
    });
  };
}(process.env.NODE_ENV === 'production'));

function remove(list, value) {
  return list.filter(localValue => localValue !== value);
}

function canRemove(list, minimum) {
  if (Array.isArray(list)) {
    return list.length > minimum;
  }
  return list.size > minimum;
}

export function triggerByFilter(
  list: Array<*> | List<*>,
  filter: Function,
  value: *,
  { min = 0 }: { min: number } = { },
) {
  if (has(list, filter, value)) {
    performMultiValueCheck(list, filter, value);
    if (canRemove(list, min)) {
      return remove(list, value);
    }
    return list;
  }
  return append(list, value);
}

export default function triggerValueInList(list: Array<*> | List<*>, ...rest: Array<*>) {
  return triggerByFilter(list, plainValue, ...rest);
}

