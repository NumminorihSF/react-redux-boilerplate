
const noop = () => {};

export function preventStop(event) {
  // eslint-disable-next-line no-param-reassign
  event.stopPropagation = noop;
}

export function allowStop(event) {
  // eslint-disable-next-line no-param-reassign
  delete event.stopPropagation;
}
