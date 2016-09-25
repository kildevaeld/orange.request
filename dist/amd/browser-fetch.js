"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(["require", "exports", 'orange', './header', './request', './base-response', './support'], function (require, exports, orange_1, header_1, request_1, base_response_1, support_1) {
    "use strict";

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
            key: "clone",
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
});