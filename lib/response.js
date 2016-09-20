"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var header_1 = require('./header');
var support_1 = require('./support');
var orange_1 = require('orange');
var utils_1 = require('./utils');
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
    BodyType[BodyType["Stream"] = 3] = "Stream";
    BodyType[BodyType["None"] = 4] = "None";
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
        this.headers = options.headers instanceof header_1.Headers ? options.headers : new header_1.Headers(options.headers);
        this.url = options.url || '';
        this._initBody(body);
    }

    _createClass(Response, [{
        key: '_initBody',
        value: function _initBody(body) {
            if (typeof body === 'string' || support_1.default.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
                this._bodyType = BodyType.Text;
            } else if (support_1.default.blob && Blob.prototype.isPrototypeOf(body)) {
                this._bodyType = BodyType.Blob;
            } else if (support_1.default.formData && FormData.prototype.isPrototypeOf(body)) {
                this._bodyType = BodyType.FormData;
            } else if (!body) {
                this._bodyType = BodyType.None;
            } else if (support_1.default.arrayBuffer && ArrayBuffer.prototype.isPrototypeOf(body)) {} else if (utils_1.isNode) {
                this._bodyType = BodyType.Stream;
            } else {
                throw new Error('unsupported BodyType type');
            }
            this._body = body ? body : "";
            if (!this.headers.get('content-type')) {
                if (this._bodyType == BodyType.Text) {
                    this.headers.set('content-type', 'text/plain; charset=UTF-8');
                } else if (this._bodyType == BodyType.Blob && this._body.type) {
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
            if (this._bodyType == BodyType.Blob) {
                return readBlobAsText(this._body);
            } else if (this._bodyType == BodyType.FormData) {
                throw new Error('could not read FormData body as text');
            } else if (this._bodyType == BodyType.Stream) {
                return this._streamToBuffer().then(function (ret) {
                    return ret.toString('utf8');
                });
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
        key: '_streamToBuffer',
        value: function _streamToBuffer() {
            if (!isNaN) return orange_1.Promise.reject(new TypeError("not node!"));
            require('./fetch').toBuffer(this._body);
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
            if (this._bodyType == BodyType.Blob) {
                return orange_1.Promise.resolve(this._body);
            } else if (this._bodyType == BodyType.FormData) {
                orange_1.Promise.reject(new Error('could not read FormData body as blob'));
            } else if (this.bodyType === BodyType.Stream) {
                return this._streamToBuffer();
            } else {
                return orange_1.Promise.resolve(new Blob([this._body]));
            }
        }
    }, {
        key: 'stream',
        value: function stream() {
            if (!utils_1.isNode) return orange_1.Promise.reject(new TypeError("streaming is only available in node"));
            return orange_1.Promise.resolve(this._body);
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
        key: 'clone',
        value: function clone() {
            return new Response(this._body, {
                status: this.status,
                statusText: this.statusText,
                headers: new header_1.Headers(this.headers),
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