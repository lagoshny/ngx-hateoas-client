import { BaseResource } from '../hal-resource/model/base-resource';
import { isEmbeddedResource } from '../hal-resource/model/defenition';
import { ResourceCollection } from '../hal-resource/model/resource-collection';

export class ResourceUtils {

  private static embeddedResourceType: new() => BaseResource;

  public static withEmbeddedResourceType(type: new() => BaseResource) {
    this.embeddedResourceType = type;
  }

  public static instantiateResource<T extends BaseResource>(entity: T, payload: any): T {
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

    return ResourceUtils.createResource(entity, payload);
  }


  // Type - тип ресурсов внутри коллекции, payload - ответ от сервера, result - результирующий массив, куда будем добалвять ресурсы
  static instantiateResourceCollection<T extends ResourceCollection<BaseResource>>(collection: T,
                                                                                   payload: any,
                                                                                   // result: ResourceArray<T>,
                                                                                   // builder?: SubTypeBuilder
  ): T {
    collection['_links'] = payload['_links'];
    const resourceCollection = payload['_embedded'];
    if (resourceCollection) {
      for (const resourceName of Object.keys(resourceCollection)) {
        const resources: Array<any> = resourceCollection[resourceName];
        resources.forEach((resource) => {
          // Создаём новый экземпляр ресурса
          // let instance: T = new type();
          // Инициализируем подтипы
          // instance = this.searchSubtypes(builder, embeddedClassName, instance);
          collection.resources.push(this.instantiateResource(new class extends BaseResource {}(), resource));
          // collection._embedded['resourceName'].push(this.instantiateResource(new class extends BaseResource {}(), resource));
        });
      }
    }

    return collection;

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
