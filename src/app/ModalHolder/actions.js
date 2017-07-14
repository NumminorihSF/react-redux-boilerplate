/** @flow */
import type { TPriority } from './constants';
import { Priority } from './constants';

export const OPEN_MODAL = Symbol('OPEN_MODAL');
export const CLOSE_MODAL = Symbol('CLOSE_MODAL');
export const CLOSE_ALL_MODAL = Symbol('CLOSE_ALL_MODAL');

export function openModal(modal: string, modalProperties: Object = {}) {
  const { priority = Priority.DEFAULT }: { priority: TPriority } = modalProperties;
  return {
    type: OPEN_MODAL,
    modal,
    priority,
    props: { ...modalProperties, priority },
  };
}

export function closeModal(target: { modal?: string, priority?: TPriority } = {}) {
  return {
    type: CLOSE_MODAL,
    target,
  };
}

export function closeAllModal(priority?: TPriority) {
  return {
    type: CLOSE_ALL_MODAL,
    priority,
  };
}
