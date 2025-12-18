import { beforeEach, describe, expect, it, vi } from 'vitest';
/* tslint:disable:no-string-literal */
import { CommonResourceHttpService } from './common-resource-http.service';
import { HttpMethod } from '../../model/declarations';
import { of } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { ResourceUtils } from '../../util/resource.utils';
import { Resource } from '../../model/resource/resource';
import { ResourceCollection } from '../../model/resource/resource-collection';
import { PagedResourceCollection } from '../../model/resource/paged-resource-collection';
import {
  rawPagedResourceCollection,
  rawResource,
  rawResourceCollection
} from '../../model/resource/resources.test-utils';
import { UrlUtils } from '../../util/url.utils';
import { DEFAULT_ROUTE_NAME } from '../../config/hateoas-configuration.interface';
import { LibConfig } from '../../config/lib-config';

describe('CommonResourceHttpService CUSTOM_QUERY', () => {
  let commonHttpService: CommonResourceHttpService;
  let httpClientSpy: any;
  let cacheServiceSpy: any;

  beforeEach(() => {
    httpClientSpy = {
      get: vi.fn(),
      post: vi.fn(),
      patch: vi.fn(),
      put: vi.fn(),
    };
    cacheServiceSpy = {
      putResource: vi.fn(),
      getResource: vi.fn(),
      evictResource: vi.fn()
    };

    commonHttpService =
      new CommonResourceHttpService(httpClientSpy, cacheServiceSpy);

    ResourceUtils.useResourceType(Resource);
    ResourceUtils.useResourceCollectionType(ResourceCollection);
    ResourceUtils.usePagedResourceCollectionType(PagedResourceCollection);
  });

  it('throws error when resourceName is empty', () => {
    expect(() => commonHttpService.customQuery('', { routeName: DEFAULT_ROUTE_NAME }, HttpMethod.GET, 'any'))
      .toThrowError(`Passed param(s) 'resourceName = ' is not valid`);
  });

  it('throws error when query is empty', () => {
    expect(() => commonHttpService.customQuery('any', { routeName: DEFAULT_ROUTE_NAME }, HttpMethod.GET, ''))
      .toThrowError(`Passed param(s) 'query = ' is not valid`);
  });

  it('should generate custom query resource url', () => {
    httpClientSpy.get.mockReturnValue(of({}));

    commonHttpService.customQuery('test', { routeName: DEFAULT_ROUTE_NAME }, HttpMethod.GET, 'someQuery').subscribe(() => {
      const url = vi.mocked(httpClientSpy.get).mock.calls[0][0];
      expect(url).toBe(`${UrlUtils.getApiUrl(DEFAULT_ROUTE_NAME)}/test/someQuery`);
    });
  });

  it('should pass http request params when it passed', () => {
    httpClientSpy.get.mockReturnValue(of({}));

    commonHttpService.customQuery('test', { routeName: DEFAULT_ROUTE_NAME }, HttpMethod.GET, 'someQuery', null, {
      pageParams: {
        size: 1,
        page: 2
      },
      params: {
        projection: 'testProjection',
        test: 'testParam'
      },
      sort: {
        prop1: 'ASC',
        prop2: 'DESC'
      }
    }).subscribe(() => {
      const httpParams = vi.mocked(httpClientSpy.get).mock.calls[0][1].params as HttpParams;
      expect(httpParams.has('projection')).toBe(true);
      expect(httpParams.get('projection')).toBe('testProjection');

      expect(httpParams.has('sort')).toBe(true);
      expect(httpParams.getAll('sort')).toEqual([
        'prop1,ASC',
        'prop2,DESC',
      ]);
      expect(httpParams.has('size')).toBe(true);
      expect(httpParams.get('size')).toBe('1');
      expect(httpParams.has('page')).toBe(true);
      expect(httpParams.get('page')).toBe('2');

      expect(httpParams.has('test')).toBe(true);
      expect(httpParams.get('test')).toBe('testParam');
    });
  });

  it('should return RESOURCE object', () => {
    httpClientSpy.get.mockReturnValue(of(rawResource));

    commonHttpService.customQuery('test', { routeName: DEFAULT_ROUTE_NAME }, HttpMethod.GET, 'someQuery').subscribe((result) => {
      expect(result instanceof Resource).toBe(true);
    });
  });

  it('should return COLLECTION_RESOURCE object', () => {
    httpClientSpy.get.mockReturnValue(of(rawResourceCollection));

    commonHttpService.customQuery('test', { routeName: DEFAULT_ROUTE_NAME }, HttpMethod.GET, 'someQuery').subscribe((result) => {
      expect(result instanceof ResourceCollection).toBe(true);
    });
  });

  it('should return PAGED_COLLECTION_RESOURCE object', () => {
    httpClientSpy.get.mockReturnValue(of(rawPagedResourceCollection));

    commonHttpService.customQuery('test', { routeName: DEFAULT_ROUTE_NAME }, HttpMethod.GET, 'someQuery').subscribe((result) => {
      expect(result instanceof PagedResourceCollection).toBe(true);
    });
  });

  it('should return raw data when it is not any resource type', () => {
    httpClientSpy.get.mockReturnValue(of({ some: 'message' }));

    commonHttpService.customQuery('test', { routeName: DEFAULT_ROUTE_NAME }, HttpMethod.GET, 'someQuery').subscribe((result) => {
      expect(result).toEqual({ some: 'message' });
    });
  });

  it('should invoke HTTP get method when passed GET HTTP_METHOD', () => {
    httpClientSpy.get.mockReturnValue(of({}));

    commonHttpService.customQuery('test', { routeName: DEFAULT_ROUTE_NAME }, HttpMethod.GET, 'someQuery').subscribe(() => {
      expect(vi.mocked(httpClientSpy.get).mock.calls.length).toBe(1);
    });
  });

  it('should NOT use cache for GET HTTP_METHOD', () => {
    httpClientSpy.get.mockReturnValue(of(rawResourceCollection));
    vi.spyOn(LibConfig, 'getConfig').mockReturnValue({
      ...LibConfig.DEFAULT_CONFIG,
      cache: {
        ...LibConfig.DEFAULT_CONFIG.cache,
        enabled: true
      }
    });

    commonHttpService.customQuery('test', { routeName: DEFAULT_ROUTE_NAME }, HttpMethod.GET, 'someQuery').subscribe(() => {
      expect(vi.mocked(cacheServiceSpy.getResource).mock.calls.length).toBe(0);
    });
  });

  it('should invoke HTTP post method when passed POST HTTP_METHOD', () => {
    httpClientSpy.post.mockReturnValue(of({}));

    commonHttpService.customQuery('test', { routeName: DEFAULT_ROUTE_NAME }, HttpMethod.POST, 'someQuery').subscribe(() => {
      expect(vi.mocked(httpClientSpy.post).mock.calls.length).toBe(1);
    });
  });

  it('should invoke HTTP patch method when passed PATCH HTTP_METHOD', () => {
    httpClientSpy.patch.mockReturnValue(of({}));

    commonHttpService.customQuery('test', { routeName: DEFAULT_ROUTE_NAME }, HttpMethod.PATCH, 'someQuery').subscribe(() => {
      expect(vi.mocked(httpClientSpy.patch).mock.calls.length).toBe(1);
    });
  });

  it('should invoke HTTP put method when passed PUT HTTP_METHOD', () => {
    httpClientSpy.put.mockReturnValue(of({}));

    commonHttpService.customQuery('test', { routeName: DEFAULT_ROUTE_NAME }, HttpMethod.PUT, 'someQuery').subscribe(() => {
      expect(vi.mocked(httpClientSpy.put).mock.calls.length).toBe(1);
    });
  });

});
