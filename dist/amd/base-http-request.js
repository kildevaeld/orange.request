"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

define(["require", "exports", 'orange', './utils', './header'], function (require, exports, orange_1, utils_1, header_1) {
    "use strict";

    (function (HttpMethod) {
        HttpMethod[HttpMethod["GET"] = 0] = "GET";
        HttpMethod[HttpMethod["PUT"] = 1] = "PUT";
        HttpMethod[HttpMethod["POST"] = 2] = "POST";
        HttpMethod[HttpMethod["DELETE"] = 3] = "DELETE";
        HttpMethod[HttpMethod["HEAD"] = 4] = "HEAD";
        HttpMethod[HttpMethod["PATCH"] = 5] = "PATCH";
    })(exports.HttpMethod || (exports.HttpMethod = {}));
    var HttpMethod = exports.HttpMethod;

    var BaseHttpRequest = function () {
        function BaseHttpRequest(_method, _url) {
            _classCallCheck(this, BaseHttpRequest);

            this._method = _method;
            this._url = _url;
            this._params = {};
            this._headers = new header_1.Headers();
            this._request = {};
            if (!utils_1.isNode) {
                this._headers.append('X-Requested-With', 'XMLHttpRequest');
            }
            this._request.method = HttpMethod[this._method];
        }

        _createClass(BaseHttpRequest, [{
            key: "uploadProgress",
            value: function uploadProgress(fn) {
                this._request.uploadProgress = fn;
                return this;
            }
        }, {
            key: "downloadProgress",
            value: function downloadProgress(fn) {
                this._request.downloadProgress = fn;
                return this;
            }
        }, {
            key: "header",
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
            key: "params",
            value: function params(key, value) {
                if (arguments.length === 1 && orange_1.isObject(key)) {
                    orange_1.extend(this._params, key);
                } else if (arguments.length === 2) {
                    this._params[key] = value;
                }
                return this;
            }
        }, {
            key: "credentials",
            value: function credentials(ret) {
                this._request.credentials = ret;
                return this;
            }
        }, {
            key: "json",
            value: function json(data) {
                this.header('content-type', 'application/json; charset=utf-8');
                if (!orange_1.isString(data)) {
                    data = JSON.stringify(data);
                }
                return this.end(data).then(function (res) {
                    return res.json();
                });
            }
        }, {
            key: "text",
            value: function text(data) {
                return this.end(data).then(function (r) {
                    return r.text();
                });
            }
        }, {
            key: "end",
            value: function end(data) {
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
                this._request.headers = this._headers;
                /*return fetch(url, this._request)
                .then((res: Response) => {
                    return res;
                });*/
                return this._fetch(url, this._request);
            }
        }, {
            key: "then",
            value: function then(onFulfilled, onRejected) {
                return this.end().then(onFulfilled, onRejected);
            }
        }, {
            key: "catch",
            value: function _catch(onRejected) {
                return this.end().catch(onRejected);
            }
        }, {
            key: "_apply_params",
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

        return BaseHttpRequest;
    }();

    exports.BaseHttpRequest = BaseHttpRequest;
});