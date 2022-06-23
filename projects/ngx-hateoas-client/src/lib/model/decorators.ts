/* tslint:disable:no-string-literal */
import { ResourceUtils } from '../util/resource.utils';
import { isArray, isEmpty, isNull, isUndefined } from 'lodash-es';
import { Resource } from './resource/resource';
import { EmbeddedResource } from './resource/embedded-resource';
import { BaseResource } from './resource/base-resource';
import { DEFAULT_SOURCE_ALIAS, ResourceOption } from '../config/hateoas-configuration.interface';
import { RESOURCE_NAME_PROP, RESOURCE_OPTIONS_PROP } from './declarations';


/**
 * Decorator used to classes that extend {@link Resource} class to register 'resourceName' and 'resourceType'
 * information about this resource.
 *
 * @param resourceName resource name which will be used to build a resource URL.
 * @param options additional resource options see more {@link ResourceOption}.
 */
export function HateoasResource(resourceName: string, options: ResourceOption = {sourceAlias: DEFAULT_SOURCE_ALIAS}) {
  return <T extends new(...args: any[]) => any>(constructor: T) => {
    if (isNull(resourceName) || isUndefined(resourceName) || !resourceName) {
      throw new Error(`Init resource '${ constructor.name }' error. @HateoasResource decorator param resourceName can not be null/undefined/empty, please pass a valid resourceName.`);
    }

    if (!isInstanceOfParent(constructor, Resource)) {
      throw new Error(`Init resource '${ constructor.name }' error. @HateoasResource decorator applied only to 'Resource' type, you used it with ${ Object.getPrototypeOf(constructor) } type.`);
    }
    constructor[RESOURCE_NAME_PROP] = resourceName;
    constructor[RESOURCE_OPTIONS_PROP] = options;
    ResourceUtils.RESOURCE_NAME_TYPE_MAP.set(resourceName.toLowerCase(), constructor);

    return constructor;
  };
}

/**
 * Decorator used to classes that extend {@link EmbeddedResource} class to register 'relationNames' and 'resourceType'
 * information about this resource.
 *
 * @param relationNames names of the properties that using to hold this embedded resource in resource objects.
 */
export function HateoasEmbeddedResource(relationNames: Array<string>) {
  return <T extends new(...args: any[]) => any>(constructor: T) => {
    if (isNull(relationNames)
      || isUndefined(relationNames)
      || (isArray(relationNames) && isEmpty(relationNames))) {
      throw new Error(`Init resource '${ constructor.name }' error. @HateoasEmbeddedResource decorator param relationNames can not be null/undefined/empty, please pass a valid relationNames.`);
    }

    if (!isInstanceOfParent(constructor, EmbeddedResource)) {
      throw new Error(`Init resource '${ constructor.name }' error. @HateoasEmbeddedResource decorator applied only to 'EmbeddedResource' type, you used it with ${ Object.getPrototypeOf(constructor) } type.`);
    }
    relationNames.forEach(relationName => {
      ResourceUtils.EMBEDDED_RESOURCE_TYPE_MAP.set(relationName, constructor);
    });
  };
}

/**
 * Decorator used to create a projection representation of {@link Resource} heirs.
 *
 * @param resourceType type of resource that using for projection.
 * @param projectionName name of projection, will be used as projection request param.
 */
export function HateoasProjection(resourceType: new() => Resource, projectionName: string) {
  return <T extends new(...args: any[]) => any>(constructor: T) => {
    if (isNull(resourceType) || isUndefined(resourceType)) {
      throw new Error(`Init resource projection '${ constructor.name }' error. @HateoasProjection decorator param resourceType can not be null/undefined, please pass a valid resourceType.`);
    }
    if (isNull(projectionName) || isUndefined(projectionName) || !projectionName) {
      throw new Error(`Init resource projection '${ constructor.name }' error. @HateoasProjection decorator param projectionName can not be null/undefined/empty, please pass a valid projectionName.`);
    }

    if (!isInstanceOfParent(constructor, Resource)) {
      throw new Error(`Init resource projection '${ constructor.name }' error. @HateoasProjection decorator applied only to 'Resource' type, you used it with ${ Object.getPrototypeOf(constructor) } type.`);
    }
    constructor[RESOURCE_NAME_PROP] = resourceType[RESOURCE_NAME_PROP];
    constructor[RESOURCE_OPTIONS_PROP] = resourceType[RESOURCE_OPTIONS_PROP];
    constructor['__projectionName__'] = projectionName;
    ResourceUtils.RESOURCE_NAME_PROJECTION_TYPE_MAP.set(resourceType[RESOURCE_NAME_PROP].toLowerCase(), constructor);

    return constructor;
  };
}

/**
 * Decorator used to mark projection class properties that are resources and specifying class type used to create this relation.
 * This decorator used with class marked as {@link HateoasProjection}.
 *
 * @param relationType resource relation type that will be used to create resource with this type when parsed server response.
 */
export function ProjectionRel(relationType: new() => BaseResource) {
  return (target: object, propertyKey: string) => {
    if (isNull(relationType) || isUndefined(relationType)) {
      throw new Error(`Init resource projection '${ target.constructor.name }' relation type error. @ProjectionRel decorator param relationType can not be null/undefined, please pass a valid relationType.`);
    }

    ResourceUtils.RESOURCE_PROJECTION_REL_NAME_TYPE_MAP.set(propertyKey, relationType);
  };
}


function isInstanceOfParent(constructor: new (...args: any[]) => any, parentClass: any) {
  if (Object.getPrototypeOf(constructor).name === '') {
    return false;
  }
  if (Object.getPrototypeOf(constructor) === parentClass) {
    return true;
  }

  return isInstanceOfParent(Object.getPrototypeOf(constructor), parentClass);
}
