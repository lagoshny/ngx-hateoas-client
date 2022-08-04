/* tslint:disable:no-string-literal */
import { ResourceUtils } from '../util/resource.utils';
import { isArray, isBoolean, isEmpty, isNull, isUndefined } from 'lodash-es';
import { Resource } from './resource/resource';
import { EmbeddedResource } from './resource/embedded-resource';
import { BaseResource } from './resource/base-resource';
import {
  DEFAULT_ROUTE_NAME,
  PropertyOption,
  ResourceOption,
  ResourcePropertyConfig
} from '../config/hateoas-configuration.interface';
import { RESOURCE_JSON_PROPS, RESOURCE_NAME_PROP, RESOURCE_OPTIONS_PROP } from './declarations';


/**
 * Decorator used to classes that extend {@link Resource} class to register 'resourceName' and 'resourceType'
 * information about this resource.
 *
 * @param resourceName resource name which will be used to build a resource URL.
 * @param options additional resource options. See more {@link ResourceOption}.
 */
export function HateoasResource(resourceName: string, options: ResourceOption = {routeName: DEFAULT_ROUTE_NAME}) {
  return <T extends new(...args: any[]) => any>(constructor: T) => {
    if (isNull(resourceName) || isUndefined(resourceName) || !resourceName) {
      throw new Error(`Init resource '${ constructor.name }' error. @HateoasResource decorator param resourceName can not be null/undefined/empty, please pass a valid resourceName.`);
    }

    if (!isInstanceOfParent(constructor, Resource)) {
      throw new Error(`Init resource '${ constructor.name }' error. @HateoasResource decorator applied only to 'Resource' type, you used it with ${ Object.getPrototypeOf(constructor) } type.`);
    }
    constructor[RESOURCE_NAME_PROP] = resourceName;
    ResourceUtils.RESOURCE_NAME_TYPE_MAP.set(resourceName.toLowerCase(), constructor);

    if (!options?.routeName) {
      options = {
        routeName: DEFAULT_ROUTE_NAME
      };
    }
    constructor[RESOURCE_OPTIONS_PROP] = options;

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

/**
 * Проблема с добавление алиаса
 * Добавить алиас в target.constructor[RESOURCE_JSON_PROPS] проблем нет и пропарсить их от сервера
 * А как тогда отправлять на сервер значение через алиас? Получается надо дублировать данные target.constructor[RESOURCE_JSON_PROPS] , что не оч экономично
 * Либо бежать по всему target.constructor[RESOURCE_JSON_PROPS] объекту и искать поля, что не оч круто по производительности
 * А что если алиас у сервера один, а у фронта другой или их несколько? А если надо получать несколько алиасов? То какой отправлять на сервер?
 *
 * P.S. сделать дублирование для in и out в RESOURCE_JSON_PROPS!!!
 *
 * Проблема с игнором кейса, что делать когда проперти в JS в одном кейсе, а на сервере в другом, в каком отправлять на сервер?
 * Если мы будем отправлять как есть, то отправится от фронта без игнор кейса и сервер упадёт.
 * Так же если на сервере не стоит игнор кейс в любом случае у нас будут проблемы т.к. при игноре кейса на фронте мы назад будем отдавать ответ в кейсе фронта
 *
 * Подумать о том, что если JsonProperty будет принимать функцию в котором будет парсится занчение от сервера и приниматься сюда (подумать а как отдавать на сервер)?
 *
 */
// TODO: docs, tests
export function JsonProperty(options: PropertyOption) {
  return (target: BaseResource, propertyKey: string) => {
    if (isNull(options) || isUndefined(options)) {
      throw new Error(`Init property format error. @JsonProperty decorator param options can not be null/undefined, please pass a valid options.`);
    }
    if (isEmpty(options.name)) {
      options.name = propertyKey;
    }
    if (isNull(options.ignoreCase) || isUndefined(options.ignoreCase) || !isBoolean(options.ignoreCase)) {
      options.ignoreCase = false;
    }
    if (isEmpty(target.constructor[RESOURCE_JSON_PROPS])) {
      target.constructor[RESOURCE_JSON_PROPS] = {
        deserialize: {},
        serialize: {}
      } as ResourcePropertyConfig;
    }

    const deserializePropKey = options.ignoreCase ? options.name.toLowerCase() : options.name;
    target.constructor[RESOURCE_JSON_PROPS].deserialize[deserializePropKey] = {
      propName: propertyKey,
      ignoreCase: options.ignoreCase
    };
    target.constructor[RESOURCE_JSON_PROPS].serialize[propertyKey] = {
      propName: options.name
    };
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
