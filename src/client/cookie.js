/**
 * Created by numminorihsf on 28.10.16.
 */


module.exports = function() {
  return {
    getHeader: noop,
    get: getCookie,
    set: setCookie,
    setCookie: noop
  };
};

function getCookie(cookieName) {
  var matches = document.cookie.match(new RegExp(
    "(?:^|; )" + cookieName.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

function setCookie(cookieName, value, options) {
  options = options || {};

  normalizeExpires(options);

  value = encodeURIComponent(value);

  var updatedCookie = cookieName + "=" + value;

  for (var propName in options) {
    if (options.hasOwnProperty(propName)) {
      updatedCookie += "; " + propName;
      var propValue = options[propName];
      if (propValue !== true) {
        updatedCookie += "=" + propValue;
      }
    }
  }

  document.cookie = updatedCookie;
}

function normalizeExpires(options){
  var expires = options.expires;

  if (typeof expires === "number" && expires) {
    var d = new Date();
    d.setTime(d.getTime() + expires * 1000);
    expires = options.expires = d;
  }
  if (expires && expires.toUTCString) {
    options.expires = expires.toUTCString();
  }
}
