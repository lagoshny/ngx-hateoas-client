/* tslint:disable:no-string-literal */
import { async } from '@angular/core/testing';
import { HalResourceService } from './hal-resource.service';
import { HttpMethod, Include, Resource } from '../../ngx-hateoas-client.module';
import { of } from 'rxjs';
import { SimpleResource } from '../../model/resource/resources.test';
import { ResourceUtils } from '../../util/resource.utils';
import { HttpParams } from '@angular/common/http';
import anything = jasmine.anything;

class ResourceRelation extends Resource {
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

class ResourceWithRelation extends SimpleResource {
  public relation: ResourceRelation;
  public name: 'Test';
}

describe('HalResourceService', () => {
  let halResourceService: HalResourceService<Resource>;
  let commonHttpServiceSpy: any;
  let resourceHttpServiceSpy: any;
  let resourceCollectionHttpServiceSpy: any;
  let pagedResourceCollectionHttpServiceSpy: any;

  beforeEach(async(() => {
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

    halResourceService =
      new HalResourceService<Resource>(commonHttpServiceSpy, resourceHttpServiceSpy,
        resourceCollectionHttpServiceSpy, pagedResourceCollectionHttpServiceSpy);
    ResourceUtils.useResourceType(Resource);
  }));

  it('GET_RESOURCE should throw error when passed resourceName is empty', () => {
    expect(() => halResourceService.getResource('', 2))
      .toThrowError(`Passed param(s) 'resourceName = ' is not valid`);
  });

  it('GET_RESOURCE should throw error when passed resourceName,id are undefined', () => {
    expect(() => halResourceService.getResource(undefined, undefined))
      .toThrowError(`Passed param(s) 'resourceName = undefined', 'id = undefined' is not valid`);
  });

  it('GET_RESOURCE should throw error when passed resourceName,id are null', () => {
    expect(() => halResourceService.getResource(null, null))
      .toThrowError(`Passed param(s) 'resourceName = null', 'id = null' is not valid`);
  });

  it('GET_COLLECTION should throw error when passed resourceName is empty', () => {
    expect(() => halResourceService.getCollection(''))
      .toThrowError(`Passed param(s) 'resourceName = ' is not valid`);
  });

  it('GET_COLLECTION should throw error when passed resourceName is undefined', () => {
    expect(() => halResourceService.getCollection(undefined))
      .toThrowError(`Passed param(s) 'resourceName = undefined' is not valid`);
  });

  it('GET_COLLECTION should throw error when passed resourceName is null', () => {
    expect(() => halResourceService.getCollection(null))
      .toThrowError(`Passed param(s) 'resourceName = null' is not valid`);
  });

  it('GET_COLLECTION should invoke getResourceCollection with query null param', () => {
    resourceCollectionHttpServiceSpy.getResourceCollection.and.returnValue(of(anything()));

    halResourceService.getCollection('test').subscribe(() => {
      const query = resourceCollectionHttpServiceSpy.getResourceCollection.calls.argsFor(0)[1];
      expect(query).toBeNull();
    });
  });

  it('GET_PAGE should throw error when passed resourceName is empty', () => {
    expect(() => halResourceService.getPage(''))
      .toThrowError(`Passed param(s) 'resourceName = ' is not valid`);
  });

  it('GET_PAGE should throw error when passed resourceName is undefined', () => {
    expect(() => halResourceService.getPage(undefined))
      .toThrowError(`Passed param(s) 'resourceName = undefined' is not valid`);
  });

  it('GET_PAGE should throw error when passed resourceName is null', () => {
    expect(() => halResourceService.getPage(null))
      .toThrowError(`Passed param(s) 'resourceName = null' is not valid`);
  });

  it('GET_PAGE should invoke getResourcePage with query null param', () => {
    pagedResourceCollectionHttpServiceSpy.getResourcePage.and.returnValue(of(anything()));

    halResourceService.getPage('test').subscribe(() => {
      const query = pagedResourceCollectionHttpServiceSpy.getResourcePage.calls.argsFor(0)[1];
      expect(query).toBeNull();
    });
  });

  it('CREATE_RESOURCE should throw error when passed resourceName is empty', () => {
    expect(() => halResourceService.createResource('', {body: new SimpleResource()}))
      .toThrowError(`Passed param(s) 'resourceName = ' is not valid`);
  });

  it('CREATE_RESOURCE should throw error when passed resourceName,requestBody are undefined', () => {
    expect(() => halResourceService.createResource(undefined, undefined))
      .toThrowError(`Passed param(s) 'resourceName = undefined', 'requestBody = undefined' is not valid`);
  });

  it('CREATE_RESOURCE should throw error when passed resourceName,requestBody are null', () => {
    expect(() => halResourceService.createResource(null, null))
      .toThrowError(`Passed param(s) 'resourceName = null', 'requestBody = null' is not valid`);
  });

  it('CREATE_RESOURCE should resolve resource values', () => {
    resourceHttpServiceSpy.postResource.and.returnValue(of(anything()));
    const resourceWithRelation = new ResourceWithRelation();
    resourceWithRelation.relation = new ResourceRelation();

    halResourceService.createResource('test', {body: resourceWithRelation})
      .subscribe(() => {
        const body = resourceHttpServiceSpy.postResource.calls.argsFor(0)[1];
        expect(body).toBeDefined();
        expect(body.relation).toBe('http://localhost:8080/api/v1/resourceRelation/1');
      });
  });

  it('UPDATE_RESOURCE should throw error when passed entity is undefined', () => {
    expect(() => halResourceService.updateResource(undefined))
      .toThrowError(`Passed param(s) 'entity = undefined' is not valid`);
  });

  it('UPDATE_RESOURCE should throw error when passed entity is null', () => {
    expect(() => halResourceService.updateResource(null))
      .toThrowError(`Passed param(s) 'entity = null' is not valid`);
  });

  it('UPDATE_RESOURCE should doing the request to the passed resource self link', () => {
    resourceHttpServiceSpy.put.and.returnValue(of(anything()));

    const simpleResource = new SimpleResource();
    halResourceService.updateResource(simpleResource)
      .subscribe(() => {
        const url = resourceHttpServiceSpy.put.calls.argsFor(0)[0];
        expect(url).toBe(simpleResource._links.self.href);
      });
  });

  it('UPDATE_RESOURCE should resolve resource values', () => {
    resourceHttpServiceSpy.put.and.returnValue(of(anything()));
    const resourceWithRelation = new ResourceWithRelation();
    resourceWithRelation.relation = new ResourceRelation();

    halResourceService.updateResource(resourceWithRelation)
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

    halResourceService.updateResource(resourceWithRelation, {body: resourceWithRelation, valuesOption: {include: Include.NULL_VALUES}})
      .subscribe(() => {
        const body = resourceHttpServiceSpy.put.calls.argsFor(0)[1];
        expect(body).toBeDefined();
        expect(body.name).toBeNull();
      });
  });

  it('UPDATE_RESOURCE should pass requestBody as body', () => {
    resourceHttpServiceSpy.put.and.returnValue(of(anything()));

    halResourceService.updateResource(new SimpleResource(), {body: {param: 'test'}})
      .subscribe(() => {
        const body = resourceHttpServiceSpy.put.calls.argsFor(0)[1];
        expect(body).toBeDefined();
        expect(body).toEqual({param: 'test'});
      });
  });

  it('UPDATE_RESOURCE_BY_ID should throw error when passed resourceName is empty', () => {
    expect(() => halResourceService.updateResourceById('', 1, {body: {param: 'test'}}))
      .toThrowError(`Passed param(s) 'resourceName = ' is not valid`);
  });

  it('UPDATE_RESOURCE_BY_ID should throw error when passed id is empty', () => {
    expect(() => halResourceService.updateResourceById('any', '', {body: {param: 'test'}}))
      .toThrowError(`Passed param(s) 'id = ' is not valid`);
  });

  it('UPDATE_RESOURCE_BY_ID should throw error when passed resourceName,id,requestBody are undefined', () => {
    expect(() => halResourceService.updateResourceById(undefined, undefined, undefined))
      .toThrowError(`Passed param(s) 'resourceName = undefined', 'id = undefined', 'requestBody = undefined' is not valid`);
  });

  it('UPDATE_RESOURCE_BY_ID should throw error when passed resourceName,id,requestBody are null', () => {
    expect(() => halResourceService.updateResourceById(null, null, null))
      .toThrowError(`Passed param(s) 'resourceName = null', 'id = null', 'requestBody = null' is not valid`);
  });

  it('UPDATE_RESOURCE_BY_ID should resolve resource values', () => {
    resourceHttpServiceSpy.putResource.and.returnValue(of(anything()));
    const resourceWithRelation = new ResourceWithRelation();
    resourceWithRelation.relation = new ResourceRelation();

    halResourceService.updateResourceById('test', 1, {body: resourceWithRelation})
      .subscribe(() => {
        const body = resourceHttpServiceSpy.putResource.calls.argsFor(0)[2];
        expect(body).toBeDefined();
        expect(body.relation).toBe('http://localhost:8080/api/v1/resourceRelation/1');
      });
  });

  it('UPDATE_RESOURCE_BY_ID should resolve resource values considering null values', () => {
    resourceHttpServiceSpy.putResource.and.returnValue(of(anything()));
    const resourceWithRelation = new ResourceWithRelation();
    resourceWithRelation.name = null;

    halResourceService.updateResourceById('test', 1, {body: resourceWithRelation, valuesOption: {include: Include.NULL_VALUES}})
      .subscribe(() => {
        const body = resourceHttpServiceSpy.putResource.calls.argsFor(0)[2];
        expect(body).toBeDefined();
        expect(body.name).toBeNull();
      });
  });

  it('PATCH_RESOURCE should throw error when passed entity is undefined', () => {
    expect(() => halResourceService.patchResource(undefined))
      .toThrowError(`Passed param(s) 'entity = undefined' is not valid`);
  });

  it('PATCH_RESOURCE should throw error when passed entity is null', () => {
    expect(() => halResourceService.patchResource(null))
      .toThrowError(`Passed param(s) 'entity = null' is not valid`);
  });

  it('PATCH_RESOURCE should doing the request to the passed resource self link', () => {
    resourceHttpServiceSpy.patch.and.returnValue(of(anything()));

    const simpleResource = new SimpleResource();
    halResourceService.patchResource(simpleResource)
      .subscribe(() => {
        const url = resourceHttpServiceSpy.patch.calls.argsFor(0)[0];
        expect(url).toBe(simpleResource._links.self.href);
      });
  });

  it('PATCH_RESOURCE should resolve resource values', () => {
    resourceHttpServiceSpy.patch.and.returnValue(of(anything()));
    const resourceWithRelation = new ResourceWithRelation();
    resourceWithRelation.relation = new ResourceRelation();

    halResourceService.patchResource(resourceWithRelation)
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

    halResourceService.patchResource(resourceWithRelation, {body: resourceWithRelation, valuesOption: {include: Include.NULL_VALUES}})
      .subscribe(() => {
        const body = resourceHttpServiceSpy.patch.calls.argsFor(0)[1];
        expect(body).toBeDefined();
        expect(body.name).toBeNull();
      });
  });

  it('PATCH_RESOURCE should pass requestBody as body', () => {
    resourceHttpServiceSpy.patch.and.returnValue(of(anything()));

    halResourceService.patchResource(new SimpleResource(), {body: {param: 'test'}})
      .subscribe(() => {
        const body = resourceHttpServiceSpy.patch.calls.argsFor(0)[1];
        expect(body).toBeDefined();
        expect(body).toEqual({param: 'test'});
      });
  });

  it('PATCH_RESOURCE_BY_ID should throw error when passed resourceName is empty', () => {
    expect(() => halResourceService.patchResourceById('', 1, {body: {param: 'test'}}))
      .toThrowError(`Passed param(s) 'resourceName = ' is not valid`);
  });

  it('PATCH_RESOURCE_BY_ID should throw error when passed id is empty', () => {
    expect(() => halResourceService.patchResourceById('any', '', {body: {param: 'test'}}))
      .toThrowError(`Passed param(s) 'id = ' is not valid`);
  });

  it('PATCH_RESOURCE_BY_ID should throw error when passed resourceName,id,requestBody are undefined', () => {
    expect(() => halResourceService.patchResourceById(undefined, undefined, undefined))
      .toThrowError(`Passed param(s) 'resourceName = undefined', 'id = undefined', 'requestBody = undefined' is not valid`);
  });

  it('PATCH_RESOURCE_BY_ID should throw error when passed resourceName,id,requestBody are null', () => {
    expect(() => halResourceService.patchResourceById(null, null, null))
      .toThrowError(`Passed param(s) 'resourceName = null', 'id = null', 'requestBody = null' is not valid`);
  });

  it('PATCH_RESOURCE_BY_ID should resolve resource values', () => {
    resourceHttpServiceSpy.patchResource.and.returnValue(of(anything()));
    const resourceWithRelation = new ResourceWithRelation();
    resourceWithRelation.relation = new ResourceRelation();

    halResourceService.patchResourceById('test', 1, {body: resourceWithRelation})
      .subscribe(() => {
        const body = resourceHttpServiceSpy.patchResource.calls.argsFor(0)[2];
        expect(body).toBeDefined();
        expect(body.relation).toBe('http://localhost:8080/api/v1/resourceRelation/1');
      });
  });

  it('PATCH_RESOURCE_BY_ID should resolve resource values considering null values', () => {
    resourceHttpServiceSpy.patchResource.and.returnValue(of(anything()));
    const resourceWithRelation = new ResourceWithRelation();
    resourceWithRelation.name = null;

    halResourceService.patchResourceById('test', 1, {body: resourceWithRelation, valuesOption: {include: Include.NULL_VALUES}})
      .subscribe(() => {
        const body = resourceHttpServiceSpy.patchResource.calls.argsFor(0)[2];
        expect(body).toBeDefined();
        expect(body.name).toBeNull();
      });
  });

  it('DELETE_RESOURCE should throw error when passed entity is undefined', () => {
    expect(() => halResourceService.deleteResource(undefined))
      .toThrowError(`Passed param(s) 'entity = undefined' is not valid`);
  });

  it('DELETE_RESOURCE should throw error when passed entity is null', () => {
    expect(() => halResourceService.deleteResource(null))
      .toThrowError(`Passed param(s) 'entity = null' is not valid`);
  });

  it('DELETE_RESOURCE should doing the request to the passed resource self link', () => {
    resourceHttpServiceSpy.delete.and.returnValue(of(anything()));

    const simpleResource = new SimpleResource();
    halResourceService.deleteResource(simpleResource)
      .subscribe(() => {
        const url = resourceHttpServiceSpy.delete.calls.argsFor(0)[0];
        expect(url).toBe(simpleResource._links.self.href);
      });
  });

  it('DELETE_RESOURCE should pass option params as http request params', () => {
    resourceHttpServiceSpy.delete.and.returnValue(of(anything()));

    const simpleResource = new SimpleResource();
    halResourceService.deleteResource(simpleResource, {params: {test: 'param'}})
      .subscribe(() => {
        const params = resourceHttpServiceSpy.delete.calls.argsFor(0)[1].params as HttpParams;
        expect(params).toBeDefined();
        expect(params.has('test')).toBeTrue();
        expect(params.get('test')).toBe('param');
      });
  });

  it('DELETE_RESOURCE should pass observe value if it specified', () => {
    resourceHttpServiceSpy.delete.and.returnValue(of(anything()));

    const simpleResource = new SimpleResource();
    halResourceService.deleteResource(simpleResource, {observe: 'response'})
      .subscribe(() => {
        const observe = resourceHttpServiceSpy.delete.calls.argsFor(0)[1].observe;
        expect(observe).toBeDefined();
        expect(observe).toBe('response');
      });
  });

  it('DELETE_RESOURCE_BY_ID should throw error when passed resourceName is empty', () => {
    expect(() => halResourceService.deleteResourceById('', 1))
      .toThrowError(`Passed param(s) 'resourceName = ' is not valid`);
  });

  it('DELETE_RESOURCE_BY_ID should throw error when passed id is empty', () => {
    expect(() => halResourceService.deleteResourceById('any', ''))
      .toThrowError(`Passed param(s) 'id = ' is not valid`);
  });

  it('DELETE_RESOURCE_BY_ID should throw error when passed resourceName,id,requestBody are undefined', () => {
    expect(() => halResourceService.deleteResourceById(undefined, undefined))
      .toThrowError(`Passed param(s) 'resourceName = undefined', 'id = undefined' is not valid`);
  });

  it('DELETE_RESOURCE_BY_ID should throw error when passed resourceName,id are null', () => {
    expect(() => halResourceService.deleteResourceById(null, null))
      .toThrowError(`Passed param(s) 'resourceName = null', 'id = null' is not valid`);
  });

  it('DELETE_RESOURCE_BY_ID should pass option params as http request params', () => {
    resourceHttpServiceSpy.deleteResource.and.returnValue(of(anything()));

    halResourceService.deleteResourceById('resource', 1, {params: {test: 'param'}})
      .subscribe(() => {
        const params = resourceHttpServiceSpy.deleteResource.calls.argsFor(0)[2].params as HttpParams;
        expect(params).toBeDefined();
        expect(params.has('test')).toBeTrue();
        expect(params.get('test')).toBe('param');
      });
  });

  it('DELETE_RESOURCE_BY_ID should pass observe value if it specified', () => {
    resourceHttpServiceSpy.deleteResource.and.returnValue(of(anything()));

    halResourceService.deleteResourceById('resource', 1, {observe: 'response'})
      .subscribe(() => {
        const observe = resourceHttpServiceSpy.deleteResource.calls.argsFor(0)[2].observe;
        expect(observe).toBeDefined();
        expect(observe).toBe('response');
      });
  });

  it('SEARCH_COLLECTION should throw error when passed resourceName is empty', () => {
    expect(() => halResourceService.searchCollection('', 'any'))
      .toThrowError(`Passed param(s) 'resourceName = ' is not valid`);
  });

  it('SEARCH_COLLECTION should throw error when passed searchQuery is empty', () => {
    expect(() => halResourceService.searchCollection('any', ''))
      .toThrowError(`Passed param(s) 'searchQuery = ' is not valid`);
  });

  it('SEARCH_COLLECTION should throw error when passed resourceName,searchQuery are undefined', () => {
    expect(() => halResourceService.searchCollection(undefined, undefined))
      .toThrowError(`Passed param(s) 'resourceName = undefined', 'searchQuery = undefined' is not valid`);
  });

  it('SEARCH_COLLECTION should throw error when passed resourceName,searchQuery are null', () => {
    expect(() => halResourceService.searchCollection(null, null))
      .toThrowError(`Passed param(s) 'resourceName = null', 'searchQuery = null' is not valid`);
  });

  it('SEARCH_PAGE should throw error when passed resourceName is empty', () => {
    expect(() => halResourceService.searchPage('', 'any'))
      .toThrowError(`Passed param(s) 'resourceName = ' is not valid`);
  });

  it('SEARCH_PAGE should throw error when passed searchQuery is empty', () => {
    expect(() => halResourceService.searchPage('any', ''))
      .toThrowError(`Passed param(s) 'searchQuery = ' is not valid`);
  });

  it('SEARCH_PAGE should throw error when passed resourceName,searchQuery are undefined', () => {
    expect(() => halResourceService.searchPage(undefined, undefined))
      .toThrowError(`Passed param(s) 'resourceName = undefined', 'searchQuery = undefined' is not valid`);
  });

  it('SEARCH_PAGE should throw error when passed resourceName,searchQuery are null', () => {
    expect(() => halResourceService.searchPage(null, null))
      .toThrowError(`Passed param(s) 'resourceName = null', 'searchQuery = null' is not valid`);
  });

  it('SEARCH_SINGLE should throw error when passed resourceName is empty', () => {
    expect(() => halResourceService.searchSingle('', 'any'))
      .toThrowError(`Passed param(s) 'resourceName = ' is not valid`);
  });

  it('SEARCH_SINGLE should throw error when passed searchQuery is empty', () => {
    expect(() => halResourceService.searchSingle('any', ''))
      .toThrowError(`Passed param(s) 'searchQuery = ' is not valid`);
  });

  it('SEARCH_SINGLE should throw error when passed resourceName,searchQuery are undefined', () => {
    expect(() => halResourceService.searchSingle(undefined, undefined))
      .toThrowError(`Passed param(s) 'resourceName = undefined', 'searchQuery = undefined' is not valid`);
  });

  it('SEARCH_SINGLE should throw error when passed resourceName,searchQuery are null', () => {
    expect(() => halResourceService.searchSingle(null, null))
      .toThrowError(`Passed param(s) 'resourceName = null', 'searchQuery = null' is not valid`);
  });

  it('CUSTOM_QUERY should throw error when passed resourceName is empty', () => {
    expect(() => halResourceService.customQuery('', HttpMethod.POST, 'query', {body: new SimpleResource()}))
      .toThrowError(`Passed param(s) 'resourceName = ' is not valid`);
  });

  it('CUSTOM_QUERY should throw error when passed query is empty', () => {
    expect(() => halResourceService.customQuery('any', HttpMethod.POST, '', {body: new SimpleResource()}))
      .toThrowError(`Passed param(s) 'query = ' is not valid`);
  });

  it('CUSTOM_QUERY should throw error when passed resourceName,method,query are undefined', () => {
    expect(() => halResourceService.customQuery(undefined, undefined, undefined))
      .toThrowError(`Passed param(s) 'resourceName = undefined', 'method = undefined', 'query = undefined' is not valid`);
  });

  it('CUSTOM_QUERY should throw error when passed resourceName,method,query are null', () => {
    expect(() => halResourceService.customQuery(null, null, null))
      .toThrowError(`Passed param(s) 'resourceName = null', 'method = null', 'query = null' is not valid`);
  });

  it('CUSTOM_QUERY should resolve resource values', () => {
    commonHttpServiceSpy.customQuery.and.returnValue(of(anything()));
    const resourceWithRelation = new ResourceWithRelation();
    resourceWithRelation.relation = new ResourceRelation();

    halResourceService.customQuery('test', HttpMethod.POST, 'query', {body: resourceWithRelation})
      .subscribe(() => {
        const body = commonHttpServiceSpy.customQuery.calls.argsFor(0)[3];
        expect(body).toBeDefined();
        expect(body.relation).toBe('http://localhost:8080/api/v1/resourceRelation/1');
      });
  });

  it('CUSTOM_QUERY should resolve resource values considering null values', () => {
    commonHttpServiceSpy.customQuery.and.returnValue(of(anything()));
    const resourceWithRelation = new ResourceWithRelation();
    resourceWithRelation.name = null;

    halResourceService.customQuery('test', HttpMethod.POST, 'query',
      {body: resourceWithRelation, valuesOption: {include: Include.NULL_VALUES}})
      .subscribe(() => {
        const body = commonHttpServiceSpy.customQuery.calls.argsFor(0)[3];
        expect(body).toBeDefined();
        expect(body.name).toBeNull();
      });
  });

  //
  it('CUSTOM_SEARCH_QUERY should throw error when passed resourceName is empty', () => {
    expect(() => halResourceService.customSearchQuery('', HttpMethod.POST, 'searchQuery', {body: new SimpleResource()}))
      .toThrowError(`Passed param(s) 'resourceName = ' is not valid`);
  });

  it('CUSTOM_SEARCH_QUERY should throw error when passed query is empty', () => {
    expect(() => halResourceService.customSearchQuery('any', HttpMethod.POST, '', {body: new SimpleResource()}))
      .toThrowError(`Passed param(s) 'searchQuery = ' is not valid`);
  });

  it('CUSTOM_SEARCH_QUERY should throw error when passed resourceName,method,query are undefined', () => {
    expect(() => halResourceService.customSearchQuery(undefined, undefined, undefined))
      .toThrowError(`Passed param(s) 'resourceName = undefined', 'method = undefined', 'searchQuery = undefined' is not valid`);
  });

  it('CUSTOM_SEARCH_QUERY should throw error when passed resourceName,method,query are null', () => {
    expect(() => halResourceService.customSearchQuery(null, null, null))
      .toThrowError(`Passed param(s) 'resourceName = null', 'method = null', 'searchQuery = null' is not valid`);
  });

  it('CUSTOM_SEARCH_QUERY should resolve resource values', () => {
    commonHttpServiceSpy.customQuery.and.returnValue(of(anything()));
    const resourceWithRelation = new ResourceWithRelation();
    resourceWithRelation.relation = new ResourceRelation();

    halResourceService.customSearchQuery('test', HttpMethod.POST, 'searchQuery', {body: resourceWithRelation})
      .subscribe(() => {
        const body = commonHttpServiceSpy.customQuery.calls.argsFor(0)[3];
        expect(body).toBeDefined();
        expect(body.relation).toBe('http://localhost:8080/api/v1/resourceRelation/1');
      });
  });

  it('CUSTOM_SEARCH_QUERY should resolve resource values considering null values', () => {
    commonHttpServiceSpy.customQuery.and.returnValue(of(anything()));
    const resourceWithRelation = new ResourceWithRelation();
    resourceWithRelation.name = null;

    halResourceService.customSearchQuery('test', HttpMethod.POST, 'searchQuery',
      {body: resourceWithRelation, valuesOption: {include: Include.NULL_VALUES}})
      .subscribe(() => {
        const body = commonHttpServiceSpy.customQuery.calls.argsFor(0)[3];
        expect(body).toBeDefined();
        expect(body.name).toBeNull();
      });
  });

  it('CUSTOM_SEARCH_QUERY should put \'search\' path to result url', () => {
    commonHttpServiceSpy.customQuery.and.returnValue(of(anything()));

    halResourceService.customSearchQuery('test', HttpMethod.GET, 'searchQuery')
      .subscribe(() => {
        const url = commonHttpServiceSpy.customQuery.calls.argsFor(0)[2];
        expect(url).toBeDefined();
        expect(url).toBe('/search/searchQuery');
      });
  });

  it('CUSTOM_SEARCH_QUERY should put \'search\' path without additional slash to result url', () => {
    commonHttpServiceSpy.customQuery.and.returnValue(of(anything()));

    halResourceService.customSearchQuery('test', HttpMethod.GET, '/searchQuery')
      .subscribe(() => {
        const url = commonHttpServiceSpy.customQuery.calls.argsFor(0)[2];
        expect(url).toBeDefined();
        expect(url).toBe('/search/searchQuery');
      });
  });

});
