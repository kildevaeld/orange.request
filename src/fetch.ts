
declare var URLSearchParams;
import {Promise, xmlHttpRequest, IPromise} from 'orange';
import {isValid} from './utils';

const support = {
    searchParams: 'URLSearchParams' in self,
    iterable: 'Symbol' in self && 'iterator' in Symbol,
    blob: 'FileReader' in self && 'Blob' in self && (function () {
        try {
            new Blob()
            return true
        } catch (e) {
            return false
        }
    })(),
    formData: 'FormData' in self,
    arrayBuffer: 'ArrayBuffer' in self
}


function normalizeName(name) {
    if (typeof name !== 'string') {
        name = String(name)
    }
    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
        throw new TypeError('Invalid character in header field name')
    }
    return name.toLowerCase()
}

function normalizeValue(value) {
    if (typeof value !== 'string') {
        value = String(value)
    }
    return value
}

// Build a destructive iterator for the value list
function iteratorFor(items) {
    var iterator = {
        next: function () {
            var value = items.shift()
            return { done: value === undefined, value: value }
        }
    }

    if (support.iterable) {
        iterator[Symbol.iterator] = function () {
            return iterator
        }
    }

    return iterator
}

export class Headers {
    private map: { [key: string]: string[] } = {};
    constructor(headers?) {
        if (headers instanceof Headers) {
            for (let key in headers.map) {
                this.append(key, headers.map[key])
            }
        } else if (headers) {
            let names = Object.getOwnPropertyNames(headers)
            for (let i = 0, ii = names.length; i < ii; i++) {
                this.append(names[i], headers[names[i]]);
            }
        }
    }

    [Symbol.iterator]() {
        return this.entries();
    }

    append(name: string, value: string) {
        name = normalizeName(name)
        value = normalizeValue(value)
        
        var list = this.map[name]
        if (!list) {
            list = []
            this.map[name] = list
        }
        list.push(value)
    }

    delete(name: string) {
        delete this.map[normalizeName(name)]
    }

    get(name: string) {
        var values = this.map[normalizeName(name)]
        return values ? values[0] : null
    }

    getAll(name: string) {
        return this.map[normalizeName(name)] || []
    }

    has(name: string) {
        return this.map.hasOwnProperty(normalizeName(name))
    }

    set(name: string, value: string) {
        this.map[normalizeName(name)] = [normalizeValue(value)]
    }

    forEach(callback: (value: string, name: string) => any, thisArg?: any) {
        Object.getOwnPropertyNames(this.map).forEach(function (name) {
            this.map[name].forEach(function (value) {
                callback.call(thisArg, value, name, this)
            }, this);
        }, this);
    }

    keys() {
        var items = []
        this.forEach(function (value, name) { items.push(name) })
        return iteratorFor(items)
    }

    values() {
        var items = []
        this.forEach(function (value) { items.push(value) })
        return iteratorFor(items)
    }

    entries() {
        var items = []
        this.forEach(function (value, name) { items.push([name, value]) })
        return iteratorFor(items)
    }

}


function consumed(body: Response) {
    if (body.bodyUsed) {
        return Promise.reject(new TypeError('Already read'))
    }
    (<any>body)._bodyUsed = true
}

function fileReaderReady(reader) {
    return new Promise(function (resolve, reject) {
        reader.onload = function () {
            resolve(reader.result)
        }
        reader.onerror = function () {
            reject(reader.error)
        }
    })
}

function readBlobAsArrayBuffer(blob) {
    var reader = new FileReader()
    reader.readAsArrayBuffer(blob)
    return fileReaderReady(reader)
}

function readBlobAsText(blob) {
    var reader = new FileReader()
    reader.readAsText(blob)
    return fileReaderReady(reader)
}

enum BodyType {
    Blob, Text, FormData, None
}

var redirectStatuses = [301, 302, 303, 307, 308]

export class Response {
    private _bodyUsed: boolean = false;
    private _bodyType: BodyType = BodyType.None
    private _body: any;

    public type: string;
    public status: number;
    public ok: boolean;
    public statusText: string;
    headers: Headers
    url: string;
    get bodyUsed() {
        return this._bodyUsed;
    }

    constructor(body, options) {
        options = options || {};
        this.type = 'default'
        this.status = options.status
        this.ok = this.status >= 200 && this.status < 300
        this.statusText = options.statusText
        this.headers = options.headers instanceof Headers ? options.headers : new Headers(options.headers)
        this.url = options.url || ''
        this._initBody(body);

    }

