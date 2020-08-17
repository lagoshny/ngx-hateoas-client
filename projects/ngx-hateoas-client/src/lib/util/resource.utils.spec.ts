import { Resource } from '../model/resource/resource';
import { async } from '@angular/core/testing';
import { ResourceUtils } from './resource.utils';
import { EmbeddedResource } from '../model/resource/embedded-resource';
import { ResourceCollection } from '../model/resource/resource-collection';
import { PagedResourceCollection } from '../model/resource/paged-resource-collection';
import { rawEmbeddedResource, rawPagedResourceCollection, rawResource, rawResourceCollection } from '../model/resource/resources.test';
import { Include } from '../model/declarations';

/* tslint:disable:no-string-literal */
describe('ResourceUtils', () => {

  beforeEach(async(() => {
    ResourceUtils.useResourceType(Resource);
    ResourceUtils.useEmbeddedResourceType(EmbeddedResource);
    ResourceUtils.useResourceCollectionType(ResourceCollection);
    ResourceUtils.usePagedResourceCollectionType(PagedResourceCollection);
  }));

  it('INSTANTIATE_RESOURCE should return "null" when passed payload is empty object', () => {
    expect(ResourceUtils.instantiateResource({})).toBeNull();
  });

  it('INSTANTIATE_RESOURCE should return "null" when passed payload is null', () => {
    expect(ResourceUtils.instantiateResource(null)).toBeNull();
  });

  it('INSTANTIATE_RESOURCE should return "null" when passed payload is undefined', () => {
    expect(ResourceUtils.instantiateResource(undefined)).toBeNull();
  });

  it('INSTANTIATE_RESOURCE should return "null" when passed payload._links is null', () => {
    expect(ResourceUtils.instantiateResource({_links: null})).toBeNull();
  });

  it('INSTANTIATE_RESOURCE should return "null" when passed payload._links is undefined', () => {
    expect(ResourceUtils.instantiateResource({_links: undefined})).toBeNull();
  });

  it('INSTANTIATE_RESOURCE should return "null" when passed payload._links is not object', () => {
    expect(ResourceUtils.instantiateResource({_links: 'not_object'})).toBeNull();
  });

  it('INSTANTIATE_RESOURCE should create embedded resource', () => {
    const result = ResourceUtils.instantiateResource({
      ...rawResource,
      embeddedCollection: [
        rawEmbeddedResource,
        rawEmbeddedResource
      ]
    });

    expect(result instanceof Resource).toBeTrue();
    expect(result['embeddedCollection']).toBeDefined();
    expect(result['embeddedCollection'].length).toBe(2);
    expect(result['embeddedCollection'][0] instanceof EmbeddedResource).toBeTrue();
    expect(result['embeddedCollection'][1] instanceof EmbeddedResource).toBeTrue();
  });

  it('INSTANTIATE_RESOURCE should create resource', () => {
    const result = ResourceUtils.instantiateResource({
      ...rawResource,
      resourceCollection: [
        rawResource,
        rawResource
      ]
    });

    expect(result instanceof Resource).toBeTrue();
    expect(result['resourceCollection']).toBeDefined();
    expect(result['resourceCollection'].length).toBe(2);
    expect(result['resourceCollection'][0] instanceof Resource).toBeTrue();
    expect(result['resourceCollection'][1] instanceof Resource).toBeTrue();
  });

  it('INSTANTIATE_RESOURCE should fill resourceName for "Resource" type', () => {
    const result = ResourceUtils.instantiateResource({
      ...rawResource,
      resourceCollection: [
        rawResource,
        rawResource
      ]
    });

    expect(result['resourceCollection']).toBeDefined();
    expect(result['resourceCollection'].length).toBe(2);
    expect(result['resourceCollection'][0]['resourceName']).toBe('Resource');
    expect(result['resourceCollection'][1]['resourceName']).toBe('Resource');
  });

  it('INSTANTIATE_RESOURCE should NOT fill resourceName for "EmbeddedResource" type', () => {
    const result = ResourceUtils.instantiateResource({
      ...rawResource,
      embeddedCollection: [
        rawEmbeddedResource,
        rawEmbeddedResource
      ]
    });

    expect(result['embeddedCollection']).toBeDefined();
    expect(result['embeddedCollection'].length).toBe(2);
    expect(result['embeddedCollection'][0]['resourceName']).toBeUndefined();
    expect(result['embeddedCollection'][1]['resourceName']).toBeUndefined();
  });

  it('INSTANTIATE_COLLECTION_RESOURCE should return "null" when passed payload is empty object', () => {
    expect(ResourceUtils.instantiateResourceCollection({})).toBeNull();
  });

  it('INSTANTIATE_COLLECTION_RESOURCE should return "null" when passed payload is null', () => {
    expect(ResourceUtils.instantiateResourceCollection(null)).toBeNull();
  });

  it('INSTANTIATE_COLLECTION_RESOURCE should return "null" when passed payload is undefined', () => {
    expect(ResourceUtils.instantiateResourceCollection(undefined)).toBeNull();
  });

  it('INSTANTIATE_COLLECTION_RESOURCE should return "null" when passed payload._links is null', () => {
    expect(ResourceUtils.instantiateResourceCollection({_links: null, _embedded: {someVal: 'test'}})).toBeNull();
  });

  it('INSTANTIATE_COLLECTION_RESOURCE should return "null" when passed payload._links is undefined', () => {
    expect(ResourceUtils.instantiateResourceCollection({_links: undefined, _embedded: {someVal: 'test'}})).toBeNull();
  });

  it('INSTANTIATE_COLLECTION_RESOURCE should return "null" when passed payload._links is not object', () => {
    expect(ResourceUtils.instantiateResourceCollection({_links: 'not_object', _embedded: {someVal: 'test'}})).toBeNull();
  });

  it('INSTANTIATE_COLLECTION_RESOURCE should return "null" when passed payload._embedded is null', () => {
    expect(ResourceUtils.instantiateResourceCollection({_embedded: null, _links: {someVal: 'test'}})).toBeNull();
  });

  it('INSTANTIATE_COLLECTION_RESOURCE should return "null" when passed payload._embedded is undefined', () => {
    expect(ResourceUtils.instantiateResourceCollection({_embedded: undefined, _links: {someVal: 'test'}})).toBeNull();
  });

  it('INSTANTIATE_COLLECTION_RESOURCE should return "null" when passed payload._embedded is not object', () => {
    expect(ResourceUtils.instantiateResourceCollection({_embedded: 'not_object', _links: {someVal: 'test'}})).toBeNull();
  });

  it('INSTANTIATE_COLLECTION_RESOURCE should create resource collections with all resources from _embedded object', () => {
    const result = ResourceUtils.instantiateResourceCollection(rawResourceCollection);

    expect(result).toBeDefined();
    expect(result instanceof ResourceCollection).toBe(true);
    expect(result.resources).toBeDefined();
    expect(result.resources.length).toBe(2);
    expect(result.resources[0] instanceof Resource).toBe(true);
    expect(result.resources[0]['text']).toBe('hello world');
    expect(result.resources[1] instanceof Resource).toBe(true);
    expect(result.resources[1]['text']).toBe('Second object');
  });

  it('INSTANTIATE_COLLECTION_RESOURCE should copy root _links object', () => {
    const result = ResourceUtils.instantiateResourceCollection(rawResourceCollection);

    expect(result).toBeDefined();
    expect(result['_links']).toBeDefined();
    expect(result['_links']).toEqual(rawResourceCollection._links);
  });

  it('INSTANTIATE_PAGED_COLLECTION_RESOURCE should return "null" when passed payload is empty object', () => {
    expect(ResourceUtils.instantiatePagedResourceCollection({})).toBeNull();
  });

  it('INSTANTIATE_PAGED_COLLECTION_RESOURCE should return "null" when passed payload is null', () => {
    expect(ResourceUtils.instantiatePagedResourceCollection(null)).toBeNull();
  });

  it('INSTANTIATE_PAGED_COLLECTION_RESOURCE should return "null" when passed payload is undefined', () => {
    expect(ResourceUtils.instantiatePagedResourceCollection(undefined)).toBeNull();
  });

  it('INSTANTIATE_PAGED_COLLECTION_RESOURCE should return "null" when passed payload._links is null', () => {
    expect(ResourceUtils.instantiatePagedResourceCollection({_links: null, _embedded: {someVal: 'test'}})).toBeNull();
  });

  it('INSTANTIATE_PAGED_COLLECTION_RESOURCE should return "null" when passed payload._links is undefined', () => {
    expect(ResourceUtils.instantiatePagedResourceCollection({_links: undefined, _embedded: {someVal: 'test'}})).toBeNull();
  });

  it('INSTANTIATE_PAGED_COLLECTION_RESOURCE should return "null" when passed payload._links is not object', () => {
    expect(ResourceUtils.instantiatePagedResourceCollection({_links: 'not_object', _embedded: {someVal: 'test'}})).toBeNull();
  });

  it('INSTANTIATE_PAGED_COLLECTION_RESOURCE should return "null" when passed payload._embedded is null', () => {
    expect(ResourceUtils.instantiatePagedResourceCollection({_embedded: null, _links: {someVal: 'test'}})).toBeNull();
  });

  it('INSTANTIATE_PAGED_COLLECTION_RESOURCE should return "null" when passed payload._embedded is undefined', () => {
    expect(ResourceUtils.instantiatePagedResourceCollection({_embedded: undefined, _links: {someVal: 'test'}})).toBeNull();
  });

  it('INSTANTIATE_PAGED_COLLECTION_RESOURCE should return "null" when passed payload._embedded is not object', () => {
    expect(ResourceUtils.instantiatePagedResourceCollection({_embedded: 'not_object', _links: {someVal: 'test'}})).toBeNull();
  });

  it('INSTANTIATE_PAGED_COLLECTION_RESOURCE should create paged resource collections with default page options', () => {
    const result = ResourceUtils.instantiatePagedResourceCollection({...rawPagedResourceCollection, page: null});

    expect(result).toBeDefined();
    expect(result instanceof PagedResourceCollection).toBe(true);
    expect(result.pageNumber).toBe(0);
    expect(result.pageSize).toBe(20);
    expect(result.totalElements).toBe(0);
    expect(result.totalPages).toBe(1);
    expect(result.hasFirst()).toBeFalse();
    expect(result.hasNext()).toBeFalse();
    expect(result.hasPrev()).toBeFalse();
    expect(result.hasLast()).toBeFalse();

    expect(result.resources).toBeDefined();
    expect(result.resources.length).toBe(2);
    expect(result.resources[0] instanceof Resource).toBe(true);
    expect(result.resources[0]['text']).toBe('hello world');
    expect(result.resources[1] instanceof Resource).toBe(true);
    expect(result.resources[1]['text']).toBe('Second object');
  });

  it('INSTANTIATE_PAGED_COLLECTION_RESOURCE should create paged resource collections with passed page options', () => {
    const result = ResourceUtils.instantiatePagedResourceCollection(rawPagedResourceCollection);

    expect(result).toBeDefined();
    expect(result instanceof PagedResourceCollection).toBe(true);
    expect(result.pageNumber).toBe(rawPagedResourceCollection.page.number);
    expect(result.pageSize).toBe(rawPagedResourceCollection.page.size);
    expect(result.totalElements).toBe(rawPagedResourceCollection.page.totalElements);
    expect(result.totalPages).toBe(rawPagedResourceCollection.page.totalPages);
    expect(result.hasFirst()).toBeTrue();
    expect(result.hasNext()).toBeTrue();
    expect(result.hasPrev()).toBeTrue();
    expect(result.hasLast()).toBeTrue();

    expect(result.resources).toBeDefined();
    expect(result.resources.length).toBe(2);
    expect(result.resources[0] instanceof Resource).toBe(true);
    expect(result.resources[0]['text']).toBe('hello world');
    expect(result.resources[1] instanceof Resource).toBe(true);
    expect(result.resources[1]['text']).toBe('Second object');
  });

  it('INSTANTIATE_PAGED_COLLECTION_RESOURCE should copy root _links object', () => {
    const result = ResourceUtils.instantiatePagedResourceCollection(rawPagedResourceCollection);

    expect(result).toBeDefined();
    expect(result['_links']).toBeDefined();
    expect(result['_links']).toEqual(rawPagedResourceCollection._links);
  });

  it('RESOLVE_VALUES should return "null" when passed requestBody is null', () => {
    expect(ResourceUtils.resolveValues(null)).toBeNull();
  });

  it('RESOLVE_VALUES should return "null" when passed requestBody is undefined', () => {
    expect(ResourceUtils.resolveValues(undefined)).toBeNull();
  });

  it('RESOLVE_VALUES should return "null" when passed requestBody.body is null', () => {
    expect(ResourceUtils.resolveValues({body: null})).toBeNull();
  });

  it('RESOLVE_VALUES should return "null" when passed requestBody.body is undefined', () => {
    expect(ResourceUtils.resolveValues({body: undefined})).toBeNull();
  });

  it('RESOLVE_VALUES should return "null" when passed requestBody.body is empty', () => {
    expect(ResourceUtils.resolveValues({body: {}})).toBeNull();
  });

  it('RESOLVE_VALUES should return the same value when passed requestBody.body is not object', () => {
    expect(ResourceUtils.resolveValues({body: 'test'})).toBe('test');
  });

  it('RESOLVE_VALUES should return object without null values when NOT pass Include.NULL_VALUES', () => {
    expect(ResourceUtils.resolveValues({
      body: {
        name: 'test',
        value: null
      }
    })).toEqual({
      name: 'test'
    });
  });

  it('RESOLVE_VALUES should return object with null values when pass Include.NULL_VALUES', () => {
    expect(ResourceUtils.resolveValues({
      body: {
        name: 'test',
        value: null
      },
      valuesOption: {include: Include.NULL_VALUES}
    })).toEqual({
      name: 'test',
      value: null
    });
  });

  it('RESOLVE_VALUES should replace resource object to it\'s self href link', () => {
    expect(ResourceUtils.resolveValues({
      body: {
        name: 'test',
        res: rawResource
      }
    })).toEqual({
      name: 'test',
      res: rawResource._links.self.href
    });
  });

  it('RESOLVE_VALUES should copy object as is when it\'s not resource', () => {
    expect(ResourceUtils.resolveValues({
      body: {
        name: 'test',
        obj: {
          simple: 'test'
        }
      }
    })).toEqual({
      name: 'test',
      obj: {
        simple: 'test'
      }
    });
  });

  it('RESOLVE_VALUES ARRAY should return object without null values when NOT pass Include.NULL_VALUES', () => {
    expect(ResourceUtils.resolveValues({
      body: {
        name: 'test',
        arr: [
          {
            prop: 'test',
            value: null
          }
        ]
      }
    })).toEqual({
      name: 'test',
      arr: [
        {
          prop: 'test'
        }
      ]
    });
  });

  it('RESOLVE_VALUES ARRAY should return object with null values when pass Include.NULL_VALUES', () => {
    expect(ResourceUtils.resolveValues({
      body: {
        name: 'test',
        arr: [
          {
            prop: 'test',
            value: null
          }
        ]
      },
      valuesOption: {include: Include.NULL_VALUES}
    })).toEqual({
      name: 'test',
      arr: [
        {
          prop: 'test',
          value: null
        }
      ]
    });
  });

  it('RESOLVE_VALUES ARRAY should replace resource object to it\'s self link', () => {
    expect(ResourceUtils.resolveValues({
      body: {
        name: 'test',
        arr: [
          {
            res: rawResource
          }
        ]
      }
    })).toEqual({
      name: 'test',
      arr: [
        {
          res: rawResource._links.self.href
        }
      ]
    });
  });

  it('RESOLVE_VALUES ARRAY should replace flat resource object to it\'s self link', () => {
    expect(ResourceUtils.resolveValues({
      body: {
        name: 'test',
        arr: [
          rawResource
        ]
      }
    })).toEqual({
      name: 'test',
      arr: [
        rawResource._links.self.href
      ]
    });
  });

  it('RESOLVE_VALUES ARRAY should copy object as is when it\'s not resource', () => {
    expect(ResourceUtils.resolveValues({
      body: {
        name: 'test',
        arr: [
          1, 2, 'str'
        ]
      }
    })).toEqual({
      name: 'test',
      arr: [
        1, 2, 'str'
      ]
    });
  });

  it('RESOLVE_VALUES INNER ARRAY should return object without null values when NOT pass Include.NULL_VALUES', () => {
    expect(ResourceUtils.resolveValues({
      body: {
        name: 'test',
        arr: [
          {
            arrName: 'arr',
            innerArr: [
              {
                name: 'test',
                value: null
              }
            ]
          }
        ]
      }
    })).toEqual({
      name: 'test',
      arr: [
        {
          arrName: 'arr',
          innerArr: [
            {
              name: 'test',
            }
          ]
        }
      ]
    });
  });

  it('RESOLVE_VALUES INNER ARRAY should return object with null values when pass Include.NULL_VALUES', () => {
    expect(ResourceUtils.resolveValues({
      body: {
        name: 'test',
        arr: [
          {
            arrName: 'arr',
            innerArr: [
              {
                name: 'test',
                value: null
              }
            ]
          }
        ]
      },
      valuesOption: {include: Include.NULL_VALUES}
    })).toEqual({
      name: 'test',
      arr: [
        {
          arrName: 'arr',
          innerArr: [
            {
              name: 'test',
              value: null
            }
          ]
        }
      ]
    });
  });

  it('RESOLVE_VALUES INNER ARRAY should replace resource object to it\'s self link', () => {
    expect(ResourceUtils.resolveValues({
      body: {
        name: 'test',
        arr: [
          {
            arrName: 'arr',
            innerArr: [
              {
                name: 'test',
                res: rawResource
              }
            ]
          }
        ]
      }
    })).toEqual({
      name: 'test',
      arr: [
        {
          arrName: 'arr',
          innerArr: [
            {
              name: 'test',
              res: rawResource._links.self.href
            }
          ]
        }
      ]
    });
  });

  it('RESOLVE_VALUES INNER ARRAY should replace flat resource object to it\'s self link', () => {
    expect(ResourceUtils.resolveValues({
      body: {
        name: 'test',
        arr: [
          {
            arrName: 'arr',
            innerArr: [
              rawResource
            ],
          }
        ]
      }
    })).toEqual({
      name: 'test',
      arr: [
        {
          arrName: 'arr',
          innerArr: [
            rawResource._links.self.href
          ]
        }
      ]
    });
  });

  it('RESOLVE_VALUES INNER ARRAY should copy object as is when it\'s not resource', () => {
    expect(ResourceUtils.resolveValues({
      body: {
        name: 'test',
        arr: [
          1, 2, 'str', [4, 5, 'test']
        ]
      }
    })).toEqual({
      name: 'test',
      arr: [
        1, 2, 'str', [4, 5, 'test']
      ]
    });
  });

  it('INIT_RESOURCE should return resource class object', () => {
    const resourceClass = ResourceUtils.initResource(rawResource);

    expect(resourceClass).toBeDefined();
    expect(resourceClass instanceof Resource).toBeDefined();
  });

  it('INIT_RESOURCE should return embedded resource class object', () => {
    const resourceClass = ResourceUtils.initResource(rawEmbeddedResource);

    expect(resourceClass).toBeDefined();
    expect(resourceClass instanceof EmbeddedResource).toBeDefined();
  });

  it('INIT_RESOURCE should return the same object when it\'s not resource/embedded class object', () => {
    const obj = ResourceUtils.initResource({test: 'name'});

    expect(obj).toBeDefined();
    expect(obj).toEqual({test: 'name'});
  });

});
