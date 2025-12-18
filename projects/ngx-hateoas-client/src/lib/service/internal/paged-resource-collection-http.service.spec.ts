import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ResourceCollection } from '../../model/resource/resource-collection';
import { of } from 'rxjs';
import {
  rawEmbeddedResource,
  rawPagedResourceCollection,
  rawResource,
  rawResourceCollection
} from '../../model/resource/resources.test-utils';
import { ResourceUtils } from '../../util/resource.utils';
import { HttpParams } from '@angular/common/http';
import { PagedResourceCollectionHttpService } from './paged-resource-collection-http.service';
import { PagedResourceCollection } from '../../model/resource/paged-resource-collection';
import { Resource } from '../../model/resource/resource';
import { LibConfig } from '../../config/lib-config';
import { UrlUtils } from '../../util/url.utils';
import { DEFAULT_ROUTE_NAME } from '../../config/hateoas-configuration.interface';

/* tslint:disable:no-string-literal */
describe('PagedResourceCollectionHttpService', () => {
  let pagedResourceCollectionHttpService: PagedResourceCollectionHttpService;
  let httpClientSpy: any;
  let cacheServiceSpy: any;

  beforeEach(() => {
    httpClientSpy = {
      get: vi.fn()
    };
    cacheServiceSpy = {
      putResource: vi.fn(),
      getResource: vi.fn(),
      evictResource: vi.fn()
    };

    pagedResourceCollectionHttpService =
      new PagedResourceCollectionHttpService(httpClientSpy, cacheServiceSpy);

    ResourceUtils.useResourceType(Resource);
    ResourceUtils.useResourceCollectionType(ResourceCollection);
    ResourceUtils.usePagedResourceCollectionType(PagedResourceCollection);
  });

  it('GET REQUEST should throw error when returned object is EMBEDDED_RESOURCE', () => {
    httpClientSpy.get.mockReturnValue(of(rawEmbeddedResource));

    pagedResourceCollectionHttpService.get('someUrl').subscribe(() => {
    }, error => {
      expect(error.message)
        .toBe('You try to get wrong resource type: expected PagedResourceCollection type, actual EmbeddedResource type.');
    });
  });

  it('GET REQUEST should throw error when returned object is RESOURCE', () => {
    httpClientSpy.get.mockReturnValue(of(rawResource));

    pagedResourceCollectionHttpService.get('someUrl').subscribe(() => {
    }, error => {
      expect(error.message).toBe('You try to get wrong resource type: expected PagedResourceCollection type, actual Resource type.');
    });
  });

  it('GET REQUEST should throw error when returned object is COLLECTION_RESOURCE', () => {
    httpClientSpy.get.mockReturnValue(of(rawResourceCollection));

    pagedResourceCollectionHttpService.get('someUrl').subscribe(() => {
    }, error => {
      expect(error.message).toBe('You try to get wrong resource type: expected PagedResourceCollection type, actual ResourceCollection type.');
    });
  });

  it('GET REQUEST should throw error when returned object is any data that not paged resource collection', () => {
    httpClientSpy.get.mockReturnValue(of({ any: 'value' }));

    pagedResourceCollectionHttpService.get('someUrl').subscribe(() => {
    }, error => {
      expect(error.message).toBe('You try to get wrong resource type: expected PagedResourceCollection type, actual Unknown type.');
    });
  });

  it('GET REQUEST should evict cache when returned object is not paged resource collection', () => {
    vi.spyOn(LibConfig, 'getConfig').mockReturnValue(LibConfig.mergeConfigs({
      ...LibConfig.DEFAULT_CONFIG,
      cache: {
        enabled: true
      }
    }));
    httpClientSpy.get.mockReturnValue(of({ any: 'value' }));

    pagedResourceCollectionHttpService.get('someUrl').subscribe(() => {
    }, () => {
      expect(vi.mocked(cacheServiceSpy.evictResource).mock.calls.length).toBe(1);
    });
  });

  it('GET REQUEST should return paged collected resource', () => {
    httpClientSpy.get.mockReturnValue(of(rawPagedResourceCollection));

    pagedResourceCollectionHttpService.get('someUrl').subscribe((result) => {
      expect(result instanceof PagedResourceCollection).toBe(true);
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

  it('GET REQUEST should pass page params and sort as http request params', () => {
    httpClientSpy.get.mockReturnValue(of(rawPagedResourceCollection));

    pagedResourceCollectionHttpService.get('http://localhost:8080/api/v1/order/1/magazine', {
      pageParams: {
        size: 10,
        page: 1
      },
      sort: {
        abc: 'ASC',
        cde: 'DESC'
      }
    }).subscribe(() => {
      const resultResourceUrl = vi.mocked(httpClientSpy.get).mock.calls[0][0];
      expect(resultResourceUrl).toBe('http://localhost:8080/api/v1/order/1/magazine');

      const httpParams = vi.mocked(httpClientSpy.get).mock.calls[0][1].params;
      expect(httpParams.has('size')).toBe(true);
      expect(httpParams.get('size')).toBe('10');
      expect(httpParams.has('page')).toBe(true);
      expect(httpParams.get('page')).toBe('1');
      expect(httpParams.has('sort')).toBe(true);
      expect(httpParams.getAll('sort')[0]).toBe('abc,ASC');
      expect(httpParams.getAll('sort')[1]).toBe('cde,DESC');
    });
  });

  it('GET REQUEST should adds projection param to http request params', () => {
    httpClientSpy.get.mockReturnValue(of(rawPagedResourceCollection));

    pagedResourceCollectionHttpService.get('http://localhost:8080/api/v1/order/1/magazine', {
      params: {
        projection: 'magazineProjection'
      }
    }).subscribe(() => {
      const resultResourceUrl = vi.mocked(httpClientSpy.get).mock.calls[0][0];
      expect(resultResourceUrl).toBe('http://localhost:8080/api/v1/order/1/magazine');

      const httpParams = vi.mocked(httpClientSpy.get).mock.calls[0][1].params;
      expect(httpParams.has('projection')).toBe(true);
      expect(httpParams.get('projection')).toBe('magazineProjection');
    });
  });

  it('GET REQUEST should use cache when useCache param is TRUE', () => {
    httpClientSpy.get.mockReturnValue(of(rawPagedResourceCollection));
    vi.spyOn(LibConfig, 'getConfig').mockReturnValue(LibConfig.mergeConfigs({
      ...LibConfig.DEFAULT_CONFIG,
      cache: {
        enabled: true
      }
    }));

    pagedResourceCollectionHttpService.get('order', {
      useCache: true
    }).subscribe(() => {
      expect(vi.mocked(cacheServiceSpy.getResource).mock.calls.length).toBe(1);
    });
  });

  it('GET REQUEST should NOT use cache when useCache param is FALSE', () => {
    httpClientSpy.get.mockReturnValue(of(rawPagedResourceCollection));
    vi.spyOn(LibConfig, 'getConfig').mockReturnValue(LibConfig.mergeConfigs({
      ...LibConfig.DEFAULT_CONFIG,
      cache: {
        enabled: true
      }
    }));

    pagedResourceCollectionHttpService.get('order', {
      useCache: false
    }).subscribe(() => {
      expect(vi.mocked(cacheServiceSpy.getResource).mock.calls.length).toBe(0);
    });
  });

  it('GET_RESOURCE_PAGE throws error when resourceName is empty', () => {
    expect(() => pagedResourceCollectionHttpService.getResourcePage('', { routeName: DEFAULT_ROUTE_NAME }))
      .toThrowError(`Passed param(s) 'resourceName = ' is not valid`);
  });

  it('GET_RESOURCE_PAGE should generate root resource url', () => {
    httpClientSpy.get.mockReturnValue(of(rawPagedResourceCollection));

    pagedResourceCollectionHttpService.getResourcePage('test', { routeName: DEFAULT_ROUTE_NAME }).subscribe(() => {
      const url = vi.mocked(httpClientSpy.get).mock.calls[0][0];
      expect(url).toBe(`${UrlUtils.getApiUrl(DEFAULT_ROUTE_NAME)}/test`);
    });
  });

  it('GET_RESOURCE_PAGE should pass http request params when it passed', () => {
    httpClientSpy.get.mockReturnValue(of(rawPagedResourceCollection));

    pagedResourceCollectionHttpService.getResourcePage('test', { routeName: DEFAULT_ROUTE_NAME }, {
      params: {
        projection: 'testProjection',
        test: 'testParam'
      },
      pageParams: {
        page: 1,
        size: 2
      },
      sort: {
        prop1: 'DESC',
        prop2: 'ASC'
      }
    }).subscribe(() => {
      const httpParams = vi.mocked(httpClientSpy.get).mock.calls[0][1].params as HttpParams;
      expect(httpParams.has('projection')).toBe(true);
      expect(httpParams.get('projection')).toBe('testProjection');

      expect(httpParams.has('sort')).toBe(true);
      expect(httpParams.getAll('sort')).toEqual([
        'prop1,DESC',
        'prop2,ASC',
      ]);
      expect(httpParams.has('size')).toBe(true);
      expect(httpParams.get('size')).toBe('2');
      expect(httpParams.has('page')).toBe(true);
      expect(httpParams.get('page')).toBe('1');

      expect(httpParams.has('test')).toBe(true);
      expect(httpParams.get('test')).toBe('testParam');
    });
  });

  it('GET_RESOURCE_PAGE should use default page options', () => {
    httpClientSpy.get.mockReturnValue(of(rawPagedResourceCollection));

    pagedResourceCollectionHttpService.getResourcePage('test', { routeName: DEFAULT_ROUTE_NAME }, {
      params: {
        projection: 'testProjection',
        test: 'testParam'
      }
    }).subscribe(() => {
      const httpParams = vi.mocked(httpClientSpy.get).mock.calls[0][1].params as HttpParams;
      expect(httpParams.has('projection')).toBe(true);
      expect(httpParams.get('projection')).toBe('testProjection');

      expect(httpParams.has('size')).toBe(true);
      expect(httpParams.get('size')).toBe('20');
      expect(httpParams.has('page')).toBe(true);
      expect(httpParams.get('page')).toBe('0');

      expect(httpParams.has('test')).toBe(true);
      expect(httpParams.get('test')).toBe('testParam');
    });
  });

  it('GET_RESOURCE_PAGE should use default page number options', () => {
    httpClientSpy.get.mockReturnValue(of(rawPagedResourceCollection));

    pagedResourceCollectionHttpService.getResourcePage('test', { routeName: DEFAULT_ROUTE_NAME }, {
      pageParams: {
        size: 10
      }
    }).subscribe(() => {
      const httpParams = vi.mocked(httpClientSpy.get).mock.calls[0][1].params as HttpParams;
      expect(httpParams.has('size')).toBe(true);
      expect(httpParams.get('size')).toBe('10');
      expect(httpParams.has('page')).toBe(true);
      expect(httpParams.get('page')).toBe('0');
    });
  });

  it('GET_RESOURCE_PAGE should use default page size options', () => {
    httpClientSpy.get.mockReturnValue(of(rawPagedResourceCollection));

    pagedResourceCollectionHttpService.getResourcePage('test', { routeName: DEFAULT_ROUTE_NAME }, {
      pageParams: {
        page: 1
      }
    }).subscribe(() => {
      const httpParams = vi.mocked(httpClientSpy.get).mock.calls[0][1].params as HttpParams;
      expect(httpParams.has('size')).toBe(true);
      expect(httpParams.get('size')).toBe('20');
      expect(httpParams.has('page')).toBe(true);
      expect(httpParams.get('page')).toBe('1');
    });
  });

  it('SEARCH throws error when resourceName is empty', () => {
    expect(() => pagedResourceCollectionHttpService.search('', { routeName: DEFAULT_ROUTE_NAME }, 'any'))
      .toThrowError(`Passed param(s) 'resourceName = ' is not valid`);
  });

  it('SEARCH throws error when searchQuery is empty', () => {
    expect(() => pagedResourceCollectionHttpService.search('any', { routeName: DEFAULT_ROUTE_NAME }, ''))
      .toThrowError(`Passed param(s) 'searchQuery = ' is not valid`);
  });

  it('SEARCH should generate search resource url', () => {
    httpClientSpy.get.mockReturnValue(of(rawPagedResourceCollection));

    pagedResourceCollectionHttpService.search('test', { routeName: DEFAULT_ROUTE_NAME }, 'someQuery').subscribe(() => {
      const url = vi.mocked(httpClientSpy.get).mock.calls[0][0];
      expect(url).toBe(`${UrlUtils.getApiUrl(DEFAULT_ROUTE_NAME)}/test/search/someQuery`);
    });
  });

  it('SEARCH should pass http request params when it passed', () => {
    httpClientSpy.get.mockReturnValue(of(rawPagedResourceCollection));

    pagedResourceCollectionHttpService.search('test', { routeName: DEFAULT_ROUTE_NAME }, 'someQuery', {
      params: {
        projection: 'testProjection',
        test: 'testParam'
      },
      pageParams: {
        page: 1,
        size: 2
      },
      sort: {
        prop1: 'DESC',
        prop2: 'ASC'
      }
    }).subscribe(() => {
      const httpParams = vi.mocked(httpClientSpy.get).mock.calls[0][1].params as HttpParams;
      expect(httpParams.has('projection')).toBe(true);
      expect(httpParams.get('projection')).toBe('testProjection');

      expect(httpParams.has('sort')).toBe(true);
      expect(httpParams.getAll('sort')).toEqual([
        'prop1,DESC',
        'prop2,ASC',
      ]);
      expect(httpParams.has('size')).toBe(true);
      expect(httpParams.get('size')).toBe('2');
      expect(httpParams.has('page')).toBe(true);
      expect(httpParams.get('page')).toBe('1');

      expect(httpParams.has('test')).toBe(true);
      expect(httpParams.get('test')).toBe('testParam');
    });
  });

  it('SEARCH should use default page options', () => {
    httpClientSpy.get.mockReturnValue(of(rawPagedResourceCollection));

    pagedResourceCollectionHttpService.search('test', { routeName: DEFAULT_ROUTE_NAME }, 'someQuery', {
      params: {
        projection: 'testProjection',
        test: 'testParam'
      }
    }).subscribe(() => {
      const httpParams = vi.mocked(httpClientSpy.get).mock.calls[0][1].params as HttpParams;
      expect(httpParams.has('projection')).toBe(true);
      expect(httpParams.get('projection')).toBe('testProjection');

      expect(httpParams.has('size')).toBe(true);
      expect(httpParams.get('size')).toBe('20');
      expect(httpParams.has('page')).toBe(true);
      expect(httpParams.get('page')).toBe('0');

      expect(httpParams.has('test')).toBe(true);
      expect(httpParams.get('test')).toBe('testParam');
    });
  });


  it('SEARCH should use default page number options', () => {
    httpClientSpy.get.mockReturnValue(of(rawPagedResourceCollection));

    pagedResourceCollectionHttpService.search('test', { routeName: DEFAULT_ROUTE_NAME }, 'any', {
      pageParams: {
        size: 10
      }
    }).subscribe(() => {
      const httpParams = vi.mocked(httpClientSpy.get).mock.calls[0][1].params as HttpParams;
      expect(httpParams.has('size')).toBe(true);
      expect(httpParams.get('size')).toBe('10');
      expect(httpParams.has('page')).toBe(true);
      expect(httpParams.get('page')).toBe('0');
    });
  });

  it('SEARCH should use default page size options', () => {
    httpClientSpy.get.mockReturnValue(of(rawPagedResourceCollection));

    pagedResourceCollectionHttpService.search('test', { routeName: DEFAULT_ROUTE_NAME }, 'any', {
      pageParams: {
        page: 1
      }
    }).subscribe(() => {
      const httpParams = vi.mocked(httpClientSpy.get).mock.calls[0][1].params as HttpParams;
      expect(httpParams.has('size')).toBe(true);
      expect(httpParams.get('size')).toBe('20');
      expect(httpParams.has('page')).toBe(true);
      expect(httpParams.get('page')).toBe('1');
    });
  });

});
