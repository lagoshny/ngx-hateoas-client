/* tslint:disable:no-string-literal */
import { BaseResource } from '../model/base-resource';
import { HttpConfigService } from '../../config/http-config.service';
import { async } from '@angular/core/testing';
import { ResourceUtils } from '../../util/resource.utils';
import { ResourceHttpService } from './resource-http.service';
import { Resource } from '../model/resource';
import { of } from 'rxjs';
import { rawCollectionResource, rawPagedCollectionResource, rawResource, SimpleResource } from '../model/resources.test';
import { HttpParams } from '@angular/common/http';

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
      putResource: jasmine.createSpy('putResource'),
      hasResource: jasmine.createSpy('hasResource'),
      getResource: jasmine.createSpy('getResource'),
      evictResource: jasmine.createSpy('evictResource')
    };
    httpConfigService = {
      baseApiUrl: 'http://localhost:8080/api/v1'
    };

    resourceHttpService =
      new ResourceHttpService<BaseResource>(httpClientSpy, cacheServiceSpy, httpConfigService);

    ResourceUtils.useResourceType(Resource);
  }));

  it('GET REQUEST should throw error when returned object is COLLECTION_RESOURCE', () => {
    httpClientSpy.get.and.returnValue(of(rawCollectionResource));

    resourceHttpService.get('someUrl').subscribe(() => {
    }, error => {
      expect(error.message).toBe('You try to get wrong resource type, expected single resource.');
    });
  });

  it('GET REQUEST should throw error when returned object is PAGED_COLLECTION_RESOURCE', () => {
    httpClientSpy.get.and.returnValue(of(rawPagedCollectionResource));

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

  it('GET REQUEST should return result from cache', () => {
    const cachedResult = Object.assign(new SimpleResource(), {text: 'test cache'});
    cacheServiceSpy.getResource.and.returnValue(cachedResult);
    cacheServiceSpy.hasResource.and.returnValue(true);

    resourceHttpService.get('someUrl').subscribe((result) => {
      expect(httpClientSpy.get.calls.count()).toBe(0);
      expect(cacheServiceSpy.getResource.calls.count()).toBe(1);
      expect(result['text']).toBe('test cache');
    });
  });

  it('GET REQUEST should put result to cache', () => {
    httpClientSpy.get.and.returnValue(of(rawResource));

    resourceHttpService.get('someUrl').subscribe(() => {
      expect(cacheServiceSpy.putResource.calls.count()).toBe(1);
    });
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

  it('POST REQUEST should evict result resource from cache', () => {
    httpClientSpy.post.and.returnValue(of(rawResource));

    resourceHttpService.post('someUrl', 'any').subscribe(() => {
      expect(cacheServiceSpy.evictResource.calls.count()).toBe(1);
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

  it('PUT REQUEST should evict result resource from cache', () => {
    httpClientSpy.put.and.returnValue(of(rawResource));

    resourceHttpService.put('someUrl', 'any').subscribe(() => {
      expect(cacheServiceSpy.evictResource.calls.count()).toBe(1);
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

  it('PATCH REQUEST should evict result resource from cache', () => {
    httpClientSpy.patch.and.returnValue(of(rawResource));

    resourceHttpService.patch('someUrl', 'any').subscribe(() => {
      expect(cacheServiceSpy.evictResource.calls.count()).toBe(1);
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

  it('DELETE_REQUEST should evict result resource from cache', () => {
    httpClientSpy.delete.and.returnValue(of(rawResource));

    resourceHttpService.delete('someUrl').subscribe(() => {
      expect(cacheServiceSpy.evictResource.calls.count()).toBe(1);
    });
  });

  it('COUNT throws error when resourceName is empty', () => {
    resourceHttpService.count('').subscribe(() => {
    }, (error) => {
      expect(error.message).toBe('resource name should be defined');
    });
  });

  it('COUNT throws error when resourceName is null', () => {
    resourceHttpService.count(null).subscribe(() => {
    }, (error) => {
      expect(error.message).toBe('resource name should be defined');
    });
  });

  it('COUNT throws error when resourceName is undefined', () => {
    resourceHttpService.count(undefined).subscribe(() => {
    }, (error) => {
      expect(error.message).toBe('resource name should be defined');
    });
  });

  it('COUNT should generate root resource url without query', () => {
    httpClientSpy.get.and.returnValue(of(5));

    resourceHttpService.count('test').subscribe(() => {
      const url = httpClientSpy.get.calls.argsFor(0)[0];
      expect(url).toBe(`${ httpConfigService.baseApiUrl }/test/search/countAll`);
    });
  });

  it('COUNT should generate root resource url with query', () => {
    httpClientSpy.get.and.returnValue(of(5));

    resourceHttpService.count('test', 'someCount').subscribe(() => {
      const url = httpClientSpy.get.calls.argsFor(0)[0];
      expect(url).toBe(`${ httpConfigService.baseApiUrl }/test/search/someCount`);
    });
  });

  it('COUNT should pass http request params when it passed', () => {
    httpClientSpy.get.and.returnValue(of(5));

    resourceHttpService.count('test', null, {
      test: 'testParam'
    }).subscribe(() => {
      const httpParams = httpClientSpy.get.calls.argsFor(0)[1].params as HttpParams;
      expect(httpParams.has('test')).toBeTrue();
      expect(httpParams.get('test')).toBe('testParam');
    });
  });

  it('COUNT should return number value', () => {
    httpClientSpy.get.and.returnValue(of(5));

    resourceHttpService.count('test', null, {
      test: 'testParam'
    }).subscribe((result) => {
      expect(typeof result === 'number').toBeTrue();
      expect(result).toBe(5);
    });
  });

  it('COUNT should throw error when return value is not number', () => {
    httpClientSpy.get.and.returnValue(of('fwaf'));

    resourceHttpService.count('test', null).subscribe(() => {
    }, error => {
      expect(error.message).toBe(`Returned value fwaf should be number.`);
    });
  });

  it('GET_RESOURCE throws error when resourceName is empty', () => {
    resourceHttpService.getResource('', 2).subscribe(() => {
    }, (error) => {
      expect(error.message).toBe('resource name should be defined');
    });
  });

  it('GET_RESOURCE throws error when resourceName is null', () => {
    resourceHttpService.getResource(null, 3).subscribe(() => {
    }, (error) => {
      expect(error.message).toBe('resource name should be defined');
    });
  });

  it('GET_RESOURCE throws error when resourceName is undefined', () => {
    resourceHttpService.getResource(undefined, 4).subscribe(() => {
    }, (error) => {
      expect(error.message).toBe('resource name should be defined');
    });
  });

  it('GET_RESOURCE throws error when id is equal 0', () => {
    resourceHttpService.getResource('any', 0).subscribe(() => {
    }, (error) => {
      expect(error.message).toBe('id should be defined and great than 0');
    });
  });

  it('GET_RESOURCE throws error when id is less than 0', () => {
    resourceHttpService.getResource('any', -3).subscribe(() => {
    }, (error) => {
      expect(error.message).toBe('id should be defined and great than 0');
    });
  });

  it('GET_RESOURCE throws error when id is null', () => {
    resourceHttpService.getResource('any', null).subscribe(() => {
    }, (error) => {
      expect(error.message).toBe('id should be defined and great than 0');
    });
  });

  it('GET_RESOURCE throws error when id is undefined', () => {
    resourceHttpService.getResource('any', undefined).subscribe(() => {
    }, (error) => {
      expect(error.message).toBe('id should be defined and great than 0');
    });
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
      projection: 'testProjection',
      params: {
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

  it('POST_RESOURCE throws error when resourceName is empty', () => {
    resourceHttpService.postResource('', new SimpleResource()).subscribe(() => {
    }, (error) => {
      expect(error.message).toBe('resource name should be defined');
    });
  });

  it('POST_RESOURCE throws error when resourceName is null', () => {
    resourceHttpService.postResource(null, new SimpleResource()).subscribe(() => {
    }, (error) => {
      expect(error.message).toBe('resource name should be defined');
    });
  });

  it('POST_RESOURCE throws error when resourceName is undefined', () => {
    resourceHttpService.postResource(undefined, new SimpleResource()).subscribe(() => {
    }, (error) => {
      expect(error.message).toBe('resource name should be defined');
    });
  });

  it('POST_RESOURCE throws error when body is null', () => {
    resourceHttpService.postResource('any', null).subscribe(() => {
    }, (error) => {
      expect(error.message).toBe('body should be defined');
    });
  });

  it('POST_RESOURCE throws error when body is undefined', () => {
    resourceHttpService.postResource('any', undefined).subscribe(() => {
    }, (error) => {
      expect(error.message).toBe('body should be defined');
    });
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

  it('SEARCH throws error when resourceName is empty', () => {
    resourceHttpService.search('', 'any').subscribe(() => {
    }, (error) => {
      expect(error.message).toBe('resource name should be defined');
    });
  });

  it('SEARCH throws error when resourceName is null', () => {
    resourceHttpService.search(null, 'any').subscribe(() => {
    }, (error) => {
      expect(error.message).toBe('resource name should be defined');
    });
  });

  it('SEARCH throws error when resourceName is undefined', () => {
    resourceHttpService.search(undefined, 'any').subscribe(() => {
    }, (error) => {
      expect(error.message).toBe('resource name should be defined');
    });
  });

  it('SEARCH throws error when searchQuery is empty', () => {
    resourceHttpService.search('any', '').subscribe(() => {
    }, (error) => {
      expect(error.message).toBe('search query should be defined');
    });
  });

  it('SEARCH throws error when searchQuery is null', () => {
    resourceHttpService.search('any', null).subscribe(() => {
    }, (error) => {
      expect(error.message).toBe('search query should be defined');
    });
  });

  it('SEARCH throws error when searchQuery is undefined', () => {
    resourceHttpService.search('any', undefined).subscribe(() => {
    }, (error) => {
      expect(error.message).toBe('search query should be defined');
    });
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
      projection: 'testProjection',
      params: {
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
