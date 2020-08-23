import { Injectable } from '@angular/core';
import { ResourceIdentifiable } from '../model/resource/resource-identifiable';
import { CacheResource } from '../model/cache/cache-resource';
import { StageLogger } from '../logger/stage-logger';
import { Stage } from '../logger/stage.enum';
import { CacheKey } from '../model/cache/cache-key';
import * as _ from 'lodash';
import { HttpConfigService } from '../config/http-config.service';

@Injectable()
export class CacheService<T extends ResourceIdentifiable> {

  /**
   * Time before cache was expired (seconds).
   */
  public static expireTime: number = 5 * 60 * 1000;

  public static enabled: boolean;

  private cacheMap: Map<string, CacheResource<T>> = new Map<string, CacheResource<T>>();

  constructor(private httpConfig: HttpConfigService) {
  }

  /**
   * Get cache value.
   *
   * @param key cache key
   * @return cached value or {@code null} when cached value is not exist or expired
   */
  public getValue(key: CacheKey): T {
    const cacheResource = this.cacheMap.get(key.value);
    if (_.isNil(cacheResource)) {
      StageLogger.stageLog(Stage.CACHE_GET, {cacheKey: key.value, result: null});
      return null;
    }

    const resourceExpiredTime = new Date(cacheResource.cachedTime);
    resourceExpiredTime.setSeconds(resourceExpiredTime.getSeconds() + CacheService.expireTime);
    if (resourceExpiredTime.getTime() < new Date().getTime()) {
      this.cacheMap.delete(key.value);
      StageLogger.stageLog(Stage.CACHE_GET, {cacheKey: key.value, message: 'cache was expired', result: null});
      return null;
    }

    StageLogger.stageLog(Stage.CACHE_GET, {cacheKey: key.value, result: cacheResource.resource});
    return cacheResource.resource;
  }

  /**
   * Add value to the cache.
   * Before add new value, previous will be deleted if it was exist.
   *
   * @param key cache key
   * @param resource cache value
   */
  public putValue(key: CacheKey, resource: T): void {
    if (!CacheService.enabled) {
      return;
    }
    // TODO проверить надо ли удалять старое
    this.cacheMap.delete(key.value);
    this.cacheMap.set(key.value, new CacheResource<T>(resource, new Date()));

    StageLogger.stageLog(Stage.CACHE_PUT, {cacheKey: key.value, resource});
  }

  /**
   * Delete cache value by passed key.
   *
   * @param key cache key
   */
  public evictValue(key: CacheKey): void {
    // Get resource name by url to evict all resource cache with collection/paged collection data
    const resourceName = key.url.replace(`${ this.httpConfig.baseApiUrl }/`, '').split('/')[0];
    if (!resourceName) {
      return;
    }
    const evictedCache = [];
    for (const cacheKey of this.cacheMap.keys()) {
      if (cacheKey.startsWith(`url=${ this.httpConfig.baseApiUrl }/${ resourceName }`)) {
        evictedCache.push({
          key: cacheKey
        });
        this.cacheMap.delete(cacheKey);
      }
    }
    if (evictedCache.length > 0) {
      StageLogger.stageLog(Stage.CACHE_EVICT, {cacheKey: key.value, evicted: evictedCache});
    }
  }

}
