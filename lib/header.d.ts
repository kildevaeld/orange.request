export declare class Headers {
    private map;
    constructor(headers?: any);
    [Symbol.iterator](): {
        next: () => {
            done: boolean;
            value: any;
        };
    };
    append(name: string, value: string): void;
    delete(name: string): void;
    get(name: string): string;
    getAll(name: string): string[];
    has(name: string): boolean;
    set(name: string, value: string): void;
    forEach(callback: (value: string, name: string) => any, thisArg?: any): void;
    keys(): {
        next: () => {
            done: boolean;
            value: any;
        };
    };
    values(): {
        next: () => {
            done: boolean;
            value: any;
        };
    };
    entries(): {
        next: () => {
            done: boolean;
            value: any;
        };
    };
}
