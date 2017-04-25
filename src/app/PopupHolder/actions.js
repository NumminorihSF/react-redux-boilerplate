/** @flow */
export const OPEN_POPUP = Symbol('OPEN_POPUP');
export const CLOSE_POPUP = Symbol('CLOSE_POPUP');
export const CLOSE_ALL_POPUP = Symbol('CLOSE_ALL_POPUP');

export function openPopup(popup: string) {
  return {
    type: OPEN_POPUP,
    popup,
  };
}

export function closePopup() {
  return {
    type: CLOSE_POPUP,
  };
}

export function closeAllPopup() {
  return {
    type: CLOSE_ALL_POPUP,
  };
}
