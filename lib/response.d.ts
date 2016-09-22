import { Headers } from './header';
import { IPromise } from 'orange';
export declare enum BodyType {
    Blob = 0,
    Text = 1,
    FormData = 2,
    Stream = 3,
    None = 4,
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
    bodyType: BodyType;
    isValid: boolean;
    constructor(body: any, options: any);
    _initBody(body: any): void;
    text(): any;
    arrayBuffer(): IPromise<ArrayBuffer>;
    _streamToBuffer(): any;
    blob(): any;
    stream(): IPromise<any>;
    formData(): IPromise<FormData>;
    json<T>(): IPromise<T>;
    clone(): Response;
    static error(): Response;
    static redirect(url: any, status: any): Response;
}
