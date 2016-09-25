import { BaseHttpRequest } from './base-http-request';
import { Request } from './request';
import { IPromise } from 'orange';
import { Response } from './types';
export declare class HttpRequest extends BaseHttpRequest {
    _fetch(url: string, request: Request): IPromise<Response>;
}
export { RequestOptions, FetchOptions, queryStringToParams, isValid, isNode } from './utils';
export * from './request';
export * from './header';
export * from './types';
export declare function get(url: string): HttpRequest;
export declare function post(url: string): HttpRequest;
export declare function put(url: string): HttpRequest;
export declare function del(url: string): HttpRequest;
export declare function patch(url: string): HttpRequest;
export declare function head(url: string): HttpRequest;
