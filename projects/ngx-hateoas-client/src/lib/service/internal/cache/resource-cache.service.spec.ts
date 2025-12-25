import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ResourceCacheService } from './resource-cache.service';
import { CacheKey } from './model/cache-key';
import {
  rawPagedResourceCollection,
  rawResource,
  rawResourceCollection
} from '../../../model/resource/resources.test-utils';
import { LibConfig } from '../../../config/lib-config';

describe('CacheService', () => {
  let cacheService: ResourceCacheService;

  beforeEach((() => {
    cacheService = new ResourceCacheService();

    vi.spyOn(LibConfig, 'getConfig').mockReturnValue({
      ...LibConfig.DEFAULT_CONFIG,
      cache: {
        ...LibConfig.DEFAULT_CONFIG.cache,
        enabled: LibConfig.DEFAULT_CONFIG.cache.enabled,
        lifeTime: 5000
      }
    });
  }));

  it('GET_RESOURCE should return null when a cache has not value', () => {
    const result = cacheService.getResource(CacheKey.of('any', {}));
    expect(result).toBeNull();
  });

  it('GET_RESOURCE should return null when a cache has value but it is expired', async () => {
    vi.spyOn(LibConfig, 'getConfig').mockReturnValue({
      ...LibConfig.DEFAULT_CONFIG,
      cache: {
        ...LibConfig.DEFAULT_CONFIG.cache,
        enabled: LibConfig.DEFAULT_CONFIG.cache.enabled,
        lifeTime: 1 / 1000
      }
    });

    cacheService.putResource(CacheKey.of('http://localhost:8080/api/v1', {}), rawResource);

    setTimeout(() => {
      const result = cacheService.getResource(CacheKey.of('http://localhost:8080/api/v1', {}));
      expect(result).toBe(null);
    }, 200);
  });

  it('GET_RESOURCE should return value from a cache', () => {
    cacheService.putResource(CacheKey.of('http://localhost:8080/api/v1', {}), rawResource);

    const result = cacheService.getResource(CacheKey.of('http://localhost:8080/api/v1', {}));
    expect(result).toBeDefined();
    expect(result).toEqual(rawResource);
  });

  it('PUT_RESOURCE should put value to a cache', () => {
    cacheService.putResource(CacheKey.of('http://localhost:8080/api/v1/resources/1', {}), rawPagedResourceCollection);

    const result = cacheService.getResource(CacheKey.of('http://localhost:8080/api/v1/resources/1', {}));
    expect(result).toEqual(rawPagedResourceCollection);
  });

  it('EVICT_RESOURCE should evict all resource cache by resourceName from key', () => {
    cacheService.putResource(CacheKey.of('http://localhost:8080/api/v1/resources/1', {}), rawResource);
    cacheService.putResource(CacheKey.of('http://localhost:8080/api/v1/resources', {}), rawResourceCollection);

    cacheService.evictResource(CacheKey.of('http://localhost:8080/api/v1/resources/1', {}));

    expect(cacheService.getResource(CacheKey.of('http://localhost:8080/api/v1/resources/1', {}))).toBeNull();
    expect(cacheService.getResource(CacheKey.of('http://localhost:8080/api/v1/resources', {}))).toBeNull();
  });

  it('EVICT_ALL should evict all resources cache', () => {
    cacheService.putResource(CacheKey.of('http://localhost:8080/api/v1/resources1', {}), rawResource);
    cacheService.putResource(CacheKey.of('http://localhost:8080/api/v1/resources2', {}), rawResourceCollection);

    cacheService.evictAll();

    expect(cacheService.getResource(CacheKey.of('http://localhost:8080/api/v1/resources1', {}))).toBeNull();
    expect(cacheService.getResource(CacheKey.of('http://localhost:8080/api/v1/resources2', {}))).toBeNull();
  });

});