    _initBody(body) {
        if (typeof body === 'string' || (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body))) {
            this._bodyType = BodyType.Text;
        } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
            this._bodyType = BodyType.Blob
        } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
            this._bodyType = BodyType.FormData;
        } else if (!body) {
            this._bodyType = BodyType.None;
        } else if (support.arrayBuffer && ArrayBuffer.prototype.isPrototypeOf(body)) {
            // Only support ArrayBuffers for POST method.
            // Receiving ArrayBuffers happens via Blobs, instead.
        } else {
            throw new Error('unsupported BodyInit type')
        }

        this._body = body ? body : "";

        if (!this.headers.get('content-type')) {
            if (this._bodyType == BodyType.Text) {
                this.headers.set('content-type', 'text/plain;charset=UTF-8')
            } else if (this._bodyType == BodyType.Blob && this._body.type) {
                this.headers.set('content-type', this._body.type)
            } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
                this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8')
            }
        }
    }

    text() {
        let rejected = consumed(this)
        if (rejected) return rejected;
        if (this._bodyType == BodyType.Blob) {
            return readBlobAsText(this._body);
        } else if (this._bodyType == BodyType.FormData) {
            throw new Error('could not read FormData body as text')
        } else {
            return Promise.resolve(this._body);
        }
    }

    arrayBuffer(): IPromise<ArrayBuffer> {
        return this.blob().then(readBlobAsArrayBuffer)
    }

    blob() {
        if (!support.blob) {
            return Promise.reject(new Error("blob not supported"));
        }
        let rejected = consumed(this)
        if (rejected) {
            return rejected;
        }
        if (this._bodyType == BodyType.Blob) {
            return Promise.resolve(this._body)
        } else if (this._bodyType == BodyType.FormData) {
            throw new Error('could not read FormData body as blob')
        } else {
            return Promise.resolve(new Blob([this._body]));
        }
    }

    formData(): IPromise<FormData> {
        if (!support.formData) {
            return Promise.reject(new Error("form data not supported"));
        }
        return this.text().then(decode);
    }

    json<T>(): IPromise<T> {
        return this.text().then(JSON.parse);
    }

    clone() {
        return new Response(this._body, {
            status: this.status,
            statusText: this.statusText,
            headers: new Headers(this.headers),
            url: this.url
        })
    }

    static error() {
        var response = new Response(null, { status: 0, statusText: '' })
        response.type = 'error'
        return response
    }

    static redirect(url, status) {
        if (redirectStatuses.indexOf(status) === -1) {
            throw new RangeError('Invalid status code')
        }

        return new Response(null, { status: status, headers: { location: url } })
    }

}


// HTTP methods whose capitalization should be normalized
var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT']

function normalizeMethod(method) {
    var upcased = method.toUpperCase()
    return (methods.indexOf(upcased) > -1) ? upcased : method
}

export interface RequestOptions {
    method?: string;
    body?: string|FormData|Blob;
    mode?: string;
    credentials?:any;
    referrer?: any;
    headers?:Headers;
}

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

function decode(body) {
    var form = new FormData()
    body.trim().split('&').forEach(function (bytes) {
        if (bytes) {
            var split = bytes.split('=')
            var name = split.shift().replace(/\+/g, ' ')
            var value = split.join('=').replace(/\+/g, ' ')
            form.append(decodeURIComponent(name), decodeURIComponent(value))
        }
    })
    return form
}

function headers(xhr) {
    var head = new Headers()
    var pairs = (xhr.getAllResponseHeaders() || '').trim().split('\n')
    for (let i = 0, ii = pairs.length; i < ii; i++) {
        var split = pairs[i].trim().split(':')
        var key = split.shift().trim()
        var value = split.join(':').trim()
        head.append(key, value)
    }
    
    return head;
}


export interface FetchOptions extends RequestOptions {
    downloadProgress?:(e:ProgressEvent) => void;
    uploadProgress?:(e:ProgressEvent) => void;
}


export function fetch(input:Request|string, init?:FetchOptions): IPromise<Response> {
    return new Promise(function (resolve, reject) {
        var request
        if (isRequest(input) && !init) {
            request = input
        } else {
            request = new Request(input, init)
        }

        init = init||{};

        var xhr = xmlHttpRequest();

        function responseURL() {
            if ('responseURL' in xhr) {
                return (<any>xhr).responseURL
            }
            // Avoid security warnings on getResponseHeader when not allowed by CORS
            if (/^X-Request-URL:/m.test(xhr.getAllResponseHeaders())) {
                return xhr.getResponseHeader('X-Request-URL')
            }
            return
        }

        xhr.onload = function () {
            var options = {
                status: xhr.status,
                statusText: xhr.statusText,
                headers: headers(xhr),
                url: responseURL()
            }
            var body = 'response' in xhr ? xhr.response : xhr.responseText
            resolve(new Response(body, options))
        }

        xhr.onerror = function () {
            reject(new TypeError('Network request failed'))
        }

        xhr.ontimeout = function () {
            reject(new TypeError('Network request failed: timeout'))
        }

        xhr.open(request.method, request.url, true)

        if (request.credentials === 'include') {
            xhr.withCredentials = true
        }

        if ('responseType' in xhr && support.blob) {
            xhr.responseType = 'blob'
        }

        request.headers.forEach(function (value, name) {
            xhr.setRequestHeader(name, value)
        });

        if (init.downloadProgress) {
            xhr.onprogress = init.downloadProgress;
        } 
        if (init.uploadProgress || xhr.upload) {
            xhr.upload.onprogress = init.uploadProgress;
        }
        console.log('BODY', request)
        xhr.send(typeof request.body === 'undefined' ? null : request.body)

    });
}
