/** @flow */
import { Iterable } from 'immutable';

export default function (state: any) {
  if (process.env.NODE_ENV === 'production') return state;
  if (!Iterable.isIterable(state)) return state;

  const serialized = {};

  state.forEach((part, key) => Object.defineProperty(serialized, key, {
    get() {
      if (!Iterable.isIterable(part)) return part;
      return part.toJS();
    },
    enumerable: true,
  }));

  return serialized;
}
