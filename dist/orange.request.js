(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("orange"));
	else if(typeof define === 'function' && define.amd)
		define(["orange"], factory);
	else if(typeof exports === 'object')
		exports["request"] = factory(require("orange"));
	else
		root["orange"] = root["orange"] || {}, root["orange"]["request"] = factory(root["orange"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	function __export(m) {
	    for (var p in m) {
	        if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	    }
	}
	var base_http_request_1 = __webpack_require__(1);
	var browser_fetch_1 = __webpack_require__(6);

	var HttpRequest = function (_base_http_request_1$) {
	    _inherits(HttpRequest, _base_http_request_1$);

	    function HttpRequest() {
	        _classCallCheck(this, HttpRequest);

	        return _possibleConstructorReturn(this, (HttpRequest.__proto__ || Object.getPrototypeOf(HttpRequest)).apply(this, arguments));
	    }

	    _createClass(HttpRequest, [{
	        key: '_fetch',
	        value: function _fetch(url, request) {
	            return browser_fetch_1.fetch(url, request);
	        }
	    }]);

	    return HttpRequest;
	}(base_http_request_1.BaseHttpRequest);

	exports.HttpRequest = HttpRequest;
	var utils_1 = __webpack_require__(3);
	exports.queryStringToParams = utils_1.queryStringToParams;
	exports.isValid = utils_1.isValid;
	exports.isNode = utils_1.isNode;
	__export(__webpack_require__(7));
	__export(__webpack_require__(4));
	__export(__webpack_require__(9));
	var base_http_request_2 = __webpack_require__(1);
	function get(url) {
	    return new HttpRequest(base_http_request_2.HttpMethod.GET, url);
	}
	exports.get = get;
	function post(url) {
	    return new HttpRequest(base_http_request_2.HttpMethod.POST, url);
	}
	exports.post = post;
	function put(url) {
	    return new HttpRequest(base_http_request_2.HttpMethod.PUT, url);
	}
	exports.put = put;
	function del(url) {
	    return new HttpRequest(base_http_request_2.HttpMethod.DELETE, url);
	}
	exports.del = del;
	function patch(url) {
	    return new HttpRequest(base_http_request_2.HttpMethod.PATCH, url);
	}
	exports.patch = patch;
	function head(url) {
	    return new HttpRequest(base_http_request_2.HttpMethod.HEAD, url);
	}
	exports.head = head;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var orange_1 = __webpack_require__(2);
	var utils_1 = __webpack_require__(3);
	var header_1 = __webpack_require__(4);
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
	        key: 'credentials',
	        value: function credentials(ret) {
	            this._request.credentials = ret;
	            return this;
	        }
	    }, {
	        key: 'json',
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
	        key: 'text',
	        value: function text(data) {
	            return this.end(data).then(function (r) {
	                return r.text();
	            });
	        }
	    }, {
	        key: 'end',
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
	        key: 'then',
	        value: function then(onFulfilled, onRejected) {
	            return this.end().then(onFulfilled, onRejected);
	        }
	    }, {
	        key: 'catch',
	        value: function _catch(onRejected) {
	            return this.end().catch(onRejected);
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

	    return BaseHttpRequest;
	}();

	exports.BaseHttpRequest = BaseHttpRequest;

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ },
/* 3 */
/***/ function(module, exports) {

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

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var support_1 = __webpack_require__(5);
	function normalizeName(name) {
	    if (typeof name !== 'string') {
	        name = String(name);
	    }
	    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
	        throw new TypeError('Invalid character in header field name');
	    }
	    return name.toLowerCase();
	}
	function normalizeValue(value) {
	    if (typeof value !== 'string') {
	        value = String(value);
	    }
	    return value;
	}
	// Build a destructive iterator for the value list
	function iteratorFor(items) {
	    var iterator = {
	        next: function next() {
	            var value = items.shift();
	            return { done: value === undefined, value: value };
	        }
	    };
	    if (support_1.default.iterable) {
	        iterator[Symbol.iterator] = function () {
	            return iterator;
	        };
	    }
	    return iterator;
	}

	var Headers = function () {
	    function Headers(headers) {
	        _classCallCheck(this, Headers);

	        this.map = {};
	        if (headers instanceof Headers) {
	            for (var key in headers.map) {
	                this.append(key, headers.map[key]);
	            }
	        } else if (headers) {
	            var names = Object.getOwnPropertyNames(headers);
	            for (var i = 0, ii = names.length; i < ii; i++) {
	                this.append(names[i], headers[names[i]]);
	            }
	        }
	    }

	    _createClass(Headers, [{
	        key: Symbol.iterator,
	        value: function value() {
	            return this.entries();
	        }
	    }, {
	        key: 'append',
	        value: function append(name, value) {
	            name = normalizeName(name);
	            value = normalizeValue(value);
	            var list = this.map[name];
	            if (!list) {
	                list = [];
	                this.map[name] = list;
	            }
	            list.push(value);
	        }
	    }, {
	        key: 'delete',
	        value: function _delete(name) {
	            delete this.map[normalizeName(name)];
	        }
	    }, {
	        key: 'get',
	        value: function get(name) {
	            var values = this.map[normalizeName(name)];
	            return values ? values[0] : null;
	        }
	    }, {
	        key: 'getAll',
	        value: function getAll(name) {
	            return this.map[normalizeName(name)] || [];
	        }
	    }, {
	        key: 'has',
	        value: function has(name) {
	            return this.map.hasOwnProperty(normalizeName(name));
	        }
	    }, {
	        key: 'set',
	        value: function set(name, value) {
	            this.map[normalizeName(name)] = [normalizeValue(value)];
	        }
	    }, {
	        key: 'forEach',
	        value: function forEach(callback, thisArg) {
	            Object.getOwnPropertyNames(this.map).forEach(function (name) {
	                this.map[name].forEach(function (value) {
	                    callback.call(thisArg, value, name, this);
	                }, this);
	            }, this);
	        }
	    }, {
	        key: 'keys',
	        value: function keys() {
	            var items = [];
	            this.forEach(function (value, name) {
	                items.push(name);
	            });
	            return iteratorFor(items);
	        }
	    }, {
	        key: 'values',
	        value: function values() {
	            var items = [];
	            this.forEach(function (value) {
	                items.push(value);
	            });
	            return iteratorFor(items);
	        }
	    }, {
	        key: 'entries',
	        value: function entries() {
	            var items = [];
	            this.forEach(function (value, name) {
	                items.push([name, value]);
	            });
	            return iteratorFor(items);
	        }
	    }]);

	    return Headers;
	}();

	exports.Headers = Headers;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {"use strict";

	var utils_1 = __webpack_require__(3);
	var self = utils_1.isNode ? global : window;
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = {
	    searchParams: 'URLSearchParams' in self,
	    iterable: 'Symbol' in self && 'iterator' in Symbol,
	    blob: 'FileReader' in self && 'Blob' in self && function () {
	        try {
	            new Blob();
	            return true;
	        } catch (e) {
	            return false;
	        }
	    }(),
	    formData: 'FormData' in self,
	    arrayBuffer: 'ArrayBuffer' in self
	};
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var orange_1 = __webpack_require__(2);
	var header_1 = __webpack_require__(4);
	var request_1 = __webpack_require__(7);
	var base_response_1 = __webpack_require__(8);
	var support_1 = __webpack_require__(5);
	function headers(xhr) {
	    var head = new header_1.Headers();
	    var pairs = (xhr.getAllResponseHeaders() || '').trim().split('\n');
	    for (var i = 0, ii = pairs.length; i < ii; i++) {
	        var split = pairs[i].trim().split(':');
	        var key = split.shift().trim();
	        var value = split.join(':').trim();
	        head.append(key, value);
	    }
	    return head;
	}

	var BrowserResponse = function (_base_response_1$Base) {
	    _inherits(BrowserResponse, _base_response_1$Base);

	    function BrowserResponse() {
	        _classCallCheck(this, BrowserResponse);

	        return _possibleConstructorReturn(this, (BrowserResponse.__proto__ || Object.getPrototypeOf(BrowserResponse)).apply(this, arguments));
	    }

	    _createClass(BrowserResponse, [{
	        key: 'clone',
	        value: function clone() {
	            return new BrowserResponse(this._body, {
	                status: this.status,
	                statusText: this.statusText,
	                headers: new header_1.Headers(this.headers),
	                url: this.url
	            });
	        }
	    }]);

	    return BrowserResponse;
	}(base_response_1.BaseResponse);

	function fetch(input, init) {
	    return new orange_1.Promise(function (resolve, reject) {
	        var request;
	        if (request_1.isRequest(input) && !init) {
	            request = input;
	        } else {
	            request = new request_1.Request(input, init);
	        }
	        init = init || {};
	        var xhr = orange_1.xmlHttpRequest();
	        function responseURL() {
	            if ('responseURL' in xhr) {
	                return xhr.responseURL;
	            }
	            // Avoid security warnings on getResponseHeader when not allowed by CORS
	            if (/^X-Request-URL:/m.test(xhr.getAllResponseHeaders())) {
	                return xhr.getResponseHeader('X-Request-URL');
	            }
	            return;
	        }
	        xhr.onload = function () {
	            var options = {
	                status: xhr.status,
	                statusText: xhr.statusText,
	                headers: headers(xhr),
	                url: responseURL()
	            };
	            var body = 'response' in xhr ? xhr.response : xhr.responseText;
	            resolve(new BrowserResponse(body, options));
	        };
	        xhr.onerror = function () {
	            reject(new TypeError('Network request failed'));
	        };
	        xhr.ontimeout = function () {
	            reject(new TypeError('Network request failed: timeout'));
	        };
	        xhr.open(request.method, request.url, true);
	        if (request.credentials === 'include') {
	            xhr.withCredentials = true;
	        }
	        if ('responseType' in xhr && support_1.default.blob) {
	            xhr.responseType = 'blob';
	        }
	        request.headers.forEach(function (value, name) {
	            xhr.setRequestHeader(name, value);
	        });
	        if (init.downloadProgress) {
	            xhr.onprogress = init.downloadProgress;
	        }
	        if (init.uploadProgress || xhr.upload) {
	            xhr.upload.onprogress = init.uploadProgress;
	        }
	        xhr.send(typeof request.body === 'undefined' ? null : request.body);
	    });
	}
	exports.fetch = fetch;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var header_1 = __webpack_require__(4);
	// HTTP methods whose capitalization should be normalized
	var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT'];
	function normalizeMethod(method) {
	    var upcased = method.toUpperCase();
	    return methods.indexOf(upcased) > -1 ? upcased : method;
	}
	function isRequest(a) {
	    return Request.prototype.isPrototypeOf(a) || a instanceof Request;
	}
	exports.isRequest = isRequest;

	var Request = function () {
	    function Request(input) {
	        var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	        _classCallCheck(this, Request);

	        options = options || {};
	        var body = options.body;
	        if (isRequest(input)) {
	            this.url = input.url;
	            this.credentials = input.credentials;
	            if (!options.headers) {
	                this.headers = new header_1.Headers(options.headers);
	            }
	            this.method = input.method;
	            this.mode = input.mode;
	        } else {
	            this.url = input;
	        }
	        this.credentials = options.credentials || this.credentials || 'omit';
	        if (options.headers || !this.headers) {
	            this.headers = new header_1.Headers(options.headers);
	        }
	        this.method = normalizeMethod(options.method || this.method || 'GET');
	        this.mode = options.mode || this.mode || null;
	        this.referrer = null;
	        if ((this.method === 'GET' || this.method === 'HEAD') && body) {
	            throw new TypeError('Body not allowed for GET or HEAD requests');
	        }
	        this.body = body;
	    }

	    _createClass(Request, [{
	        key: 'clone',
	        value: function clone() {
	            return new Request(this);
	        }
	    }]);

	    return Request;
	}();

	exports.Request = Request;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var header_1 = __webpack_require__(4);
	var support_1 = __webpack_require__(5);
	var orange_1 = __webpack_require__(2);
	var utils_1 = __webpack_require__(3);
	var types_1 = __webpack_require__(9);
	function decode(body) {
	    var form = new FormData();
	    body.trim().split('&').forEach(function (bytes) {
	        if (bytes) {
	            var split = bytes.split('=');
	            var name = split.shift().replace(/\+/g, ' ');
	            var value = split.join('=').replace(/\+/g, ' ');
	            form.append(decodeURIComponent(name), decodeURIComponent(value));
	        }
	    });
	    return form;
	}
	function consumed(body) {
	    if (body.bodyUsed) {
	        return orange_1.Promise.reject(new TypeError('Already read'));
	    }
	    body._bodyUsed = true;
	}
	exports.consumed = consumed;
	function fileReaderReady(reader) {
	    return new orange_1.Promise(function (resolve, reject) {
	        reader.onload = function () {
	            resolve(reader.result);
	        };
	        reader.onerror = function () {
	            reject(reader.error);
	        };
	    });
	}
	function readBlobAsArrayBuffer(blob) {
	    var reader = new FileReader();
	    reader.readAsArrayBuffer(blob);
	    return fileReaderReady(reader);
	}
	function readBlobAsText(blob) {
	    var reader = new FileReader();
	    reader.readAsText(blob);
	    return fileReaderReady(reader);
	}
	var redirectStatuses = [301, 302, 303, 307, 308];

	var BaseResponse = function () {
	    function BaseResponse(body, options) {
	        _classCallCheck(this, BaseResponse);

	        this._bodyUsed = false;
	        this._bodyType = types_1.BodyType.None;
	        options = options || {};
	        this.type = 'default';
	        this.status = options.status;
	        this.ok = this.status >= 200 && this.status < 300;
	        this.statusText = options.statusText;
	        this.headers = options.headers instanceof header_1.Headers ? options.headers : new header_1.Headers(options.headers);
	        this.url = options.url || '';
	        this._initBody(body);
	    }

	    _createClass(BaseResponse, [{
	        key: '_initBody',
	        value: function _initBody(body) {
	            if (typeof body === 'string' || support_1.default.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
	                this._bodyType = types_1.BodyType.Text;
	            } else if (support_1.default.blob && Blob.prototype.isPrototypeOf(body)) {
	                this._bodyType = types_1.BodyType.Blob;
	            } else if (support_1.default.formData && FormData.prototype.isPrototypeOf(body)) {
	                this._bodyType = types_1.BodyType.FormData;
	            } else if (!body) {
	                this._bodyType = types_1.BodyType.None;
	            } else if (support_1.default.arrayBuffer && ArrayBuffer.prototype.isPrototypeOf(body)) {} else if (utils_1.isNode) {
	                this._bodyType = types_1.BodyType.Stream;
	            } else {
	                throw new Error('unsupported BodyType type');
	            }
	            this._body = body ? body : "";
	            if (!this.headers.get('content-type')) {
	                if (this._bodyType == types_1.BodyType.Text) {
	                    this.headers.set('content-type', 'text/plain; charset=UTF-8');
	                } else if (this._bodyType == types_1.BodyType.Blob && this._body.type) {
	                    this.headers.set('content-type', this._body.type);
	                } else if (support_1.default.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
	                    this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
	                }
	            }
	        }
	    }, {
	        key: 'text',
	        value: function text() {
	            var rejected = consumed(this);
	            if (rejected) return rejected;
	            if (this._bodyType == types_1.BodyType.Blob) {
	                return readBlobAsText(this._body);
	            } else if (this._bodyType == types_1.BodyType.FormData) {
	                throw new Error('could not read FormData body as text');
	            } else if (this._bodyType == types_1.BodyType.Stream) {
	                return orange_1.Promise.reject(new Error("cannot handle streams"));
	            } else {
	                return orange_1.Promise.resolve(this._body);
	            }
	        }
	    }, {
	        key: 'arrayBuffer',
	        value: function arrayBuffer() {
	            return this.blob().then(readBlobAsArrayBuffer);
	        }
	    }, {
	        key: 'stream',
	        value: function stream() {
	            return this.blob();
	        }
	    }, {
	        key: 'blob',
	        value: function blob() {
	            if (!support_1.default.blob && !utils_1.isNode) {
	                return orange_1.Promise.reject(new Error("blob not supported"));
	            }
	            var rejected = consumed(this);
	            if (rejected) {
	                return rejected;
	            }
	            if (this._bodyType == types_1.BodyType.Blob) {
	                return orange_1.Promise.resolve(this._body);
	            } else if (this._bodyType == types_1.BodyType.FormData) {
	                orange_1.Promise.reject(new Error('could not read FormData body as blob'));
	            } else {
	                return orange_1.Promise.resolve(new Blob([this._body]));
	            }
	        }
	    }, {
	        key: 'formData',
	        value: function formData() {
	            if (!support_1.default.formData) {
	                return orange_1.Promise.reject(new Error("form data not supported"));
	            }
	            return this.text().then(decode);
	        }
	    }, {
	        key: 'json',
	        value: function json() {
	            return this.text().then(JSON.parse);
	        }
	    }, {
	        key: 'bodyUsed',
	        get: function get() {
	            return this._bodyUsed;
	        }
	    }, {
	        key: 'bodyType',
	        get: function get() {
	            return this._bodyType;
	        }
	    }, {
	        key: 'isValid',
	        get: function get() {
	            return utils_1.isValid(this.status);
	        }
	    }]);

	    return BaseResponse;
	}();

	exports.BaseResponse = BaseResponse;

/***/ },
/* 9 */
/***/ function(module, exports) {

	"use strict";

	(function (BodyType) {
	    BodyType[BodyType["Blob"] = 0] = "Blob";
	    BodyType[BodyType["Text"] = 1] = "Text";
	    BodyType[BodyType["FormData"] = 2] = "FormData";
	    BodyType[BodyType["Stream"] = 3] = "Stream";
	    BodyType[BodyType["None"] = 4] = "None";
	})(exports.BodyType || (exports.BodyType = {}));
	var BodyType = exports.BodyType;
	;

/***/ }
/******/ ])
});
;