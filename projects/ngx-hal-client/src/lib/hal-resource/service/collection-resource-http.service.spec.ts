import { async } from '@angular/core/testing';
import { HttpConfigService } from '../../config/http-config.service';
import { CollectionResourceHttpService } from './collection-resource-http.service';
import { CollectionResource } from '../model/collection-resource';
import { BaseResource } from '../model/base-resource';
import { of } from 'rxjs';
import {
  rawCollectionResource, rawEmbeddedResource,
  rawPagedCollectionResource,
  rawResource,
  SimpleCollectionResource,
  SimpleResource
} from '../model/resources.test';
import { ResourceUtils } from '../../util/resource.utils';
import { HttpParams } from '@angular/common/http';

/* tslint:disable:no-string-literal */
describe('CollectionResourceHttpService', () => {
  let collectionResourceHttpService: CollectionResourceHttpService<CollectionResource<BaseResource>>;
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

    collectionResourceHttpService =
      new CollectionResourceHttpService<CollectionResource<BaseResource>>(httpClientSpy, cacheServiceSpy, httpConfigService);

    ResourceUtils.useCollectionResourceType(CollectionResource);
  }));

  it('GET REQUEST should throw error when returned object is EMBEDDED_RESOURCE', () => {
    httpClientSpy.get.and.returnValue(of(rawEmbeddedResource));

    collectionResourceHttpService.get('someUrl').subscribe(() => {
    }, error => {
      expect(error.message).toBe('You try to get wrong resource type, expected collection resource type.');
    });
  });

  it('GET REQUEST should throw error when returned object is RESOURCE', () => {
    httpClientSpy.get.and.returnValue(of(rawResource));

    collectionResourceHttpService.get('someUrl').subscribe(() => {
    }, error => {
      expect(error.message).toBe('You try to get wrong resource type, expected collection resource type.');
    });
  });

  it('GET REQUEST should throw error when returned object is PAGED_COLLECTION_RESOURCE', () => {
    httpClientSpy.get.and.returnValue(of(rawPagedCollectionResource));

    collectionResourceHttpService.get('someUrl').subscribe(() => {
    }, error => {
      expect(error.message).toBe('You try to get wrong resource type, expected collection resource type.');
    });
  });

  it('GET REQUEST should throw error when returned object is any data that not collection resource', () => {
    httpClientSpy.get.and.returnValue(of({any: 'value'}));

    collectionResourceHttpService.get('someUrl').subscribe(() => {
    }, error => {
      expect(error.message).toBe('You try to get wrong resource type, expected collection resource type.');
    });
  });

  it('GET REQUEST should return result from cache', () => {
    const cachedResult = new SimpleCollectionResource();
    cachedResult.resources.push(Object.assign(new SimpleResource(), {text: 'test cache'}));
    cacheServiceSpy.getResource.and.returnValue(cachedResult);
    cacheServiceSpy.hasResource.and.returnValue(true);

    collectionResourceHttpService.get('someUrl').subscribe((result) => {
      expect(httpClientSpy.get.calls.count()).toBe(0);
      expect(cacheServiceSpy.getResource.calls.count()).toBe(1);
      expect(result.resources.length).toBe(2);
      expect(result.resources[1]['text']).toBe('test cache');
    });
  });

  it('GET REQUEST should put result to cache', () => {
    httpClientSpy.get.and.returnValue(of(rawCollectionResource));

    collectionResourceHttpService.get('someUrl').subscribe(() => {
      expect(cacheServiceSpy.putResource.calls.count()).toBe(1);
    });
  });

  it('GET REQUEST should return collected resource', () => {
    httpClientSpy.get.and.returnValue(of(rawCollectionResource));

    collectionResourceHttpService.get('someUrl').subscribe((result) => {
      expect(result instanceof CollectionResource).toBeTrue();
    });
  });

  it('GET_RESOURCE_COLLECTION throws error when resourceName is empty', () => {
    collectionResourceHttpService.getResourceCollection('').subscribe(() => {
    }, (error) => {
      expect(error.message).toBe('resource name should be defined');
    });
  });

  it('GET_RESOURCE_COLLECTION throws error when resourceName is null', () => {
    collectionResourceHttpService.getResourceCollection(null).subscribe(() => {
    }, (error) => {
      expect(error.message).toBe('resource name should be defined');
    });
  });

  it('GET_RESOURCE_COLLECTION throws error when resourceName is undefined', () => {
    collectionResourceHttpService.getResourceCollection(undefined).subscribe(() => {
    }, (error) => {
      expect(error.message).toBe('resource name should be defined');
    });
  });

  it('GET_RESOURCE_COLLECTION should generate root resource url', () => {
    httpClientSpy.get.and.returnValue(of(rawCollectionResource));

    collectionResourceHttpService.getResourceCollection('test').subscribe(() => {
      const url = httpClientSpy.get.calls.argsFor(0)[0];
      expect(url).toBe(`${ httpConfigService.baseApiUrl }/test`);
    });
  });

  it('GET_RESOURCE_COLLECTION should generate root resource url with query param', () => {
    httpClientSpy.get.and.returnValue(of(rawCollectionResource));

    collectionResourceHttpService.getResourceCollection('test', 'someQuery').subscribe(() => {
      const url = httpClientSpy.get.calls.argsFor(0)[0];
      expect(url).toBe(`${ httpConfigService.baseApiUrl }/test/someQuery`);
    });
  });

  it('GET_RESOURCE_COLLECTION should pass http request params when it passed', () => {
    httpClientSpy.get.and.returnValue(of(rawCollectionResource));

    collectionResourceHttpService.getResourceCollection('test', null, {
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

  it('SEARCH throws error when resourceName is empty', () => {
    collectionResourceHttpService.search('', 'any').subscribe(() => {
    }, (error) => {
      expect(error.message).toBe('resource name should be defined');
    });
  });

  it('SEARCH throws error when resourceName is null', () => {
    collectionResourceHttpService.search(null, 'any').subscribe(() => {
    }, (error) => {
      expect(error.message).toBe('resource name should be defined');
    });
  });

  it('SEARCH throws error when resourceName is undefined', () => {
    collectionResourceHttpService.search(undefined, 'any').subscribe(() => {
    }, (error) => {
      expect(error.message).toBe('resource name should be defined');
    });
  });

  it('SEARCH throws error when searchQuery is empty', () => {
    collectionResourceHttpService.search('any', '').subscribe(() => {
    }, (error) => {
      expect(error.message).toBe('search query should be defined');
    });
  });

  it('SEARCH throws error when searchQuery is null', () => {
    collectionResourceHttpService.search('any', null).subscribe(() => {
    }, (error) => {
      expect(error.message).toBe('search query should be defined');
    });
  });

  it('SEARCH throws error when searchQuery is undefined', () => {
    collectionResourceHttpService.search('any', undefined).subscribe(() => {
    }, (error) => {
      expect(error.message).toBe('search query should be defined');
    });
  });

  it('SEARCH should generate search resource url', () => {
    httpClientSpy.get.and.returnValue(of(rawCollectionResource));

    collectionResourceHttpService.search('test', 'someQuery').subscribe(() => {
      const url = httpClientSpy.get.calls.argsFor(0)[0];
      expect(url).toBe(`${ httpConfigService.baseApiUrl }/test/search/someQuery`);
    });
  });

  it('SEARCH should pass http request params when it passed', () => {
    httpClientSpy.get.and.returnValue(of(rawCollectionResource));

    collectionResourceHttpService.search('test', 'someQuery', {
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
