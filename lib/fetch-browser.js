"use strict";

var orange_1 = require('orange');
var header_1 = require('./header');
var request_1 = require('./request');
var response_1 = require('./response');
var support_1 = require('./support');
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
            resolve(new response_1.Response(body, options));
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