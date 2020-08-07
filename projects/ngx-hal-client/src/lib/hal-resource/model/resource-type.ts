import * as _ from 'lodash';

export function isEmbeddedResource(object: any) {
  // Embedded resource doesn't have self link in _links object
  return !isPagedCollectionResource(object) && !isCollectionResource(object) && isObjectHasLinks(object) && !('self' in object._links);
}

export function isResource(object: any): boolean {
  return !isPagedCollectionResource(object) && !isCollectionResource(object) && isObjectHasLinks(object) && ('self' in object._links);
}

export function isCollectionResource(object: any): boolean {
  return _.isObject(object) && ('_embedded' in object) && !('page' in object);
}

export function isPagedCollectionResource(object: any): boolean {
  return _.isObject(object) && ('_embedded' in object) && ('page' in object);
}

/**
 * Check that passed object has links property.
 *
 * @param object which need to check links property
 */
function isObjectHasLinks(object: any) {
  return _.isObject(object) && ('_links' in object);
}
