import { HttpExecutor } from './http-executor';
import { async } from '@angular/core/testing';
import { rawResource, rawResourceCollection, SimpleResource, SimpleResourceCollection } from '../model/resource/resources.test';
import { of } from 'rxjs';

describe('HttpExecutor', () => {
  let httpExecutor: HttpExecutor;
  let httpClientSpy: any;
  let cacheServiceSpy: any;

  beforeEach(async(() => {
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
  }));

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


  // TODO:
  // it('GET REQUEST should return result from cache', () => {
  //   const cachedResult = new SimpleResourceCollection();
  //   cachedResult.resources.push(Object.assign(new SimpleResource(), {text: 'test cache'}));
  //   cacheServiceSpy.getResource.and.returnValue(cachedResult);
  //   cacheServiceSpy.hasResource.and.returnValue(true);
  //
  //   resourceCollectionHttpServiceSpy.getHttp('someUrl').subscribe((result) => {
  //     expect(httpClientSpy.get.calls.count()).toBe(0);
  //     expect(cacheServiceSpy.getResource.calls.count()).toBe(1);
  //     expect(result.resources.length).toBe(2);
  //     expect(result.resources[1]['text']).toBe('test cache');
  //   });
  // });
  //
  // it('GET REQUEST should put result to cache', () => {
  //   httpClientSpy.get.and.returnValue(of(rawResourceCollection));
  //
  //   resourceCollectionHttpServiceSpy.getHttp('someUrl').subscribe(() => {
  //     expect(cacheServiceSpy.putResource.calls.count()).toBe(1);
  //   });
  // });

  // it('POST REQUEST should evict result resource from cache', () => {
  //   httpClientSpy.post.and.returnValue(of(rawResource));
  //
  //   resourceHttpService.post('someUrl', 'any').subscribe(() => {
  //     expect(cacheServiceSpy.evictResource.calls.count()).toBe(1);
  //   });
  // });

  // it('PUT REQUEST should evict result resource from cache', () => {
  //   httpClientSpy.put.and.returnValue(of(rawResource));
  //
  //   resourceHttpService.put('someUrl', 'any').subscribe(() => {
  //     expect(cacheServiceSpy.evictResource.calls.count()).toBe(1);
  //   });
  // });


  // it('PATCH REQUEST should evict result resource from cache', () => {
  //   httpClientSpy.patch.and.returnValue(of(rawResource));
  //
  //   resourceHttpService.patch('someUrl', 'any').subscribe(() => {
  //     expect(cacheServiceSpy.evictResource.calls.count()).toBe(1);
  //   });
  // });


  // it('DELETE_REQUEST should evict result resource from cache', () => {
  //   httpClientSpy.delete.and.returnValue(of(rawResource));
  //
  //   resourceHttpService.delete('someUrl').subscribe(() => {
  //     expect(cacheServiceSpy.evictResource.calls.count()).toBe(1);
  //   });
  // });

});
