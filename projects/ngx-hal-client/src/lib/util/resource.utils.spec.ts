import { Resource } from '../hal-resource/model/resource';
import { async } from '@angular/core/testing';
import { ResourceUtils } from './resource.utils';
import { EmbeddedResource } from '../hal-resource/model/embedded-resource';
import { CollectionResource } from '../hal-resource/model/collection-resource';
import { PagedCollectionResource } from '../hal-resource/model/paged-collection-resource';
import { rawCollectionResource, rawEmbeddedResource, rawPagedCollectionResource, rawResource } from '../hal-resource/model/resources.test';
import { Include } from '../hal-resource/model/declarations';

/* tslint:disable:no-string-literal */
describe('ResourceUtils', () => {

  beforeEach(async(() => {
    ResourceUtils.useResourceType(Resource);
    ResourceUtils.useEmbeddedResourceType(EmbeddedResource);
    ResourceUtils.useCollectionResourceType(CollectionResource);
    ResourceUtils.usePagedCollectionResourceType(PagedCollectionResource);
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
    expect(ResourceUtils.instantiateCollectionResource({})).toBeNull();
  });

  it('INSTANTIATE_COLLECTION_RESOURCE should return "null" when passed payload is null', () => {
    expect(ResourceUtils.instantiateCollectionResource(null)).toBeNull();
  });

  it('INSTANTIATE_COLLECTION_RESOURCE should return "null" when passed payload is undefined', () => {
    expect(ResourceUtils.instantiateCollectionResource(undefined)).toBeNull();
  });

  it('INSTANTIATE_COLLECTION_RESOURCE should return "null" when passed payload._links is null', () => {
    expect(ResourceUtils.instantiateCollectionResource({_links: null, _embedded: {someVal: 'test'}})).toBeNull();
  });

  it('INSTANTIATE_COLLECTION_RESOURCE should return "null" when passed payload._links is undefined', () => {
    expect(ResourceUtils.instantiateCollectionResource({_links: undefined, _embedded: {someVal: 'test'}})).toBeNull();
  });

  it('INSTANTIATE_COLLECTION_RESOURCE should return "null" when passed payload._links is not object', () => {
    expect(ResourceUtils.instantiateCollectionResource({_links: 'not_object', _embedded: {someVal: 'test'}})).toBeNull();
  });

  it('INSTANTIATE_COLLECTION_RESOURCE should return "null" when passed payload._embedded is null', () => {
    expect(ResourceUtils.instantiateCollectionResource({_embedded: null, _links: {someVal: 'test'}})).toBeNull();
  });

  it('INSTANTIATE_COLLECTION_RESOURCE should return "null" when passed payload._embedded is undefined', () => {
    expect(ResourceUtils.instantiateCollectionResource({_embedded: undefined, _links: {someVal: 'test'}})).toBeNull();
  });

  it('INSTANTIATE_COLLECTION_RESOURCE should return "null" when passed payload._embedded is not object', () => {
    expect(ResourceUtils.instantiateCollectionResource({_embedded: 'not_object', _links: {someVal: 'test'}})).toBeNull();
  });

  it('INSTANTIATE_COLLECTION_RESOURCE should create collection resources with all resources from _embedded object', () => {
    const result = ResourceUtils.instantiateCollectionResource(rawCollectionResource);

    expect(result).toBeDefined();
    expect(result instanceof CollectionResource).toBe(true);
    expect(result.resources).toBeDefined();
    expect(result.resources.length).toBe(2);
    expect(result.resources[0] instanceof Resource).toBe(true);
    expect(result.resources[0]['text']).toBe('hello world');
    expect(result.resources[1] instanceof Resource).toBe(true);
    expect(result.resources[1]['text']).toBe('Second object');
  });

  it('INSTANTIATE_COLLECTION_RESOURCE should copy root _links object', () => {
    const result = ResourceUtils.instantiateCollectionResource(rawCollectionResource);

    expect(result).toBeDefined();
    expect(result['_links']).toBeDefined();
    expect(result['_links']).toEqual(rawCollectionResource._links);
  });

  it('INSTANTIATE_PAGED_COLLECTION_RESOURCE should return "null" when passed payload is empty object', () => {
    expect(ResourceUtils.instantiatePagedCollectionResource({})).toBeNull();
  });

  it('INSTANTIATE_PAGED_COLLECTION_RESOURCE should return "null" when passed payload is null', () => {
    expect(ResourceUtils.instantiatePagedCollectionResource(null)).toBeNull();
  });

  it('INSTANTIATE_PAGED_COLLECTION_RESOURCE should return "null" when passed payload is undefined', () => {
    expect(ResourceUtils.instantiatePagedCollectionResource(undefined)).toBeNull();
  });

  it('INSTANTIATE_PAGED_COLLECTION_RESOURCE should return "null" when passed payload._links is null', () => {
    expect(ResourceUtils.instantiatePagedCollectionResource({_links: null, _embedded: {someVal: 'test'}})).toBeNull();
  });

  it('INSTANTIATE_PAGED_COLLECTION_RESOURCE should return "null" when passed payload._links is undefined', () => {
    expect(ResourceUtils.instantiatePagedCollectionResource({_links: undefined, _embedded: {someVal: 'test'}})).toBeNull();
  });

  it('INSTANTIATE_PAGED_COLLECTION_RESOURCE should return "null" when passed payload._links is not object', () => {
    expect(ResourceUtils.instantiatePagedCollectionResource({_links: 'not_object', _embedded: {someVal: 'test'}})).toBeNull();
  });

  it('INSTANTIATE_PAGED_COLLECTION_RESOURCE should return "null" when passed payload._embedded is null', () => {
    expect(ResourceUtils.instantiatePagedCollectionResource({_embedded: null, _links: {someVal: 'test'}})).toBeNull();
  });

  it('INSTANTIATE_PAGED_COLLECTION_RESOURCE should return "null" when passed payload._embedded is undefined', () => {
    expect(ResourceUtils.instantiatePagedCollectionResource({_embedded: undefined, _links: {someVal: 'test'}})).toBeNull();
  });

  it('INSTANTIATE_PAGED_COLLECTION_RESOURCE should return "null" when passed payload._embedded is not object', () => {
    expect(ResourceUtils.instantiatePagedCollectionResource({_embedded: 'not_object', _links: {someVal: 'test'}})).toBeNull();
  });

  it('INSTANTIATE_PAGED_COLLECTION_RESOURCE should create paged collection resources with default page options', () => {
    const result = ResourceUtils.instantiatePagedCollectionResource({...rawPagedCollectionResource, page: null});

    expect(result).toBeDefined();
    expect(result instanceof PagedCollectionResource).toBe(true);
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

  it('INSTANTIATE_PAGED_COLLECTION_RESOURCE should create paged collection resources with passed page options', () => {
    const result = ResourceUtils.instantiatePagedCollectionResource(rawPagedCollectionResource);

    expect(result).toBeDefined();
    expect(result instanceof PagedCollectionResource).toBe(true);
    expect(result.pageNumber).toBe(rawPagedCollectionResource.page.number);
    expect(result.pageSize).toBe(rawPagedCollectionResource.page.size);
    expect(result.totalElements).toBe(rawPagedCollectionResource.page.totalElements);
    expect(result.totalPages).toBe(rawPagedCollectionResource.page.totalPages);
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
    const result = ResourceUtils.instantiatePagedCollectionResource(rawPagedCollectionResource);

    expect(result).toBeDefined();
    expect(result['_links']).toBeDefined();
    expect(result['_links']).toEqual(rawPagedCollectionResource._links);
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
