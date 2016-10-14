import { Promise, IPromise, isString, isFunction } from 'orange';

import * as http from 'http';
import * as https from 'https';
import { Request, isRequest } from './request'
import { FetchOptions } from './utils';
import { Headers } from './header';
import { Response, BodyType } from './types';
import { BaseResponse, consumed } from './base-response';
import * as URL from 'url';
const concat = require('concat-stream');

function _headers(headers) {
    var head = new Headers()

    for (var key in headers) {
        head.append(key, headers[key]);
    }

    return head;
}


class NodeResponse extends BaseResponse {
    blob() {
        if (this.bodyType === BodyType.Stream) {
            let reject = consumed(this)
            if (reject) return reject;
            return this._streamToBuffer();
        } else {
            return super.blob();
        }
    }
    private _streamToBuffer() {
        return toBuffer(this._body);
    }

    stream() {
        return Promise.resolve(this._body);
    }

    clone() {
        return new NodeResponse(this._body, {
            status: this.status,
            statusText: this.statusText,
            headers: new Headers(this.headers),
            url: this.url
        })
    }

}

export function httpRequest(request: Request, init: FetchOptions): IPromise<Response> {
    return new Promise((resolve, reject) => {

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
                headers: _headers(res.headers),
            }

            resolve(new NodeResponse(res, options));
        });

        req.on('error', reject);

        if (request.body) {
            if (Buffer.isBuffer(request.body)) {
                req.write(request.body);
            } else if (isString(request.body)) {
                req.write(Buffer.from(<any>request.body));
            } else if (isFunction(request.body.read) && isFunction(request.body.pipe)) {

                return request.body.pipe(req);
            }
        }

        req.end();
    })
}

function httpsRequest(request: Request, init: FetchOptions): IPromise<Response> {
    return new Promise((resolve, reject) => {
        let url = URL.parse(request.url, false);

        var headers = {}
        request.headers.forEach((v, k) => {
            headers[k] = v;
        });


        var req = https.request({
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
                headers: _headers(res.headers),
            }

            resolve(new NodeResponse(res, options));
        });

        req.on('error', reject);

        if (request.body) {
            if (Buffer.isBuffer(request.body)) {
                req.write(request.body);
            } else if (isString(request.body)) {
                req.write(Buffer.from(<any>request.body));
            } else if (isFunction(request.body.read) && isFunction(request.body.pipe)) {

                return request.body.pipe(req);
            }
        }

        req.end();
    })
}


export function fetch(input: Request | string, init?: FetchOptions): IPromise<Response> {
    var request: Request;
    if (isRequest(input) && !init) {
        request = input
    } else {
        request = new Request(input, init)
    }

    init = init || {};


    let url = URL.parse(request.url, false);

    if (url.protocol == 'https:') {
        return httpsRequest(request, init);
    }

    return httpRequest(request, init);
}


function toBuffer(a) {
    return new Promise((resolve, reject) => {
        a.on('error', reject);
        let stream = concat(resolve);
        a.pipe(stream);
    })
}