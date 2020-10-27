import { Injectable } from '@angular/core';
import { CachedResource } from './model/cached-resource';
import { StageLogger } from '../../../logger/stage-logger';
import { Stage } from '../../../logger/stage.enum';
import { CacheKey } from './model/cache-key';
import { ValidationUtils } from '../../../util/validation.utils';
import { ResourceIdentifiable } from '../../../model/declarations';
import { LibConfig } from '../../../config/lib-config';
import { UrlUtils } from '../../../util/url.utils';
import { isNil } from 'lodash-es';

@Injectable()
export class ResourceCacheService {

  private cacheMap: Map<string, CachedResource> = new Map<string, CachedResource>();

  /**
   * Get cached resource value.
   *
   * @param key cache key
   * @return cached value or {@code null} when cached value is not exist or expired
   */
  public getResource(key: CacheKey): ResourceIdentifiable {
    ValidationUtils.validateInputParams({key});

    const cacheValue = this.cacheMap.get(key.value);
    if (isNil(cacheValue)) {
      StageLogger.stageLog(Stage.CACHE_GET, {cacheKey: key.value, result: null});
      return null;
    }

    const cacheExpiredTime = new Date(cacheValue.cachedTime);
    cacheExpiredTime.setMilliseconds(cacheExpiredTime.getMilliseconds() + LibConfig.config.cache.lifeTime);
    if (cacheExpiredTime.getTime() < new Date().getTime()) {
      this.evictResource(key);
      StageLogger.stageLog(Stage.CACHE_GET, {cacheKey: key.value, message: 'cache was expired', result: null});
      return null;
    }

    StageLogger.stageLog(Stage.CACHE_GET, {cacheKey: key.value, result: cacheValue.value});
    return cacheValue.value;
  }

  /**
   * Add resource value to the cache.
   * Before add new value, previous will be deleted if it was exist.
   *
   * @param key cache key
   * @param value cache value
   */
  public putResource(key: CacheKey, value: ResourceIdentifiable): void {
    ValidationUtils.validateInputParams({key, value});

    this.cacheMap.set(key.value, new CachedResource(value, new Date()));

    StageLogger.stageLog(Stage.CACHE_PUT, {cacheKey: key.value, value});
  }

  /**
   * Delete cached resource value by passed key.
   *
   * @param key cache key
   */
  public evictResource(key: CacheKey): void {
    ValidationUtils.validateInputParams({key});

    // Get resource name by url to evict all resource cache with collection/paged collection data
    const resourceName = key.url.replace(`${ UrlUtils.getApiUrl() }/`, '').split('/')[0];
    if (!resourceName) {
      return;
    }
    const evictedCache = [];
    for (const cacheKey of this.cacheMap.keys()) {
      if (cacheKey.startsWith(`url=${ UrlUtils.getApiUrl() }/${ resourceName }`)) {
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
