"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var orange_1 = require('orange');
/*import {isValid, FetchOptions} from './utils';
import {Headers} from './header';
import {Request, RequestOptions, isRequest} from './request';
import {Response} from './response';
import support from './support';*/
var http = require('http');
var request_1 = require('./request');
var header_1 = require('./header');
var types_1 = require('./types');
var base_response_1 = require('./base-response');
var URL = require('url');
var concat = require('concat-stream');
function _headers(headers) {
    var head = new header_1.Headers();
    for (var key in headers) {
        head.append(key, headers[key]);
    }
    return head;
}

var NodeResponse = function (_base_response_1$Base) {
    _inherits(NodeResponse, _base_response_1$Base);

    function NodeResponse() {
        _classCallCheck(this, NodeResponse);

        return _possibleConstructorReturn(this, (NodeResponse.__proto__ || Object.getPrototypeOf(NodeResponse)).apply(this, arguments));
    }

    _createClass(NodeResponse, [{
        key: 'blob',
        value: function blob() {
            if (this.bodyType === types_1.BodyType.Stream) {
                var reject = base_response_1.consumed(this);
                if (reject) return reject;
                return this._streamToBuffer();
            } else {
                return _get(NodeResponse.prototype.__proto__ || Object.getPrototypeOf(NodeResponse.prototype), 'blob', this).call(this);
            }
        }
    }, {
        key: '_streamToBuffer',
        value: function _streamToBuffer() {
            return toBuffer(this._body);
        }
    }, {
        key: 'stream',
        value: function stream() {
            return orange_1.Promise.resolve(this._body);
        }
    }, {
        key: 'clone',
        value: function clone() {
            return new NodeResponse(this._body, {
                status: this.status,
                statusText: this.statusText,
                headers: new header_1.Headers(this.headers),
                url: this.url
            });
        }
    }]);

    return NodeResponse;
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
        var url = URL.parse(request.url, false);
        var headers = {};
        request.headers.forEach(function (v, k) {
            headers[k] = v;
        });
        var req = http.request({
            method: request.method,
            host: url.hostname,
            port: parseInt(url.port),
            path: url.path,
            protocol: url.protocol,
            headers: headers
        }, function (res) {
            var options = {
                status: res.statusCode,
                statusText: res.statusMessage,
                headers: _headers(res.headers)
            };
            resolve(new NodeResponse(res, options));
        });
        req.on('error', reject);
        if (request.body) {
            if (Buffer.isBuffer(request.body)) {
                req.write(request.body);
            } else if (orange_1.isString(request.body)) {
                req.write(Buffer.from(request.body));
            } else if (orange_1.isFunction(request.body.read) && orange_1.isFunction(request.body.pipe)) {
                return request.body.pipe(req);
            }
        }
        req.end();
    });
}
exports.fetch = fetch;
function toBuffer(a) {
    return new orange_1.Promise(function (resolve, reject) {
        a.on('error', reject);
        var stream = concat(resolve);
        a.pipe(stream);
    });
}