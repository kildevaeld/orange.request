import { IPromise } from 'orange';
import { Headers } from './header';
export declare enum BodyType {
    Blob = 0,
    Text = 1,
    FormData = 2,
    Stream = 3,
    None = 4,
}
export interface Response {
    type: string;
    status: number;
    ok: boolean;
    statusText: string;
    headers: Headers;
    url: string;
    bodyUsed: boolean;
    bodyType: BodyType;
    isValid: boolean;
    text(): IPromise<string>;
    arrayBuffer(): IPromise<ArrayBuffer>;
    blob(): IPromise<Blob>;
    stream(): IPromise<any>;
    formData(): IPromise<FormData>;
    json<T>(): IPromise<T>;
    clone(): Response;
}
