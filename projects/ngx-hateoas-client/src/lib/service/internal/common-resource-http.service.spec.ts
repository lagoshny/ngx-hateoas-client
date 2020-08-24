/* tslint:disable:no-string-literal */
import { LibConfig } from '../../config/lib-config';
import { CommonResourceHttpService } from './common-resource-http.service';
import { HttpMethod } from '../../model/declarations';
import { of } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { ResourceUtils } from '../../util/resource.utils';
import { Resource } from '../../model/resource/resource';
import { ResourceCollection } from '../../model/resource/resource-collection';
import { PagedResourceCollection } from '../../model/resource/paged-resource-collection';
import { rawPagedResourceCollection, rawResource, rawResourceCollection } from '../../model/resource/resources.test';
import anything = jasmine.anything;

describe('CommonResourceHttpService CUSTOM_QUERY', () => {
  let commonHttpService: CommonResourceHttpService;
  let httpClientSpy: any;
  let cacheServiceSpy: any;

  beforeEach(() => {
    httpClientSpy = {
      get: jasmine.createSpy('get'),
      post: jasmine.createSpy('post'),
      patch: jasmine.createSpy('patch'),
      put: jasmine.createSpy('put'),
    };
    cacheServiceSpy = {
      putResource: jasmine.createSpy('putResource'),
      getResource: jasmine.createSpy('getResource'),
      evictResource: jasmine.createSpy('evictResource')
    };

    commonHttpService =
      new CommonResourceHttpService(httpClientSpy, cacheServiceSpy);

    ResourceUtils.useResourceType(Resource);
    ResourceUtils.useResourceCollectionType(ResourceCollection);
    ResourceUtils.usePagedResourceCollectionType(PagedResourceCollection);
  });

  afterEach(() => {
    ResourceUtils.useResourceType(null);
    ResourceUtils.useResourceCollectionType(null);
    ResourceUtils.usePagedResourceCollectionType(null);
  });

  it('throws error when resourceName is empty', () => {
    expect(() => commonHttpService.customQuery('', HttpMethod.GET, 'any'))
      .toThrowError(`Passed param(s) 'resourceName = ' is not valid`);
  });

  it('throws error when query is empty', () => {
    expect(() => commonHttpService.customQuery('any', HttpMethod.GET, ''))
      .toThrowError(`Passed param(s) 'query = ' is not valid`);
  });

  it('throws error when resourceName,method,query are undefined', () => {
    expect(() => commonHttpService.customQuery(undefined, undefined, undefined))
      .toThrowError(`Passed param(s) 'resourceName = undefined', 'method = undefined', 'query = undefined' are not valid`);
  });

  it('throws error when resourceName,method,query are null', () => {
    expect(() => commonHttpService.customQuery(null, null, null))
      .toThrowError(`Passed param(s) 'resourceName = null', 'method = null', 'query = null' are not valid`);
  });

  it('should generate custom query resource url', () => {
    httpClientSpy.get.and.returnValue(of(anything()));

    commonHttpService.customQuery('test', HttpMethod.GET, 'someQuery').subscribe(() => {
      const url = httpClientSpy.get.calls.argsFor(0)[0];
      expect(url).toBe(`${ LibConfig.config.http.baseApiUrl }/test/someQuery`);
    });
  });

  it('should pass http request params when it passed', () => {
    httpClientSpy.get.and.returnValue(of(anything()));

    commonHttpService.customQuery('test', HttpMethod.GET, 'someQuery', null, {
      pageParams: {
        sort: {
          prop1: 'ASC',
          prop2: 'DESC'
        },
        size: 1,
        page: 2
      },
      params: {
        projection: 'testProjection',
        test: 'testParam'
      }
    }).subscribe(() => {
      const httpParams = httpClientSpy.get.calls.argsFor(0)[1].params as HttpParams;
      expect(httpParams.has('projection')).toBeTrue();
      expect(httpParams.get('projection')).toBe('testProjection');

      expect(httpParams.has('sort')).toBeTrue();
      expect(httpParams.getAll('sort').length).toBe(2);
      expect(httpParams.getAll('sort')[0]).toBe('prop1,ASC');
      expect(httpParams.getAll('sort')[1]).toBe('prop2,DESC');
      expect(httpParams.has('size')).toBeTrue();
      expect(httpParams.get('size')).toBe('1');
      expect(httpParams.has('page')).toBeTrue();
      expect(httpParams.get('page')).toBe('2');

      expect(httpParams.has('test')).toBeTrue();
      expect(httpParams.get('test')).toBe('testParam');
    });
  });

  it('should return RESOURCE object', () => {
    httpClientSpy.get.and.returnValue(of(rawResource));

    commonHttpService.customQuery('test', HttpMethod.GET, 'someQuery').subscribe((result) => {
      expect(result instanceof Resource).toBeTrue();
    });
  });

  it('should return COLLECTION_RESOURCE object', () => {
    httpClientSpy.get.and.returnValue(of(rawResourceCollection));

    commonHttpService.customQuery('test', HttpMethod.GET, 'someQuery').subscribe((result) => {
      expect(result instanceof ResourceCollection).toBeTrue();
    });
  });

  it('should return PAGED_COLLECTION_RESOURCE object', () => {
    httpClientSpy.get.and.returnValue(of(rawPagedResourceCollection));

    commonHttpService.customQuery('test', HttpMethod.GET, 'someQuery').subscribe((result) => {
      expect(result instanceof PagedResourceCollection).toBeTrue();
    });
  });

  it('should return raw data when it is not any resource type', () => {
    httpClientSpy.get.and.returnValue(of({some: 'message'}));

    commonHttpService.customQuery('test', HttpMethod.GET, 'someQuery').subscribe((result) => {
      expect(result).toEqual({some: 'message'});
    });
  });

  it('should invoke HTTP get method when passed GET HTTP_METHOD', () => {
    httpClientSpy.get.and.returnValue(of(anything()));

    commonHttpService.customQuery('test', HttpMethod.GET, 'someQuery').subscribe(() => {
      expect(httpClientSpy.get.calls.count()).toBe(1);
    });
  });

  it('should invoke HTTP post method when passed POST HTTP_METHOD', () => {
    httpClientSpy.post.and.returnValue(of(anything()));

    commonHttpService.customQuery('test', HttpMethod.POST, 'someQuery').subscribe(() => {
      expect(httpClientSpy.post.calls.count()).toBe(1);
    });
  });

  it('should invoke HTTP patch method when passed PATCH HTTP_METHOD', () => {
    httpClientSpy.patch.and.returnValue(of(anything()));

    commonHttpService.customQuery('test', HttpMethod.PATCH, 'someQuery').subscribe(() => {
      expect(httpClientSpy.patch.calls.count()).toBe(1);
    });
  });

  it('should invoke HTTP put method when passed PUT HTTP_METHOD', () => {
    httpClientSpy.put.and.returnValue(of(anything()));

    commonHttpService.customQuery('test', HttpMethod.PUT, 'someQuery').subscribe(() => {
      expect(httpClientSpy.put.calls.count()).toBe(1);
    });
  });

});
