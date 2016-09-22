declare var URLSearchParams;
import {Promise, extend, IPromise, isString, isObject, isFunction} from 'orange';
/*import {isValid, FetchOptions} from './utils';
import {Headers} from './header';
import {Request, RequestOptions, isRequest} from './request';
import {Response} from './response';
import support from './support';*/
import * as http from 'http'
import {Request, isRequest} from './request'
import {FetchOptions} from './utils';
import {Headers} from './header';
import {Response} from './response';
import * as URL from 'url';
import * as QS from 'querystring';


function _headers(headers) {
    var head = new Headers()

    for (var key in headers) {
        head.append(key, headers[key]);
    }

    return head;
}





export function fetch(input: Request | string, init?: FetchOptions): IPromise<Response> {
    return new Promise(function (resolve, reject) {
        var request: Request;
        if (isRequest(input) && !init) {
            request = input
        } else {
            request = new Request(input, init)
        }

        init = init || {};


        let url = URL.parse(request.url, false);

        var headers = {}
        request.headers.forEach((v, k) => {
            headers[k] = v;
        });


        var req = http.request({
            method: request.method,
            host: url.hostname,
            port: parseInt(url.port),
            path: url.path,
            protocol: url.protocol,
            headers: headers,
        }, function (res) {
            var options = {
                status: res.statusCode,
                statusText: res.statusMessage,
                headers: _headers(res.headers)
            }

            resolve(new Response(res, options));
        });

        req.on('error', reject);

        if (request.body) {
            if (Buffer.isBuffer(request.body)) {
                req.write(request.body);
            } else if (isString(request.body)) {
                req.write(Buffer.from(request.body));
            } else if (isFunction(request.body.read) && isFunction(request.body.pipe)) {

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


export function toBuffer(a) {
    var concat = require('concat-stream');
    return new Promise((resolve, reject) => {
        a.on('error', reject);
        let stream = concat(resolve);
        a.pipe(stream);
    })
}