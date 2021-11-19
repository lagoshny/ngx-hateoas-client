import { isObject } from 'lodash-es';

export function isEmbeddedResource(object: any) {
  // Embedded resource doesn't have self link in _links object
  return !isPagedResourceCollection(object) && !isResourceCollection(object) && isResourceObject(object) && !('self' in object._links);
}

export function isResource(object: any): boolean {
  return !isPagedResourceCollection(object) && !isResourceCollection(object) && isResourceObject(object) && ('self' in object._links);
}

export function isResourceCollection(object: any): boolean {
  return isObject(object) &&
         ('_embedded' in object) &&
         ('_links' in object) &&
         !('page' in object) &&
         (Object.keys(object).length === 2);
}

export function isPagedResourceCollection(object: any): boolean {
  return isObject(object) &&
         ('_embedded' in object) &&
         ('_links' in object) &&
         ('page' in object) &&
         (Object.keys(object).length === 3);
}

/**
 * Check that passed object has links property.
 *
 * @param object which need to check links property
 */
export function isResourceObject(object: any) {
  return isObject(object) && ('_links' in object);
}

/**
 * Defining resource type bypassed object.
 *
 * @param object that presumably is one of resource type
 */
export function getResourceType(object: any): string {
  if (isEmbeddedResource(object)) {
    return 'EmbeddedResource';
  } else if (isResource(object)) {
    return 'Resource';
  } else if (isResourceCollection(object)) {
    return 'ResourceCollection';
  } else if (isPagedResourceCollection(object)) {
    return 'PagedResourceCollection';
  } else {
    return 'Unknown';
  }
}
