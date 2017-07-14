/** @flow */
const catchers = new Set();
let catchersArr = Array.from(catchers);

function ensureRunOnClient() {
  if (!document) throw new Error('Can be called only on client');
  if (!document.documentElement) throw new Error('Can be called only on client');
}

function isCatcher(element: HTMLElement) {
  return catchers.has(element);
}

function isInCatcher(element: HTMLElement) {
  return catchersArr.some(catcher => catcher.contains(element));
}

export function addListener(callback: Function) {
  ensureRunOnClient();
  (document.documentElement: any).addEventListener('click', callback);
}

export function isOnElement(event: Event, element: ?HTMLElement): boolean {
  if (!event.target) return false;
  const target: any = event.target;
  if (!element) return false;
  if (isInCatcher(target)) return true;
  if (isCatcher(element)) return true;
  return element.contains(target);
}

export function removeListener(callback: Function) {
  ensureRunOnClient();
  (document.documentElement: any).removeEventListener('click', callback);
}

export function addCatcher(element: HTMLElement) {
  catchers.add(element);
  catchersArr = Array.from(catchers);
}

export function removeCatcher(element: HTMLElement) {
  catchers.delete(element);
  catchersArr = Array.from(catchers);
}
