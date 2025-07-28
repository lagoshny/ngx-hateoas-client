import { Resource } from '../model/resource/resource';
import { ResourceUtils } from './resource.utils';
import { EmbeddedResource } from '../model/resource/embedded-resource';
import { ResourceCollection } from '../model/resource/resource-collection';
import { PagedResourceCollection } from '../model/resource/paged-resource-collection';
import {
  rawCaseSensitiveResource,
  RawEmbeddedResource,
  rawEmbeddedResource,
  rawEmptyPagedResourceCollection,
  rawEmptyResourceCollection, rawHalFormsPagedResourceCollection, rawHalFormsResource, rawHalFormsResourceCollection,
  rawPagedResourceCollection,
  RawResource,
  rawResource,
  rawResourceCollection,
  SimpleResource,
  SimpleResourceProjection,
} from '../model/resource/resources.test'
import { Include } from '../model/declarations';
import { HateoasResource } from '../model/decorators';
import { LibConfig } from '../config/lib-config';
import { isArray, isEmpty } from 'lodash-es';


/* tslint:disable:no-string-literal */
describe('ResourceUtils', () => {

  beforeEach(() => {
    ResourceUtils.useResourceType(Resource);
    ResourceUtils.useEmbeddedResourceType(EmbeddedResource);
    ResourceUtils.useResourceCollectionType(ResourceCollection);
    ResourceUtils.usePagedResourceCollectionType(PagedResourceCollection);
  });

  afterEach(() => {
    ResourceUtils.useResourceType(null);
    ResourceUtils.useEmbeddedResourceType(null);
    ResourceUtils.useResourceCollectionType(null);
    ResourceUtils.usePagedResourceCollectionType(null);
  });

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

  it('INSTANTIATE_RESOURCE should skip \'hibernateLazyInitializer\' resource property', () => {
    const result = ResourceUtils.instantiateResource({
      ...rawResource,
      hibernateLazyInitializer: {}
    });

    expect(result instanceof Resource).toBeTrue();
    expect(result['hibernateLazyInitializer']).toBeUndefined();
  });

  it('INSTANTIATE_RESOURCE should create Resource with concrete resource type not with common ', () => {
    const result = ResourceUtils.instantiateResource({
      ...rawResource,
    });

    expect(result instanceof RawResource).toBeTrue();
  });

  it('INSTANTIATE_RESOURCE should create Resource with _templates', () => {
    const result = ResourceUtils.instantiateResource({
      ...rawHalFormsResource
    });

    expect(result instanceof Resource).toBeTrue();
    expect(result['_templates']).toBeDefined();
    expect(result.hasTemplate('default')).toBeTrue();
  });

  it('INSTANTIATE_RESOURCE should create EmbeddedResource with concrete embedded resource type not with common ', () => {
    const result = ResourceUtils.instantiateResource({
      ...rawResource,
      embedResTest: rawEmbeddedResource
    });

    expect(result instanceof Resource).toBeTrue();
    expect(result['embedResTest'] instanceof RawEmbeddedResource).toBeTrue();
  });

  it('INSTANTIATE_RESOURCE projection should create projection relation property as resource object', () => {
    const resourceProjection = new SimpleResourceProjection();
    resourceProjection.rawResource = new RawResource();
    const result = ResourceUtils.instantiateResource({
      ...resourceProjection
    });

    expect(result instanceof Resource).toBeTrue();
    expect(result['rawResource']).toBeDefined();
    expect(result['rawResource'] instanceof RawResource).toBeTrue();
  });

  it('INSTANTIATE_RESOURCE define resource type should be case insensitive #1', () => {

    @HateoasResource('testResource')
    class CaseSensitiveResource1 extends Resource {

      // tslint:disable-next-line:variable-name
      _links = {
        self: {
          href: 'http://localhost:8080/api/v1/testResource/1'
        },
        testResource: {
          href: 'http://localhost:8080/api/v1/testResource/1'
        }
      };

    }

    const result = ResourceUtils.instantiateResource(rawCaseSensitiveResource);
    expect(result instanceof CaseSensitiveResource1).toBeTrue();
  });

  it('INSTANTIATE_RESOURCE define resource type should be case insensitive #2', () => {

    @HateoasResource('testresource')
    class CaseSensitiveResource2 extends Resource {

      // tslint:disable-next-line:variable-name
      _links = {
        self: {
          href: 'http://localhost:8080/api/v1/testResource/1'
        },
        testResource: {
          href: 'http://localhost:8080/api/v1/testResource/1'
        }
      };

    }

    const result = ResourceUtils.instantiateResource(rawCaseSensitiveResource);
    expect(result instanceof CaseSensitiveResource2).toBeTrue();
  });

  it('INSTANTIATE_RESOURCE define resource type should be case insensitive #3', () => {

    @HateoasResource('TESTRESOURCE')
    class CaseSensitiveResource3 extends Resource {

      // tslint:disable-next-line:variable-name
      _links = {
        self: {
          href: 'http://localhost:8080/api/v1/testResource/1'
        },
        testResource: {
          href: 'http://localhost:8080/api/v1/testResource/1'
        }
      };

    }

    const result = ResourceUtils.instantiateResource(rawCaseSensitiveResource);
    expect(result instanceof CaseSensitiveResource3).toBeTrue();
  });

  it('INSTANTIATE_RESOURCE with Date field as string should be parsed to Date object', () => {
    spyOn(LibConfig, 'getConfig').and.returnValue({
      ...LibConfig.DEFAULT_CONFIG,
      typesFormat: {
        date: {
          patterns: ['dd.MM.yyyy']
        }
      }
    });

    const testRawResource = {
      someDate: '23.06.2022',
      _links: {
        self: {
          href: 'http://localhost:8080/api/v1/testResource/1'
        },
        testResource: {
          href: 'http://localhost:8080/api/v1/testResource/1'
        }
      }
    };

    const result = ResourceUtils.instantiateResource(testRawResource);
    expect(result instanceof Resource).toBeTrue();
    expect(result['someDate'] instanceof Date).toBeTrue();
  });

  it('INSTANTIATE_RESOURCE with Date field as string should be parsed from one of specified Date format', () => {
    spyOn(LibConfig, 'getConfig').and.returnValue({
      ...LibConfig.DEFAULT_CONFIG,
      typesFormat: {
        date: {
          patterns: ['d.MM.yyyy', 'dd.MM.yyyy']
        }
      }
    });

    const testRawResource = {
      someDate: '23.06.2022',
      _links: {
        self: {
          href: 'http://localhost:8080/api/v1/testResource/1'
        },
        testResource: {
          href: 'http://localhost:8080/api/v1/testResource/1'
        }
      }
    };

    const result = ResourceUtils.instantiateResource(testRawResource);
    expect(result instanceof Resource).toBeTrue();
    expect(result['someDate'] instanceof Date).toBeTrue();
  });

  it('INSTANTIATE_RESOURCE with Date field as string result resource filed should be as string without specified Date format', () => {
    const testRawResource = {
      someDate: '23.06.2022',
      _links: {
        self: {
          href: 'http://localhost:8080/api/v1/testResource/1'
        },
        testResource: {
          href: 'http://localhost:8080/api/v1/testResource/1'
        }
      }
    };

    const result = ResourceUtils.instantiateResource(testRawResource);
    expect(result instanceof Resource).toBeTrue();
    expect(typeof result['someDate'] === 'string').toBeTrue();
  });

  it('INSTANTIATE_RESOURCE define resource type should be case insensitive #4', () => {

    @HateoasResource('tEsTrEsOuRce')
    class CaseSensitiveResource4 extends Resource {

      // tslint:disable-next-line:variable-name
      _links = {
        self: {
          href: 'http://localhost:8080/api/v1/testResource/1'
        },
        testResource: {
          href: 'http://localhost:8080/api/v1/testResource/1'
        }
      };

    }

    const result = ResourceUtils.instantiateResource(rawCaseSensitiveResource);
    expect(result instanceof CaseSensitiveResource4).toBeTrue();
  });

  it('INSTANTIATE_RESOURCE define right embedded Resource types with _embedded resources', () => {
    const rawResourceWithEmbedded = {
      id: '123',
      color: 'red',
      brand: 'Volkswagen',
      model: 'Golf',
      garageId: '456',
      _links: {
        self: {
          href: 'http://localhost:8080/api/v1/cars/123'
        },
        inspections: {
          href: 'http://localhost:8080/api/v1/cars/123/inspections'
        },
        garage: {
          href: 'http://localhost:8080/api/v1/garages/456'
        }
      },
      _embedded: {
        inspections: [
          {
            id: '789',
            name: 'XY',
            date: 'DD.MM.YYYY',
            carId: '123',
            _links: {
              self: {
                href: 'http://localhost:8080/api/v1/inspections/789'
              },
              car: {
                href: 'http://localhost:8080/api/v1/cars/123'
              }
            }
          }
        ],
        garage: {
          id: '456',
          location: 'XY',
          surface: 'pavement',
          city: 'XY',
          _links: {
            self: {
              href: 'http://localhost:8080/api/v1/garages/456'
            },
            cars: {
              href: 'http://localhost:8080/api/v1/garages/456/cars'
            },
            inspections: {
              href: 'http://localhost:8080/api/v1/garages/456/inspections'
            }
          }
        }
      }
    };

    @HateoasResource('garages')
    class GarageItemEmb extends Resource {
      public id: string;
      public location: string;
      public surface: string;
      public city: string;
    }

    @HateoasResource('inspections')
    class InspectionItemEmb extends Resource {
      public id: string;
      public name: string;
      public date: string;
      public carId: string;
    }

    @HateoasResource('cars')
    class CarItem extends Resource {
      public id: string;
      public color: string;
      public brand: string;
      public model: string;
      public garageId: string;
      public garage: GarageItemEmb;
      public inspections: InspectionItemEmb[];
    }

    const result = ResourceUtils.instantiateResource(rawResourceWithEmbedded, false);

    expect(result instanceof CarItem).toBeTruthy('result of resource should be CarItem type');
    expect(result['garage'] instanceof GarageItemEmb).toBeTruthy('embedded resource garage should be GarageItemEmb type');
    expect(isArray(result['inspections'])).toBeTruthy('embedded resource inspections should be Array');
    expect(isEmpty(result['inspections'])).toBeFalsy('embedded resource inspections should NOT be EMPTY');
    expect(result['inspections'][0] instanceof InspectionItemEmb).toBeTruthy('embedded resource inspections should be InspectionItemEmb type');
  });

  it('INSTANTIATE_RESOURCE embedded resources are EMPTY when _embedded resource is EMPTY', () => {
    const rawResourceWithEmbedded = {
      id: '123',
      color: 'red',
      brand: 'Volkswagen',
      model: 'Golf',
      garageId: '456',
      _links: {
        self: {
          href: 'http://localhost:8080/api/v1/cars/123'
        },
        inspections: {
          href: 'http://localhost:8080/api/v1/cars/123/inspections'
        },
        garage: {
          href: 'http://localhost:8080/api/v1/garages/456'
        }
      },
      _embedded: {}
    };

    @HateoasResource('garages')
    class GarageItemEmb extends Resource {
      public id: string;
      public location: string;
      public surface: string;
      public city: string;
    }

    @HateoasResource('inspections')
    class InspectionItemEmb extends Resource {
      public id: string;
      public name: string;
      public date: string;
      public carId: string;
    }

    @HateoasResource('cars')
    class CarItem extends Resource {
      public id: string;
      public color: string;
      public brand: string;
      public model: string;
      public garageId: string;
      public garage: GarageItemEmb;
      public inspections: InspectionItemEmb[];
    }

    const result = ResourceUtils.instantiateResource(rawResourceWithEmbedded, false);

    expect(result instanceof CarItem).toBeTruthy();
    expect(isEmpty(result['garage'])).toBeTruthy('embedded resource garage should be EMPTY');
    expect(isEmpty(result['inspections'])).toBeTruthy('embedded resource inspections should be EMPTY');
  });

  it('INSTANTIATE_RESOURCE embedded Resources are EMPTY when _embedded resource is UNDEFINED', () => {
    const rawResourceWithEmbedded = {
      id: '123',
      color: 'red',
      brand: 'Volkswagen',
      model: 'Golf',
      garageId: '456',
      _links: {
        self: {
          href: 'http://localhost:8080/api/v1/cars/123'
        },
        inspections: {
          href: 'http://localhost:8080/api/v1/cars/123/inspections'
        },
        garage: {
          href: 'http://localhost:8080/api/v1/garages/456'
        }
      },
      _embedded: undefined
    };

    @HateoasResource('garages')
    class GarageItemEmb extends Resource {
      public id: string;
      public location: string;
      public surface: string;
      public city: string;
    }

    @HateoasResource('inspections')
    class InspectionItemEmb extends Resource {
      public id: string;
      public name: string;
      public date: string;
      public carId: string;
    }

    @HateoasResource('cars')
    class CarItem extends Resource {
      public id: string;
      public color: string;
      public brand: string;
      public model: string;
      public garageId: string;
      public garage: GarageItemEmb;
      public inspections: InspectionItemEmb[];
    }

    const result = ResourceUtils.instantiateResource(rawResourceWithEmbedded, false);

    expect(result instanceof CarItem).toBeTruthy();
    expect(isEmpty(result['garage'])).toBeTruthy('embedded resource garage should be EMPTY');
    expect(isEmpty(result['inspections'])).toBeTruthy('embedded resource inspections should be EMPTY');
  });

  it('INSTANTIATE_RESOURCE embedded resources are EMPTY when _embedded resource is NULL', () => {
    const rawResourceWithEmbedded = {
      id: '123',
      color: 'red',
      brand: 'Volkswagen',
      model: 'Golf',
      garageId: '456',
      _links: {
        self: {
          href: 'http://localhost:8080/api/v1/cars/123'
        },
        inspections: {
          href: 'http://localhost:8080/api/v1/cars/123/inspections'
        },
        garage: {
          href: 'http://localhost:8080/api/v1/garages/456'
        }
      },
      _embedded: null
    };

    @HateoasResource('garages')
    class GarageItemEmb extends Resource {
      public id: string;
      public location: string;
      public surface: string;
      public city: string;
    }

    @HateoasResource('inspections')
    class InspectionItemEmb extends Resource {
      public id: string;
      public name: string;
      public date: string;
      public carId: string;
    }

    @HateoasResource('cars')
    class CarItem extends Resource {
      public id: string;
      public color: string;
      public brand: string;
      public model: string;
      public garageId: string;
      public garage: GarageItemEmb;
      public inspections: InspectionItemEmb[];
    }

    const result = ResourceUtils.instantiateResource(rawResourceWithEmbedded, false);

    expect(result instanceof CarItem).toBeTruthy();
    expect(isEmpty(result['garage'])).toBeTruthy('embedded resource garage should be EMPTY');
    expect(isEmpty(result['inspections'])).toBeTruthy('embedded resource inspections should be EMPTY');
  });


  it('INSTANTIATE_RESOURCE PROJECTION define resource type should be case insensitive #1', () => {

    @HateoasResource('testResource')
    class CaseSensitiveResource1 extends Resource {

      // tslint:disable-next-line:variable-name
      _links = {
        self: {
          href: 'http://localhost:8080/api/v1/testResource/1'
        },
        testResource: {
          href: 'http://localhost:8080/api/v1/testResource/1'
        }
      };

    }

    const result = ResourceUtils.instantiateResource(rawCaseSensitiveResource, true);
    expect(result instanceof CaseSensitiveResource1).toBeTrue();
  });

  it('INSTANTIATE_RESOURCE PROJECTION define resource type should be case insensitive #2', () => {

    @HateoasResource('testresource')
    class CaseSensitiveResource2 extends Resource {

      // tslint:disable-next-line:variable-name
      _links = {
        self: {
          href: 'http://localhost:8080/api/v1/testResource/1'
        },
        testResource: {
          href: 'http://localhost:8080/api/v1/testResource/1'
        }
      };

    }

    const result = ResourceUtils.instantiateResource(rawCaseSensitiveResource, true);
    expect(result instanceof CaseSensitiveResource2).toBeTrue();
  });

  it('INSTANTIATE_RESOURCE PROJECTION define resource type should be case insensitive #3', () => {

    @HateoasResource('TESTRESOURCE')
    class CaseSensitiveResource3 extends Resource {

      // tslint:disable-next-line:variable-name
      _links = {
        self: {
          href: 'http://localhost:8080/api/v1/testResource/1'
        },
        testResource: {
          href: 'http://localhost:8080/api/v1/testResource/1'
        }
      };

    }

    const result = ResourceUtils.instantiateResource(rawCaseSensitiveResource, true);
    expect(result instanceof CaseSensitiveResource3).toBeTrue();
  });

  it('INSTANTIATE_RESOURCE PROJECTION define resource type should be case insensitive #4', () => {

    @HateoasResource('tEsTrEsOuRce')
    class CaseSensitiveResource4 extends Resource {

      // tslint:disable-next-line:variable-name
      _links = {
        self: {
          href: 'http://localhost:8080/api/v1/testResource/1'
        },
        testResource: {
          href: 'http://localhost:8080/api/v1/testResource/1'
        }
      };

    }

    const result = ResourceUtils.instantiateResource(rawCaseSensitiveResource, true);
    expect(result instanceof CaseSensitiveResource4).toBeTrue();
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
    expect(ResourceUtils.instantiateResourceCollection({
      _links: 'not_object',
      _embedded: {someVal: 'test'}
    })).toBeNull();
  });

  it('INSTANTIATE_COLLECTION_RESOURCE should return "null" when passed payload._embedded is null', () => {
    expect(ResourceUtils.instantiateResourceCollection({_embedded: null, _links: {someVal: 'test'}})).toBeNull();
  });

  it('INSTANTIATE_COLLECTION_RESOURCE should return "null" when passed payload._embedded is undefined', () => {
    expect(ResourceUtils.instantiateResourceCollection({_embedded: undefined, _links: {someVal: 'test'}})).toBeNull();
  });

  it('INSTANTIATE_COLLECTION_RESOURCE should return "null" when passed payload._embedded is not object', () => {
    expect(ResourceUtils.instantiateResourceCollection({
      _embedded: 'not_object',
      _links: {someVal: 'test'}
    })).toBeNull();
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

  it('INSTANTIATE_COLLECTION_RESOURCE should create resource collections with _templates', () => {
    const result = ResourceUtils.instantiateResourceCollection(rawHalFormsResourceCollection);

    expect(result).toBeDefined();
    expect(result instanceof ResourceCollection).toBe(true);
    expect(result.resources).toBeDefined();
    expect(result.resources.length).toBe(2);
    expect(result.resources[0] instanceof Resource).toBe(true);
    expect(result.resources[0]['text']).toBe('hello world');
    expect(result.resources[1] instanceof Resource).toBe(true);
    expect(result.resources[1]['text']).toBe('Second object');
    expect(result['_templates']).toBeDefined();
    expect(result.hasTemplate('default')).toBeTrue();
  });

  it('INSTANTIATE_COLLECTION_RESOURCE should copy root _links object', () => {
    const result = ResourceUtils.instantiateResourceCollection(rawResourceCollection);

    expect(result).toBeDefined();
    expect(result['_links']).toBeDefined();
    expect(result['_links']).toEqual(rawResourceCollection._links);
  });

  it('INSTANTIATE_COLLECTION_RESOURCE should return null when _embedded not defined and embeddedOptional is FALSE', () => {
    spyOn(LibConfig, 'getConfig').and.returnValue({
      ...LibConfig.DEFAULT_CONFIG,
      halFormat: {
        collections: {
          embeddedOptional: false
        }
      }
    });

    const result = ResourceUtils.instantiateResourceCollection(rawEmptyResourceCollection);

    expect(result).toBeNull();
  });

  it('INSTANTIATE_COLLECTION_RESOURCE should create empty resource collections when _embedded not defined and embeddedOptional is TRUE',
    () => {
      spyOn(LibConfig, 'getConfig').and.returnValue({
        ...LibConfig.DEFAULT_CONFIG,
        halFormat: {
          collections: {
            embeddedOptional: true
          }
        }
      });

      const result = ResourceUtils.instantiateResourceCollection(rawEmptyResourceCollection);

      expect(result).toBeDefined();
      expect(result.resources).toEqual([]);
      expect(result['_links']).toBeDefined();
      expect(result['_links']).toEqual(rawEmptyResourceCollection._links);
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
    expect(ResourceUtils.instantiatePagedResourceCollection({
      _links: undefined,
      _embedded: {someVal: 'test'}
    })).toBeNull();
  });

  it('INSTANTIATE_PAGED_COLLECTION_RESOURCE should return "null" when passed payload._links is not object', () => {
    expect(ResourceUtils.instantiatePagedResourceCollection({
      _links: 'not_object',
      _embedded: {someVal: 'test'}
    })).toBeNull();
  });

  it('INSTANTIATE_PAGED_COLLECTION_RESOURCE should return "null" when passed payload._embedded is null', () => {
    expect(ResourceUtils.instantiatePagedResourceCollection({_embedded: null, _links: {someVal: 'test'}})).toBeNull();
  });

  it('INSTANTIATE_PAGED_COLLECTION_RESOURCE should return "null" when passed payload._embedded is undefined', () => {
    expect(ResourceUtils.instantiatePagedResourceCollection({
      _embedded: undefined,
      _links: {someVal: 'test'}
    })).toBeNull();
  });

  it('INSTANTIATE_PAGED_COLLECTION_RESOURCE should return "null" when passed payload._embedded is not object', () => {
    expect(ResourceUtils.instantiatePagedResourceCollection({
      _embedded: 'not_object',
      _links: {someVal: 'test'}
    })).toBeNull();
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

  it('INSTANTIATE_PAGED_COLLECTION_RESOURCE should create paged resource collections with _templates', () => {
    const result = ResourceUtils.instantiatePagedResourceCollection({...rawHalFormsPagedResourceCollection, page: null});

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
    expect(result['_templates']).toBeDefined();
    expect(result.hasTemplate('default')).toBeTrue();
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

  it('INSTANTIATE_PAGED_COLLECTION_RESOURCE should return null when _embedded not defined and embeddedOptional is FALSE', () => {
    spyOn(LibConfig, 'getConfig').and.returnValue({
      ...LibConfig.DEFAULT_CONFIG,
      halFormat: {
        collections: {
          embeddedOptional: false
        }
      }
    });

    const result = ResourceUtils.instantiatePagedResourceCollection(rawEmptyPagedResourceCollection);

    expect(result).toBeNull();
  });

  it('INSTANTIATE_PAGED_COLLECTION_RESOURCE should create empty resource collections when _embedded not defined and embeddedOptional is TRUE',
    () => {
      spyOn(LibConfig, 'getConfig').and.returnValue({
        ...LibConfig.DEFAULT_CONFIG,
        halFormat: {
          collections: {
            embeddedOptional: true
          }
        }
      });

      const result = ResourceUtils.instantiatePagedResourceCollection(rawEmptyPagedResourceCollection);

      expect(result).toBeDefined();
      expect(result.resources).toEqual([]);
      expect(result['_links']).toBeDefined();
      expect(result['_links']).toEqual(rawEmptyPagedResourceCollection._links);
      expect(result instanceof PagedResourceCollection).toBe(true);
      expect(result.pageNumber).toBe(rawEmptyPagedResourceCollection.page.number);
      expect(result.pageSize).toBe(rawEmptyPagedResourceCollection.page.size);
      expect(result.totalElements).toBe(rawEmptyPagedResourceCollection.page.totalElements);
      expect(result.totalPages).toBe(rawEmptyPagedResourceCollection.page.totalPages);
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
    spyOn(LibConfig, 'getConfig').and.returnValue({
      ...LibConfig.DEFAULT_CONFIG,
      halFormat: {
        json: {
          convertEmptyObjectToNull: true
        }
      }
    });

    expect(ResourceUtils.resolveValues({body: {}})).toBeNull();
  });

  it('RESOLVE_VALUES should return the empty value when passed requestBody.body is empty object', () => {
    spyOn(LibConfig, 'getConfig').and.returnValue({
      ...LibConfig.DEFAULT_CONFIG,
      halFormat: {
        json: {
          convertEmptyObjectToNull: false
        }
      }
    });

    expect(ResourceUtils.resolveValues({body: {}})).toEqual({});
  });

  it('RESOLVE_VALUES should return the empty value when passed requestBody.body is empty array', () => {
    expect(ResourceUtils.resolveValues({body: []})).toEqual([]);
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

  it('RESOLVE_VALUES should generate resource link for object that has Resource properties', () => {
    expect(ResourceUtils.resolveValues({
      body: {
        name: 'test',
        obj: {
          simple: 'test'
        },
        resource: rawResource
      }
    })).toEqual({
      name: 'test',
      obj: {
        simple: 'test'
      },
      resource: 'http://localhost:8080/api/v1/resource/1'
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

  it('RESOLVE_VALUES INNER RESOURCE OBJECT should convert to resource self link', () => {
    expect(ResourceUtils.resolveValues({
      body: {
        name: 'test',
        someObject: {
          innerObject: {
            innerResource: rawResource
          }
        }
      }
    })).toEqual({
      name: 'test',
      someObject: {
        innerObject: {
          innerResource: rawResource._links.self.href
        }
      }
    });
  });

  it('RESOLVE_VALUES DATE OBJECT should pass as Data object', () => {
    const dateToTest = new Date();
    expect(ResourceUtils.resolveValues({
      body: {
        name: 'test',
        someObject: {
          dateObj: dateToTest
        }
      }
    })).toEqual({
      name: 'test',
      someObject: {
        dateObj: dateToTest
      }
    });
  });

  it('RESOLVE_VALUES return relations as simple objects when pass Include.RESOURCES_REL_AS_OBJECTS', () => {
    expect(ResourceUtils.resolveValues({
      body: {
        name: 'test',
        someObject: {
          innerObject: {
            innerResource: rawResource
          }
        }
      },
      valuesOption: {include: Include.REL_RESOURCES_AS_OBJECTS}
    })).toEqual({
      name: 'test',
      someObject: {
        innerObject: {
          innerResource: rawResource
        }
      }
    });
  });

  it('RESOLVE_VALUES return relations as simple objects with array when pass Include.RESOURCES_REL_AS_OBJECTS', () => {
    expect(ResourceUtils.resolveValues({
      body: {
        name: 'test',
        _embedded: [
          {
            someObject: {
              innerObject: {
                innerResource: rawResource
              }
            }
          }
        ]
      },
      valuesOption: {include: Include.REL_RESOURCES_AS_OBJECTS}
    })).toEqual({
      name: 'test',
      _embedded: [
        {
          someObject: {
            innerObject: {
              innerResource: rawResource
            }
          }
        }
      ]
    });
  });

  it('RESOLVE_VALUES return relations as simple objects with nulls when pass RESOURCES_REL_AS_OBJECTS and NULL_VALUES', () => {
    expect(ResourceUtils.resolveValues({
      body: {
        name: 'test',
        value: null,
        _embedded: [
          {
            someObject: {
              innerObject: {
                innerResource: rawResource
              }
            }
          }
        ]
      },
      valuesOption: {include: [Include.REL_RESOURCES_AS_OBJECTS, Include.NULL_VALUES]}
    })).toEqual({
      name: 'test',
      value: null,
      _embedded: [
        {
          someObject: {
            innerObject: {
              innerResource: rawResource
            }
          }
        }
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

  it('FILL_PROJECTION_NAME_FROM_RESOURCE_TYPE should return options as \'undefined\' when resource type and options are \'null\' ', () => {
    const options = ResourceUtils.fillProjectionNameFromResourceType(null, null);

    expect(options).toBeUndefined();
  });

  it('FILL_PROJECTION_NAME_FROM_RESOURCE_TYPE should return options as \'undefined\' ' +
    'when resource type and options are \'undefined\' ', () => {
    const options = ResourceUtils.fillProjectionNameFromResourceType(undefined, undefined);

    expect(options).toBeUndefined();
  });

  it('FILL_PROJECTION_NAME_FROM_RESOURCE_TYPE should return options as IS when resource type has not __projectionName__ ', () => {
    const options = ResourceUtils.fillProjectionNameFromResourceType(SimpleResource, {params: {test: 'ololo'}});

    expect(options).toBeDefined();
    expect(options.params).toBeDefined();
    expect(options.params.test).toBeDefined();
    expect(options.params.test).toEqual('ololo');
  });

  it('FILL_PROJECTION_NAME_FROM_RESOURCE_TYPE should return options with projection param ' +
    'when resource type has __projectionName__ ', () => {
    const options = ResourceUtils.fillProjectionNameFromResourceType(SimpleResourceProjection, {params: {test: 'ololo'}});

    expect(options).toBeDefined();
    expect(options.params).toBeDefined();
    expect(options.params.test).toBeDefined();
    expect(options.params.test).toEqual('ololo');
    expect(options.params.projection).toBeDefined();
    expect(options.params.projection).toEqual('simpleProjection');
  });

  it('FILL_PROJECTION_NAME_FROM_RESOURCE_TYPE should replace options param projection with projection param ' +
    'from resource type __projectionName__ ', () => {
    const options = ResourceUtils.fillProjectionNameFromResourceType(SimpleResourceProjection, {
      params: {
        test: 'ololo',
        projection: 'testProjection'
      }
    });

    expect(options).toBeDefined();
    expect(options.params).toBeDefined();
    expect(options.params.test).toBeDefined();
    expect(options.params.test).toEqual('ololo');
    expect(options.params.projection).toBeDefined();
    expect(options.params.projection).toEqual('simpleProjection');
  });

  it('FILL_PROJECTION_NAME_FROM_RESOURCE_TYPE should NOT replace options param projection ' +
    'when resource type has not __projectionName__', () => {
    const options = ResourceUtils.fillProjectionNameFromResourceType(SimpleResource, {
      params: {
        test: 'ololo',
        projection: 'testProjection'
      }
    });

    expect(options).toBeDefined();
    expect(options.params).toBeDefined();
    expect(options.params.test).toBeDefined();
    expect(options.params.test).toEqual('ololo');
    expect(options.params.projection).toBeDefined();
    expect(options.params.projection).toEqual('testProjection');
  });

});
