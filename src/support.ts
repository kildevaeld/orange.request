import {isNode} from './utils';

var self = isNode ? global : window

export default {
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