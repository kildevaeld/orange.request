import { IPromise } from 'orange';
import { Response } from './response';
export declare enum HttpMethod {
    GET = 0,
    PUT = 1,
    POST = 2,
    DELETE = 3,
    HEAD = 4,
    PATCH = 5,
}
export declare class HttpRequest {
    private _method;
    private _url;
    private _xhr;
    private _params;
    private _headers;
    private _body;
    private _request;
    constructor(_method: HttpMethod, _url: string);
    uploadProgress(fn: (e: ProgressEvent) => void): this;
    downloadProgress(fn: (e: ProgressEvent) => void): this;
    header(field: string | {
        [key: string]: string;
    }, value?: string): this;
    params(key: string | {
        [key: string]: any;
    }, value?: any): this;
    withCredentials(ret: any): HttpRequest;
    json<T>(data?: any, throwOnInvalid?: boolean): IPromise<T>;
    end<T>(data?: any, throwOnInvalid?: boolean): IPromise<Response>;
    private _apply_params(url);
}
export declare function get(url: string): HttpRequest;
export declare function post(url: string): HttpRequest;
export declare function put(url: string): HttpRequest;
export declare function del(url: string): HttpRequest;
export declare function patch(url: string): HttpRequest;
export declare function head(url: string): HttpRequest;
