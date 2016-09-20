"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var header_1 = require('./header');
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