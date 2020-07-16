import { isObject } from 'rxjs/internal-compatibility';
import { Resource } from './resource';


export function isEmbeddedResource(object: any) {
    // Embedded resource doesn't have self link in _links array
    return isObject(object) && ('_links' in object) && !('self' in object['_links']);
}

export function isResource(value: Resource | string | number | boolean): value is Resource {
    return (value as Resource).getSelfLinkHref !== undefined
        && typeof (value as Resource).getSelfLinkHref === 'function';
}
