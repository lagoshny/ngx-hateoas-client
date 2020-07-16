import { BaseResource } from '../hal-resource/model/base-resource';
import * as _ from 'lodash';

export class ResourceUtils {

  private static embeddedResourceType: new() => BaseResource;

  public static withEmbeddedResourceType(type: new() => BaseResource) {
    this.embeddedResourceType = type;
  }

  public static instantiateResource<T extends BaseResource>(entity: T, payload: any): T {
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

  private static createResource<T extends BaseResource>(entity: T, payload: any): T {
    for (const p in payload) {
      entity[p] = payload[p];
    }
    return entity;
  }

}

export function isEmbeddedResource(object: any) {
  // Embedded resource doesn't have self link in _links array
  return _.isObject(object) && ('_links' in object) && !('self' in object['_links']);
}

// export function isResource(value: Resource | string | number | boolean): value is Resource {
//   return (value as Resource).getSelfLinkHref !== undefined
//     && typeof (value as Resource).getSelfLinkHref === 'function';
// }
