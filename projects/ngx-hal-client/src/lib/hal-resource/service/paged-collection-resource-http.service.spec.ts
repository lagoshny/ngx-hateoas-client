import { async } from '@angular/core/testing';
import { HttpConfigService } from '../../config/http-config.service';
import { CollectionResource } from '../model/collection-resource';
import { BaseResource } from '../model/base-resource';
import { of } from 'rxjs';
import {
  rawCollectionResource, rawEmbeddedResource,
  rawPagedCollectionResource,
  rawResource,
  SimplePagedCollectionResource,
  SimpleResource
} from '../model/resources.test';
import { ResourceUtils } from '../../util/resource.utils';
import { HttpParams } from '@angular/common/http';
import { PagedCollectionResourceHttpService } from './paged-collection-resource-http.service';
import { PagedCollectionResource } from '../model/paged-collection-resource';
import { Resource } from '../model/resource';

/* tslint:disable:no-string-literal */
describe('PagedpagedCollectionResourceHttpService', () => {
  let pagedCollectionResourceHttpService: PagedCollectionResourceHttpService<PagedCollectionResource<BaseResource>>;
  let httpClientSpy: any;
  let cacheServiceSpy: any;
  let httpConfigService: HttpConfigService;

  beforeEach(async(() => {
    httpClientSpy = {
      get: jasmine.createSpy('get')
    };
    cacheServiceSpy = {
      putResource: jasmine.createSpy('putResource'),
      hasResource: jasmine.createSpy('hasResource'),
      getResource: jasmine.createSpy('getResource')
    };
    httpConfigService = {
      baseApiUrl: 'http://localhost:8080/api/v1'
    };

    pagedCollectionResourceHttpService =
      new PagedCollectionResourceHttpService<PagedCollectionResource<BaseResource>>(httpClientSpy, cacheServiceSpy, httpConfigService);

    ResourceUtils.useResourceType(Resource);
    ResourceUtils.useCollectionResourceType(CollectionResource);
    ResourceUtils.usePagedCollectionResourceType(PagedCollectionResource);
  }));

  it('GET REQUEST should throw error when returned object is EMBEDDED_RESOURCE', () => {
    httpClientSpy.get.and.returnValue(of(rawEmbeddedResource));

    pagedCollectionResourceHttpService.get('someUrl').subscribe(() => {
    }, error => {
      expect(error.message).toBe('You try to get wrong resource type, expected paged collection resource type.');
    });
  });

  it('GET REQUEST should throw error when returned object is RESOURCE', () => {
    httpClientSpy.get.and.returnValue(of(rawResource));

    pagedCollectionResourceHttpService.get('someUrl').subscribe(() => {
    }, error => {
      expect(error.message).toBe('You try to get wrong resource type, expected paged collection resource type.');
    });
  });

  it('GET REQUEST should throw error when returned object is COLLECTION_RESOURCE', () => {
    httpClientSpy.get.and.returnValue(of(rawCollectionResource));

    pagedCollectionResourceHttpService.get('someUrl').subscribe(() => {
    }, error => {
      expect(error.message).toBe('You try to get wrong resource type, expected paged collection resource type.');
    });
  });

  it('GET REQUEST should throw error when returned object is any data that not paged collection resource', () => {
    httpClientSpy.get.and.returnValue(of({any: 'value'}));

    pagedCollectionResourceHttpService.get('someUrl').subscribe(() => {
    }, error => {
      expect(error.message).toBe('You try to get wrong resource type, expected paged collection resource type.');
    });
  });

  it('GET REQUEST should return result from cache', () => {
    const cachedResult = new SimplePagedCollectionResource();
    cachedResult.resources.push(Object.assign(new SimpleResource(), {text: 'test cache'}));
    cacheServiceSpy.getResource.and.returnValue(cachedResult);
    cacheServiceSpy.hasResource.and.returnValue(true);

    pagedCollectionResourceHttpService.get('someUrl').subscribe((result) => {
      expect(httpClientSpy.get.calls.count()).toBe(0);
      expect(cacheServiceSpy.getResource.calls.count()).toBe(1);
      expect(result.resources.length).toBe(2);
      expect(result.resources[1]['text']).toBe('test cache');
    });
  });

  it('GET REQUEST should put result to cache', () => {
    httpClientSpy.get.and.returnValue(of(rawPagedCollectionResource));

    pagedCollectionResourceHttpService.get('someUrl').subscribe(() => {
      expect(cacheServiceSpy.putResource.calls.count()).toBe(1);
    });
  });

  it('GET REQUEST should return paged collected resource', () => {
    httpClientSpy.get.and.returnValue(of(rawPagedCollectionResource));

    pagedCollectionResourceHttpService.get('someUrl').subscribe((result) => {
      expect(result instanceof PagedCollectionResource).toBeTrue();
    });
  });

  it('GET_RESOURCE_PAGE throws error when resourceName is empty', () => {
    pagedCollectionResourceHttpService.getResourcePage('').subscribe(() => {
    }, (error) => {
      expect(error.message).toBe('resource name should be defined');
    });
  });

  it('GET_RESOURCE_PAGE throws error when resourceName is null', () => {
    pagedCollectionResourceHttpService.getResourcePage(null).subscribe(() => {
    }, (error) => {
      expect(error.message).toBe('resource name should be defined');
    });
  });

  it('GET_RESOURCE_PAGE throws error when resourceName is undefined', () => {
    pagedCollectionResourceHttpService.getResourcePage(undefined).subscribe(() => {
    }, (error) => {
      expect(error.message).toBe('resource name should be defined');
    });
  });

  it('GET_RESOURCE_PAGE should generate root resource url', () => {
    httpClientSpy.get.and.returnValue(of(rawPagedCollectionResource));

    pagedCollectionResourceHttpService.getResourcePage('test').subscribe(() => {
      const url = httpClientSpy.get.calls.argsFor(0)[0];
      expect(url).toBe(`${ httpConfigService.baseApiUrl }/test`);
    });
  });

  it('GET_RESOURCE_PAGE should generate root resource url with query param', () => {
    httpClientSpy.get.and.returnValue(of(rawPagedCollectionResource));

    pagedCollectionResourceHttpService.getResourcePage('test', 'someQuery').subscribe(() => {
      const url = httpClientSpy.get.calls.argsFor(0)[0];
      expect(url).toBe(`${ httpConfigService.baseApiUrl }/test/someQuery`);
    });
  });

  it('GET_RESOURCE_PAGE should pass http request params when it passed', () => {
    httpClientSpy.get.and.returnValue(of(rawPagedCollectionResource));

    pagedCollectionResourceHttpService.getResourcePage('test', null, {
      projection: 'testProjection',
      params: {
        test: 'testParam'
      },
      page: {
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
    httpClientSpy.get.and.returnValue(of(rawPagedCollectionResource));

    pagedCollectionResourceHttpService.getResourcePage('test', null, {
      projection: 'testProjection',
      params: {
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

  it('SEARCH throws error when resourceName is empty', () => {
    pagedCollectionResourceHttpService.search('', 'any').subscribe(() => {
    }, (error) => {
      expect(error.message).toBe('resource name should be defined');
    });
  });

  it('SEARCH throws error when resourceName is null', () => {
    pagedCollectionResourceHttpService.search(null, 'any').subscribe(() => {
    }, (error) => {
      expect(error.message).toBe('resource name should be defined');
    });
  });

  it('SEARCH throws error when resourceName is undefined', () => {
    pagedCollectionResourceHttpService.search(undefined, 'any').subscribe(() => {
    }, (error) => {
      expect(error.message).toBe('resource name should be defined');
    });
  });

  it('SEARCH throws error when searchQuery is empty', () => {
    pagedCollectionResourceHttpService.search('any', '').subscribe(() => {
    }, (error) => {
      expect(error.message).toBe('search query should be defined');
    });
  });

  it('SEARCH throws error when searchQuery is null', () => {
    pagedCollectionResourceHttpService.search('any', null).subscribe(() => {
    }, (error) => {
      expect(error.message).toBe('search query should be defined');
    });
  });

  it('SEARCH throws error when searchQuery is undefined', () => {
    pagedCollectionResourceHttpService.search('any', undefined).subscribe(() => {
    }, (error) => {
      expect(error.message).toBe('search query should be defined');
    });
  });

  it('SEARCH should generate search resource url', () => {
    httpClientSpy.get.and.returnValue(of(rawPagedCollectionResource));

    pagedCollectionResourceHttpService.search('test', 'someQuery').subscribe(() => {
      const url = httpClientSpy.get.calls.argsFor(0)[0];
      expect(url).toBe(`${ httpConfigService.baseApiUrl }/test/search/someQuery`);
    });
  });

  it('SEARCH should pass http request params when it passed', () => {
    httpClientSpy.get.and.returnValue(of(rawPagedCollectionResource));

    pagedCollectionResourceHttpService.search('test', 'someQuery', {
      projection: 'testProjection',
      params: {
        test: 'testParam'
      },
      page: {
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
    httpClientSpy.get.and.returnValue(of(rawPagedCollectionResource));

    pagedCollectionResourceHttpService.search('test', 'someQuery', {
      projection: 'testProjection',
      params: {
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

});
