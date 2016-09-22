
export const isNode = !(new Function("try {return this===window;}catch(e){ return false;}"))();


export function queryStringToParams(qs: string): Object {
    var kvp, k, v, ls, params = {}, decode = decodeURIComponent;
    var kvps = qs.split('&');
    for (var i = 0, l = kvps.length; i < l; i++) {
        var param = kvps[i];
        kvp = param.split('='), k = kvp[0], v = kvp[1];
        if (v == null) v = true;
        k = decode(k), v = decode(v), ls = params[k];
        if (Array.isArray(ls)) ls.push(v);
        else if (ls) params[k] = [ls, v];
        else params[k] = v;
    }
    return params;
}

export function queryParam(obj): string {
    return Object.keys(obj).reduce(function(a, k) { a.push(k + '=' + encodeURIComponent(obj[k])); return a }, []).join('&')
}
/*const fileProto = /^file:/;
export function isValid(xhr, url) {
    return (xhr.status >= 200 && xhr.status < 300) ||
        (xhr.status === 304) ||
        (xhr.status === 0 && fileProto.test(url)) ||
        (xhr.status === 0 && window.location.protocol === 'file:')
};*/

export function isValid(status:number) {
    return (status >= 200 && status < 300) || (status === 304)
};

export interface RequestOptions {
    method?: string;
    body?: string|FormData|Blob;
    mode?: string;
    credentials?:any;
    referrer?: any;
    headers?:any;
}

export interface FetchOptions extends RequestOptions {
    downloadProgress?:(e:ProgressEvent) => void;
    uploadProgress?:(e:ProgressEvent) => void;
}