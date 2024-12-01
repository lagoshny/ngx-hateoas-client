import { isObject } from 'lodash-es';
import { LibConfig } from '../config/lib-config';

export function isEmbeddedResource(object: any) {
  // Embedded resource doesn't have self link in _links object
  return !isPagedResourceCollection(object) && !isResourceCollection(object)
    && isResourceObject(object) && !('self' in (object._links as object));
}

export function isResource(object: any): boolean {
  return !isPagedResourceCollection(object) && !isResourceCollection(object)
    && isResourceObject(object) && ('self' in (object._links as object));
}

export function isResourceCollection(object: any): boolean {
  const baseCondition = isObject(object) &&
    ('_links' in object) &&
    !('page' in object);
  if (!baseCondition) {
    return false;
  }

  if (LibConfig.getConfig().halFormat.collections.embeddedOptional) {
    return baseCondition && (Object.keys(object).length === 1 ||
      '_embedded' in object && Object.keys(object).length === 2);
  } else {
    return baseCondition && '_embedded' in object && Object.keys(object).length === 2;
  }
}

export function isPagedResourceCollection(object: any): boolean {
  const baseCondition = isObject(object) &&
    ('_links' in object) &&
    ('page' in object);
  if (!baseCondition) {
    return false;
  }

  if (LibConfig.getConfig().halFormat.collections.embeddedOptional) {
    return baseCondition && (Object.keys(object).length === 2 ||
      '_embedded' in object && Object.keys(object).length === 3);
  } else {
    return baseCondition && '_embedded' in object && Object.keys(object).length === 3;
  }
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
