import { Headers } from './header';
import { RequestOptions } from './utils';
export { RequestOptions } from './utils';
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
