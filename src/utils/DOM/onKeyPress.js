/** @flow */
const ANY_KEY = Symbol('ANY_KEY');

const realCallbacks: Map<Function, Function> = new Map();
const realKeyedCallbacks: Map<string, Map<Function, Function>> = new Map();
const noop = () => {};

function appendToAny(callback) {
  realCallbacks.set(callback, callback);
  return callback;
}

function removeFromAny(callback) {
  realCallbacks.delete(callback);
  return callback;
}

function getRealCallback(key, callback): Function {
  if (key === ANY_KEY) {
    return appendToAny(callback);
  }
  const k = ((key: any): string);
  if (!realKeyedCallbacks.has(k)) {
    realKeyedCallbacks.set(k, new Map());
  }

  const realCallback = function onKeyPressCallback(event: Event) {
    if (event.key === key) callback(event);
  };

  ((realKeyedCallbacks.get(k): any): Map<Function, Function>).set(callback, realCallback);

  return realCallback;
}

function getForRemoveRealCallback(key, callback): Function {
  if (key === ANY_KEY) {
    return removeFromAny(callback);
  }

  const k = ((key: any): string);
  if (!realKeyedCallbacks.has(k)) {
    return noop;
  }

  const realCallbackMap: Map<Function, Function> = realKeyedCallbacks.get(k) || new Map();

  const realCallback = realCallbackMap.get(callback) || noop;

  realCallbackMap.delete(callback);

  if (realCallbackMap.size === 0) {
    realKeyedCallbacks.delete(k);
  }

  return realCallback;
}

function ensureRunOnClient() {
  if (!document) throw new Error('Can be called only on client');
  if (!document.documentElement) throw new Error('Can be called only on client');
}

export function addListener(key: string | typeof ANY_KEY | Function, callback: Function) {
  if (typeof key === 'function') {
    addListener(ANY_KEY, ((key: any): Function));
    return;
  }
  ensureRunOnClient();

  (document.documentElement: any).addEventListener('keyup', getRealCallback(key, callback));
}

export function removeListener(key: string | typeof ANY_KEY | Function, callback: Function) {
  if (typeof key === 'function') {
    removeListener(ANY_KEY, ((key: any): Function));
    return;
  }
  ensureRunOnClient();

  (document.documentElement: any).removeEventListener('keyup', getForRemoveRealCallback(key, callback));
}
