/** @flow */
// don't remove dotsm because it'll break the help:me script.
import getCurrent from '../../../utils/URL/getCurrent';
import getURL from '../../../utils/URL/getURL';

let NO_CODE;

const DEFAULT_URL = 'http://127.0.0.1:3001';

const getFormattedUrl = (base) => {
  if (process.env.NODE_ENV !== 'dev-server') {
    return base || DEFAULT_URL;
  }

  const current = getCurrent();

  if (!base) {
    current.pathname = '';
  }
  const url = getURL(
    (((base: any) || DEFAULT_URL): string),
  );
  url.protocol = current.protocol;
  url.hostname = current.hostname;

  if (current.port) {
    url.port = current.port;
  }

  return url.href;
};

const getBaseUrl = () => {
  if (process.env.API_BASE_URL === 'NO_BASE_URL') return DEFAULT_URL;
  return getFormattedUrl(process.env.API_BASE_URL);
};

const getExtraUrl = () => Object.keys(process.env)
  .filter(key => key.startsWith('EXTRA_URL_'))
  .reduce((result, key) => {
    const nextKey = key.replace('EXTRA_URL_', '');
    return {
      ...result,
      [nextKey]: getFormattedUrl(process.env[key]).replace(/\/$/, ''),
    };
  }, {});

export default {
  BASE_URL: getBaseUrl(),
  EXTRA_URL: getExtraUrl(),
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
