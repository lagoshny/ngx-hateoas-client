/* tslint:disable:no-string-literal */
import { BaseResource } from '../../model/resource/base-resource';
import { HttpConfigService } from '../../config/http-config.service';
import { async } from '@angular/core/testing';
import { ResourceUtils } from '../../util/resource.utils';
import { ResourceHttpService } from './resource-http.service';
import { Resource } from '../../model/resource/resource';
import { of } from 'rxjs';
import { rawPagedResourceCollection, rawResource, rawResourceCollection, SimpleResource } from '../../model/resource/resources.test';
import { HttpParams } from '@angular/common/http';
import { CacheService } from '../cache.service';

describe('ResourceHttpService', () => {
  let resourceHttpService: ResourceHttpService<BaseResource>;
  let httpClientSpy: any;
  let cacheServiceSpy: any;
  let httpConfigService: HttpConfigService;

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
    httpConfigService = {
      baseApiUrl: 'http://localhost:8080/api/v1'
    };

    resourceHttpService =
      new ResourceHttpService<BaseResource>(httpClientSpy, cacheServiceSpy, httpConfigService);
  }));

  beforeEach(() => {
    ResourceUtils.useResourceType(Resource);
  });

  afterEach(() => {
    ResourceUtils.useResourceType(null);
  });

  it('GET REQUEST should throw error when returned object is COLLECTION_RESOURCE', () => {
    httpClientSpy.get.and.returnValue(of(rawResourceCollection));

    resourceHttpService.get('someUrl').subscribe(() => {
    }, error => {
      expect(error.message).toBe('You try to get wrong resource type, expected single resource.');
    });
  });

  it('GET REQUEST should throw error when returned object is PAGED_COLLECTION_RESOURCE', () => {
    httpClientSpy.get.and.returnValue(of(rawPagedResourceCollection));

    resourceHttpService.get('someUrl').subscribe(() => {
    }, error => {
      expect(error.message).toBe('You try to get wrong resource type, expected single resource.');
    });
  });

  it('GET REQUEST should throw error when returned object is any data that not resource', () => {
    httpClientSpy.get.and.returnValue(of({any: 'value'}));

    resourceHttpService.get('someUrl').subscribe(() => {
    }, error => {
      expect(error.message).toBe('You try to get wrong resource type, expected single resource.');
    });
  });

  it('GET REQUEST should return resource', () => {
    httpClientSpy.get.and.returnValue(of(rawResource));

    resourceHttpService.get('someUrl').subscribe((result) => {
      expect(result instanceof Resource).toBeTrue();
    });
  });

  it('GET REQUEST should fill http request params from params object', () => {
    httpClientSpy.get.and.returnValue(of(rawResource));

    resourceHttpService.get('order', {
      params: {
        orderType: 'online'
      }
    }).subscribe(() => {
      const httpParams = httpClientSpy.get.calls.argsFor(0)[1].params;
      expect(httpParams.has('orderType')).toBeTrue();
      expect(httpParams.get('orderType')).toBe('online');
    });
  });

  it('GET REQUEST should adds projection param in http request params', () => {
    httpClientSpy.get.and.returnValue(of(rawResource));

    resourceHttpService.get('order', {
      params: {
        projection: 'orderProjection'
      }
    }).subscribe(() => {
      const httpParams = httpClientSpy.get.calls.argsFor(0)[1].params;
      expect(httpParams.has('projection')).toBeTrue();
      expect(httpParams.get('projection')).toBe('orderProjection');
    });
  });

  it('GET REQUEST should evict cache when returned object is not resource', () => {
    CacheService.enabled = true;
    httpClientSpy.get.and.returnValue(of({any: 'value'}));

    resourceHttpService.get('someUrl').subscribe(() => {
    }, () => {
      expect(cacheServiceSpy.evictValue.calls.count()).toBe(1);
    });
    CacheService.enabled = false;
  });

  it('POST REQUEST should return resource', () => {
    httpClientSpy.post.and.returnValue(of(rawResource));

    resourceHttpService.post('someUrl', 'any').subscribe((result) => {
      expect(result instanceof Resource).toBeTrue();
    });
  });

  it('POST REQUEST should return any data when result is not resource', () => {
    httpClientSpy.post.and.returnValue(of({any: 'value'}));

    resourceHttpService.post('someUrl', 'any').subscribe((result) => {
      expect(result).toEqual({any: 'value'});
    });
  });

  it('PUT REQUEST should return resource', () => {
    httpClientSpy.put.and.returnValue(of(rawResource));

    resourceHttpService.put('someUrl', 'any').subscribe((result) => {
      expect(result instanceof Resource).toBeTrue();
    });
  });

  it('PUT REQUEST should return any data when result is not resource', () => {
    httpClientSpy.put.and.returnValue(of({any: 'value'}));

    resourceHttpService.put('someUrl', 'any').subscribe((result) => {
      expect(result).toEqual({any: 'value'});
    });
  });

  it('PATCH REQUEST should return resource', () => {
    httpClientSpy.patch.and.returnValue(of(rawResource));

    resourceHttpService.patch('someUrl', 'any').subscribe((result) => {
      expect(result instanceof Resource).toBeTrue();
    });
  });

  it('PATCH REQUEST should return any data when result is not resource', () => {
    httpClientSpy.patch.and.returnValue(of({any: 'value'}));

    resourceHttpService.patch('someUrl', 'any').subscribe((result) => {
      expect(result).toEqual({any: 'value'});
    });
  });

  it('DELETE_REQUEST should return resource', () => {
    httpClientSpy.delete.and.returnValue(of(rawResource));

    resourceHttpService.delete('someUrl').subscribe((result) => {
      expect(result instanceof Resource).toBeTrue();
    });
  });

  it('DELETE_REQUEST should return any data when result is not resource', () => {
    httpClientSpy.delete.and.returnValue(of({any: 'value'}));

    resourceHttpService.delete('someUrl').subscribe((result) => {
      expect(result).toEqual({any: 'value'});
    });
  });

  it('GET_RESOURCE should throw error when passed resourceName is empty', () => {
    expect(() => resourceHttpService.getResource('', 2))
      .toThrowError(`Passed param(s) 'resourceName = ' is not valid`);
  });

  it('GET_RESOURCE should throw error when passed resourceName,id are undefined', () => {
    expect(() => resourceHttpService.getResource(undefined, undefined))
      .toThrowError(`Passed param(s) 'resourceName = undefined', 'id = undefined' is not valid`);
  });

  it('GET_RESOURCE should throw error when passed resourceName,id are null', () => {
    expect(() => resourceHttpService.getResource(null, null))
      .toThrowError(`Passed param(s) 'resourceName = null', 'id = null' is not valid`);
  });

  it('GET_RESOURCE should generate resource url', () => {
    httpClientSpy.get.and.returnValue(of(rawResource));

    resourceHttpService.getResource('test', 10).subscribe(() => {
      const url = httpClientSpy.get.calls.argsFor(0)[0];
      expect(url).toBe(`${ httpConfigService.baseApiUrl }/test/10`);
    });
  });

  it('GET_RESOURCE should pass http request params when it passed', () => {
    httpClientSpy.get.and.returnValue(of(rawResource));

    resourceHttpService.getResource('test', 5, {
      params: {
        projection: 'testProjection',
        test: 'testParam'
      }
    }).subscribe(() => {
      const httpParams = httpClientSpy.get.calls.argsFor(0)[1].params as HttpParams;
      expect(httpParams.has('projection')).toBeTrue();
      expect(httpParams.get('projection')).toBe('testProjection');

      expect(httpParams.has('test')).toBeTrue();
      expect(httpParams.get('test')).toBe('testParam');
    });
  });

  it('POST_RESOURCE should throw error when passed resourceName is empty', () => {
    expect(() => resourceHttpService.postResource('', new SimpleResource()))
      .toThrowError(`Passed param(s) 'resourceName = ' is not valid`);
  });

  it('POST_RESOURCE should throw error when passed resourceName,body are undefined', () => {
    expect(() => resourceHttpService.postResource(undefined, undefined))
      .toThrowError(`Passed param(s) 'resourceName = undefined', 'body = undefined' is not valid`);
  });

  it('POST_RESOURCE should throw error when passed resourceName,body are null', () => {
    expect(() => resourceHttpService.postResource(null, null))
      .toThrowError(`Passed param(s) 'resourceName = null', 'body = null' is not valid`);
  });

  it('POST_RESOURCE should generate resource url', () => {
    httpClientSpy.post.and.returnValue(of(rawResource));

    resourceHttpService.postResource('test', new SimpleResource()).subscribe(() => {
      const url = httpClientSpy.post.calls.argsFor(0)[0];
      expect(url).toBe(`${ httpConfigService.baseApiUrl }/test`);
    });
  });

  it('POST_RESOURCE should pass observe "body"', () => {
    httpClientSpy.post.and.returnValue(of(rawResource));

    resourceHttpService.postResource('test', new SimpleResource()).subscribe(() => {
      const observe = httpClientSpy.post.calls.argsFor(0)[2].observe;
      expect(observe).toBe('body');
    });
  });

  it('POST_RESOURCE should pass body', () => {
    httpClientSpy.post.and.returnValue(of(rawResource));

    resourceHttpService.postResource('test', new SimpleResource()).subscribe(() => {
      const body = httpClientSpy.post.calls.argsFor(0)[1];
      expect(body).toBeDefined();
    });
  });

  it('SEARCH should throw error when passed resourceName is empty', () => {
    expect(() => resourceHttpService.search('', 'any'))
      .toThrowError(`Passed param(s) 'resourceName = ' is not valid`);
  });

  it('SEARCH should throw error when passed searchQuery is empty', () => {
    expect(() => resourceHttpService.search('any', ''))
      .toThrowError(`Passed param(s) 'searchQuery = ' is not valid`);
  });

  it('SEARCH should throw error when passed resourceName,searchQuery are undefined', () => {
    expect(() => resourceHttpService.search(undefined, undefined))
      .toThrowError(`Passed param(s) 'resourceName = undefined', 'searchQuery = undefined' is not valid`);
  });

  it('SEARCH should throw error when passed resourceName,searchQuery are null', () => {
    expect(() => resourceHttpService.search(null, null))
      .toThrowError(`Passed param(s) 'resourceName = null', 'searchQuery = null' is not valid`);
  });

  it('SEARCH should generate search resource url', () => {
    httpClientSpy.get.and.returnValue(of(rawResource));

    resourceHttpService.search('test', 'someQuery').subscribe(() => {
      const url = httpClientSpy.get.calls.argsFor(0)[0];
      expect(url).toBe(`${ httpConfigService.baseApiUrl }/test/search/someQuery`);
    });
  });

  it('SEARCH should pass http request params when it passed', () => {
    httpClientSpy.get.and.returnValue(of(rawResource));

    resourceHttpService.search('test', 'someQuery', {
      params: {
        projection: 'testProjection',
        test: 'testParam'
      }
    }).subscribe(() => {
      const httpParams = httpClientSpy.get.calls.argsFor(0)[1].params as HttpParams;
      expect(httpParams.has('projection')).toBeTrue();
      expect(httpParams.get('projection')).toBe('testProjection');

      expect(httpParams.has('test')).toBeTrue();
      expect(httpParams.get('test')).toBe('testParam');
    });
  });

});
