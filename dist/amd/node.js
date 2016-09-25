"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(["require", "exports", './base-http-request', './node-fetch', './utils', './request', './header', './types', './base-http-request'], function (require, exports, base_http_request_1, node_fetch_1, utils_1, request_1, header_1, types_1, base_http_request_2) {
    "use strict";

    function __export(m) {
        for (var p in m) {
            if (!exports.hasOwnProperty(p)) exports[p] = m[p];
        }
    }

    var HttpRequest = function (_base_http_request_1$) {
        _inherits(HttpRequest, _base_http_request_1$);

        function HttpRequest() {
            _classCallCheck(this, HttpRequest);

            return _possibleConstructorReturn(this, (HttpRequest.__proto__ || Object.getPrototypeOf(HttpRequest)).apply(this, arguments));
        }

        _createClass(HttpRequest, [{
            key: "_fetch",
            value: function _fetch(url, request) {
                return node_fetch_1.fetch(url, request);
            }
        }]);

        return HttpRequest;
    }(base_http_request_1.BaseHttpRequest);

    exports.HttpRequest = HttpRequest;
    exports.queryStringToParams = utils_1.queryStringToParams;
    exports.isValid = utils_1.isValid;
    exports.isNode = utils_1.isNode;
    __export(request_1);
    __export(header_1);
    __export(types_1);
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
});