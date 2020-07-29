import { BaseResource } from '../hal-resource/model/base-resource';
import { isEmbeddedResource, isResource } from '../hal-resource/model/resource-type';
import { CollectionResource } from '../hal-resource/model/collection-resource';
import { PagedCollectionResource } from '../hal-resource/model/paged-collection-resource';
import { Include, Link, PageData, ResourceOption } from '../hal-resource/model/declarations';
import * as _ from 'lodash';
import { Resource } from '../hal-resource/model/resource';
import { EmbeddedResource } from '../hal-resource/model/embedded-resource';

export class ResourceUtils {

  private static resourceType: new() => BaseResource;

  private static collectionResourceType: new() => CollectionResource<BaseResource>;

  private static pagedCollectionResourceType: new(collection: CollectionResource<BaseResource>, pageData?: PageData) => PagedCollectionResource<BaseResource>;

  private static embeddedResourceType: new() => EmbeddedResource;

  public static useResourceType(type: new () => Resource) {
    this.resourceType = type;
  }

  public static useCollectionResourceType(type: new() => CollectionResource<BaseResource>) {
    this.collectionResourceType = type;
  }

  public static usePagedCollectionResourceType(type: new(collection: CollectionResource<BaseResource>) => PagedCollectionResource<BaseResource>) {
    this.pagedCollectionResourceType = type;
  }

  public static useEmbeddedResourceType(type: new() => BaseResource) {
    this.embeddedResourceType = type;
  }

  public static instantiateResource<T extends BaseResource>(payload: any): T {
    // TODO: Все эти проверки используются для embedded ресурсов, типа коллекций, подумать как их упроситить
    for (const key of Object.keys(payload)) {
      if (_.isArray(payload[key])) {
        for (let i = 0; i < payload[key].length; i++) {
          if (isEmbeddedResource(payload[key][i]) && this.embeddedResourceType) {
            payload[key][i] = ResourceUtils.createResource(new this.embeddedResourceType(), payload[key][i]);
          }
        }
      } else if (isEmbeddedResource(payload[key]) && this.embeddedResourceType) {
        payload[key] = ResourceUtils.createResource(new this.embeddedResourceType(), payload[key]);
      }
    }

    const resource = ResourceUtils.createResource(new this.resourceType() as T, payload);
    resource['resourceName'] = this.findResourceName(resource);

    return resource;
  }


  // Type - тип ресурсов внутри коллекции, payload - ответ от сервера, result - результирующий массив, куда будем добалвять ресурсы
  static instantiateCollectionResource<T extends CollectionResource<BaseResource>>(payload: any,
                                                                                   // result: ResourceArray<T>,
                                                                                   // builder?: SubTypeBuilder
  ): T {
    const result = new this.collectionResourceType() as T;
    result['_links'] = payload['_links'];
    const resourceCollection = payload['_embedded'];
    if (resourceCollection) {
      for (const resourceName of Object.keys(resourceCollection)) {
        const resources: Array<any> = resourceCollection[resourceName];
        resources.forEach((resource) => {
          // Создаём новый экземпляр ресурса
          // let instance: T = new type();
          // Инициализируем подтипы
          // instance = this.searchSubtypes(builder, embeddedClassName, instance);
          result.resources.push(this.instantiateResource(resource));
          // result._embedded['resourceName'].push(this.instantiateResource(new class extends BaseResource {}(), resource));
        });
      }
    }

    return result;
  }

  static instantiatePagedCollectionResource<T extends PagedCollectionResource<BaseResource>>(payload: any,
                                                                                             // result: ResourceArray<T>,
                                                                                             // builder?: SubTypeBuilder
  ): T {
    const resourceCollection = this.instantiateCollectionResource(payload);
    let result;
    if (payload.page && payload._links) {
      result = new this.pagedCollectionResourceType(resourceCollection, payload as PageData);
    } else {
      result = new this.pagedCollectionResourceType(resourceCollection);
    }
    return result as T;
  }


  private static createResource<T extends BaseResource>(entity: T, payload: any): T {
    for (const p in payload) {
      entity[p] = payload[p];
    }
    return entity;
  }

  static resolveRelations(resource: Resource, options?: ResourceOption): object {
    const result: object = {};
    for (const key in resource) {
      if (resource[key] == null && Include.NULL_VALUES === options?.include) {
        result[key] = null;
      } else if (!_.isNull(resource[key]) && !_.isUndefined(resource[key])) {
        if (_.isArray(resource[key])) {
          const array: any[] = resource[key];
          result[key] = [];
          array.forEach((element) => {
            result[key].push(this.resolveRelations(element));
            // if (!_.isFunction(element) && !_.isObject(element)) {
            //   result[key].push(element);
            // } else if (isResource(element)) {
            //   result[key].push(element['_links'].self.href);
            // } else {
            //   result[key].push(this.resolveRelations(element));
            // }
          });
        } else if (isResource(resource[key])) {
          result[key] = resource[key]._links.self.href;
        } else {
          result[key] = resource[key];
        }
      }
    }
    return result;
  }

  public static initResource(resource: BaseResource): BaseResource {
    if (isResource(resource)) {
      return Object.assign(new this.resourceType(), resource);
    } else if (isEmbeddedResource(resource)) {
      return Object.assign(new this.embeddedResourceType(), resource);
    } else {
      return resource;
    }
  }

  private static findResourceName(resource: BaseResource): string {
    // TODO: подумать как быть с embedded
    const resourceLinks = resource['_links'] as Link;
    if (_.isEmpty(resourceLinks) || _.isEmpty(resourceLinks.self) || _.isNil(resourceLinks.self.href)) {
      return undefined;
    }
    const selfLink = resourceLinks.self.href;

    for (const link of Object.keys(resourceLinks)) {
      if (link !== 'self' && resourceLinks[link].href === selfLink) {
        return _.upperFirst(link);
      }
    }
  }
}
