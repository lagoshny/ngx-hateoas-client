import { ResourceCollectionHttpService } from './resource-collection-http.service';
import { ResourceCollection } from '../../model/resource/resource-collection';
import { of } from 'rxjs';
import {
  rawEmbeddedResource,
  rawPagedResourceCollection,
  rawResource,
  rawResourceCollection
} from '../../model/resource/resources.test';
import { ResourceUtils } from '../../util/resource.utils';
import { HttpParams } from '@angular/common/http';
import { Resource } from '../../model/resource/resource';
import { LibConfig } from '../../config/lib-config';
import { UrlUtils } from '../../util/url.utils';
import { DEFAULT_ROUTE_NAME } from '../../config/hateoas-configuration.interface';

/* tslint:disable:no-string-literal */
describe('ResourceCollectionHttpService', () => {
  let resourceCollectionHttpService: ResourceCollectionHttpService;
  let httpClientSpy: any;
  let cacheServiceSpy: any;

  beforeEach(() => {
    httpClientSpy = {
      get: jasmine.createSpy('get')
    };
    cacheServiceSpy = {
      putResource: jasmine.createSpy('putResource'),
      getResource: jasmine.createSpy('getResource'),
      evictResource: jasmine.createSpy('evictResource')
    };

    resourceCollectionHttpService =
      new ResourceCollectionHttpService(httpClientSpy, cacheServiceSpy);

    ResourceUtils.useResourceType(Resource);
    ResourceUtils.useResourceCollectionType(ResourceCollection);
  });

  afterEach(() => {
    ResourceUtils.useResourceType(null);
    ResourceUtils.useResourceCollectionType(null);
    LibConfig.config = LibConfig.DEFAULT_CONFIG;
  });

  it('GET REQUEST should throw error when returned object is EMBEDDED_RESOURCE', () => {
    httpClientSpy.get.and.returnValue(of(rawEmbeddedResource));

    resourceCollectionHttpService.get('someUrl').subscribe(() => {
    }, error => {
      expect(error.message).toBe('You try to get the wrong resource type: expected ResourceCollection type, actual EmbeddedResource type.');
    });
  });

  it('GET REQUEST should throw error when returned object is RESOURCE', () => {
    httpClientSpy.get.and.returnValue(of(rawResource));

    resourceCollectionHttpService.get('someUrl').subscribe(() => {
    }, error => {
      expect(error.message).toBe('You try to get the wrong resource type: expected ResourceCollection type, actual Resource type.');
    });
  });

  it('GET REQUEST should throw error when returned object is PAGED_COLLECTION_RESOURCE', () => {
    httpClientSpy.get.and.returnValue(of(rawPagedResourceCollection));

    resourceCollectionHttpService.get('someUrl').subscribe(() => {
    }, error => {
      expect(error.message).toBe('You try to get the wrong resource type: expected ResourceCollection type, actual PagedResourceCollection type.');
    });
  });

  it('GET REQUEST should throw error when returned object is any data that not resource collection', () => {
    httpClientSpy.get.and.returnValue(of({any: 'value'}));

    resourceCollectionHttpService.get('someUrl').subscribe(() => {
    }, error => {
      expect(error.message).toBe('You try to get the wrong resource type: expected ResourceCollection type, actual Unknown type.');
    });
  });

  it('GET REQUEST should return collected resource', () => {
    httpClientSpy.get.and.returnValue(of(rawResourceCollection));

    resourceCollectionHttpService.get('someUrl').subscribe((result) => {
      expect(result instanceof ResourceCollection).toBeTrue();
    });
  });

  it('GET REQUEST should fill http request params from params object', () => {
    httpClientSpy.get.and.returnValue(of(rawResourceCollection));

    resourceCollectionHttpService.get('order', {
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
    httpClientSpy.get.and.returnValue(of(rawResourceCollection));

    resourceCollectionHttpService.get('order', {
      params: {
        projection: 'orderProjection'
      }
    }).subscribe(() => {
      const httpParams = httpClientSpy.get.calls.argsFor(0)[1].params;
      expect(httpParams.has('projection')).toBeTrue();
      expect(httpParams.get('projection')).toBe('orderProjection');
    });
  });

  it('GET REQUEST should evict cache when returned object is not resource collection', () => {
    LibConfig.config.cache.enabled = true;
    httpClientSpy.get.and.returnValue(of({any: 'value'}));

    resourceCollectionHttpService.get('someUrl').subscribe(() => {
    }, () => {
      expect(cacheServiceSpy.evictResource.calls.count()).toBe(1);
    });
  });

  it('GET_RESOURCE_COLLECTION throws error when resourceName is empty', () => {
    expect(() => resourceCollectionHttpService.getResourceCollection('', {routeName: DEFAULT_ROUTE_NAME}))
      .toThrowError(`Passed param(s) 'resourceName = ' is not valid`);
  });

  it('GET_RESOURCE_COLLECTION throws error when resourceName is null', () => {
    expect(() => resourceCollectionHttpService.getResourceCollection(null, {routeName: DEFAULT_ROUTE_NAME}))
      .toThrowError(`Passed param(s) 'resourceName = null' is not valid`);
  });

  it('GET_RESOURCE_COLLECTION throws error when resourceName is undefined', () => {
    expect(() => resourceCollectionHttpService.getResourceCollection(undefined, {routeName: DEFAULT_ROUTE_NAME}))
      .toThrowError(`Passed param(s) 'resourceName = undefined' is not valid`);
  });

  it('GET_RESOURCE_COLLECTION should generate root resource url', () => {
    httpClientSpy.get.and.returnValue(of(rawResourceCollection));

    resourceCollectionHttpService.getResourceCollection('test', {routeName: DEFAULT_ROUTE_NAME}).subscribe(() => {
      const url = httpClientSpy.get.calls.argsFor(0)[0];
      expect(url).toBe(`${ UrlUtils.getApiUrl(DEFAULT_ROUTE_NAME) }/test`);
    });
  });

  it('GET_RESOURCE_COLLECTION should pass http request params when it passed', () => {
    httpClientSpy.get.and.returnValue(of(rawResourceCollection));

    resourceCollectionHttpService.getResourceCollection('test', {routeName: DEFAULT_ROUTE_NAME}, {
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

  it('SEARCH throws error when resourceName is empty', () => {
    expect(() => resourceCollectionHttpService.search('', {routeName: DEFAULT_ROUTE_NAME}, 'any'))
      .toThrowError(`Passed param(s) 'resourceName = ' is not valid`);
  });

  it('SEARCH throws error when searchQuery is empty', () => {
    expect(() => resourceCollectionHttpService.search('any', {routeName: DEFAULT_ROUTE_NAME}, ''))
      .toThrowError(`Passed param(s) 'searchQuery = ' is not valid`);
  });

  it('SEARCH throws error when resourceName,searchQuery are null', () => {
    expect(() => resourceCollectionHttpService.search(null, {routeName: DEFAULT_ROUTE_NAME}, null))
      .toThrowError(`Passed param(s) 'resourceName = null', 'searchQuery = null' are not valid`);
  });

  it('SEARCH throws error when resourceName,searchQuery are undefined', () => {
    expect(() => resourceCollectionHttpService.search(undefined, {routeName: DEFAULT_ROUTE_NAME}, undefined))
      .toThrowError(`Passed param(s) 'resourceName = undefined', 'searchQuery = undefined' are not valid`);
  });

  it('SEARCH should generate search resource url', () => {
    httpClientSpy.get.and.returnValue(of(rawResourceCollection));

    resourceCollectionHttpService.search('test', {routeName: DEFAULT_ROUTE_NAME}, 'someQuery').subscribe(() => {
      const url = httpClientSpy.get.calls.argsFor(0)[0];
      expect(url).toBe(`${ UrlUtils.getApiUrl(DEFAULT_ROUTE_NAME) }/test/search/someQuery`);
    });
  });

  it('SEARCH should pass http request params when it passed', () => {
    httpClientSpy.get.and.returnValue(of(rawResourceCollection));

    resourceCollectionHttpService.search('test', {routeName: DEFAULT_ROUTE_NAME}, 'someQuery', {
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
