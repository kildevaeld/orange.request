import { IPromise } from 'orange';
import { Request } from './request';
import { FetchOptions } from './utils';
import { Response } from './types';
export declare function fetch(input: Request | string, init?: FetchOptions): IPromise<Response>;
