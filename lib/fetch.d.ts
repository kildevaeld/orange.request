import { IPromise } from 'orange';
export declare class Headers {
    private map;
    constructor(headers?: any);
    [Symbol.iterator](): {
        next: () => {
            done: boolean;
            value: any;
        };
    };
    append(name: string, value: string): void;
    delete(name: string): void;
    get(name: string): string;
    getAll(name: string): string[];
    has(name: string): boolean;
    set(name: string, value: string): void;
    forEach(callback: (value: string, name: string) => any, thisArg?: any): void;
    keys(): {
        next: () => {
            done: boolean;
            value: any;
        };
    };
    values(): {
        next: () => {
            done: boolean;
            value: any;
        };
    };
    entries(): {
        next: () => {
            done: boolean;
            value: any;
        };
    };
}
export declare class Response {
    private _bodyUsed;
    private _bodyType;
    private _body;
    type: string;
    status: number;
    ok: boolean;
    statusText: string;
    headers: Headers;
    url: string;
    bodyUsed: boolean;
    constructor(body: any, options: any);
    _initBody(body: any): void;
    text(): IPromise<any>;
    arrayBuffer(): IPromise<ArrayBuffer>;
    blob(): IPromise<any>;
    formData(): IPromise<FormData>;
    json<T>(): IPromise<T>;
    clone(): Response;
    static error(): Response;
    static redirect(url: any, status: any): Response;
}
export interface RequestOptions {
    method?: string;
    body?: string | FormData | Blob;
    mode?: string;
    credentials?: any;
    referrer?: any;
    headers?: Headers;
}
export declare function isRequest(a: any): a is Request;
export declare class Request {
    url: string;
    credentials: any;
    headers: Headers;
    method: string;
    mode: any;
    referrer: any;
    body: any;
    constructor(input: string | Request, options?: RequestOptions);
    clone(): Request;
}
export interface FetchOptions extends RequestOptions {
    downloadProgress?: (e: ProgressEvent) => void;
    uploadProgress?: (e: ProgressEvent) => void;
}
export declare function fetch(input: Request | string, init?: FetchOptions): IPromise<Response>;
