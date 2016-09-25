"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

define(["require", "exports", './header', './support', 'orange', './utils', './types'], function (require, exports, header_1, support_1, orange_1, utils_1, types_1) {
    "use strict";

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
            key: "_initBody",
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
            key: "text",
            value: function text() {
                if (this._bodyType == types_1.BodyType.Stream) {
                    return this.blob().then(function (n) {
                        return n.toString();
                    });
                }
                var rejected = consumed(this);
                if (rejected) return rejected;
                if (this._bodyType == types_1.BodyType.Blob) {
                    return readBlobAsText(this._body);
                } else if (this._bodyType == types_1.BodyType.FormData) {
                    throw new Error('could not read FormData body as text');
                } else {
                    return orange_1.Promise.resolve(this._body);
                }
            }
        }, {
            key: "arrayBuffer",
            value: function arrayBuffer() {
                return this.blob().then(readBlobAsArrayBuffer);
            }
        }, {
            key: "stream",
            value: function stream() {
                return this.blob();
            }
        }, {
            key: "blob",
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
            key: "formData",
            value: function formData() {
                if (!support_1.default.formData) {
                    return orange_1.Promise.reject(new Error("form data not supported"));
                }
                return this.text().then(decode);
            }
        }, {
            key: "json",
            value: function json() {
                return this.text().then(JSON.parse);
            }
        }, {
            key: "bodyUsed",
            get: function get() {
                return this._bodyUsed;
            }
        }, {
            key: "bodyType",
            get: function get() {
                return this._bodyType;
            }
        }, {
            key: "isValid",
            get: function get() {
                return utils_1.isValid(this.status);
            }
        }]);

        return BaseResponse;
    }();

    exports.BaseResponse = BaseResponse;
});