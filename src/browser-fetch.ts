
import { Promise, xmlHttpRequest, IPromise } from 'orange';
import { FetchOptions } from './utils';
import { Headers } from './header';
import { Request, isRequest } from './request';
import { Response } from './types';
import { BaseResponse } from './base-response';

import support from './support';
function headers(xhr) {
    var head = new Headers()
    var pairs = (xhr.getAllResponseHeaders() || '').trim().split('\n')

    for (let i = 0, ii = pairs.length; i < ii; i++) {
        var split = pairs[i].trim().split(':')
        var key = split.shift().trim()
        var value = split.join(':').trim()
        head.append(key, value)
    }

    return head;
}



class BrowserResponse extends BaseResponse {
    clone() {
        return new BrowserResponse(this._body, {
            status: this.status,
            statusText: this.statusText,
            headers: new Headers(this.headers),
            url: this.url
        })
    }
}




export function fetch(input: Request | string, init?: FetchOptions): IPromise<Response> {
    return new Promise(function (resolve, reject) {
        var request
        if (isRequest(input) && !init) {
            request = input
        } else {
            request = new Request(input, init)
        }

        init = init || {};

        var xhr = xmlHttpRequest();

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
            resolve(new BrowserResponse(body, options))
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

        xhr.send(typeof request.body === 'undefined' ? null : request.body)

    });
}
