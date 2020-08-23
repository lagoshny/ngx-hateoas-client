import { async } from '@angular/core/testing';
import { HttpConfigService } from '../../config/http-config.service';
import { ResourceCollectionHttpService } from './resource-collection-http.service';
import { ResourceCollection } from '../../model/resource/resource-collection';
import { BaseResource } from '../../model/resource/base-resource';
import { of } from 'rxjs';
import { rawEmbeddedResource, rawPagedResourceCollection, rawResource, rawResourceCollection } from '../../model/resource/resources.test';
import { ResourceUtils } from '../../util/resource.utils';
import { HttpParams } from '@angular/common/http';
import { Resource } from '../../model/resource/resource';
import { PagedResourceCollection } from '../../model/resource/paged-resource-collection';

/* tslint:disable:no-string-literal */
describe('ResourceCollectionHttpService', () => {
  let resourceCollectionHttpServiceSpy: ResourceCollectionHttpService<ResourceCollection<BaseResource>>;
  let httpClientSpy: any;
  let cacheServiceSpy: any;
  let httpConfigService: HttpConfigService;

  beforeEach(async(() => {
    httpClientSpy = {
      get: jasmine.createSpy('get')
    };
    cacheServiceSpy = {
      putValue: jasmine.createSpy('putValue'),
      getValue: jasmine.createSpy('getValue'),
      evictValue: jasmine.createSpy('evictValue')
    };
    httpConfigService = {
      baseApiUrl: 'http://localhost:8080/api/v1'
    };

    resourceCollectionHttpServiceSpy =
      new ResourceCollectionHttpService<ResourceCollection<BaseResource>>(httpClientSpy, cacheServiceSpy, httpConfigService);
  }));

  beforeEach(() => {
    ResourceUtils.useResourceType(Resource);
    ResourceUtils.useResourceCollectionType(ResourceCollection);
  });

  afterEach(() => {
    ResourceUtils.useResourceType(null);
    ResourceUtils.useResourceCollectionType(null);
  });

  it('GET REQUEST should throw error when returned object is EMBEDDED_RESOURCE', () => {
    httpClientSpy.get.and.returnValue(of(rawEmbeddedResource));

    resourceCollectionHttpServiceSpy.get('someUrl').subscribe(() => {
    }, error => {
      expect(error.message).toBe('You try to get wrong resource type, expected resource collection type.');
    });
  });

  it('GET REQUEST should throw error when returned object is RESOURCE', () => {
    httpClientSpy.get.and.returnValue(of(rawResource));

    resourceCollectionHttpServiceSpy.get('someUrl').subscribe(() => {
    }, error => {
      expect(error.message).toBe('You try to get wrong resource type, expected resource collection type.');
    });
  });

  it('GET REQUEST should throw error when returned object is PAGED_COLLECTION_RESOURCE', () => {
    httpClientSpy.get.and.returnValue(of(rawPagedResourceCollection));

    resourceCollectionHttpServiceSpy.get('someUrl').subscribe(() => {
    }, error => {
      expect(error.message).toBe('You try to get wrong resource type, expected resource collection type.');
    });
  });

  it('GET REQUEST should throw error when returned object is any data that not resource collection', () => {
    httpClientSpy.get.and.returnValue(of({any: 'value'}));

    resourceCollectionHttpServiceSpy.get('someUrl').subscribe(() => {
    }, error => {
      expect(error.message).toBe('You try to get wrong resource type, expected resource collection type.');
    });
  });

  it('GET REQUEST should return collected resource', () => {
    httpClientSpy.get.and.returnValue(of(rawResourceCollection));

    resourceCollectionHttpServiceSpy.get('someUrl').subscribe((result) => {
      expect(result instanceof ResourceCollection).toBeTrue();
    });
  });
  //
  // it('should fill template params in TEMPLATED link from passed params object', () => {
  //   resourceCollectionHttpServiceSpy.get.and.returnValue(of(new TestOrderResource()));
  //
  //   baseResource.getRelatedCollection('paymentType', {
  //     params: {
  //       paymentId: 10
  //     }
  //   }).subscribe(() => {
  //     const resultResourceUrl = resourceCollectionHttpServiceSpy.get.calls.argsFor(0)[0];
  //     expect(resultResourceUrl).toBe('http://localhost:8080/api/v1/order/1/payment?paymentId=10');
  //   });
  // });


  // it('should fill projection template param for TEMPLATED link', () => {
  //   resourceCollectionHttpServiceSpy.get.and.returnValue(of(new TestOrderResource()));
  //
  //   baseResource.getRelatedCollection('paymentType', {
  //     params: {
  //       projection: 'paymentProjection'
  //     }
  //   }).subscribe(() => {
  //     const resultResourceUrl = resourceCollectionHttpServiceSpy.get.calls.argsFor(0)[0];
  //     expect(resultResourceUrl).toBe('http://localhost:8080/api/v1/order/1/payment?projection=paymentProjection');
  //   });
  // });

  // it('should clear template params for TEMPLATED link when passed params object IS EMPTY', () => {
  //   resourceCollectionHttpServiceSpy.get.and.returnValue(of(new TestOrderResource()));
  //
  //   baseResource.getRelatedCollection('paymentType', {}).subscribe(() => {
  //     const resultResourceUrl = resourceCollectionHttpServiceSpy.get.calls.argsFor(0)[0];
  //     expect(resultResourceUrl).toBe('http://localhost:8080/api/v1/order/1/payment');
  //   });
  // });


  // it('should fill http request params for NOT TEMPLATED link from params object', () => {
  //   resourceCollectionHttpServiceSpy.get.and.returnValue(of(new TestOrderResource()));
  //
  //   baseResource.getRelatedCollection('order', {
  //     params: {
  //       orderType: 'online'
  //     }
  //   }).subscribe(() => {
  //     const resultResourceUrl = resourceCollectionHttpServiceSpy.get.calls.argsFor(0)[0];
  //     expect(resultResourceUrl).toBe('http://localhost:8080/api/v1/order/1');
  //
  //     const httpParams = resourceCollectionHttpServiceSpy.get.calls.argsFor(0)[1].params;
  //     expect(httpParams.has('orderType')).toBeTrue();
  //     expect(httpParams.get('orderType')).toBe('online');
  //   });
  // });

  // it('should adds projection param in http request params for NOT TEMPLATED link', () => {
  //   resourceCollectionHttpServiceSpy.get.and.returnValue(of(new TestOrderResource()));
  //
  //   baseResource.getRelatedCollection('order', {
  //     params: {
  //       projection: 'orderProjection'
  //     }
  //   }).subscribe(() => {
  //     const resultResourceUrl = resourceCollectionHttpServiceSpy.get.calls.argsFor(0)[0];
  //     expect(resultResourceUrl).toBe('http://localhost:8080/api/v1/order/1');
  //
  //     const httpParams = resourceCollectionHttpServiceSpy.get.calls.argsFor(0)[1].params;
  //     expect(httpParams.has('projection')).toBeTrue();
  //     expect(httpParams.get('projection')).toBe('orderProjection');
  //   });
  // });


  it('GET_RESOURCE_COLLECTION throws error when resourceName is empty', () => {
    expect(() => resourceCollectionHttpServiceSpy.getResourceCollection(''))
      .toThrowError(`Passed param(s) 'resourceName = ' is not valid`);
  });

  it('GET_RESOURCE_COLLECTION throws error when resourceName is null', () => {
    expect(() => resourceCollectionHttpServiceSpy.getResourceCollection(null))
      .toThrowError(`Passed param(s) 'resourceName = null' is not valid`);
  });

  it('GET_RESOURCE_COLLECTION throws error when resourceName is undefined', () => {
    expect(() => resourceCollectionHttpServiceSpy.getResourceCollection(undefined))
      .toThrowError(`Passed param(s) 'resourceName = undefined' is not valid`);
  });

  it('GET_RESOURCE_COLLECTION should generate root resource url', () => {
    httpClientSpy.get.and.returnValue(of(rawResourceCollection));

    resourceCollectionHttpServiceSpy.getResourceCollection('test').subscribe(() => {
      const url = httpClientSpy.get.calls.argsFor(0)[0];
      expect(url).toBe(`${ httpConfigService.baseApiUrl }/test`);
    });
  });

  it('GET_RESOURCE_COLLECTION should pass http request params when it passed', () => {
    httpClientSpy.get.and.returnValue(of(rawResourceCollection));

    resourceCollectionHttpServiceSpy.getResourceCollection('test', {
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
    expect(() => resourceCollectionHttpServiceSpy.search('', 'any'))
      .toThrowError(`Passed param(s) 'resourceName = ' is not valid`);
  });

  it('SEARCH throws error when searchQuery is empty', () => {
    expect(() => resourceCollectionHttpServiceSpy.search('any', ''))
      .toThrowError(`Passed param(s) 'searchQuery = ' is not valid`);
  });

  it('SEARCH throws error when resourceName,searchQuery are null', () => {
    expect(() => resourceCollectionHttpServiceSpy.search(null, null))
      .toThrowError(`Passed param(s) 'resourceName = null', 'searchQuery = null' is not valid`);
  });

  it('SEARCH throws error when resourceName,searchQuery are undefined', () => {
    expect(() => resourceCollectionHttpServiceSpy.search(undefined, undefined))
      .toThrowError(`Passed param(s) 'resourceName = undefined', 'searchQuery = undefined' is not valid`);
  });

  it('SEARCH should generate search resource url', () => {
    httpClientSpy.get.and.returnValue(of(rawResourceCollection));

    resourceCollectionHttpServiceSpy.search('test', 'someQuery').subscribe(() => {
      const url = httpClientSpy.get.calls.argsFor(0)[0];
      expect(url).toBe(`${ httpConfigService.baseApiUrl }/test/search/someQuery`);
    });
  });

  it('SEARCH should pass http request params when it passed', () => {
    httpClientSpy.get.and.returnValue(of(rawResourceCollection));

    resourceCollectionHttpServiceSpy.search('test', 'someQuery', {
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
