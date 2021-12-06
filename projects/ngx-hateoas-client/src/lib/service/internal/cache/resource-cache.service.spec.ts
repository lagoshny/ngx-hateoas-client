import { ResourceCacheService } from './resource-cache.service';
import { CacheKey } from './model/cache-key';
import { rawPagedResourceCollection, rawResource, rawResourceCollection } from '../../../model/resource/resources.test';
import { LibConfig } from '../../../config/lib-config';
import { waitForAsync } from '@angular/core/testing';

describe('CacheService', () => {
  let cacheService: ResourceCacheService;

  beforeEach((() => {
    cacheService = new ResourceCacheService();
  }));

  afterEach(() => {
    LibConfig.config = LibConfig.DEFAULT_CONFIG;
  });

  it('GET_RESOURCE should throw error when passed key is null', () => {
    expect(() => cacheService.getResource(null))
      .toThrowError(`Passed param(s) 'key = null' is not valid`);
  });

  it('GET_RESOURCE should throw error when passed key is undefined', () => {
    expect(() => cacheService.getResource(undefined))
      .toThrowError(`Passed param(s) 'key = undefined' is not valid`);
  });

  it('GET_RESOURCE should return null when a cache has not value', () => {
    const result = cacheService.getResource(CacheKey.of('any', {}));
    expect(result).toBeNull();
  });

  it('GET_RESOURCE should return null when a cache has value but it is expired',
    waitForAsync(() => {
      LibConfig.config.cache.lifeTime = 1 / 1000;
      cacheService.putResource(CacheKey.of('someVal', {}), rawResource);

      setTimeout(() => {
        const result = cacheService.getResource(CacheKey.of('someVal', {}));
        expect(result).toBe(null);
      }, 200);
    }));

  it('GET_RESOURCE should return value from a cache', () => {
    cacheService.putResource(CacheKey.of('someVal', {}), rawResource);

    const result = cacheService.getResource(CacheKey.of('someVal', {}));
    expect(result).toBeDefined();
    expect(result).toEqual(rawResource);
  });

  it('PUT_RESOURCE should throw error when passed key,value are null', () => {
    expect(() => cacheService.putResource(null, null))
      .toThrowError(`Passed param(s) 'key = null', 'value = null' are not valid`);
  });

  it('PUT_RESOURCE should throw error when passed key,value are undefined', () => {
    expect(() => cacheService.putResource(undefined, undefined))
      .toThrowError(`Passed param(s) 'key = undefined', 'value = undefined' are not valid`);
  });

  it('PUT_RESOURCE should put value to a cache', () => {
    cacheService.putResource(CacheKey.of('someVal', {}), rawPagedResourceCollection);

    const result = cacheService.getResource(CacheKey.of('someVal', {}));
    expect(result).toEqual(rawPagedResourceCollection);
  });

  it('EVICT_RESOURCE should throw error when passed key,value are null', () => {
    expect(() => cacheService.evictResource(null))
      .toThrowError(`Passed param(s) 'key = null' is not valid`);
  });

  it('EVICT_RESOURCE should throw error when passed key,value are undefined', () => {
    expect(() => cacheService.evictResource(undefined))
      .toThrowError(`Passed param(s) 'key = undefined' is not valid`);
  });

  it('EVICT_RESOURCE should evict all resource cache by resourceName from key', () => {
    cacheService.putResource(CacheKey.of('http://localhost:8080/api/v1/resources/1', {}), rawResource);
    cacheService.putResource(CacheKey.of('http://localhost:8080/api/v1/resources', {}), rawResourceCollection);

    cacheService.evictResource(CacheKey.of('http://localhost:8080/api/v1/resources/1', {}));

    expect(cacheService.getResource(CacheKey.of('http://localhost:8080/api/v1/resources/1', {}))).toBeNull();
    expect(cacheService.getResource(CacheKey.of('http://localhost:8080/api/v1/resources', {}))).toBeNull();
  });

});
