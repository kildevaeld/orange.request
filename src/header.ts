import support from './support'

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
                headers.map[key].forEach(v => this.append(key, v));
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
