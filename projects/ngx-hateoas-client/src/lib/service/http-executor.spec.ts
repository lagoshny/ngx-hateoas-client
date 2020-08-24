import { HttpExecutor } from './http-executor';
import { async } from '@angular/core/testing';
import { of } from 'rxjs';
import { CacheService } from './internal/cache.service';
import anything = jasmine.anything;

describe('HttpExecutor', () => {
  let httpExecutor: HttpExecutor;
  let httpClientSpy: any;
  let cacheServiceSpy: any;

  beforeEach(() => {
    httpClientSpy = {
      get: jasmine.createSpy('get'),
      post: jasmine.createSpy('post'),
      patch: jasmine.createSpy('patch'),
      put: jasmine.createSpy('put'),
      delete: jasmine.createSpy('delete')
    };

    cacheServiceSpy = {
      putValue: jasmine.createSpy('putValue'),
      getValue: jasmine.createSpy('getValue'),
      evictValue: jasmine.createSpy('evictValue')
    };

    httpExecutor = new HttpExecutor(httpClientSpy, cacheServiceSpy);
  });

  it('GET should throw error when passed url is empty', () => {
    expect(() => httpExecutor.getHttp(''))
      .toThrowError(`Passed param(s) 'url = ' is not valid`);
  });

  it('GET should throw error when passed url is null', () => {
    expect(() => httpExecutor.getHttp(null))
      .toThrowError(`Passed param(s) 'url = null' is not valid`);
  });

  it('GET should throw error when passed url is undefined', () => {
    expect(() => httpExecutor.getHttp(undefined))
      .toThrowError(`Passed param(s) 'url = undefined' is not valid`);
  });

  it('GET should doing request when cache is disable', () => {
    CacheService.enabled = false;
    httpClientSpy.get.and.returnValue(of(anything()));
    httpExecutor.getHttp('any').subscribe(() => {
      expect(httpClientSpy.get.calls.count()).toBe(1);
    });
  });

  it('GET should doing request when useCache is false but cache is enabled', () => {
    CacheService.enabled = true;
    httpClientSpy.get.and.returnValue(of(anything()));
    httpExecutor.getHttp('any', null, false).subscribe(() => {
      expect(httpClientSpy.get.calls.count()).toBe(1);
    });
    CacheService.enabled = false;
  });

  it('GET should fetch value from cache when cache is enabled', () => {
    CacheService.enabled = true;
    cacheServiceSpy.getValue.and.returnValue(of(anything()));

    httpExecutor.getHttp('any').subscribe(() => {
      expect(cacheServiceSpy.getValue.calls.count()).toBe(1);
      expect(httpClientSpy.get.calls.count()).toBe(0);
    });
    CacheService.enabled = false;
  });

  it('GET should doing request when cache has not value', () => {
    CacheService.enabled = true;
    httpClientSpy.get.and.returnValue(of(anything()));
    cacheServiceSpy.getValue.and.returnValue(null);

    httpExecutor.getHttp('any').subscribe(() => {
      expect(cacheServiceSpy.getValue.calls.count()).toBe(1);
      expect(httpClientSpy.get.calls.count()).toBe(1);
    });
    CacheService.enabled = false;
  });

  it('GET should put request result to the cache when cache is enabled', () => {
    CacheService.enabled = true;
    httpClientSpy.get.and.returnValue(of(anything()));

    httpExecutor.getHttp('any').subscribe(() => {
      expect(httpClientSpy.get.calls.count()).toBe(1);
      expect(cacheServiceSpy.putValue.calls.count()).toBe(1);
    });
    CacheService.enabled = false;
  });

  it('GET should NOT put request result to the cache when cache is disabled', () => {
    CacheService.enabled = false;
    httpClientSpy.get.and.returnValue(of(anything()));

    httpExecutor.getHttp('any').subscribe(() => {
      expect(httpClientSpy.get.calls.count()).toBe(1);
      expect(cacheServiceSpy.putValue.calls.count()).toBe(0);
    });
  });

  it('GET should NOT put request result to the cache when pass useCache = false', () => {
    CacheService.enabled = true;
    httpClientSpy.get.and.returnValue(of(anything()));

    httpExecutor.getHttp('any', null, false).subscribe(() => {
      expect(httpClientSpy.get.calls.count()).toBe(1);
      expect(cacheServiceSpy.putValue.calls.count()).toBe(0);
    });
    CacheService.enabled = false;
  });

  it('POST should throw error when passed url is empty', () => {
    expect(() => httpExecutor.postHttp('', null))
      .toThrowError(`Passed param(s) 'url = ' is not valid`);
  });

  it('POST should throw error when passed url is null', () => {
    expect(() => httpExecutor.postHttp(null, null))
      .toThrowError(`Passed param(s) 'url = null' is not valid`);
  });

  it('POST should throw error when passed url is undefined', () => {
    expect(() => httpExecutor.postHttp(undefined, null))
      .toThrowError(`Passed param(s) 'url = undefined' is not valid`);
  });

  it('POST should evict cache when cache is enabled', () => {
    CacheService.enabled = true;
    httpClientSpy.post.and.returnValue(of(anything()));

    httpExecutor.postHttp('any', {}).subscribe(() => {
      expect(cacheServiceSpy.evictValue.calls.count()).toBe(1);
    });
    CacheService.enabled = false;
  });

  it('POST should NOT evict cache when cache is disabled', () => {
    CacheService.enabled = false;
    httpClientSpy.post.and.returnValue(of(anything()));

    httpExecutor.postHttp('any', {}).subscribe(() => {
      expect(cacheServiceSpy.evictValue.calls.count()).toBe(0);
    });
  });

  it('PATCH should throw error when passed url is empty', () => {
    expect(() => httpExecutor.patchHttp('', null))
      .toThrowError(`Passed param(s) 'url = ' is not valid`);
  });

  it('PATCH should throw error when passed url is null', () => {
    expect(() => httpExecutor.patchHttp(null, null))
      .toThrowError(`Passed param(s) 'url = null' is not valid`);
  });

  it('PATCH should throw error when passed url is undefined', () => {
    expect(() => httpExecutor.patchHttp(undefined, null))
      .toThrowError(`Passed param(s) 'url = undefined' is not valid`);
  });

  it('PATCH should evict cache when cache is enabled', () => {
    CacheService.enabled = true;
    httpClientSpy.patch.and.returnValue(of(anything()));

    httpExecutor.patchHttp('any', {}).subscribe(() => {
      expect(cacheServiceSpy.evictValue.calls.count()).toBe(1);
    });
    CacheService.enabled = false;
  });

  it('PATCH should NOT evict cache when cache is disabled', () => {
    CacheService.enabled = false;
    httpClientSpy.patch.and.returnValue(of(anything()));

    httpExecutor.patchHttp('any', {}).subscribe(() => {
      expect(cacheServiceSpy.evictValue.calls.count()).toBe(0);
    });
  });

  it('PUT should throw error when passed url is empty', () => {
    expect(() => httpExecutor.putHttp('', null))
      .toThrowError(`Passed param(s) 'url = ' is not valid`);
  });

  it('PUT should throw error when passed url is null', () => {
    expect(() => httpExecutor.putHttp(null, null))
      .toThrowError(`Passed param(s) 'url = null' is not valid`);
  });

  it('PUT should throw error when passed url is undefined', () => {
    expect(() => httpExecutor.putHttp(undefined, null))
      .toThrowError(`Passed param(s) 'url = undefined' is not valid`);
  });

  it('PUT should evict cache when cache is enabled', () => {
    CacheService.enabled = true;
    httpClientSpy.put.and.returnValue(of(anything()));

    httpExecutor.putHttp('any', {}).subscribe(() => {
      expect(cacheServiceSpy.evictValue.calls.count()).toBe(1);
    });
    CacheService.enabled = false;
  });

  it('PUT should NOT evict cache when cache is disabled', () => {
    CacheService.enabled = false;
    httpClientSpy.put.and.returnValue(of(anything()));

    httpExecutor.putHttp('any', {}).subscribe(() => {
      expect(cacheServiceSpy.evictValue.calls.count()).toBe(0);
    });
  });

  it('DELETE should throw error when passed url is empty', () => {
    expect(() => httpExecutor.deleteHttp(''))
      .toThrowError(`Passed param(s) 'url = ' is not valid`);
  });

  it('DELETE should throw error when passed url is null', () => {
    expect(() => httpExecutor.deleteHttp(null))
      .toThrowError(`Passed param(s) 'url = null' is not valid`);
  });

  it('DELETE should throw error when passed url is undefined', () => {
    expect(() => httpExecutor.deleteHttp(undefined))
      .toThrowError(`Passed param(s) 'url = undefined' is not valid`);
  });

  it('DELETE should evict cache when cache is enabled', () => {
    CacheService.enabled = true;
    httpClientSpy.delete.and.returnValue(of(anything()));

    httpExecutor.deleteHttp('any', {}).subscribe(() => {
      expect(cacheServiceSpy.evictValue.calls.count()).toBe(1);
    });
    CacheService.enabled = false;
  });

  it('DELETE should NOT evict cache when cache is disabled', () => {
    CacheService.enabled = false;
    httpClientSpy.delete.and.returnValue(of(anything()));

    httpExecutor.deleteHttp('any', {}).subscribe(() => {
      expect(cacheServiceSpy.evictValue.calls.count()).toBe(0);
    });
  });

});
