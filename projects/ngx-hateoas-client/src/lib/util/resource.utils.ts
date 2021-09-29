import { BaseResource } from '../model/resource/base-resource';
import { isEmbeddedResource, isResource } from '../model/resource-type';
import { ResourceCollection } from '../model/resource/resource-collection';
import { PagedResourceCollection } from '../model/resource/paged-resource-collection';
import { GetOption, Include, Link, PageData, RequestBody } from '../model/declarations';
import { Resource } from '../model/resource/resource';
import { EmbeddedResource } from '../model/resource/embedded-resource';
import { UrlUtils } from './url.utils';
import { Stage } from '../logger/stage.enum';
import { StageLogger } from '../logger/stage-logger';
import { isArray, isEmpty, isNil, isObject, isPlainObject } from 'lodash-es';
import { ConsoleLogger } from '../logger/console-logger';

/* tslint:disable:no-string-literal */
export class ResourceUtils {

  public static RESOURCE_NAME_TYPE_MAP: Map<string, any> = new Map<string, any>();
  public static RESOURCE_NAME_PROJECTION_TYPE_MAP: Map<string, any> = new Map<string, any>();
  public static RESOURCE_PROJECTION_REL_NAME_TYPE_MAP: Map<string, any> = new Map<string, any>();
  public static EMBEDDED_RESOURCE_TYPE_MAP: Map<string, any> = new Map<string, any>();

  private static resourceType: new() => BaseResource;

  private static resourceCollectionType: new() => ResourceCollection<BaseResource>;

  private static pagedResourceCollectionType: new(collection: ResourceCollection<BaseResource>, pageData?: PageData)
    => PagedResourceCollection<BaseResource>;

  private static embeddedResourceType: new() => EmbeddedResource;

  public static useResourceType(type: new () => Resource) {
    this.resourceType = type;
  }

  public static useResourceCollectionType(type: new() => ResourceCollection<BaseResource>) {
    this.resourceCollectionType = type;
  }

  public static usePagedResourceCollectionType(type: new(collection: ResourceCollection<BaseResource>)
    => PagedResourceCollection<BaseResource>) {
    this.pagedResourceCollectionType = type;
  }

  public static useEmbeddedResourceType(type: new() => EmbeddedResource) {
    this.embeddedResourceType = type;
  }

  public static instantiateResource<T extends BaseResource>(payload: object, isProjection?: boolean): T {
    // @ts-ignore
    if (isEmpty(payload)
      || (!isObject(payload['_links']) || isEmpty(payload['_links']))) {
      ConsoleLogger.warn('Incorrect resource object! Returned \'null\' value, because it has not \'_links\' array. Check that server send right resource object.', {incorrectResource: payload});
      return null;
    }

    return this.createResource(this.resolvePayloadProperties(payload, isProjection), isProjection);
  }

  private static resolvePayloadProperties<T extends BaseResource>(payload: object, isProjection?: boolean): object {
    for (const key of Object.keys(payload)) {
      if (key === 'hibernateLazyInitializer') {
        delete payload[key];
        continue;
      }
      if (key === '_links') {
        payload[key] = payload[key];
        continue;
      }
      payload[key] = this.resolvePayloadType(key, payload[key], isProjection);
    }

    return payload;
  }

  private static resolvePayloadType<T extends BaseResource>(key: string, payload: object, isProjection?: boolean): object {
    if (isNil(payload)) {
      return payload;
    } else if (isArray(payload)) {
      for (let i = 0; i < payload.length; i++) {
        payload[i] = this.resolvePayloadType(key, payload[i], isProjection);
      }
    } else if (isProjection && isPlainObject(payload)) {
      // Need to check resource projection relation props because some inner props can be objects that can be also resources
      payload = this.resolvePayloadProperties(this.createResourceProjectionRel(key, payload), isProjection);
    } else if (isEmbeddedResource(payload) || ResourceUtils.EMBEDDED_RESOURCE_TYPE_MAP.get(key)) {
      // Need to check embedded resource props because some inner props can be objects that can be also resources
      payload = this.resolvePayloadProperties(this.createEmbeddedResource(key, payload), isProjection);
    } else if (isResource(payload)) {
      // Need to check resource props because some inner props can be objects that can be also resources
      payload = this.resolvePayloadProperties(this.createResource(payload), isProjection);
    }

    return payload;
  }

