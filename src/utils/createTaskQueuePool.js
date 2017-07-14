/** @flow */
import isFunction from 'utils/type/isFunction';

export function AbortingError(message: string) {
  if (!Error.captureStackTrace) this.stack = (new Error()).stack;
  else Error.captureStackTrace(this, this.constructor);
  this.message = message;
}

(AbortingError: any).prototype = new Error();
AbortingError.prototype.name = 'AbortingError';
AbortingError.prototype.constructor = AbortingError;

type Queue = {
  waiters: Function[],
  currentWorker: ?{ then: Function, abort?: Function, 'catch': Function },
  inWork: boolean,
  maxCount: number,
  dislodging: boolean,
  id: string,
}

export default function createTaskQueuePool() {
  const queues: Map<string, Queue> = new Map();

  const getQueue = (queueId: string, maxCount: number, dislodging): Queue => {
    const tempQueue: ?Queue = queues.get(queueId);
    if (!tempQueue) {
      const queue: Queue = {
        waiters: [],
        inWork: false,
        currentWorker: null,
        dislodging,
        maxCount,
        id: queueId,
      };
      queues.set(queueId, queue);
      return queue;
    }
    return tempQueue;
  };

  const sanitizeQueue = (queueId) => {
    const queue: ?Queue = queues.get(queueId);
    if (!queue) return;
    if (queue.waiters.length > 0 || queue.inWork) return;
    queues.delete(queueId);
  };

  const closeCurrentTaskIfNeed = (queue) => {
    if (!queue.dislodging) return queue;
    if (queue.inWork === false) return queue;
    if (!queue.currentWorker) {
      console.warn('Unexpected empty current worker on isWork = true.');
      return queue;
    }
    if (!queue.currentWorker.abort) {
      console.warn('Expect #abort() method in currentWorker, but found nothing.');
      return queue;
    }
    try {
      queue.currentWorker.abort();
      // eslint-disable-next-line no-param-reassign
      queue.inWork = false;
    } catch (e) {
      console.warn(e);
    }
    return queue;
  };

  const removeExtraTask = (queue: Queue) => {
    closeCurrentTaskIfNeed(queue);
    let { maxCount } = queue;
    const { waiters, inWork } = queue;
    if (inWork) maxCount--;
    while (waiters.length && waiters.length > maxCount) {
      const taskCreator = waiters.shift();
      try {
        taskCreator(new AbortingError('Aborting by rules'));
      } catch (e) {
        console.error(`Failed remove task from queue by call with aborting error as first argument.\n${e}`);
      }
    }
  };

  const tryDoQueue = (queueId) => {
    const queue: ?Queue = queues.get(queueId);
    if (!queue) return Promise.resolve();
    removeExtraTask(queue);
    if (queue.inWork) return Promise.resolve();
    queue.inWork = !!queue.waiters.length;
    const promiseLikeObject = queue.waiters.shift()();
    queue.currentWorker = promiseLikeObject;
    const promiseFinally = () => {
      queue.inWork = false;
      queue.currentWorker = null;
      sanitizeQueue(queueId);
      return tryDoQueue(queueId);
    };
    return promiseLikeObject
      .then(promiseFinally)
      .catch(promiseFinally);
  };

  const appendToQueue = (queueId, maxCount, waiter, dislodging) => {
    const queue = getQueue(queueId, maxCount, dislodging);
    queue.waiters.push(waiter);
    return tryDoQueue(queueId);
  };

  function pushToQueue(
    queueId: string,
    maxCount: number | Function = 1,
    promiseCreator: Function | boolean,
    dislodging: boolean = false,
  ) {
    if (isFunction(maxCount)) {
      return pushToQueue(queueId, 1, ((maxCount: any): Function), ((promiseCreator: any): boolean));
    }
    if (((maxCount: any): number) < 1) {
      throw new Error('Max count of waiters can\'t be less then 1.');
    }
    return appendToQueue(queueId, ((maxCount: any): number), ((promiseCreator: any): Function), dislodging);
  }

  return {
    push: pushToQueue,
    append: pushToQueue,
    clear: function clear(queueId: string | void) {
      if (typeof queueId === 'undefined') queues.clear();
      else queues.delete(queueId);
    },
  };
}
