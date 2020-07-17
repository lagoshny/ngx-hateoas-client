import { isObject } from 'rxjs/internal-compatibility';


export function isEmbeddedResource(object: any) {
    // Embedded resource doesn't have self link in _links array
    return isObject(object) && ('_links' in object) && !('self' in object['_links']);
}

export function isResource(object: any): boolean {
    return isObject(object) && ('_links' in object) && ('self' in object['_links']);
}
