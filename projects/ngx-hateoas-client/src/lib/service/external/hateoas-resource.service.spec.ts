/* tslint:disable:no-string-literal */
import { HateoasResourceService } from './hateoas-resource.service';
import { HateoasResource, HttpMethod, Include, Resource } from '../../ngx-hateoas-client.module';
import { of } from 'rxjs';
import { SimpleResource } from '../../model/resource/resources.test';
import { ResourceUtils } from '../../util/resource.utils';
import { RequestOption, RequestParam } from '../../model/declarations';
import anything = jasmine.anything;

@HateoasResource('resourceRelation')
class ResourceRelation extends Resource {
  public name = 'Test';
  // tslint:disable-next-line:variable-name
  _links = {
    self: {
      href: 'http://localhost:8080/api/v1/resourceRelation/1'
    },
    resourceRelation: {
      href: 'http://localhost:8080/api/v1/resourceRelation/1'
    }
  };

}

@HateoasResource('resourceWithRelation')
class ResourceWithRelation extends SimpleResource {
  public relation: ResourceRelation;
  public name = 'Test';
}

describe('HateoasResourceService', () => {
  let hateoasResourceService: HateoasResourceService;
  let commonHttpServiceSpy: any;
  let resourceHttpServiceSpy: any;
  let resourceCollectionHttpServiceSpy: any;
  let pagedResourceCollectionHttpServiceSpy: any;
  let resourceCacheService: any;

  beforeEach(() => {
    commonHttpServiceSpy = {
      customQuery: jasmine.createSpy('customQuery')
    };
    resourceHttpServiceSpy = {
      postResource: jasmine.createSpy('postResource'),
      put: jasmine.createSpy('put'),
      putResource: jasmine.createSpy('putResource'),
      patch: jasmine.createSpy('patch'),
      patchResource: jasmine.createSpy('patchResource'),
      delete: jasmine.createSpy('delete'),
      deleteResource: jasmine.createSpy('deleteResource')
    };
    resourceCollectionHttpServiceSpy = {
      getResourceCollection: jasmine.createSpy('getResourceCollection')
    };
    pagedResourceCollectionHttpServiceSpy = {
      getResourcePage: jasmine.createSpy('getResourcePage')
    };
    resourceCacheService = {
      evictAll: jasmine.createSpy('evictAll')
    };

    hateoasResourceService =
      new HateoasResourceService(commonHttpServiceSpy, resourceHttpServiceSpy,
        resourceCollectionHttpServiceSpy, pagedResourceCollectionHttpServiceSpy, resourceCacheService);

    ResourceUtils.useResourceType(Resource);
  });

  afterEach(() => {
    ResourceUtils.useResourceType(null);
  });

  it('GET_RESOURCE should throw error when passed resourceName,id are undefined', () => {
    expect(() => hateoasResourceService.getResource(undefined, undefined))
      .toThrowError(`Passed param(s) 'resourceType = undefined', 'id = undefined' are not valid`);
  });

  it('GET_RESOURCE should throw error when passed resourceName,id are null', () => {
    expect(() => hateoasResourceService.getResource(null, null))
      .toThrowError(`Passed param(s) 'resourceType = null', 'id = null' are not valid`);
  });

  it('GET_COLLECTION should throw error when passed resourceName is undefined', () => {
    expect(() => hateoasResourceService.getCollection(undefined))
      .toThrowError(`Passed param(s) 'resourceType = undefined' is not valid`);
  });

  it('GET_COLLECTION should throw error when passed resourceName is null', () => {
    expect(() => hateoasResourceService.getCollection(null))
      .toThrowError(`Passed param(s) 'resourceType = null' is not valid`);
  });

  it('GET_PAGE should throw error when passed resourceName is undefined', () => {
    expect(() => hateoasResourceService.getPage(undefined))
      .toThrowError(`Passed param(s) 'resourceType = undefined' is not valid`);
  });

  it('GET_PAGE should throw error when passed resourceName is null', () => {
    expect(() => hateoasResourceService.getPage(null))
      .toThrowError(`Passed param(s) 'resourceType = null' is not valid`);
  });

  it('CREATE_RESOURCE should throw error when passed resourceName,requestBody are undefined', () => {
    expect(() => hateoasResourceService.createResource(undefined, undefined))
      .toThrowError(`Passed param(s) 'resourceType = undefined', 'requestBody = undefined' are not valid`);
  });

  it('CREATE_RESOURCE should throw error when passed resourceName,requestBody are null', () => {
    expect(() => hateoasResourceService.createResource(null, null))
      .toThrowError(`Passed param(s) 'resourceType = null', 'requestBody = null' are not valid`);
  });

  it('CREATE_RESOURCE should resolve resource values', () => {
    resourceHttpServiceSpy.postResource.and.returnValue(of(anything()));
    const resourceWithRelation = new ResourceWithRelation();
    resourceWithRelation.relation = new ResourceRelation();

    hateoasResourceService.createResource(ResourceWithRelation, {body: resourceWithRelation})
      .subscribe(() => {
        const body = resourceHttpServiceSpy.postResource.calls.argsFor(0)[2];
        expect(body).toBeDefined();
        expect(body.relation).toBe('http://localhost:8080/api/v1/resourceRelation/1');
      });
  });

  it('CREATE_RESOURCE should pass options to http request', () => {
    resourceHttpServiceSpy.postResource.and.returnValue(of(anything()));
    const resourceWithRelation = new ResourceWithRelation();
    resourceWithRelation.relation = new ResourceRelation();
    const requestOption: RequestOption = {
      params: {
        testParam: 'testsRequest'
      },
      headers: {
        testHeader: 'test'
      },
      observe: 'body',
      reportProgress: true,
      withCredentials: false
    };

    hateoasResourceService.createResource(ResourceWithRelation, {body: resourceWithRelation}, requestOption)
      .subscribe(() => {
        const options = resourceHttpServiceSpy.postResource.calls.argsFor(0)[3] as RequestOption;
        expect(options).toEqual(requestOption);
      });
  });

  it('UPDATE_RESOURCE should throw error when passed entity is undefined', () => {
    expect(() => hateoasResourceService.updateResource(undefined))
      .toThrowError(`Passed param(s) 'entity = undefined' is not valid`);
  });

  it('UPDATE_RESOURCE should throw error when passed entity is null', () => {
    expect(() => hateoasResourceService.updateResource(null))
      .toThrowError(`Passed param(s) 'entity = null' is not valid`);
  });

  it('UPDATE_RESOURCE should doing the request to the passed resource self link', () => {
    resourceHttpServiceSpy.put.and.returnValue(of(anything()));

    const simpleResource = new SimpleResource();
    hateoasResourceService.updateResource(simpleResource)
      .subscribe(() => {
        const url = resourceHttpServiceSpy.put.calls.argsFor(0)[0];
        expect(url).toBe(simpleResource._links.self.href);
      });
  });

  it('UPDATE_RESOURCE should resolve resource values', () => {
    resourceHttpServiceSpy.put.and.returnValue(of(anything()));
    const resourceWithRelation = new ResourceWithRelation();
    resourceWithRelation.relation = new ResourceRelation();

    hateoasResourceService.updateResource(resourceWithRelation)
      .subscribe(() => {
        const body = resourceHttpServiceSpy.put.calls.argsFor(0)[1];
        expect(body).toBeDefined();
        expect(body.relation).toBe('http://localhost:8080/api/v1/resourceRelation/1');
      });
  });

  it('UPDATE_RESOURCE should resolve resource values considering null values', () => {
    resourceHttpServiceSpy.put.and.returnValue(of(anything()));
    const resourceWithRelation = new ResourceWithRelation();
    resourceWithRelation.name = null;

    hateoasResourceService.updateResource(resourceWithRelation, {
      body: resourceWithRelation,
      valuesOption: {include: Include.NULL_VALUES}
    })
      .subscribe(() => {
        const body = resourceHttpServiceSpy.put.calls.argsFor(0)[1];
        expect(body).toBeDefined();
        expect(body.name).toBeNull();
      });
  });

  it('UPDATE_RESOURCE should pass requestBody as body', () => {
    resourceHttpServiceSpy.put.and.returnValue(of(anything()));

    hateoasResourceService.updateResource(new SimpleResource(), {body: {param: 'test'}})
      .subscribe(() => {
        const body = resourceHttpServiceSpy.put.calls.argsFor(0)[1];
        expect(body).toBeDefined();
        expect(body).toEqual({param: 'test'});
      });
  });

  it('UPDATE_RESOURCE should pass options to http request', () => {
    resourceHttpServiceSpy.put.and.returnValue(of(anything()));
    const requestOption: RequestOption = {
      params: {
        testParam: 'testsRequest'
      },
      headers: {
        testHeader: 'test'
      },
      observe: 'body',
      reportProgress: true,
      withCredentials: false
    };

    hateoasResourceService.updateResource(new SimpleResource(), {body: {param: 'test'}}, requestOption)
      .subscribe(() => {
        const options = resourceHttpServiceSpy.put.calls.argsFor(0)[2] as RequestOption;
        expect(options).toEqual(requestOption);
      });
  });

  it('UPDATE_RESOURCE_BY_ID should throw error when passed id is empty', () => {
    expect(() => hateoasResourceService.updateResourceById(SimpleResource, '', {body: {param: 'test'}}))
      .toThrowError(`Passed param(s) 'id = ' is not valid`);
  });

  it('UPDATE_RESOURCE_BY_ID should throw error when passed resourceName,id,requestBody are undefined', () => {
    expect(() => hateoasResourceService.updateResourceById(undefined, undefined, undefined))
      .toThrowError(`Passed param(s) 'resourceType = undefined', 'id = undefined', 'requestBody = undefined' are not valid`);
  });

  it('UPDATE_RESOURCE_BY_ID should throw error when passed resourceName,id,requestBody are null', () => {
    expect(() => hateoasResourceService.updateResourceById(null, null, null))
      .toThrowError(`Passed param(s) 'resourceType = null', 'id = null', 'requestBody = null' are not valid`);
  });

  it('UPDATE_RESOURCE_BY_ID should resolve resource values', () => {
    resourceHttpServiceSpy.putResource.and.returnValue(of(anything()));
    const resourceWithRelation = new ResourceWithRelation();
    resourceWithRelation.relation = new ResourceRelation();

    hateoasResourceService.updateResourceById(ResourceWithRelation, 1, {body: resourceWithRelation})
      .subscribe(() => {
        const body = resourceHttpServiceSpy.putResource.calls.argsFor(0)[3];
        expect(body).toBeDefined();
        expect(body.relation).toBe('http://localhost:8080/api/v1/resourceRelation/1');
      });
  });

  it('UPDATE_RESOURCE_BY_ID should resolve resource values considering null values', () => {
    resourceHttpServiceSpy.putResource.and.returnValue(of(anything()));
    const resourceWithRelation = new ResourceWithRelation();
    resourceWithRelation.name = null;

    hateoasResourceService.updateResourceById(ResourceWithRelation, 1, {
      body: resourceWithRelation,
      valuesOption: {include: Include.NULL_VALUES}
    })
      .subscribe(() => {
        const body = resourceHttpServiceSpy.putResource.calls.argsFor(0)[3];
        expect(body).toBeDefined();
        expect(body.name).toBeNull();
      });
  });

  it('UPDATE_RESOURCE_BY_ID should pass options to http request', () => {
    resourceHttpServiceSpy.putResource.and.returnValue(of(anything()));
    const resourceWithRelation = new ResourceWithRelation();
    resourceWithRelation.relation = new ResourceRelation();
    const requestOption: RequestOption = {
      params: {
        testParam: 'testsRequest'
      },
      headers: {
        testHeader: 'test'
      },
      observe: 'body',
      reportProgress: true,
      withCredentials: false
    };

    hateoasResourceService.updateResourceById(ResourceWithRelation, 1, {body: resourceWithRelation}, requestOption)
      .subscribe(() => {
        const options = resourceHttpServiceSpy.putResource.calls.argsFor(0)[4] as RequestOption;
        expect(options).toEqual(requestOption);
      });
  });


  it('PATCH_RESOURCE should throw error when passed entity is undefined', () => {
    expect(() => hateoasResourceService.patchResource(undefined))
      .toThrowError(`Passed param(s) 'entity = undefined' is not valid`);
  });

  it('PATCH_RESOURCE should throw error when passed entity is null', () => {
    expect(() => hateoasResourceService.patchResource(null))
      .toThrowError(`Passed param(s) 'entity = null' is not valid`);
  });

  it('PATCH_RESOURCE should doing the request to the passed resource self link', () => {
    resourceHttpServiceSpy.patch.and.returnValue(of(anything()));

    const simpleResource = new SimpleResource();
    hateoasResourceService.patchResource(simpleResource)
      .subscribe(() => {
        const url = resourceHttpServiceSpy.patch.calls.argsFor(0)[0];
        expect(url).toBe(simpleResource._links.self.href);
      });
  });

  it('PATCH_RESOURCE should resolve resource values', () => {
    resourceHttpServiceSpy.patch.and.returnValue(of(anything()));
    const resourceWithRelation = new ResourceWithRelation();
    resourceWithRelation.relation = new ResourceRelation();

    hateoasResourceService.patchResource(resourceWithRelation)
      .subscribe(() => {
        const body = resourceHttpServiceSpy.patch.calls.argsFor(0)[1];
        expect(body).toBeDefined();
        expect(body.relation).toBe('http://localhost:8080/api/v1/resourceRelation/1');
      });
  });

  it('PATCH_RESOURCE should resolve resource values considering null values', () => {
    resourceHttpServiceSpy.patch.and.returnValue(of(anything()));
    const resourceWithRelation = new ResourceWithRelation();
    resourceWithRelation.name = null;

    hateoasResourceService.patchResource(resourceWithRelation, {
      body: resourceWithRelation,
      valuesOption: {include: Include.NULL_VALUES}
    })
      .subscribe(() => {
        const body = resourceHttpServiceSpy.patch.calls.argsFor(0)[1];
        expect(body).toBeDefined();
        expect(body.name).toBeNull();
      });
  });

  it('PATCH_RESOURCE should pass options to http request', () => {
    resourceHttpServiceSpy.patch.and.returnValue(of(anything()));

    hateoasResourceService.patchResource(new SimpleResource(), {body: {param: 'test'}})
      .subscribe(() => {
        const body = resourceHttpServiceSpy.patch.calls.argsFor(0)[1];
        expect(body).toBeDefined();
        expect(body).toEqual({param: 'test'});
      });
  });

  it('PATCH_RESOURCE should pass requestBody as body', () => {
    resourceHttpServiceSpy.patch.and.returnValue(of(anything()));
    const requestOption: RequestOption = {
      params: {
        testParam: 'testsRequest'
      },
      headers: {
        testHeader: 'test'
      },
      observe: 'body',
      reportProgress: true,
      withCredentials: false
    };

    hateoasResourceService.patchResource(new SimpleResource(), {body: {param: 'test'}}, requestOption)
      .subscribe(() => {
        const options = resourceHttpServiceSpy.patch.calls.argsFor(0)[2] as RequestOption;
        expect(options).toEqual(requestOption);
      });
  });

  it('PATCH_RESOURCE_BY_ID should throw error when passed id is empty', () => {
    expect(() => hateoasResourceService.patchResourceById(SimpleResource, '', {body: {param: 'test'}}))
      .toThrowError(`Passed param(s) 'id = ' is not valid`);
  });

  it('PATCH_RESOURCE_BY_ID should throw error when passed resourceName,id,requestBody are undefined', () => {
    expect(() => hateoasResourceService.patchResourceById(undefined, undefined, undefined))
      .toThrowError(`Passed param(s) 'resourceType = undefined', 'id = undefined', 'requestBody = undefined' are not valid`);
  });

  it('PATCH_RESOURCE_BY_ID should throw error when passed resourceName,id,requestBody are null', () => {
    expect(() => hateoasResourceService.patchResourceById(null, null, null))
      .toThrowError(`Passed param(s) 'resourceType = null', 'id = null', 'requestBody = null' are not valid`);
  });

  it('PATCH_RESOURCE_BY_ID should resolve resource values', () => {
    resourceHttpServiceSpy.patchResource.and.returnValue(of(anything()));
    const resourceWithRelation = new ResourceWithRelation();
    resourceWithRelation.relation = new ResourceRelation();

    hateoasResourceService.patchResourceById(ResourceWithRelation, 1, {body: resourceWithRelation})
      .subscribe(() => {
        const body = resourceHttpServiceSpy.patchResource.calls.argsFor(0)[3];
        expect(body).toBeDefined();
        expect(body.relation).toBe('http://localhost:8080/api/v1/resourceRelation/1');
      });
  });

  it('PATCH_RESOURCE_BY_ID should resolve resource values considering null values', () => {
    resourceHttpServiceSpy.patchResource.and.returnValue(of(anything()));
    const resourceWithRelation = new ResourceWithRelation();
    resourceWithRelation.name = null;

    hateoasResourceService.patchResourceById(ResourceWithRelation, 1, {
      body: resourceWithRelation,
      valuesOption: {include: Include.NULL_VALUES}
    })
      .subscribe(() => {
        const body = resourceHttpServiceSpy.patchResource.calls.argsFor(0)[3];
        expect(body).toBeDefined();
        expect(body.name).toBeNull();
      });
  });

  it('PATCH_RESOURCE_BY_ID should pass requestBody as body', () => {
    resourceHttpServiceSpy.patchResource.and.returnValue(of(anything()));
    const resourceWithRelation = new ResourceWithRelation();
    resourceWithRelation.relation = new ResourceRelation();
    const requestOption: RequestOption = {
      params: {
        testParam: 'testsRequest'
      },
      headers: {
        testHeader: 'test'
      },
      observe: 'body',
      reportProgress: true,
      withCredentials: false
    };

    hateoasResourceService.patchResourceById(ResourceWithRelation, 1, {body: resourceWithRelation}, requestOption)
      .subscribe(() => {
        const options = resourceHttpServiceSpy.patchResource.calls.argsFor(0)[4] as RequestOption;
        expect(options).toEqual(requestOption);
      });
  });

  it('DELETE_RESOURCE should throw error when passed entity is undefined', () => {
    expect(() => hateoasResourceService.deleteResource(undefined))
      .toThrowError(`Passed param(s) 'entity = undefined' is not valid`);
  });

  it('DELETE_RESOURCE should throw error when passed entity is null', () => {
    expect(() => hateoasResourceService.deleteResource(null))
      .toThrowError(`Passed param(s) 'entity = null' is not valid`);
  });

  it('DELETE_RESOURCE should doing the request to the passed resource self link', () => {
    resourceHttpServiceSpy.delete.and.returnValue(of(anything()));

    const simpleResource = new SimpleResource();
    hateoasResourceService.deleteResource(simpleResource)
      .subscribe(() => {
        const url = resourceHttpServiceSpy.delete.calls.argsFor(0)[0];
        expect(url).toBe(simpleResource._links.self.href);
      });
  });

  it('DELETE_RESOURCE should pass option params as http request params', () => {
    resourceHttpServiceSpy.delete.and.returnValue(of(anything()));

    const simpleResource = new SimpleResource();
    hateoasResourceService.deleteResource(simpleResource, {params: {test: 'param'}})
      .subscribe(() => {
        const params = resourceHttpServiceSpy.delete.calls.argsFor(0)[1].params as RequestParam;
        expect(params).toBeDefined();
        expect(params.test).toBe('param');
      });
  });

  it('DELETE_RESOURCE should pass observe value if it specified', () => {
    resourceHttpServiceSpy.delete.and.returnValue(of(anything()));

    const simpleResource = new SimpleResource();
    hateoasResourceService.deleteResource(simpleResource, {observe: 'response'})
      .subscribe(() => {
        const observe = resourceHttpServiceSpy.delete.calls.argsFor(0)[1].observe;
        expect(observe).toBeDefined();
        expect(observe).toBe('response');
      });
  });

  it('DELETE_RESOURCE should pass requestBody as body', () => {
    resourceHttpServiceSpy.delete.and.returnValue(of(anything()));
    const requestOption: RequestOption = {
      params: {
        testParam: 'testsRequest'
      },
      headers: {
        testHeader: 'test'
      },
      observe: 'body',
      reportProgress: true,
      withCredentials: false
    };

    const simpleResource = new SimpleResource();
    hateoasResourceService.deleteResource(simpleResource, requestOption)
      .subscribe(() => {
        const options = resourceHttpServiceSpy.delete.calls.argsFor(0)[1] as RequestOption;
        expect(options).toEqual(requestOption);
      });
  });

  it('DELETE_RESOURCE_BY_ID should throw error when passed id is empty', () => {
    expect(() => hateoasResourceService.deleteResourceById(SimpleResource, ''))
      .toThrowError(`Passed param(s) 'id = ' is not valid`);
  });

  it('DELETE_RESOURCE_BY_ID should throw error when passed resourceName,id,requestBody are undefined', () => {
    expect(() => hateoasResourceService.deleteResourceById(undefined, undefined))
      .toThrowError(`Passed param(s) 'resourceType = undefined', 'id = undefined' are not valid`);
  });

  it('DELETE_RESOURCE_BY_ID should throw error when passed resourceName,id are null', () => {
    expect(() => hateoasResourceService.deleteResourceById(null, null))
      .toThrowError(`Passed param(s) 'resourceType = null', 'id = null' are not valid`);
  });

  it('DELETE_RESOURCE_BY_ID should pass option params as http request params', () => {
    resourceHttpServiceSpy.deleteResource.and.returnValue(of(anything()));

    hateoasResourceService.deleteResourceById(SimpleResource, 1, {params: {test: 'param'}})
      .subscribe(() => {
        const params = resourceHttpServiceSpy.deleteResource.calls.argsFor(0)[3].params as RequestParam;
        expect(params).toBeDefined();
        expect(params.test).toBe('param');
      });
  });

  it('DELETE_RESOURCE_BY_ID should pass observe value if it specified', () => {
    resourceHttpServiceSpy.deleteResource.and.returnValue(of(anything()));

    hateoasResourceService.deleteResourceById(SimpleResource, 1, {observe: 'response'})
      .subscribe(() => {
        const observe = resourceHttpServiceSpy.deleteResource.calls.argsFor(0)[3].observe;
        expect(observe).toBeDefined();
        expect(observe).toBe('response');
      });
  });

  it('DELETE_RESOURCE_BY_ID should pass requestBody as body', () => {
    resourceHttpServiceSpy.deleteResource.and.returnValue(of(anything()));
    const requestOption: RequestOption = {
      params: {
        testParam: 'testsRequest'
      },
      headers: {
        testHeader: 'test'
      },
      observe: 'body',
      reportProgress: true,
      withCredentials: false
    };

    hateoasResourceService.deleteResourceById(SimpleResource, 1, requestOption)
      .subscribe(() => {
        const options = resourceHttpServiceSpy.deleteResource.calls.argsFor(0)[3] as RequestOption;
        expect(options).toEqual(requestOption);
      });
  });

  it('SEARCH_COLLECTION should throw error when passed searchQuery is empty', () => {
    expect(() => hateoasResourceService.searchCollection(SimpleResource, ''))
      .toThrowError(`Passed param(s) 'searchQuery = ' is not valid`);
  });

  it('SEARCH_COLLECTION should throw error when passed resourceName,searchQuery are undefined', () => {
    expect(() => hateoasResourceService.searchCollection(undefined, undefined))
      .toThrowError(`Passed param(s) 'resourceType = undefined', 'searchQuery = undefined' are not valid`);
  });

  it('SEARCH_COLLECTION should throw error when passed resourceName,searchQuery are null', () => {
    expect(() => hateoasResourceService.searchCollection(null, null))
      .toThrowError(`Passed param(s) 'resourceType = null', 'searchQuery = null' are not valid`);
  });

  it('SEARCH_PAGE should throw error when passed searchQuery is empty', () => {
    expect(() => hateoasResourceService.searchPage(SimpleResource, ''))
      .toThrowError(`Passed param(s) 'searchQuery = ' is not valid`);
  });

  it('SEARCH_PAGE should throw error when passed resourceName,searchQuery are undefined', () => {
    expect(() => hateoasResourceService.searchPage(undefined, undefined))
      .toThrowError(`Passed param(s) 'resourceType = undefined', 'searchQuery = undefined' are not valid`);
  });

  it('SEARCH_PAGE should throw error when passed resourceName,searchQuery are null', () => {
    expect(() => hateoasResourceService.searchPage(null, null))
      .toThrowError(`Passed param(s) 'resourceType = null', 'searchQuery = null' are not valid`);
  });

  it('SEARCH_RESOURCE should throw error when passed searchQuery is empty', () => {
    expect(() => hateoasResourceService.searchResource(SimpleResource, ''))
      .toThrowError(`Passed param(s) 'searchQuery = ' is not valid`);
  });

  it('SEARCH_RESOURCE should throw error when passed resourceName,searchQuery are undefined', () => {
    expect(() => hateoasResourceService.searchResource(undefined, undefined))
      .toThrowError(`Passed param(s) 'resourceType = undefined', 'searchQuery = undefined' are not valid`);
  });

  it('SEARCH_RESOURCE should throw error when passed resourceName,searchQuery are null', () => {
    expect(() => hateoasResourceService.searchResource(null, null))
      .toThrowError(`Passed param(s) 'resourceType = null', 'searchQuery = null' are not valid`);
  });


  it('CUSTOM_QUERY should throw error when passed query is empty', () => {
    expect(() => hateoasResourceService.customQuery(SimpleResource, HttpMethod.POST, '', {body: new SimpleResource()}))
      .toThrowError(`Passed param(s) 'query = ' is not valid`);
  });

  it('CUSTOM_QUERY should throw error when passed resourceName,method,query are undefined', () => {
    expect(() => hateoasResourceService.customQuery(undefined, undefined, undefined))
      .toThrowError(`Passed param(s) 'resourceType = undefined', 'method = undefined', 'query = undefined' are not valid`);
  });

  it('CUSTOM_QUERY should throw error when passed resourceName,method,query are null', () => {
    expect(() => hateoasResourceService.customQuery(null, null, null))
      .toThrowError(`Passed param(s) 'resourceType = null', 'method = null', 'query = null' are not valid`);
  });

  it('CUSTOM_QUERY should resolve resource values', () => {
    commonHttpServiceSpy.customQuery.and.returnValue(of(anything()));
    const resourceWithRelation = new ResourceWithRelation();
    resourceWithRelation.relation = new ResourceRelation();

    hateoasResourceService.customQuery(ResourceWithRelation, HttpMethod.POST, 'query', {body: resourceWithRelation})
      .subscribe(() => {
        const body = commonHttpServiceSpy.customQuery.calls.argsFor(0)[4];
        expect(body).toBeDefined();
        expect(body.relation).toBe('http://localhost:8080/api/v1/resourceRelation/1');
      });
  });

  it('CUSTOM_QUERY should resolve resource values considering null values', () => {
    commonHttpServiceSpy.customQuery.and.returnValue(of(anything()));
    const resourceWithRelation = new ResourceWithRelation();
    resourceWithRelation.name = null;

    hateoasResourceService.customQuery(ResourceWithRelation, HttpMethod.POST, 'query',
      {body: resourceWithRelation, valuesOption: {include: Include.NULL_VALUES}})
      .subscribe(() => {
        const body = commonHttpServiceSpy.customQuery.calls.argsFor(0)[4];
        expect(body).toBeDefined();
        expect(body.name).toBeNull();
      });
  });

  it('CUSTOM_SEARCH_QUERY should throw error when passed query is empty', () => {
    expect(() => hateoasResourceService.customSearchQuery(SimpleResource, HttpMethod.POST, '', {body: new SimpleResource()}))
      .toThrowError(`Passed param(s) 'searchQuery = ' is not valid`);
  });

  it('CUSTOM_SEARCH_QUERY should throw error when passed resourceName,method,query are undefined', () => {
    expect(() => hateoasResourceService.customSearchQuery(undefined, undefined, undefined))
      .toThrowError(`Passed param(s) 'resourceType = undefined', 'method = undefined', 'searchQuery = undefined' are not valid`);
  });

  it('CUSTOM_SEARCH_QUERY should throw error when passed resourceName,method,query are null', () => {
    expect(() => hateoasResourceService.customSearchQuery(null, null, null))
      .toThrowError(`Passed param(s) 'resourceType = null', 'method = null', 'searchQuery = null' are not valid`);
  });

  it('CUSTOM_SEARCH_QUERY should resolve resource values', () => {
    commonHttpServiceSpy.customQuery.and.returnValue(of(anything()));
    const resourceWithRelation = new ResourceWithRelation();
    resourceWithRelation.relation = new ResourceRelation();

    hateoasResourceService.customSearchQuery(ResourceWithRelation, HttpMethod.POST, 'searchQuery', {body: resourceWithRelation})
      .subscribe(() => {
        const body = commonHttpServiceSpy.customQuery.calls.argsFor(0)[4];
        expect(body).toBeDefined();
        expect(body.relation).toBe('http://localhost:8080/api/v1/resourceRelation/1');
      });
  });

  it('CUSTOM_SEARCH_QUERY should resolve resource values considering null values', () => {
    commonHttpServiceSpy.customQuery.and.returnValue(of(anything()));
    const resourceWithRelation = new ResourceWithRelation();
    resourceWithRelation.name = null;

    hateoasResourceService.customSearchQuery(ResourceWithRelation, HttpMethod.POST, 'searchQuery',
      {body: resourceWithRelation, valuesOption: {include: Include.NULL_VALUES}})
      .subscribe(() => {
        const body = commonHttpServiceSpy.customQuery.calls.argsFor(0)[4];
        expect(body).toBeDefined();
        expect(body.name).toBeNull();
      });
  });

  it('CUSTOM_SEARCH_QUERY should put \'search\' path to result url', () => {
    commonHttpServiceSpy.customQuery.and.returnValue(of(anything()));

    hateoasResourceService.customSearchQuery(SimpleResource, HttpMethod.GET, 'searchQuery')
      .subscribe(() => {
        const url = commonHttpServiceSpy.customQuery.calls.argsFor(0)[3];
        expect(url).toBeDefined();
        expect(url).toBe('/search/searchQuery');
      });
  });

  it('CUSTOM_SEARCH_QUERY should put \'search\' path without additional slash to result url', () => {
    commonHttpServiceSpy.customQuery.and.returnValue(of(anything()));

    hateoasResourceService.customSearchQuery(SimpleResource, HttpMethod.GET, '/searchQuery')
      .subscribe(() => {
        const url = commonHttpServiceSpy.customQuery.calls.argsFor(0)[3];
        expect(url).toBeDefined();
        expect(url).toBe('/search/searchQuery');
      });
  });

  it('EVICT_RESOURCES_CACHE should evict all resources cache', () => {
    hateoasResourceService.evictResourcesCache();

    expect(resourceCacheService.evictAll.calls.count()).toBe(1);
  });

});
