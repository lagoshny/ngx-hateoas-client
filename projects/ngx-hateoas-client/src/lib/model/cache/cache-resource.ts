import { ResourceIdentifiable } from '../resource/resource-identifiable';

export class CacheResource<T extends ResourceIdentifiable> {

  /**
   * Resource value.
   */
  public resource: T;

  /**
   * Time when resource cache was expired.
   */
  public cachedTime: Date;

  constructor(resource: T, cachedTime: Date) {
    this.resource = resource;
    this.cachedTime = cachedTime;
  }

}
