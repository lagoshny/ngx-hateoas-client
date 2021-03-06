/**
 * Represents cache resource model that contains resource and time when resource was added to the cache.
 */
import { ResourceIdentifiable } from '../../../../model/declarations';

export class CachedResource  {

  /**
   * Cached resource value.
   * It's can be {@link Resource}, {@link ResourceCollection}, {@link PagedResourceCollection}.
   */
  public value: ResourceIdentifiable;

  /**
   * Time when value was added to the cache.
   */
  public cachedTime: Date;

  constructor(value: any, cachedTime: Date) {
    this.value = value;
    this.cachedTime = cachedTime;
  }

}
