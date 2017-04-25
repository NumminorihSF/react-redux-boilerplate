/** @flow */
let parseDeepDates: Function;

const objectProto = Object.getPrototypeOf({});

export default function parseDeepDatesFromObject(something: Object): Object {
  if (Object.getPrototypeOf(something) === objectProto) {
    return Object.keys(something).reduce((result, key) => ({
      ...result,
      [key]: parseDeepDates(something[key]),
    }), {});
  }

  return something;
}

export function setMainParser(parser: Function) {
  parseDeepDates = parser;
}
