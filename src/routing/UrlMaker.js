"use strict";
/**
 * You can use this to declare URLs in you app with static string template.
 * Templates should have Express.js' style.
 * **Warn:** Url should ends with `/`.
 * @example:
 *     URLMaker.create('/api/v1/:path/any/').mapParams({path:123, filter:1})
 *     // Will returns '/api/v1/123/any/?filter=1
 *
 * @class URLMaker
 */
class URLMaker {
    /**
     * @private
     * @param url {String}
     */
    constructor(url){
        this.url = url;
    }

    /**
     * Generates URLMaker and returns it
     * @param urlParts {String|String[]}
     * @returns {URLMaker}
     */
    static create(urlParts){
        if (typeof urlParts === 'string'){
            if (urlParts[urlParts.length-1] === '/'){
                urlParts += '?'
            }
            return new URLMaker(urlParts);
        }
        let result = [''];
        for(let i = 0; i < urlParts.length; i++){
            if (!urlParts[i].path) continue;
            if (urlParts[i].path === '/') continue;
            result.push(urlParts[i].path);
        }
        result.push('?');
        return new URLMaker(result.join('/'));
    }

    toString() {
        return this.url;
    }

    /**
     * Map params into URL.
     * @param params
     * @returns {URLMaker}
     */
    mapParams(params){
        return Object.keys(params).reduce(function(path, param){
            return path._mapParam(param, params[param]);
        }, this).toString();
    }

    /**
     * Map 1 parameter into url.
     * @param param
     * @param value
     * @returns {URLMaker}
     * @private
     */
    _mapParam(param, value){
        let re = new RegExp(':'+param+'/', 'ig');
        let url = this.url;
        if (re.test(url)){
            url = url.replace(re, function(){
                return value+'/'
            });
        }
        else {
            url += '&' + param + '=' + encodeURIComponent(value);
        }
        return new URLMaker(url);
    }

}

export default URLMaker;