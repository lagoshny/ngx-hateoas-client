import { HttpConfigService } from '../../../config/http-config.service';
import { ResourceCacheService } from './resource-cache.service';
import { CacheKey } from './model/cache-key';
import { rawResource } from '../../../model/resource/resources.test';
import { async } from '@angular/core/testing';

describe('CacheService', () => {
  let cacheService: ResourceCacheService;
  let httpConfigService: HttpConfigService;

  beforeEach((() => {
    httpConfigService = {
      baseApiUrl: 'http://localhost:8080/api/v1'
    };
    cacheService = new ResourceCacheService(httpConfigService);
  }));

  it('GET_VALUE should throw error when passed key is null', () => {
    expect(() => cacheService.getResource(null))
      .toThrowError(`Passed param(s) 'key = null' is not valid`);
  });

  it('GET_VALUE should throw error when passed key is undefined', () => {
    expect(() => cacheService.getResource(undefined))
      .toThrowError(`Passed param(s) 'key = undefined' is not valid`);
  });

  it('GET_VALUE should return null when a cache has not value', () => {
    const result = cacheService.getResource(CacheKey.of('any', {}));
    expect(result).toBeNull();
  });

  it('GET_VALUE should return null when a cache has value but it is expired', async(() => {
    cacheService.setCacheLifeTime(1 / 1000);
    cacheService.putResource(CacheKey.of('someVal', {}), rawResource);

    setTimeout(() => {
      const result = cacheService.getResource(CacheKey.of('someVal', {}));
      expect(result).toBeDefined();
      expect(result).toBe(null);
      cacheService.setCacheLifeTime(5 * 60 * 1000);
    }, 200);
  }));

  // it('GET_VALUE should delete expired value from a cache', () => {
  //   cacheService.putResource(CacheKey.of('someVal', {}), {value: 'test'});
  //
  //   const result = cacheService.getResource(CacheKey.of('someVal', {}));
  //   expect(result).toBeDefined();
  //   expect(result).toEqual({value: 'test'});
  // });

  it('GET_VALUE should return value from a cache', () => {
    cacheService.putResource(CacheKey.of('someVal', {}), rawResource);

    const result = cacheService.getResource(CacheKey.of('someVal', {}));
    expect(result).toBeDefined();
    expect(result).toEqual(rawResource);
  });


});
