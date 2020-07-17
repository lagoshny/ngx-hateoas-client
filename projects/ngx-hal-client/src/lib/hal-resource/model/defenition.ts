import { isObject } from 'rxjs/internal-compatibility';

function isObjectHasLinks(object: any) {
  return isObject(object) && ('_links' in object);
}

export function isEmbeddedResource(object: any) {
  // Embedded resource doesn't have self link in _links array
  return !isCollectionResource(object) && isObjectHasLinks(object) && !('self' in object['_links']);
}

export function isResource(object: any): boolean {
  return !isCollectionResource(object) && isObjectHasLinks(object) && ('self' in object['_links']);
}

export function isCollectionResource(object: any): boolean {
  return isObject(object) && ('_embedded' in object);
}

export function isPagedCollectionResource(object: any): boolean {
  return isCollectionResource(object) && ('page' in object);
}
