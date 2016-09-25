declare var require;
import {extend, isString, isObject, IPromise, isEmpty, Thenable} from 'orange';
import {queryParam, queryStringToParams, isNode, FetchOptions} from './utils'
import {Headers} from './header';
import {Response} from './types';
import {Request} from './request';
export enum HttpMethod {
    GET, PUT, POST, DELETE, HEAD, PATCH
}



export abstract class BaseHttpRequest {
    private _params: any = {};
    private _headers: Headers = new Headers();
    private _body: any;
    private _request: FetchOptions = {};
    
    constructor(private _method: HttpMethod, private _url: string) {
        if (!isNode) {
            this._headers.append('X-Requested-With', 'XMLHttpRequest');
        }
        this._request.method = HttpMethod[this._method];
    }

    uploadProgress(fn: (e: ProgressEvent) => void) {
        this._request.uploadProgress = fn;
        return this;
    }

    downloadProgress(fn: (e: ProgressEvent) => void) {
        this._request.downloadProgress = fn;
        return this;
    }

    header(field: string | { [key: string]: string }, value?: string) {
        if (isString(field) && isString(value)) {
            this._headers.append(field, value)
        } else if (isObject(field)) {
            for (let key in (<any>field)) {
                this._headers.append(key, field[key]);
            }
        }

        return this;
    }

    params(key: string | { [key: string]: any }, value?: any) {
        if (arguments.length === 1 && isObject(key)) {
            extend(this._params, key);
        } else if (arguments.length === 2) {
            this._params[<string>key] = value;
        }
        return this;
    }

    credentials(ret): this {
        this._request.credentials = ret;
        return this;
    }

    json<T>(data?: any): IPromise<T> {
        this.header('content-type', 'application/json; charset=utf-8');
        if (!isString(data)) {
            data = JSON.stringify(data);
        }
        return this.end(data)
        .then((res) => {
            return res.json<T>()
        });
    }

    text(data?:any): IPromise<string> {
        return this.end(data).then( r => r.text());
    }

    end(data?: any): IPromise<Response> {

        let url = this._url;
        if (data && data === Object(data) && this._method == HttpMethod.GET /* && check for content-type */) {
            var sep = (url.indexOf('?') === -1) ? '?' : '&';
            let d = sep + queryParam(data)
            url += d
            data = null;
        } else {
            this._request.body = data;
        }

        url = this._apply_params(url);

        this._request.headers = this._headers

        /*return fetch(url, this._request)
        .then((res: Response) => {
            return res;
        });*/
        return this._fetch(url, <any>this._request);

    }

    protected abstract _fetch(url: string, request:Request): IPromise<Response>;

    then<U>(onFulfilled?: (value: Response) => U | Thenable<U>, onRejected?: (error: any) => U | Thenable<U>): Thenable<U> {
        return this.end().then(onFulfilled, onRejected);
    }

    catch<U>(onRejected?: (error: any) => U | Thenable<U>): IPromise<U> {
        return this.end().catch(onRejected);
    }

    
    private _apply_params(url: string): string {
        let params = {};
        let idx = url.indexOf('?');
        if (idx > -1) {
            params = extend(params, queryStringToParams(url.substr(idx + 1)));
            url = url.substr(0, idx);
        }

        extend(params, this._params);

        if (!isEmpty(params)) {
            var sep = (url.indexOf('?') === -1) ? '?' : '&';
            url += sep + queryParam(params);
        }

        return url;
    }
}


