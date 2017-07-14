"use strict";
require('babel-register');
const path = require('path');
const url = require('url');

const proxy = require('anyproxy');
const moment = require('moment');
const watch = require('watch');

const config = require('../../src/config');

const MODULE_NAME = '[PROXY]';
const FORMAT = '\\[hh:mm:ss\\]';


const log = (string, ...rest) => {
  console.log(`${moment().format(FORMAT)} ${MODULE_NAME} - ${string}`, ...rest);
};

module.exports.start = function ({ API_BASE_URL, EXTRA_URL, EXTRA_TEMP_API_PREFIXES, BASE_PORT, PROXY_PORT, TEMP_API_PREFIX }) {
  const apiBaseUrl = url.parse(API_BASE_URL);
  const regexp = new RegExp(String(TEMP_API_PREFIX).replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1'));

  const urls = Object.keys(EXTRA_URL)
    .reduce((res, key) => Object.assign({}, res, { [key]: url.parse(EXTRA_URL[key]) }), {});

  const getPath = (path = '') => {
    const prefixKey = Object.keys(EXTRA_TEMP_API_PREFIXES).find(prefix => path.startsWith(EXTRA_TEMP_API_PREFIXES[prefix]));
    if (prefixKey) return path.replace(EXTRA_TEMP_API_PREFIXES[prefixKey], '');
    return path.replace(TEMP_API_PREFIX, '');
  };

  const getHost = (path = '') => {
    const prefixKey = Object.keys(EXTRA_TEMP_API_PREFIXES).find(prefix => path.startsWith(EXTRA_TEMP_API_PREFIXES[prefix]));
    if (prefixKey) return urls[prefixKey].host;
    return apiBaseUrl.host;
  };

  const getHostname = (path = '') => {
    const prefixKey = Object.keys(EXTRA_TEMP_API_PREFIXES).find(prefix => path.startsWith(EXTRA_TEMP_API_PREFIXES[prefix]));
    if (prefixKey) return urls[prefixKey].hostname;
    return apiBaseUrl.hostname;
  };

  const getPort = (path = '') => {
    const prefixKey = Object.keys(EXTRA_TEMP_API_PREFIXES).find(prefix => path.startsWith(EXTRA_TEMP_API_PREFIXES[prefix]));
    if (prefixKey) return urls[prefixKey].port;
    return 443;
  };

  const options = {
    type          : "http",
    port          : PROXY_PORT,
//    silent        : true,
    summary:function(){
      return `proxy /api/ to ${API_BASE_URL}`;
    },
    rule          : {
      replaceRequestProtocol:function(req,protocol){
        if (regexp.test(req.url)) {
          return apiBaseUrl.protocol;
        } else {
          return 'http';
        }
      },

      replaceRequestOption : function(req, option) {
        const newOption = Object.assign({}, option);
        newOption.headers.host     = getHost(option.path);
        newOption.host     = getHost(option.path);
        newOption.hostname = getHostname(option.path);
        newOption.port     = getPort(option.path);
        newOption.path     = getPath(option.path);
        return newOption;
      },
    }
  };
  log(`run on port ${BASE_PORT}`);
  log(`proxy /api/ to ${API_BASE_URL}`);
  new proxy.proxyServer(options);
};
