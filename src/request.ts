import {Headers} from './header';
import {RequestOptions} from './utils';
// HTTP methods whose capitalization should be normalized
var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT']

function normalizeMethod(method) {
    var upcased = method.toUpperCase()
    return (methods.indexOf(upcased) > -1) ? upcased : method
}

export {RequestOptions} from './utils';

export function isRequest(a:any): a is Request {
    return Request.prototype.isPrototypeOf(a) || a instanceof Request;
}


export class Request {
    url: string;
    credentials: any;
    headers: Headers;
    method: string;
    mode: any;
    referrer: any;
    body: any;

    constructor(input:string|Request, options:RequestOptions = {}) {
        options = options || {};
        let body = options.body;
        if (isRequest(input)) {
            this.url = input.url;
            this.credentials = input.credentials
            if (!options.headers) {
                this.headers = new Headers(options.headers);
            }
            this.method = input.method;
            this.mode = input.mode;
        } else {
            this.url = input;
        }

        this.credentials = options.credentials || this.credentials || 'omit'
        if (options.headers || !this.headers) {
            this.headers = new Headers(options.headers)
        }
        this.method = normalizeMethod(options.method || this.method || 'GET')
        this.mode = options.mode || this.mode || null
        this.referrer = null

        if ((this.method === 'GET' || this.method === 'HEAD') && body) {
            throw new TypeError('Body not allowed for GET or HEAD requests')
        }
        this.body = body;
    }

    clone() {
        return new Request(this);
    }
}