  private static createResource<T extends BaseResource>(payload: any, isProjection?: boolean): T {
    const resourceName = this.findResourceName(payload);
    const resourceClass = isProjection
      ? ResourceUtils.RESOURCE_NAME_PROJECTION_TYPE_MAP.get(resourceName)
      : ResourceUtils.RESOURCE_NAME_TYPE_MAP.get(resourceName);
    if (resourceClass) {
      return Object.assign(new (resourceClass)() as T, payload);
    } else {
      ConsoleLogger.prettyWarn('Not found resource type when create resource: \'' + resourceName + '\' so used default Resource type, for this can be some reasons: \n\r' +
        '1) You did not pass resource property name as \'' + resourceName + '\' with @HateoasResource decorator. \n\r' +
        '2) You did not declare resource type in configuration "configuration.useTypes.resources". \n\r' +
        '\n\r Please check both points to to fix this issue.');

      return Object.assign(new this.resourceType(), payload);
    }
  }

  private static createResourceProjectionRel<T extends Resource>(relationName: string, payload: any): T {
    const relationClass = ResourceUtils.RESOURCE_PROJECTION_REL_NAME_TYPE_MAP.get(relationName);
    if (relationClass) {
      return Object.assign(new (relationClass)() as T, payload);
    } else {
      ConsoleLogger.prettyWarn('Not found resource relation type when create relation: \'' + relationName + '\' so used default Resource type, for this can be some reasons: \n\r' +
        'You did not pass relation type property with @ProjectionRel decorator on relation property \'' + relationName + '\'. \n\r' +
        '\n\rPlease check it to to fix this issue.');

      return Object.assign(new this.resourceType(), payload);
    }
  }

  private static createEmbeddedResource<T extends BaseResource>(key: string, payload: any): T {
    const resourceClass = ResourceUtils.EMBEDDED_RESOURCE_TYPE_MAP.get(key);
    if (resourceClass) {
      return Object.assign(new (resourceClass)() as T, payload);
    } else {
      ConsoleLogger.prettyWarn('Not found embedded resource type when create resource: \'' + key + '\' so used default EmbeddedResource type, for this can be some reasons:. \n\r' +
        '1) You did not pass embedded resource property name as \'' + key + '\' with @HateoasEmbeddedResource decorator. \n\r' +
        '2) You did not declare embedded resource type in configuration "configuration.useTypes.embeddedResources". \n\r' +
        '\n\r Please check both points to to fix this issue.');

      return Object.assign(new this.embeddedResourceType(), payload);
    }
  }

  public static instantiateResourceCollection<T extends ResourceCollection<BaseResource>>(payload: object, isProjection?: boolean): T {
    if (isEmpty(payload)
      || (!isObject(payload['_links']) || isEmpty(payload['_links']))
      || (!isObject(payload['_embedded']) || isEmpty(payload['_embedded']))) {
      return null;
    }
    const result = new this.resourceCollectionType() as T;
    for (const resourceName of Object.keys(payload['_embedded'])) {
      payload['_embedded'][resourceName].forEach((resource) => {
        result.resources.push(this.instantiateResource(resource, isProjection));
      });
    }
    result['_links'] = {...payload['_links']};

    return result;
  }

  public static instantiatePagedResourceCollection<T extends PagedResourceCollection<BaseResource>>(payload: object,
                                                                                                    isProjection?: boolean): T {
    const resourceCollection = this.instantiateResourceCollection(payload, isProjection);
    if (resourceCollection == null) {
      return null;
    }

    let result;
    if (payload['page']) {
      result = new this.pagedResourceCollectionType(resourceCollection, payload as PageData);
    } else {
      result = new this.pagedResourceCollectionType(resourceCollection);
    }
    return result as T;
  }

