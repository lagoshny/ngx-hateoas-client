import * as _ from 'lodash';

export function isEmbeddedResource(object: any) {
  // Embedded resource doesn't have self link in _links array
  return !isCollectionResource(object) && isObjectHasLinks(object) && !('self' in object['_links']);
}

export function isResource(object: any): boolean {
  return !isCollectionResource(object) && isObjectHasLinks(object) && ('self' in object['_links']);
}

export function isCollectionResource(object: any): boolean {
  return _.isObject(object) && ('_embedded' in object);
}

export function isPagedCollectionResource(object: any): boolean {
  return isCollectionResource(object) && ('page' in object);
}

function isObjectHasLinks(object: any) {
  return _.isObject(object) && ('_links' in object);
}
