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
      patch: jasmine.createSpy('patch'),
      delete: jasmine.createSpy('delete')
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

  it('GET should throw error when passed resourceName is empty', () => {
    expect(() => halResourceService.get('', 2))
      .toThrowError(`Passed param(s) 'resourceName = ' is not valid`);
  });

  it('GET should throw error when passed resourceName,id are undefined', () => {
    expect(() => halResourceService.get(undefined, undefined))
      .toThrowError(`Passed param(s) 'resourceName = undefined', 'id = undefined' is not valid`);
  });

  it('GET should throw error when passed resourceName,id are null', () => {
    expect(() => halResourceService.get(null, null))
      .toThrowError(`Passed param(s) 'resourceName = null', 'id = null' is not valid`);
  });

  it('GET_ALL should throw error when passed resourceName is empty', () => {
    expect(() => halResourceService.getAll(''))
      .toThrowError(`Passed param(s) 'resourceName = ' is not valid`);
  });

  it('GET_ALL should throw error when passed resourceName is undefined', () => {
    expect(() => halResourceService.getAll(undefined))
      .toThrowError(`Passed param(s) 'resourceName = undefined' is not valid`);
  });

  it('GET_ALL should throw error when passed resourceName is null', () => {
    expect(() => halResourceService.getAll(null))
      .toThrowError(`Passed param(s) 'resourceName = null' is not valid`);
  });

  it('GET_ALL should invoke getResourceCollection with query null param', () => {
    resourceCollectionHttpServiceSpy.getResourceCollection.and.returnValue(of(anything()));

    halResourceService.getAll('test').subscribe(() => {
      const query = resourceCollectionHttpServiceSpy.getResourceCollection.calls.argsFor(0)[1];
      expect(query).toBeNull();
    });
  });

  it('GET_ALL_PAGE should throw error when passed resourceName is empty', () => {
    expect(() => halResourceService.getAllPage(''))
      .toThrowError(`Passed param(s) 'resourceName = ' is not valid`);
  });

  it('GET_ALL_PAGE should throw error when passed resourceName is undefined', () => {
    expect(() => halResourceService.getAllPage(undefined))
      .toThrowError(`Passed param(s) 'resourceName = undefined' is not valid`);
  });

  it('GET_ALL_PAGE should throw error when passed resourceName is null', () => {
    expect(() => halResourceService.getAllPage(null))
      .toThrowError(`Passed param(s) 'resourceName = null' is not valid`);
  });

  it('GET_ALL_PAGE should invoke getResourcePage with query null param', () => {
    pagedResourceCollectionHttpServiceSpy.getResourcePage.and.returnValue(of(anything()));

    halResourceService.getAllPage('test').subscribe(() => {
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

  it('UPDATE_RESOURCE should throw error when passed requestBody is undefined', () => {
    expect(() => halResourceService.updateResource(undefined))
      .toThrowError(`Passed param(s) 'requestBody = undefined' is not valid`);
  });

  it('UPDATE_RESOURCE should throw error when passed requestBody is null', () => {
    expect(() => halResourceService.updateResource(null))
      .toThrowError(`Passed param(s) 'requestBody = null' is not valid`);
  });

  it('UPDATE_RESOURCE should doing the request to the passed resource self link', () => {
    resourceHttpServiceSpy.put.and.returnValue(of(anything()));

    const simpleResource = new SimpleResource();
    halResourceService.updateResource({body: simpleResource})
      .subscribe(() => {
        const url = resourceHttpServiceSpy.put.calls.argsFor(0)[0];
        expect(url).toBe(simpleResource._links.self.href);
      });
  });

  it('UPDATE_RESOURCE should resolve resource values', () => {
    resourceHttpServiceSpy.put.and.returnValue(of(anything()));
    const resourceWithRelation = new ResourceWithRelation();
    resourceWithRelation.relation = new ResourceRelation();

    halResourceService.updateResource({body: resourceWithRelation})
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

    halResourceService.updateResource({body: resourceWithRelation, valuesOption: {include: Include.NULL_VALUES}})
      .subscribe(() => {
        const body = resourceHttpServiceSpy.put.calls.argsFor(0)[1];
        expect(body).toBeDefined();
        expect(body.name).toBeNull();
      });
  });

  it('COUNT should throw error when passed resourceName is empty', () => {
    expect(() => halResourceService.count(''))
      .toThrowError(`Passed param(s) 'resourceName = ' is not valid`);
  });

  it('COUNT should throw error when passed resourceName is undefined', () => {
    expect(() => halResourceService.count(undefined))
      .toThrowError(`Passed param(s) 'resourceName = undefined' is not valid`);
  });

  it('COUNT should throw error when passed resourceName is null', () => {
    expect(() => halResourceService.count(null))
      .toThrowError(`Passed param(s) 'resourceName = null' is not valid`);
  });

  it('PATCH_RESOURCE should throw error when passed requestBody is undefined', () => {
    expect(() => halResourceService.patchResource(undefined))
      .toThrowError(`Passed param(s) 'requestBody = undefined' is not valid`);
  });

  it('PATCH_RESOURCE should throw error when passed requestBody is null', () => {
    expect(() => halResourceService.patchResource(null))
      .toThrowError(`Passed param(s) 'requestBody = null' is not valid`);
  });

  it('PATCH_RESOURCE should doing the request to the passed resource self link', () => {
    resourceHttpServiceSpy.patch.and.returnValue(of(anything()));

    const simpleResource = new SimpleResource();
    halResourceService.patchResource({body: simpleResource})
      .subscribe(() => {
        const url = resourceHttpServiceSpy.patch.calls.argsFor(0)[0];
        expect(url).toBe(simpleResource._links.self.href);
      });
  });

  it('PATCH_RESOURCE should resolve resource values', () => {
    resourceHttpServiceSpy.patch.and.returnValue(of(anything()));
    const resourceWithRelation = new ResourceWithRelation();
    resourceWithRelation.relation = new ResourceRelation();

    halResourceService.patchResource({body: resourceWithRelation})
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

    halResourceService.patchResource({body: resourceWithRelation, valuesOption: {include: Include.NULL_VALUES}})
      .subscribe(() => {
        const body = resourceHttpServiceSpy.patch.calls.argsFor(0)[1];
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

});
