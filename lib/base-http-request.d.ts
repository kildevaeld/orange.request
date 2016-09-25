import { IPromise, Thenable } from 'orange';
import { Response } from './types';
import { Request } from './request';
export declare enum HttpMethod {
    GET = 0,
    PUT = 1,
    POST = 2,
    DELETE = 3,
    HEAD = 4,
    PATCH = 5,
}
export declare abstract class BaseHttpRequest {
    private _method;
    private _url;
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
    credentials(ret: any): this;
    json<T>(data?: any): IPromise<T>;
    text(data?: any): IPromise<string>;
    end(data?: any): IPromise<Response>;
    protected abstract _fetch(url: string, request: Request): IPromise<Response>;
    then<U>(onFulfilled?: (value: Response) => U | Thenable<U>, onRejected?: (error: any) => U | Thenable<U>): Thenable<U>;
    catch<U>(onRejected?: (error: any) => U | Thenable<U>): IPromise<U>;
    private _apply_params(url);
}
