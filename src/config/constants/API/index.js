/** @flow */
let NO_CODE;

export default {
  BASE_URL: (process.env.API_BASE_URL === 'NO_BASE_URL' ? '' : process.env.API_BASE_URL) || 'http://localhost:3001',
  CODE: {
    SUCCESS: [
      'success',
      null,
      NO_CODE,
    ],
    ERROR: [
      'validation_error',
    ],
    VALIDATION_ERROR: 'validation_error',
  },
  FIELD: {
    VALIDATION_ERRORS: 'validationErrors',
    VALIDATION_DETAILS: 'detail',
  },
};
