import { Headers } from './header';
import { IPromise } from 'orange';
import { BodyType, Response } from './types';
export declare function consumed(body: Response): IPromise<any>;
export declare abstract class BaseResponse implements Response {
    private _bodyUsed;
    private _bodyType;
    protected _body: any;
    type: string;
    status: number;
    ok: boolean;
    statusText: string;
    headers: Headers;
    url: string;
    readonly bodyUsed: boolean;
    readonly bodyType: BodyType;
    readonly isValid: boolean;
    constructor(body: any, options: any);
    _initBody(body: any): void;
    text(): any;
    arrayBuffer(): IPromise<ArrayBuffer>;
    stream(): IPromise<any>;
    blob(): any;
    formData(): IPromise<FormData>;
    json<T>(): IPromise<T>;
    abstract clone(): Response;
}
