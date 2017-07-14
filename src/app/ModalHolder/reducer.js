import { fromJS } from 'immutable';

import { Priority } from './constants';
import * as ActionType from './actions';

const priorities = Object.values(Priority).sort((a, b) => a - b);

const defaultState = fromJS({
  queues: priorities.map(() => []),
});

function closeModalInQueue(state, popup, queueIndex) {
  return state.updateIn(
    ['queues', queueIndex],
    queue => (queue.getIn([0, 'id']) === popup ?
      queue.shift() : queue),
  );
}
function closeModal(state, action) {
  const { target } = action;
  if (target.priority !== undefined) {
    if (target.popup !== undefined) {
      return closeModalInQueue(state, target.popup, target.priority);
    }
    return state.updateIn(['queues', priorities.indexOf(target.priority)], queue => queue.shift());
  }
  if (target.popup !== undefined) {
    const queueIndex = state.get('queues').findIndex(queue => queue.getIn([0, 'id']) === target.popup);

    if (queueIndex !== undefined) {
      return closeModalInQueue(state, queueIndex, target.priority);
    }
  }
  return state;
}

function closeAllModal(state, action) {
  if (action.priority === undefined) return defaultState;
  const queueIndex = priorities.indexOf(action.priority);
  return state.updateIn(
    ['queues', queueIndex],
    defaultState.getIn(['queues', queueIndex]),
  );
}

export default function (state = defaultState, action) {
  switch (action.type) {
    case (ActionType.OPEN_MODAL):
      return state.updateIn(
        ['queues', priorities.indexOf(action.priority)],
        queue => queue.push(fromJS({ id: action.popup, props: action.props })),
      );

    case (ActionType.CLOSE_MODAL):
      return closeModal(state, action);

    case (ActionType.CLOSE_ALL_MODAL):
      return closeAllModal(state, action);

    default:
      return state;
  }
}
