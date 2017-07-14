/** @flow */
export type TPriority = 0 | 50 | 100 | 150;

const IF_EMPTY = 0;
const DEFAULT = 50;
const HIGH = 100;
const HIGHEST = 150;

// eslint-disable-next-line import/prefer-default-export
export const Priority: { [string]: TPriority } = {
  IF_EMPTY,
  DEFAULT,
  HIGH,
  HIGHEST,
};
