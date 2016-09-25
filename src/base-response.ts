declare var URLSearchParams;
import {Headers} from './header';
import support from './support'
import {IPromise, Promise} from 'orange';
import {isNode, isValid} from './utils';
import {BodyType, Response} from './types';

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

export function consumed(body: Response) {
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

var redirectStatuses = [301, 302, 303, 307, 308]

export abstract class BaseResponse implements Response {
    private _bodyUsed: boolean = false;
    private _bodyType: BodyType = BodyType.None
    protected _body: any;

    public type: string;
    public status: number;
    public ok: boolean;
    public statusText: string;
    headers: Headers
    url: string;

    get bodyUsed() {
        return this._bodyUsed;
    }

    get bodyType() {
        return this._bodyType;
    }

    get isValid() {
        return isValid(this.status);
    }

    constructor(body:any, options) {
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
        } else if (isNode) {
            this._bodyType = BodyType.Stream;
        } else {
            throw new Error('unsupported BodyType type')
        }

        this._body = body ? body : "";

        if (!this.headers.get('content-type')) {
            if (this._bodyType == BodyType.Text) {
                this.headers.set('content-type', 'text/plain; charset=UTF-8')
            } else if (this._bodyType == BodyType.Blob && this._body.type) {
                this.headers.set('content-type', this._body.type)
            } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
                this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8')
            }
        }
    }

    text() {
        if (this._bodyType == BodyType.Stream) {
            return this.blob().then( n => (<any>n).toString());
        }
        let rejected = consumed(this)
        if (rejected) return rejected;
        if (this._bodyType == BodyType.Blob) {
            return readBlobAsText(this._body);
        } else if (this._bodyType == BodyType.FormData) {
            throw new Error('could not read FormData body as text')
        }  else {
            return Promise.resolve(this._body);
        }
    }

    arrayBuffer(): IPromise<ArrayBuffer> {
        return this.blob().then(readBlobAsArrayBuffer)
    }

    stream(): IPromise<any> {
        return this.blob();
    }    

    blob() {
        if (!support.blob && !isNode) {
            return Promise.reject(new Error("blob not supported"));
        }
        let rejected = consumed(this)
        if (rejected) {
            return rejected;
        }
        if (this._bodyType == BodyType.Blob) {
            return Promise.resolve(this._body)
        } else if (this._bodyType == BodyType.FormData) {
            Promise.reject(new Error('could not read FormData body as blob'));
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

    abstract clone(): Response

    /*static error() {
        var response = new Response(null, { status: 0, statusText: '' })
        response.type = 'error'
        return response
    }

    static redirect(url, status) {
        if (redirectStatuses.indexOf(status) === -1) {
            throw new RangeError('Invalid status code')
        }

        return new Response(null, { status: status, headers: { location: url } })
    }*/

}