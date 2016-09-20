"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var orange_1 = require('orange');
var utils_1 = require('./utils');
var header_1 = require('./header');
var fetch;
if (utils_1.isNode) {
    fetch = require('./fetch').fetch;
} else {
    fetch = require('./fetch-browser').fetch;
}
(function (HttpMethod) {
    HttpMethod[HttpMethod["GET"] = 0] = "GET";
    HttpMethod[HttpMethod["PUT"] = 1] = "PUT";
    HttpMethod[HttpMethod["POST"] = 2] = "POST";
    HttpMethod[HttpMethod["DELETE"] = 3] = "DELETE";
    HttpMethod[HttpMethod["HEAD"] = 4] = "HEAD";
    HttpMethod[HttpMethod["PATCH"] = 5] = "PATCH";
})(exports.HttpMethod || (exports.HttpMethod = {}));
var HttpMethod = exports.HttpMethod;

var HttpRequest = function () {
    function HttpRequest(_method, _url) {
        _classCallCheck(this, HttpRequest);

        this._method = _method;
        this._url = _url;
        this._params = {};
        this._headers = new header_1.Headers();
        this._request = {};
        this._headers.append('X-Requested-With', 'XMLHttpRequest');
        this._request.method = HttpMethod[this._method];
    }

    _createClass(HttpRequest, [{
        key: 'uploadProgress',
        value: function uploadProgress(fn) {
            this._request.uploadProgress = fn;
            return this;
        }
    }, {
        key: 'downloadProgress',
        value: function downloadProgress(fn) {
            this._request.downloadProgress = fn;
            return this;
        }
    }, {
        key: 'header',
        value: function header(field, value) {
            if (orange_1.isString(field) && orange_1.isString(value)) {
                this._headers.append(field, value);
            } else if (orange_1.isObject(field)) {
                for (var key in field) {
                    this._headers.append(key, field[key]);
                }
            }
            return this;
        }
    }, {
        key: 'params',
        value: function params(key, value) {
            if (arguments.length === 1 && orange_1.isObject(key)) {
                orange_1.extend(this._params, key);
            } else if (arguments.length === 2) {
                this._params[key] = value;
            }
            return this;
        }
    }, {
        key: 'withCredentials',
        value: function withCredentials(ret) {
            this._xhr.withCredentials = ret;
            return this;
        }
    }, {
        key: 'json',
        value: function json(data) {
            var throwOnInvalid = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

            this.header('content-type', 'application/json; charset=utf-8');
            if (!orange_1.isString(data)) {
                data = JSON.stringify(data);
            }
            return this.end(data, throwOnInvalid).then(function (res) {
                return res.json();
            });
        }
    }, {
        key: 'end',
        value: function end(data) {
            var throwOnInvalid = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

            var url = this._url;
            if (data && data === Object(data) && this._method == HttpMethod.GET /* && check for content-type */) {
                    var sep = url.indexOf('?') === -1 ? '?' : '&';
                    var d = sep + utils_1.queryParam(data);
                    url += d;
                    data = null;
                } else {
                this._request.body = data;
            }
            url = this._apply_params(url);
            return fetch(url, this._request).then(function (res) {
                if (!res.ok && throwOnInvalid) {
                    throw new Error(res.statusText);
                }
                return res;
            });
        }
    }, {
        key: '_apply_params',
        value: function _apply_params(url) {
            var params = {};
            var idx = url.indexOf('?');
            if (idx > -1) {
                params = orange_1.extend(params, utils_1.queryStringToParams(url.substr(idx + 1)));
                url = url.substr(0, idx);
            }
            orange_1.extend(params, this._params);
            if (!orange_1.isEmpty(params)) {
                var sep = url.indexOf('?') === -1 ? '?' : '&';
                url += sep + utils_1.queryParam(params);
            }
            return url;
        }
    }]);

    return HttpRequest;
}();

exports.HttpRequest = HttpRequest;
function get(url) {
    return new HttpRequest(HttpMethod.GET, url);
}
exports.get = get;
function post(url) {
    return new HttpRequest(HttpMethod.POST, url);
}
exports.post = post;
function put(url) {
    return new HttpRequest(HttpMethod.PUT, url);
}
exports.put = put;
function del(url) {
    return new HttpRequest(HttpMethod.DELETE, url);
}
exports.del = del;
function patch(url) {
    return new HttpRequest(HttpMethod.PATCH, url);
}
exports.patch = patch;
function head(url) {
    return new HttpRequest(HttpMethod.HEAD, url);
}
exports.head = head;