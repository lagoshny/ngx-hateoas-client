import { BaseResource } from '../hal-resource/model/base-resource';
import { isEmbeddedResource } from '../hal-resource/model/resource-type';
import { CollectionResource } from '../hal-resource/model/collection-resource';
import { PagedCollectionResource } from '../hal-resource/model/paged-collection-resource';
import { PageData } from '../hal-resource/model/declarations';

export class ResourceUtils {

  private static resourceType: new() => BaseResource;

  private static collectionResourceType: new() => CollectionResource<BaseResource>;

  private static pagedCollectionResourceType: new(collection: CollectionResource<BaseResource>, pageData?: PageData) => PagedCollectionResource<BaseResource>;

  private static embeddedResourceType: new() => BaseResource;

  public static useResourceType(type: new () => BaseResource) {
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
      if (payload[key] instanceof Array) {
        for (let i = 0; i < payload[key].length; i++) {
          if (isEmbeddedResource(payload[key][i]) && this.embeddedResourceType) {
            payload[key][i] = ResourceUtils.createResource(new this.embeddedResourceType(), payload[key][i]);
          }
        }
      } else if (isEmbeddedResource(payload[key]) && this.embeddedResourceType) {
        payload[key] = ResourceUtils.createResource(new this.embeddedResourceType(), payload[key]);
      }
    }

    return ResourceUtils.createResource(new this.resourceType() as T, payload);
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

    // result.totalElements = payload.page ? payload.page.totalElements : result.resources.length;
    // result.totalPages = payload.page ? payload.page.totalPages : 1;
    // result.pageNumber = payload.page ? payload.page.number : 0;
    // result.pageSize = payload.page ? payload.page.size : 20;
    //
    // result.selfUri = payload._links && payload._links.self ? payload._links.self.href : undefined;
    // result.nextUri = payload._links && payload._links.next ? payload._links.next.href : undefined;
    // result.prevUri = payload._links && payload._links.prev ? payload._links.prev.href : undefined;
    // result.firstUri = payload._links && payload._links.first ? payload._links.first.href : undefined;
    // result.lastUri = payload._links && payload._links.last ? payload._links.last.href : undefined;

    return result as T;
    //
    // // Проверка на то, что в payload есть объект _embedded
    // if (payload[result._embedded]) {
    //   // Начинаем идти по ключам объекта _embedded
    //   for (const embeddedClassName of Object.keys(payload[result._embedded])) {
    //     const embedded: any = payload[result._embedded];
    //     // Получаем конкретный объект из _embedded по ключу
    //     const items = embedded[embeddedClassName];
    //     for (const item of items) {
    //       // Итерируемся по каждому элементу (ресурсу) из _embedded
    //
    //       // Создаём новый экземпляр ресурса
    //       let instance: T = new type();
    //       // Инициализируем подтипы
    //       instance = this.searchSubtypes(builder, embeddedClassName, instance);
    //
    //       // И создаём сам ресурс
    //       this.instantiateResource(instance, item);
    //       result.push(instance);
    //     }
    //   }
    // }
    //
    // result.totalElements = payload.page ? payload.page.totalElements : result.length;
    // result.totalPages = payload.page ? payload.page.totalPages : 1;
    // result.pageNumber = payload.page ? payload.page.number : 1;
    // result.pageSize = payload.page ? payload.page.size : 20;
    //
    // result.selfUri = payload._links && payload._links.self ? payload._links.self.href : undefined;
    // result.nextUri = payload._links && payload._links.next ? payload._links.next.href : undefined;
    // result.prevUri = payload._links && payload._links.prev ? payload._links.prev.href : undefined;
    // result.firstUri = payload._links && payload._links.first ? payload._links.first.href : undefined;
    // result.lastUri = payload._links && payload._links.last ? payload._links.last.href : undefined;
    // return result;
  }


  private static createResource<T extends BaseResource>(entity: T, payload: any): T {
    for (const p in payload) {
      entity[p] = payload[p];
    }
    return entity;
  }

}

// export function isEmbeddedResource(object: any) {
//   // Embedded resource doesn't have self link in _links array
//   return _.isObject(object) && ('_links' in object) && !('self' in object['_links']);
// }

// export function isResource(value: Resource | string | number | boolean): value is Resource {
//   return (value as Resource).getSelfLinkHref !== undefined
//     && typeof (value as Resource).getSelfLinkHref === 'function';
// }
