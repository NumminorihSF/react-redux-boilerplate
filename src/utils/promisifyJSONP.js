/** @flow */
import uniqueId from './uniqueId';
import getURL from './URL/getURL';

const DEFAULT_CALLBACK_FIELD = 'jsonp';

function createJSONPUrl(url, callbackId, field) {
  const my = getURL(url);
  my.search += `&${encodeURIComponent(field)}=${encodeURIComponent(callbackId)}`;
  return my.href;
}

function defferRemove(script) {
  setTimeout(() => requestIdleCallback(() => {
    if (document.body) document.body.removeChild(script);
  }), 10000);
}

function defferAppend(script) {
  setTimeout(() => {
    if (document.body) {
      document.body.appendChild(script);
    } else {
      throw new Error('Need document.body to exists.');
    }
  }, 0);
}

export default function promisifyJSONP(url: string, callbackField: string = DEFAULT_CALLBACK_FIELD): Promise<any[]> {
  const callbackId = uniqueId();
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = createJSONPUrl(url, callbackId, callbackField);
  script.async = true;
  script.defer = true;

  const prom = new Promise((resolve, reject) => {
    window[callbackId] = (...rest) => {
      defferRemove(script);
      delete window[callbackId];
      resolve(rest);
    };

    script.onerror = (err) => {
      defferRemove(script);
      delete window[callbackId];
      reject(err);
    };
  });

  defferAppend(script);

  return prom;
}

