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
  inWork: boolean,
  maxCount: number,
  id: string,
}

export default function createQueue() {
  const queues: Map<string, Queue> = new Map();

  const getQueue = (queueId: string, maxCount): Queue => {
    const tempQueue: ?Queue = queues.get(queueId);
    if (!tempQueue) {
      const queue: Queue = {
        waiters: [],
        inWork: false,
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

  const removeExtraTask = (queue: Queue) => {
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
    const promise = queue.waiters.shift()();
    const promiseFinally = () => {
      queue.inWork = false;
      sanitizeQueue(queueId);
      return tryDoQueue(queueId);
    };
    return promise
      .then(promiseFinally)
      .catch(promiseFinally);
  };

  const appendToQueue = (queueId, maxCount, waiter) => {
    const queue = getQueue(queueId, maxCount);
    queue.waiters.push(waiter);
    return tryDoQueue(queueId);
  };

  function pushToQueue(queueId: string, maxCount: number = 1, promiseCreator: Function) {
    if (isFunction(maxCount)) return pushToQueue(queueId, 1, promiseCreator);
    if (maxCount < 1) throw new Error('Max count of waiters can\'t be less then 1.');
    return appendToQueue(queueId, maxCount, promiseCreator);
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
