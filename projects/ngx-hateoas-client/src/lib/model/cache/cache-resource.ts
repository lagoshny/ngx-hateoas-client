import { ResourceIdentifiable } from '../resource/resource-identifiable';

/**
 * Represents cache resource model that contains resource and time when resource was added to the cache.
 */
export class CacheResource<T extends ResourceIdentifiable> {

  /**
   * Resource value.
   * It's can be {@link Resource}, {@link ResourceCollection}, {@link PagedResourceCollection}.
   */
  public resource: T;

  /**
   * Time when resource cache was added to the cache.
   */
  public cachedTime: Date;

  constructor(resource: T, cachedTime: Date) {
    this.resource = resource;
    this.cachedTime = cachedTime;
  }

}
