/** @flow */
import React from 'react';
import type { Element } from 'react';

export default function displayLineBreaks(value: string): Array<Element<*> | string> {
  // eslint-disable-next-line react/no-array-index-key
  return value.split('\n').map((line, index) => <div key={index}>{line}</div>);
}
