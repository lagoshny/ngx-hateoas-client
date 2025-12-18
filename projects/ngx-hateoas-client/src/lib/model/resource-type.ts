import { isObject } from 'lodash-es';
import { LibConfig } from '../config/lib-config';
import { ResourceCtor } from './decorators';
import { RESOURCE_NAME_PROP, RESOURCE_OPTIONS_PROP, RESOURCE_PROJECTION_NAME_PROP } from './declarations';
import { ResourceOption } from '../config/hateoas-configuration.interface';

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

  if (LibConfig.getConfig().halFormat?.collections?.embeddedOptional) {
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

/**
 * Get resource name from resource constructor meta info.
 * @throws Error when resource does not have a name.
 */
export function getResourceName(ctor: ResourceCtor): string {
  const name = ctor[RESOURCE_NAME_PROP];
  if (!name) {
    throw new Error(
      `Resource '${ctor.name}' does not have resourceName metadata`
    );
  }
  return name;
}

/**
 * Get resource options from resource constructor meta info.
 * @throws Error when resource does not have options.
 */
export function getResourceOptions(ctor: ResourceCtor): ResourceOption {
  const options = ctor[RESOURCE_OPTIONS_PROP];
  if (!options) {
    throw new Error(
      `Resource '${ctor.name}' does not have resourceOptions metadata`
    );
  }
  return options;
}

/**
 * Get resource projection from resource constructor meta info.
 */
export function getResourceProjection(ctor: ResourceCtor): string | undefined {
  return ctor[RESOURCE_PROJECTION_NAME_PROP];
}

/**
 * Returns {@code true} if value is [ResourceCtor], false otherwise.
 */
export function isResourceCtor(value: any): value is ResourceCtor {
  return typeof value === 'function';
}

