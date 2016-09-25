"use strict";

define(["require", "exports", './utils'], function (require, exports, utils_1) {
    "use strict";

    var self = utils_1.isNode ? global : window;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = {
        searchParams: 'URLSearchParams' in self,
        iterable: 'Symbol' in self && 'iterator' in Symbol,
        blob: 'FileReader' in self && 'Blob' in self && function () {
            try {
                new Blob();
                return true;
            } catch (e) {
                return false;
            }
        }(),
        formData: 'FormData' in self,
        arrayBuffer: 'ArrayBuffer' in self
    };
});