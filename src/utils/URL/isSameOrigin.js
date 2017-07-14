/** @flow */
import 'url-polyfill';
import getCurrent from './getCurrent';

export default function isSameOrigin(urlToCheck: window.URL, baseUrl: window.URL = getCurrent()) {
  let result = false;
  try {
    result = urlToCheck.origin === baseUrl.origin;
  } catch (e) {
    throw new Error('You are trying to check invalid URL object');
  }
  return result;
}
