/** @flow */
export function isObject(value: mixed): boolean {
  const type = typeof value;
  return !!value && (type === 'object' || type === 'function');
}

export function isFunction(value: mixed): boolean {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in older versions of Chrome and Safari which return 'function' for regexes
  // and Safari 8 which returns 'object' for typed array constructors.
  return isObject(value) && Object.prototype.toString.call(value) === '[object Function]';
}

export function getCookieHeader(cookie: any): string {
  if (!isObject(cookie)) return '';
  if (!isFunction(cookie.getHeader)) return '';
  return cookie.getHeader();
}

export function defaultCookieSetter(url: string, cookieName: string): void {
  if (process.env.ON_SERVER === false) return;
  console.warn(`Try set cookie (Set-Cookie: ${cookieName}) without \`cookie\` object in action. Requested url: ${url}`);
}

export function getCookieSetter(url: string, cookie: any): Function {
  if (!isObject(cookie)) return (...params) => defaultCookieSetter(url, ...params);
  if (!isFunction(cookie.setCookie)) return (...params) => defaultCookieSetter(url, ...params);
  return cookie.setCookie;
}

export function setCookie({ headers = {} }: { headers?: Object }, setCookie: Function): void {
  if (headers && headers['set-cookie']) {
    setCookie(headers['set-cookie']);
  }
}

export function setCookieHeader(superagent: any, { cookieHeader }: { cookieHeader?: string }): mixed {
  if (process.env.ON_SERVER === false) return superagent;
  if (!cookieHeader) return superagent;
  return superagent.set('Cookie', cookieHeader);
}
