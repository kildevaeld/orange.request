"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var support_1 = require('./support');
function normalizeName(name) {
    if (typeof name !== 'string') {
        name = String(name);
    }
    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
        throw new TypeError('Invalid character in header field name');
    }
    return name.toLowerCase();
}
function normalizeValue(value) {
    if (typeof value !== 'string') {
        value = String(value);
    }
    return value;
}
// Build a destructive iterator for the value list
function iteratorFor(items) {
    var iterator = {
        next: function next() {
            var value = items.shift();
            return { done: value === undefined, value: value };
        }
    };
    if (support_1.default.iterable) {
        iterator[Symbol.iterator] = function () {
            return iterator;
        };
    }
    return iterator;
}

var Headers = function () {
    function Headers(headers) {
        var _this = this;

        _classCallCheck(this, Headers);

        this.map = {};
        if (headers instanceof Headers) {
            var _loop = function _loop(key) {
                headers.map[key].forEach(function (v) {
                    return _this.append(key, v);
                });
            };

            for (var key in headers.map) {
                _loop(key);
            }
        } else if (headers) {
            var names = Object.getOwnPropertyNames(headers);
            for (var i = 0, ii = names.length; i < ii; i++) {
                this.append(names[i], headers[names[i]]);
            }
        }
    }

    _createClass(Headers, [{
        key: Symbol.iterator,
        value: function value() {
            return this.entries();
        }
    }, {
        key: 'append',
        value: function append(name, value) {
            name = normalizeName(name);
            value = normalizeValue(value);
            var list = this.map[name];
            if (!list) {
                list = [];
                this.map[name] = list;
            }
            list.push(value);
        }
    }, {
        key: 'delete',
        value: function _delete(name) {
            delete this.map[normalizeName(name)];
        }
    }, {
        key: 'get',
        value: function get(name) {
            var values = this.map[normalizeName(name)];
            return values ? values[0] : null;
        }
    }, {
        key: 'getAll',
        value: function getAll(name) {
            return this.map[normalizeName(name)] || [];
        }
    }, {
        key: 'has',
        value: function has(name) {
            return this.map.hasOwnProperty(normalizeName(name));
        }
    }, {
        key: 'set',
        value: function set(name, value) {
            this.map[normalizeName(name)] = [normalizeValue(value)];
        }
    }, {
        key: 'forEach',
        value: function forEach(callback, thisArg) {
            Object.getOwnPropertyNames(this.map).forEach(function (name) {
                this.map[name].forEach(function (value) {
                    callback.call(thisArg, value, name, this);
                }, this);
            }, this);
        }
    }, {
        key: 'keys',
        value: function keys() {
            var items = [];
            this.forEach(function (value, name) {
                items.push(name);
            });
            return iteratorFor(items);
        }
    }, {
        key: 'values',
        value: function values() {
            var items = [];
            this.forEach(function (value) {
                items.push(value);
            });
            return iteratorFor(items);
        }
    }, {
        key: 'entries',
        value: function entries() {
            var items = [];
            this.forEach(function (value, name) {
                items.push([name, value]);
            });
            return iteratorFor(items);
        }
    }]);

    return Headers;
}();

exports.Headers = Headers;