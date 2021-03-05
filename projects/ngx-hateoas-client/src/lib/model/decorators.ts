import { ResourceUtils } from '../util/resource.utils';
import { isArray, isEmpty, isNull, isUndefined } from 'lodash-es';
import { Resource } from './resource/resource';
import { EmbeddedResource } from './resource/embedded-resource';

export function HateoasResource(resourceName: string) {
  return <T extends new(...args: any[]) => any>(constructor: T) => {
    if (isNull(resourceName) || isUndefined(resourceName) || !resourceName) {
      throw new Error(`Init resource '${constructor.name}' error. HateoasResource decorator param resourceName can not be null/undefined/empty, please pass a valid resourceName.`);
    }

    if (!isInstanceOfParent(constructor, Resource)) {
      throw new Error(`Init resource '${constructor.name}' error. HateoasResource decorator applied only to 'Resource' type, you used it with ${ Object.getPrototypeOf(constructor) } type`);
    }
    constructor['__resourceName__'] = resourceName;
    ResourceUtils.RESOURCE_NAME_TYPE_MAP.set(resourceName, constructor);

    return constructor;
  };
}

export function HateoasEmbeddedResource(resourceNames: Array<string>) {
  return <T extends new(...args: any[]) => any>(constructor: T) => {
    if (isNull(resourceNames) || isUndefined(resourceNames) || (isArray(resourceNames) && isEmpty(resourceNames))) {
      throw new Error(`Init resource '${constructor.name}' error. HateoasEmbeddedResource decorator param resourceNames can not be null/undefined/empty, please pass a valid resourceNames.`);
    }

    if (!isInstanceOfParent(constructor, EmbeddedResource)) {
      throw new Error(`Init resource '${constructor.name}' error. HateoasEmbeddedResource decorator applied only to 'EmbeddedResource' type, you used it with ${ Object.getPrototypeOf(constructor) } type`);
    }
    resourceNames.forEach(resourceName => {
      ResourceUtils.EMBEDDED_RESOURCE_TYPE_MAP.set(resourceName, constructor);
    });
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
