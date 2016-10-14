
import { BaseHttpRequest } from './base-http-request';
import { Request } from './request';
import { IPromise } from 'orange';
import { Response } from './types';

import { fetch } from './browser-fetch';

export class HttpRequest extends BaseHttpRequest {
    _fetch(url: string, request: Request): IPromise<Response> {
        return fetch(url, request);
    }
}

export { RequestOptions, FetchOptions, queryStringToParams, isValid, isNode, queryParam } from './utils';
export * from './request';
export * from './header';
export * from './types'
export { HttpMethod } from './base-http-request';
import { HttpMethod } from './base-http-request'
export function get(url: string): HttpRequest {
    return new HttpRequest(HttpMethod.GET, url);
}
export function post(url: string): HttpRequest {
    return new HttpRequest(HttpMethod.POST, url);
}
export function put(url: string): HttpRequest {
    return new HttpRequest(HttpMethod.PUT, url);
}
export function del(url: string): HttpRequest {
    return new HttpRequest(HttpMethod.DELETE, url);
}
export function patch(url: string): HttpRequest {
    return new HttpRequest(HttpMethod.PATCH, url);
}
export function head(url: string): HttpRequest {
    return new HttpRequest(HttpMethod.HEAD, url);
}