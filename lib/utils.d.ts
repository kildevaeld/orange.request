export declare const isNode: boolean;
export declare function queryStringToParams(qs: string): Object;
export declare function queryParam(obj: any): string;
export declare function isValid(status: number): boolean;
export interface RequestOptions {
    method?: string;
    body?: string | FormData | Blob;
    mode?: string;
    credentials?: any;
    referrer?: any;
    headers?: any;
}
export interface FetchOptions extends RequestOptions {
    downloadProgress?: (e: ProgressEvent) => void;
    uploadProgress?: (e: ProgressEvent) => void;
}
