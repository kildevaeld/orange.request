import {extend, isString, isObject, IPromise, isEmpty} from 'orange';
import {queryParam, queryStringToParams} from './utils'
import {Headers, FetchOptions, Response, fetch} from './fetch';

export enum HttpMethod {
    GET, PUT, POST, DELETE, HEAD, PATCH
}

export class HttpRequest {
    private _xhr: XMLHttpRequest;
    private _params: any = {};
    private _headers: Headers = new Headers();
    private _body: any;
    private _request: FetchOptions = {};
    
    constructor(private _method: HttpMethod, private _url: string) {
        this._headers.append('X-Requested-With', 'XMLHttpRequest');
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

    withCredentials(ret): HttpRequest {
        this._xhr.withCredentials = ret;
        return this;
    }

    json<T>(data?: any, throwOnInvalid:boolean = false): IPromise<T> {
        this.header('content-type', 'application/json; charset=utf-8');
        if (!isString(data)) {
            data = JSON.stringify(data);
        }
        return this.end<string>(data, throwOnInvalid)
        .then((res) => {
            return res.json<T>()
        });
    }

    end<T>(data?: any, throwOnInvalid:boolean = false): IPromise<Response> {

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


        return fetch(url, this._request)
        .then(res => {
            if (!res.ok && throwOnInvalid) {
                throw new Error(res.statusText);
            }
            return res;
        });

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

export function get(url:string): HttpRequest {
    return new HttpRequest(HttpMethod.GET, url);
}
export function post(url:string): HttpRequest {
    return new HttpRequest(HttpMethod.POST, url);
}
export function put(url:string): HttpRequest {
    return new HttpRequest(HttpMethod.PUT, url);
}
export function del(url:string): HttpRequest {
    return new HttpRequest(HttpMethod.DELETE, url);
}
export function patch(url:string): HttpRequest {
    return new HttpRequest(HttpMethod.PATCH, url);
}
export function head(url:string): HttpRequest {
    return new HttpRequest(HttpMethod.HEAD, url);
}
