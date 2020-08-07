/* tslint:disable:no-string-literal */
import { HttpConfigService } from '../../config/http-config.service';
import { async } from '@angular/core/testing';
import { CommonHttpService } from './common-http.service';
import { HttpMethod } from '../model/declarations';
import { of } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { ResourceUtils } from '../../util/resource.utils';
import { Resource } from '../model/resource';
import { CollectionResource } from '../model/collection-resource';
import { PagedCollectionResource } from '../model/paged-collection-resource';
import { rawPagedCollectionResource, rawResource, rawCollectionResource } from '../model/resources.test';
import anything = jasmine.anything;

describe('CommonHttpService CUSTOM_QUERY', () => {
  let commonHttpService: CommonHttpService;
  let httpClientSpy: any;
  let cacheServiceSpy: any;
  let httpConfigService: HttpConfigService;

  beforeEach(async(() => {
    httpClientSpy = {
      get: jasmine.createSpy('get'),
      post: jasmine.createSpy('post'),
      patch: jasmine.createSpy('patch'),
      put: jasmine.createSpy('put'),
    };
    cacheServiceSpy = {
      putResource: jasmine.createSpy('putResource'),
      hasResource: jasmine.createSpy('hasResource'),
      getResource: jasmine.createSpy('getResource')
    };
    httpConfigService = {
      baseApiUrl: 'http://localhost:8080/api/v1'
    };

    commonHttpService =
      new CommonHttpService(httpClientSpy, cacheServiceSpy, httpConfigService);

    ResourceUtils.useResourceType(Resource);
    ResourceUtils.useCollectionResourceType(CollectionResource);
    ResourceUtils.usePagedCollectionResourceType(PagedCollectionResource);
  }));

  it('throws error when resourceName is empty', () => {
    commonHttpService.customQuery('', HttpMethod.GET, 'any').subscribe(() => {
    }, (error) => {
      expect(error.message).toBe('resource name should be defined');
    });
  });

  it('throws error when resourceName is null', () => {
    commonHttpService.customQuery(null, HttpMethod.GET, 'any').subscribe(() => {
    }, (error) => {
      expect(error.message).toBe('resource name should be defined');
    });
  });

  it('throws error when resourceName is undefined', () => {
    commonHttpService.customQuery(undefined, HttpMethod.GET, 'any').subscribe(() => {
    }, (error) => {
      expect(error.message).toBe('resource name should be defined');
    });
  });

  it('throws error when query is empty', () => {
    commonHttpService.customQuery('any', HttpMethod.GET, '').subscribe(() => {
    }, (error) => {
      expect(error.message).toBe('query should be defined');
    });
  });

  it('throws error when query is null', () => {
    commonHttpService.customQuery('any', HttpMethod.GET, null).subscribe(() => {
    }, (error) => {
      expect(error.message).toBe('query should be defined');
    });
  });

  it('throws error when query is undefined', () => {
    commonHttpService.customQuery('any', HttpMethod.GET, undefined).subscribe(() => {
    }, (error) => {
      expect(error.message).toBe('query should be defined');
    });
  });

  it('should generate custom query resource url', () => {
    httpClientSpy.get.and.returnValue(of(anything()));

    commonHttpService.customQuery('test', HttpMethod.GET, 'someQuery').subscribe(() => {
      const url = httpClientSpy.get.calls.argsFor(0)[0];
      expect(url).toBe(`${ httpConfigService.baseApiUrl }/test/someQuery`);
    });
  });

  it('should pass http request params when it passed', () => {
    httpClientSpy.get.and.returnValue(of(anything()));

    commonHttpService.customQuery('test', HttpMethod.GET, 'someQuery', null, {
      projection: 'testProjection',
      page: {
        sort: {
          prop1: 'ASC',
          prop2: 'DESC'
        },
        size: 1,
        page: 2
      },
      params: {
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
    httpClientSpy.get.and.returnValue(of(rawCollectionResource));

    commonHttpService.customQuery('test', HttpMethod.GET, 'someQuery').subscribe((result) => {
      expect(result instanceof CollectionResource).toBeTrue();
    });
  });

  it('should return PAGED_COLLECTION_RESOURCE object', () => {
    httpClientSpy.get.and.returnValue(of(rawPagedCollectionResource));

    commonHttpService.customQuery('test', HttpMethod.GET, 'someQuery').subscribe((result) => {
      expect(result instanceof PagedCollectionResource).toBeTrue();
    });
  });

  it('should return raw data when it is not any resource type', () => {
    httpClientSpy.get.and.returnValue(of({some: 'message'}));

    commonHttpService.customQuery('test', HttpMethod.GET, 'someQuery').subscribe((result) => {
      expect(result).toEqual({some: 'message'});
    });
  });

  it('should throw error when NULL HTTP_METHOD was passed', () => {
    commonHttpService.customQuery('test', null, 'someQuery').subscribe(() => {
    }, error => {
      expect(error.message).toBe('allowed ony GET/POST/PUT/PATCH http methods you pass null');
    });
  });

  it('should throw error when UNDEFINED HTTP_METHOD was passed', () => {
    commonHttpService.customQuery('test', undefined, 'someQuery').subscribe(() => {
    }, error => {
      expect(error.message).toBe('allowed ony GET/POST/PUT/PATCH http methods you pass undefined');
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