  /**
   * Resolve request body relations.
   * If request body has {@link Resource} value then this value will be replaced by resource self link.
   * If request body has {@link ValuesOption} it will be applied to body values.
   *
   * @param requestBody that contains the body directly and optional body values option {@link ValuesOption}
   */
  public static resolveValues(requestBody: RequestBody<any>): any {
    if (isEmpty(requestBody) || isNil(requestBody.body)
      || (isObject(requestBody.body) && isEmpty(requestBody.body))) {
      StageLogger.stageLog(Stage.RESOLVE_VALUES, {result: 'body is empty return null'});
      return null;
    }
    const body = requestBody.body;
    if (!isObject(body) || isArray(body)) {
      StageLogger.stageLog(Stage.RESOLVE_VALUES, {result: 'body is not object or array return as is'});
      return body;
    }

    const result: object = {};
    for (const key in body) {
      if (!body.hasOwnProperty(key)) {
        continue;
      }
      if (body[key] == null && Include.NULL_VALUES === requestBody?.valuesOption?.include) {
        result[key] = null;
        continue;
      }
      if (isNil(body[key])) {
        continue;
      }
      if (isArray(body[key])) {
        const array: any[] = body[key];
        result[key] = [];
        array.forEach((element) => {
          if (isResource(element)) {
            result[key].push(element?._links?.self?.href);
          } else {
            result[key].push(this.resolveValues({body: element, valuesOption: requestBody?.valuesOption}));
          }
        });
      } else if (isResource(body[key])) {
        result[key] = body[key]._links?.self?.href;
      } else if (isPlainObject(body[key])) {
        result[key] = this.resolveValues({body: body[key], valuesOption: requestBody?.valuesOption});
      } else {
        result[key] = body[key];
      }
    }
    StageLogger.stageLog(Stage.RESOLVE_VALUES, {result});

    return result;
  }

  /**
   * Assign {@link Resource} or {@link EmbeddedResource} properties to passed entity.
   *
   * @param entity to be converter to resource
   */
  public static initResource(entity: any): BaseResource | any {
    if (isResource(entity)) {
      return Object.assign(new this.resourceType(), entity);
    } else if (isEmbeddedResource(entity)) {
      return Object.assign(new this.embeddedResourceType(), entity);
    } else {
      return entity;
    }
  }

  /**
   * Define resource name based on resource links.
   * It will get link name that href equals to self href resource link.
   *
   * @param payload that can be a resource for which to find the name
   */
  private static findResourceName(payload: object): string {
    if (!payload || !payload['_links'] || !payload['_links'].self) {
      return '';
    }
    const resourceLinks = payload['_links'] as Link;
    if (isEmpty(resourceLinks) || isEmpty(resourceLinks.self) || isNil(resourceLinks.self.href)) {
      return '';
    }

    return UrlUtils.getResourceNameFromUrl(UrlUtils.removeTemplateParams(resourceLinks.self.href));
  }

  /**
   * Checks is a resource projection or not.
   *
   * @param payload object that can be resource or resource projection
   */
  private static isResourceProjection(payload: object): boolean {
    if (!payload || !payload['_links'] || !payload['_links'].self) {
      return false;
    }

    const selfLink = payload['_links'].self;
    const resourceLinks = payload['_links'];
    for (const key of Object.keys(resourceLinks)) {
      if (key !== 'self' && resourceLinks[key].href.includes(selfLink.href)) {
        return new URL(resourceLinks[key].href).search.includes('projection');
      }
    }

    return false;
  }

  /**
   * Try to get projectionName from resource type and set it to options. If resourceType has not projectionName then return options as is.
   *
   * @param resourceType from get projectionName
   * @param options to set projectionName
   */
  public static fillProjectionNameFromResourceType<T extends Resource>(resourceType: new () => T, options?: GetOption) {
    if (!resourceType) {
      return;
    }
    const projectionName = resourceType['__projectionName__'];
    if (projectionName) {
      options = options ? options : {params: {}};
      options = {
        ...options,
        params: {
          ...options.params,
          projection: projectionName
        }
      };
    }

    return options;
  }

}
