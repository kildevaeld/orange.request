import {IPromise} from 'orange';
import {Headers} from './header';
export enum BodyType {
    Blob, Text, FormData, Stream, None
}

export interface Response {
	type: string;
    status: number;
    ok: boolean;
    statusText: string;
    headers: Headers
    url: string;

    bodyUsed: boolean;
       
    bodyType: BodyType;
    isValid: boolean;
    text(): IPromise<string>
    arrayBuffer(): IPromise<ArrayBuffer>;
    blob(): IPromise<Blob>;
    stream(): IPromise<any>;
    formData(): IPromise<FormData>;
    json<T>(): IPromise<T>;
    clone(): Response;  
};