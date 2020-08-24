import { HttpConfigService } from '../../config/http-config.service';
import { ResourceCollection } from '../../model/resource/resource-collection';
import { BaseResource } from '../../model/resource/base-resource';
import { of } from 'rxjs';
import { rawEmbeddedResource, rawPagedResourceCollection, rawResource, rawResourceCollection } from '../../model/resource/resources.test';
import { ResourceUtils } from '../../util/resource.utils';
import { HttpParams } from '@angular/common/http';
import { PagedResourceCollectionHttpService } from './paged-resource-collection-http.service';
import { PagedResourceCollection } from '../../model/resource/paged-resource-collection';
import { Resource } from '../../model/resource/resource';

/* tslint:disable:no-string-literal */
describe('PagedResourceCollectionHttpService', () => {
  let pagedResourceCollectionHttpService: PagedResourceCollectionHttpService<PagedResourceCollection<BaseResource>>;
  let httpClientSpy: any;
  let cacheServiceSpy: any;
  let httpConfigService: HttpConfigService;

  beforeEach(() => {
    httpClientSpy = {
      get: jasmine.createSpy('get')
    };
    cacheServiceSpy = {
      enabled: false,
      putResource: jasmine.createSpy('putResource'),
      getResource: jasmine.createSpy('getResource'),
      evictResource: jasmine.createSpy('evictResource')
    };
    httpConfigService = {
      baseApiUrl: 'http://localhost:8080/api/v1'
    };

    pagedResourceCollectionHttpService =
      new PagedResourceCollectionHttpService<PagedResourceCollection<BaseResource>>(httpClientSpy, cacheServiceSpy, httpConfigService);

    ResourceUtils.useResourceType(Resource);
    ResourceUtils.useResourceCollectionType(ResourceCollection);
    ResourceUtils.usePagedResourceCollectionType(PagedResourceCollection);
  });

  afterEach(() => {
    ResourceUtils.useResourceType(null);
    ResourceUtils.useResourceCollectionType(null);
    ResourceUtils.usePagedResourceCollectionType(null);
  });

  it('GET REQUEST should throw error when returned object is EMBEDDED_RESOURCE', () => {
    httpClientSpy.get.and.returnValue(of(rawEmbeddedResource));

    pagedResourceCollectionHttpService.get('someUrl').subscribe(() => {
    }, error => {
      expect(error.message).toBe('You try to get wrong resource type, expected paged resource collection type.');
    });
  });

  it('GET REQUEST should throw error when returned object is RESOURCE', () => {
    httpClientSpy.get.and.returnValue(of(rawResource));

    pagedResourceCollectionHttpService.get('someUrl').subscribe(() => {
    }, error => {
      expect(error.message).toBe('You try to get wrong resource type, expected paged resource collection type.');
    });
  });

  it('GET REQUEST should throw error when returned object is COLLECTION_RESOURCE', () => {
    httpClientSpy.get.and.returnValue(of(rawResourceCollection));

    pagedResourceCollectionHttpService.get('someUrl').subscribe(() => {
    }, error => {
      expect(error.message).toBe('You try to get wrong resource type, expected paged resource collection type.');
    });
  });

  it('GET REQUEST should throw error when returned object is any data that not paged resource collection', () => {
    httpClientSpy.get.and.returnValue(of({any: 'value'}));

    pagedResourceCollectionHttpService.get('someUrl').subscribe(() => {
    }, error => {
      expect(error.message).toBe('You try to get wrong resource type, expected paged resource collection type.');
    });
  });

  it('GET REQUEST should evict cache when returned object is not paged resource collection', () => {
    cacheServiceSpy.enabled = true;
    httpClientSpy.get.and.returnValue(of({any: 'value'}));

    pagedResourceCollectionHttpService.get('someUrl').subscribe(() => {
    }, () => {
      expect(cacheServiceSpy.evictResource.calls.count()).toBe(1);
    });
  });

  it('GET REQUEST should return paged collected resource', () => {
    httpClientSpy.get.and.returnValue(of(rawPagedResourceCollection));

    pagedResourceCollectionHttpService.get('someUrl').subscribe((result) => {
      expect(result instanceof PagedResourceCollection).toBeTrue();
    });
  });

  it('GET REQUEST should throw error when page params passed IN PARAMS OBJECT', () => {
    expect(() => {
      pagedResourceCollectionHttpService.get('someUrl', {
        params: {
          page: 1,
          size: 2
        }
      }).subscribe();
    }).toThrowError('Please, pass page params in page object key, not with params object!');
  });

  it('GET REQUEST should pass page params as http request params', () => {
    httpClientSpy.get.and.returnValue(of(rawPagedResourceCollection));

    pagedResourceCollectionHttpService.get('http://localhost:8080/api/v1/order/1/magazine', {
      pageParams: {
        size: 10,
        page: 1,
        sort: {
          abc: 'ASC',
          cde: 'DESC'
        }
      }
    }).subscribe(() => {
      const resultResourceUrl = httpClientSpy.get.calls.argsFor(0)[0];
      expect(resultResourceUrl).toBe('http://localhost:8080/api/v1/order/1/magazine');

      const httpParams = httpClientSpy.get.calls.argsFor(0)[1].params;
      expect(httpParams.has('size')).toBeTrue();
      expect(httpParams.get('size')).toBe('10');
      expect(httpParams.has('page')).toBeTrue();
      expect(httpParams.get('page')).toBe('1');
      expect(httpParams.has('sort')).toBeTrue();
      expect(httpParams.getAll('sort')[0]).toBe('abc,ASC');
      expect(httpParams.getAll('sort')[1]).toBe('cde,DESC');
    });
  });

  it('GET REQUEST should adds projection param to http request params', () => {
    httpClientSpy.get.and.returnValue(of(rawPagedResourceCollection));

    pagedResourceCollectionHttpService.get('http://localhost:8080/api/v1/order/1/magazine', {
      params: {
        projection: 'magazineProjection'
      }
    }).subscribe(() => {
      const resultResourceUrl = httpClientSpy.get.calls.argsFor(0)[0];
      expect(resultResourceUrl).toBe('http://localhost:8080/api/v1/order/1/magazine');

      const httpParams = httpClientSpy.get.calls.argsFor(0)[1].params;
      expect(httpParams.has('projection')).toBeTrue();
      expect(httpParams.get('projection')).toBe('magazineProjection');
    });
  });

  it('GET_RESOURCE_PAGE throws error when resourceName is empty', () => {
    expect(() => pagedResourceCollectionHttpService.getResourcePage(''))
      .toThrowError(`Passed param(s) 'resourceName = ' is not valid`);
  });

  it('GET_RESOURCE_PAGE throws error when resourceName is null', () => {
    expect(() => pagedResourceCollectionHttpService.getResourcePage(null))
      .toThrowError(`Passed param(s) 'resourceName = null' is not valid`);
  });

  it('GET_RESOURCE_PAGE throws error when resourceName is undefined', () => {
    expect(() => pagedResourceCollectionHttpService.getResourcePage(undefined))
      .toThrowError(`Passed param(s) 'resourceName = undefined' is not valid`);
  });

  it('GET_RESOURCE_PAGE should generate root resource url', () => {
    httpClientSpy.get.and.returnValue(of(rawPagedResourceCollection));

    pagedResourceCollectionHttpService.getResourcePage('test').subscribe(() => {
      const url = httpClientSpy.get.calls.argsFor(0)[0];
      expect(url).toBe(`${ httpConfigService.baseApiUrl }/test`);
    });
  });

  it('GET_RESOURCE_PAGE should pass http request params when it passed', () => {
    httpClientSpy.get.and.returnValue(of(rawPagedResourceCollection));

    pagedResourceCollectionHttpService.getResourcePage('test', {
      params: {
        projection: 'testProjection',
        test: 'testParam'
      },
      pageParams: {
        page: 1,
        size: 2,
        sort: {
          prop1: 'DESC',
          prop2: 'ASC'
        }
      }
    }).subscribe(() => {
      const httpParams = httpClientSpy.get.calls.argsFor(0)[1].params as HttpParams;
      expect(httpParams.has('projection')).toBeTrue();
      expect(httpParams.get('projection')).toBe('testProjection');

      expect(httpParams.has('sort')).toBeTrue();
      expect(httpParams.getAll('sort').length).toBe(2);
      expect(httpParams.getAll('sort')[0]).toBe('prop1,DESC');
      expect(httpParams.getAll('sort')[1]).toBe('prop2,ASC');
      expect(httpParams.has('size')).toBeTrue();
      expect(httpParams.get('size')).toBe('2');
      expect(httpParams.has('page')).toBeTrue();
      expect(httpParams.get('page')).toBe('1');

      expect(httpParams.has('test')).toBeTrue();
      expect(httpParams.get('test')).toBe('testParam');
    });
  });

  it('GET_RESOURCE_PAGE should use default page options', () => {
    httpClientSpy.get.and.returnValue(of(rawPagedResourceCollection));

    pagedResourceCollectionHttpService.getResourcePage('test', {
      params: {
        projection: 'testProjection',
        test: 'testParam'
      }
    }).subscribe(() => {
      const httpParams = httpClientSpy.get.calls.argsFor(0)[1].params as HttpParams;
      expect(httpParams.has('projection')).toBeTrue();
      expect(httpParams.get('projection')).toBe('testProjection');

      expect(httpParams.has('size')).toBeTrue();
      expect(httpParams.get('size')).toBe('20');
      expect(httpParams.has('page')).toBeTrue();
      expect(httpParams.get('page')).toBe('0');

      expect(httpParams.has('test')).toBeTrue();
      expect(httpParams.get('test')).toBe('testParam');
    });
  });

  it('GET_RESOURCE_PAGE should use default page number options', () => {
    httpClientSpy.get.and.returnValue(of(rawPagedResourceCollection));

    pagedResourceCollectionHttpService.getResourcePage('test', {
      pageParams: {
        size: 10
      }
    }).subscribe(() => {
      const httpParams = httpClientSpy.get.calls.argsFor(0)[1].params as HttpParams;
      expect(httpParams.has('size')).toBeTrue();
      expect(httpParams.get('size')).toBe('10');
      expect(httpParams.has('page')).toBeTrue();
      expect(httpParams.get('page')).toBe('0');
    });
  });

  it('GET_RESOURCE_PAGE should use default page size options', () => {
    httpClientSpy.get.and.returnValue(of(rawPagedResourceCollection));

    pagedResourceCollectionHttpService.getResourcePage('test', {
      pageParams: {
        page: 1
      }
    }).subscribe(() => {
      const httpParams = httpClientSpy.get.calls.argsFor(0)[1].params as HttpParams;
      expect(httpParams.has('size')).toBeTrue();
      expect(httpParams.get('size')).toBe('20');
      expect(httpParams.has('page')).toBeTrue();
      expect(httpParams.get('page')).toBe('1');
    });
  });

  it('SEARCH throws error when resourceName is empty', () => {
    expect(() => pagedResourceCollectionHttpService.search('', 'any'))
      .toThrowError(`Passed param(s) 'resourceName = ' is not valid`);
  });

  it('SEARCH throws error when searchQuery is empty', () => {
    expect(() => pagedResourceCollectionHttpService.search('any', ''))
      .toThrowError(`Passed param(s) 'searchQuery = ' is not valid`);
  });

  it('SEARCH throws error when resourceName,searchQuery are null', () => {
    expect(() => pagedResourceCollectionHttpService.search(null, null))
      .toThrowError(`Passed param(s) 'resourceName = null', 'searchQuery = null' are not valid`);
  });

  it('SEARCH throws error when resourceName,searchQuery are undefined', () => {
    expect(() => pagedResourceCollectionHttpService.search(undefined, undefined))
      .toThrowError(`Passed param(s) 'resourceName = undefined', 'searchQuery = undefined' are not valid`);
  });

  it('SEARCH should generate search resource url', () => {
    httpClientSpy.get.and.returnValue(of(rawPagedResourceCollection));

    pagedResourceCollectionHttpService.search('test', 'someQuery').subscribe(() => {
      const url = httpClientSpy.get.calls.argsFor(0)[0];
      expect(url).toBe(`${ httpConfigService.baseApiUrl }/test/search/someQuery`);
    });
  });

  it('SEARCH should pass http request params when it passed', () => {
    httpClientSpy.get.and.returnValue(of(rawPagedResourceCollection));

    pagedResourceCollectionHttpService.search('test', 'someQuery', {
      params: {
        projection: 'testProjection',
        test: 'testParam'
      },
      pageParams: {
        page: 1,
        size: 2,
        sort: {
          prop1: 'DESC',
          prop2: 'ASC'
        }
      }
    }).subscribe(() => {
      const httpParams = httpClientSpy.get.calls.argsFor(0)[1].params as HttpParams;
      expect(httpParams.has('projection')).toBeTrue();
      expect(httpParams.get('projection')).toBe('testProjection');

      expect(httpParams.has('sort')).toBeTrue();
      expect(httpParams.getAll('sort').length).toBe(2);
      expect(httpParams.getAll('sort')[0]).toBe('prop1,DESC');
      expect(httpParams.getAll('sort')[1]).toBe('prop2,ASC');
      expect(httpParams.has('size')).toBeTrue();
      expect(httpParams.get('size')).toBe('2');
      expect(httpParams.has('page')).toBeTrue();
      expect(httpParams.get('page')).toBe('1');

      expect(httpParams.has('test')).toBeTrue();
      expect(httpParams.get('test')).toBe('testParam');
    });
  });

  it('SEARCH should use default page options', () => {
    httpClientSpy.get.and.returnValue(of(rawPagedResourceCollection));

    pagedResourceCollectionHttpService.search('test', 'someQuery', {
      params: {
        projection: 'testProjection',
        test: 'testParam'
      }
    }).subscribe(() => {
      const httpParams = httpClientSpy.get.calls.argsFor(0)[1].params as HttpParams;
      expect(httpParams.has('projection')).toBeTrue();
      expect(httpParams.get('projection')).toBe('testProjection');

      expect(httpParams.has('size')).toBeTrue();
      expect(httpParams.get('size')).toBe('20');
      expect(httpParams.has('page')).toBeTrue();
      expect(httpParams.get('page')).toBe('0');

      expect(httpParams.has('test')).toBeTrue();
      expect(httpParams.get('test')).toBe('testParam');
    });
  });


  it('SEARCH should use default page number options', () => {
    httpClientSpy.get.and.returnValue(of(rawPagedResourceCollection));

    pagedResourceCollectionHttpService.search('test', 'any', {
      pageParams: {
        size: 10
      }
    }).subscribe(() => {
      const httpParams = httpClientSpy.get.calls.argsFor(0)[1].params as HttpParams;
      expect(httpParams.has('size')).toBeTrue();
      expect(httpParams.get('size')).toBe('10');
      expect(httpParams.has('page')).toBeTrue();
      expect(httpParams.get('page')).toBe('0');
    });
  });

  it('SEARCH should use default page size options', () => {
    httpClientSpy.get.and.returnValue(of(rawPagedResourceCollection));

    pagedResourceCollectionHttpService.search('test', 'any', {
      pageParams: {
        page: 1
      }
    }).subscribe(() => {
      const httpParams = httpClientSpy.get.calls.argsFor(0)[1].params as HttpParams;
      expect(httpParams.has('size')).toBeTrue();
      expect(httpParams.get('size')).toBe('20');
      expect(httpParams.has('page')).toBeTrue();
      expect(httpParams.get('page')).toBe('1');
    });
  });

});
