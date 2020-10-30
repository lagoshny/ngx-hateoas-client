import { isObject } from 'lodash-es';

export function isEmbeddedResource(object: any) {
  // Embedded resource doesn't have self link in _links object
  return !isPagedResourceCollection(object) && !isResourceCollection(object) && isResourceObject(object) && !('self' in object._links);
}

export function isResource(object: any): boolean {
  return !isPagedResourceCollection(object) && !isResourceCollection(object) && isResourceObject(object) && ('self' in object._links);
}

export function isResourceCollection(object: any): boolean {
  return isObject(object) && ('_embedded' in object) && !('page' in object);
}

export function isPagedResourceCollection(object: any): boolean {
  return isObject(object) && ('_embedded' in object) && ('page' in object);
}

/**
 * Check that passed object has links property.
 *
 * @param object which need to check links property
 */
export function isResourceObject(object: any) {
  return isObject(object) && ('_links' in object);
}
