"use strict";

var orange_1 = require('orange');
/*import {isValid, FetchOptions} from './utils';
import {Headers} from './header';
import {Request, RequestOptions, isRequest} from './request';
import {Response} from './response';
import support from './support';*/
var http = require('http');
var request_1 = require('./request');
var header_1 = require('./header');
var response_1 = require('./response');
var URL = require('url');
function _headers(headers) {
    var head = new header_1.Headers();
    for (var key in headers) {
        head.append(key, headers[key]);
    }
    return head;
}
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
            resolve(new response_1.Response(res, options));
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
        /*var xhr = xmlHttpRequest();
         function responseURL() {
            if ('responseURL' in xhr) {
                return (<any>xhr).responseURL
            }
            // Avoid security warnings on getResponseHeader when not allowed by CORS
            if (/^X-Request-URL:/m.test(xhr.getAllResponseHeaders())) {
                return xhr.getResponseHeader('X-Request-URL')
            }
            return
        }
         xhr.onload = function () {
            var options = {
                status: xhr.status,
                statusText: xhr.statusText,
                headers: headers(xhr),
                url: responseURL()
            }
            var body = 'response' in xhr ? xhr.response : xhr.responseText
            resolve(new Response(body, options))
        }
         xhr.onerror = function () {
            reject(new TypeError('Network request failed'))
        }
         xhr.ontimeout = function () {
            reject(new TypeError('Network request failed: timeout'))
        }
         xhr.open(request.method, request.url, true)
         if (request.credentials === 'include') {
            xhr.withCredentials = true
        }
         if ('responseType' in xhr && support.blob) {
            xhr.responseType = 'blob'
        }
         request.headers.forEach(function (value, name) {
            xhr.setRequestHeader(name, value)
        });
         if (init.downloadProgress) {
            xhr.onprogress = init.downloadProgress;
        }
        if (init.uploadProgress || xhr.upload) {
            xhr.upload.onprogress = init.uploadProgress;
        }
                xhr.send(typeof request.body === 'undefined' ? null : request.body)*/
    });
}
exports.fetch = fetch;
function toBuffer(a) {
    var _this = this;

    var concat = require('concat-stream');
    return new orange_1.Promise(function (resolve, reject) {
        _this._body.on('error', reject);
        var stream = concat(resolve);
        _this._body.pipe(stream);
    });
}
exports.toBuffer = toBuffer;