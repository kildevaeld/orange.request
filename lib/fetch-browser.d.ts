import { IPromise } from 'orange';
import { FetchOptions } from './utils';
import { Request } from './request';
import { Response } from './response';
export declare function fetch(input: Request | string, init?: FetchOptions): IPromise<Response>;
