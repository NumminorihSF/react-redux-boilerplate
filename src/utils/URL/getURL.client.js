/** @flow */
import 'url-polyfill';

const a = document.createElement('a');
a.style.display = 'none';
window.document.body.appendChild(a);


export default function getURL(stringToParse: string): window.URL {
  a.href = stringToParse;
  return new URL(a.href);
}
