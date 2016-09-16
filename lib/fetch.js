"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var orange_1 = require('orange');
var support = {
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
    if (support.iterable) {
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
function consumed(body) {
    if (body.bodyUsed) {
        return orange_1.Promise.reject(new TypeError('Already read'));
    }
    body._bodyUsed = true;
}
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
(function (BodyType) {
    BodyType[BodyType["Blob"] = 0] = "Blob";
    BodyType[BodyType["Text"] = 1] = "Text";
    BodyType[BodyType["FormData"] = 2] = "FormData";
    BodyType[BodyType["None"] = 3] = "None";
})(exports.BodyType || (exports.BodyType = {}));
var BodyType = exports.BodyType;
var redirectStatuses = [301, 302, 303, 307, 308];

var Response = function () {
    function Response(body, options) {
        _classCallCheck(this, Response);

        this._bodyUsed = false;
        this._bodyType = BodyType.None;
        options = options || {};
        this.type = 'default';
        this.status = options.status;
        this.ok = this.status >= 200 && this.status < 300;
        this.statusText = options.statusText;
        this.headers = options.headers instanceof Headers ? options.headers : new Headers(options.headers);
        this.url = options.url || '';
        this._initBody(body);
    }

    _createClass(Response, [{
        key: '_initBody',
        value: function _initBody(body) {
            if (typeof body === 'string' || support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
                this._bodyType = BodyType.Text;
            } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
                this._bodyType = BodyType.Blob;
            } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
                this._bodyType = BodyType.FormData;
            } else if (!body) {
                this._bodyType = BodyType.None;
            } else if (support.arrayBuffer && ArrayBuffer.prototype.isPrototypeOf(body)) {} else {
                throw new Error('unsupported BodyInit type');
            }
            this._body = body ? body : "";
            if (!this.headers.get('content-type')) {
                if (this._bodyType == BodyType.Text) {
                    this.headers.set('content-type', 'text/plain; charset=UTF-8');
                } else if (this._bodyType == BodyType.Blob && this._body.type) {
                    this.headers.set('content-type', this._body.type);
                } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
                    this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
                }
            }
        }
    }, {
        key: 'text',
        value: function text() {
            var rejected = consumed(this);
            if (rejected) return rejected;
            if (this._bodyType == BodyType.Blob) {
                return readBlobAsText(this._body);
            } else if (this._bodyType == BodyType.FormData) {
                throw new Error('could not read FormData body as text');
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
        key: 'blob',
        value: function blob() {
            if (!support.blob) {
                return orange_1.Promise.reject(new Error("blob not supported"));
            }
            var rejected = consumed(this);
            if (rejected) {
                return rejected;
            }
            if (this._bodyType == BodyType.Blob) {
                return orange_1.Promise.resolve(this._body);
            } else if (this._bodyType == BodyType.FormData) {
                throw new Error('could not read FormData body as blob');
            } else {
                return orange_1.Promise.resolve(new Blob([this._body]));
            }
        }
    }, {
        key: 'formData',
        value: function formData() {
            if (!support.formData) {
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
        key: 'clone',
        value: function clone() {
            return new Response(this._body, {
                status: this.status,
                statusText: this.statusText,
                headers: new Headers(this.headers),
                url: this.url
            });
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
    }], [{
        key: 'error',
        value: function error() {
            var response = new Response(null, { status: 0, statusText: '' });
            response.type = 'error';
            return response;
        }
    }, {
        key: 'redirect',
        value: function redirect(url, status) {
            if (redirectStatuses.indexOf(status) === -1) {
                throw new RangeError('Invalid status code');
            }
            return new Response(null, { status: status, headers: { location: url } });
        }
    }]);

    return Response;
}();

exports.Response = Response;
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
                this.headers = new Headers(options.headers);
            }
            this.method = input.method;
            this.mode = input.mode;
        } else {
            this.url = input;
        }
        this.credentials = options.credentials || this.credentials || 'omit';
        if (options.headers || !this.headers) {
            this.headers = new Headers(options.headers);
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
function headers(xhr) {
    var head = new Headers();
    var pairs = (xhr.getAllResponseHeaders() || '').trim().split('\n');
    for (var i = 0, ii = pairs.length; i < ii; i++) {
        var split = pairs[i].trim().split(':');
        var key = split.shift().trim();
        var value = split.join(':').trim();
        head.append(key, value);
    }
    return head;
}
function fetch(input, init) {
    return new orange_1.Promise(function (resolve, reject) {
        var request;
        if (isRequest(input) && !init) {
            request = input;
        } else {
            request = new Request(input, init);
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
            resolve(new Response(body, options));
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
        if ('responseType' in xhr && support.blob) {
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