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



module.exports.start = function( { API_BASE_URL, BASE_PORT, PROXY_PORT }){
  const apiBaseUrl = url.parse(API_BASE_URL);
  const options = {
    type          : "http",
    port          : PROXY_PORT,
//    silent        : true,
    summary:function(){
      return `proxy /api/ to ${API_BASE_URL}`;
    },
    rule          : {
      replaceRequestProtocol:function(req,protocol){
        return apiBaseUrl.protocol;
      },

      replaceRequestOption : function(req, option){
        const newOption = Object.assign({}, option);
        newOption.headers.host     = apiBaseUrl.host;
        newOption.host     = apiBaseUrl.host;
        newOption.hostname = apiBaseUrl.hostname;
        newOption.port     = apiBaseUrl.port;

        return newOption;
      },
    }
  };
  log(`run on port ${BASE_PORT}`);
  log(`proxy /api/ to ${API_BASE_URL}`);
  new proxy.proxyServer(options);
};
