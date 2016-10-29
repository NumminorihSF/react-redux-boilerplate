/**
 * Created by numminorihsf on 28.10.16.
 */


module.exports = function(request, response){
  return {
    getHeader: getCookiesHeader,
    get: getCookie,
    set: setCookie,
    setCookie: sendSetCookieHeader
  };

  function getCookiesHeader(){
    return request.headers.cookie;
  }

  function getCookie(cookieName){
    return getCookieValue(getCookiesHeader(), cookieName);
  }

  function setCookie(cookieName, value, options){
    response.cookie(cookieName, value, options);
  }

  function sendSetCookieHeader(headerValue){
    return response.set('Set-Cookie', headerValue);
  }
};


function getCookieValue(header, cookieName) {
  var matches = header.match(new RegExp(
    "(?:^|; )" + cookieName.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}
