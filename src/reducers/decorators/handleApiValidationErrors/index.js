/** @flow */
import type { Reducer } from 'redux';

import config from 'config';

import getValidationErrors from './getValidationErrors';
import getValidationDetails from './getValidationDetails';

type ActionType = Symbol | string
type ActionTypes = ActionType | ActionType[]

const { constants } = config;
const { API, STATE } = constants;
const { CODE, FIELD } = API;
const { VALIDATION } = STATE;


export default function handleApiValidationErrors(types: ActionTypes, originalReducer: Reducer<*, Object>) {
  if (!(originalReducer instanceof Function)) {
    throw new Error('Reducer should be a function');
  }

  let errorTypes: ActionType[];

  if (Array.isArray(types)) {
    errorTypes = types;
  } else {
    errorTypes = [types];
  }

  const reducer: Reducer<*, Object> = function reducer(state, action) {
    if (!errorTypes.includes(action.type)) return originalReducer(state, action);
    if (!action.response) return originalReducer(state, action);
    if (action.response.code !== CODE.VALIDATION_ERROR) return originalReducer(state, action);
    const nextState = state.merge({
      [VALIDATION.ERRORS_FIELD]: getValidationErrors(action.response[FIELD.VALIDATION_ERRORS]),
      [VALIDATION.DETAIL_FIELD]: getValidationDetails(action.response[FIELD.VALIDATION_DETAILS]),
      [VALIDATION.IS_VALID_FIELD]: false,
    });

    return originalReducer(nextState, action);
  };
  return reducer;
}

export const detailsField = VALIDATION.DETAIL_FIELD;
export const errorsField = VALIDATION.ERRORS_FIELD;
export const isValidField = VALIDATION.IS_VALID_FIELD;
