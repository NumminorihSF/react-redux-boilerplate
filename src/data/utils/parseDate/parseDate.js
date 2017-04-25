/** @flow */
import moment from 'moment';

export default function parseDate(something: string) {
  const date = moment(something);
  if (date.isValid()) {
    return date;
  }

  return something;
}
