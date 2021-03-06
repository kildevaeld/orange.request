"use strict";

define(["require", "exports"], function (require, exports) {
    "use strict";

    exports.isNode = !new Function("try {return this===window;}catch(e){ return false;}")();
    function queryStringToParams(qs) {
        var kvp,
            k,
            v,
            ls,
            params = {},
            decode = decodeURIComponent;
        var kvps = qs.split('&');
        for (var i = 0, l = kvps.length; i < l; i++) {
            var param = kvps[i];
            kvp = param.split('='), k = kvp[0], v = kvp[1];
            if (v == null) v = true;
            k = decode(k), v = decode(v), ls = params[k];
            if (Array.isArray(ls)) ls.push(v);else if (ls) params[k] = [ls, v];else params[k] = v;
        }
        return params;
    }
    exports.queryStringToParams = queryStringToParams;
    function queryParam(obj) {
        return Object.keys(obj).reduce(function (a, k) {
            a.push(k + '=' + encodeURIComponent(obj[k]));return a;
        }, []).join('&');
    }
    exports.queryParam = queryParam;
    /*const fileProto = /^file:/;
    export function isValid(xhr, url) {
        return (xhr.status >= 200 && xhr.status < 300) ||
            (xhr.status === 304) ||
            (xhr.status === 0 && fileProto.test(url)) ||
            (xhr.status === 0 && window.location.protocol === 'file:')
    };*/
    function isValid(status) {
        return status >= 200 && status < 300 || status === 304;
    }
    exports.isValid = isValid;
    ;
});