import { IPromise } from 'orange';
import { Request } from './request';
import { FetchOptions } from './utils';
import { Response } from './response';
export declare function fetch(input: Request | string, init?: FetchOptions): IPromise<Response>;
