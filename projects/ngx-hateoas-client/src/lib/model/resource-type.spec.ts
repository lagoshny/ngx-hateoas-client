import { describe, expect, it, vi } from 'vitest';
import { isEmbeddedResource, isPagedResourceCollection, isResource, isResourceCollection } from './resource-type';
import {
  rawEmbeddedResource,
  rawEmptyPagedResourceCollection,
  rawEmptyResourceCollection,
  rawPagedResourceCollection,
  rawResource,
  rawResourceCollection
} from './resource/resources.test-utils';
import { LibConfig } from '../config/lib-config';

describe('ResourceType', () => {

  it('object IS EMBEDDED_RESOURCE with _links object WITHOUT self link', () => {
    const result = isEmbeddedResource({
      test: 'Test',
      _links: {
        someRelation: {
          href: 'http://localhost:8080/api/v1/someRelation/1'
        }
      }
    });

    expect(result).toBe(true);
  });

  it('object IS EMBEDDED_RESOURCE with empty _links object', () => {
    expect(isEmbeddedResource({ test: 'Test', _links: {} })).toBe(true);
  });


  it('object IS NOT EMBEDDED_RESOURCE with _links object WITH self link', () => {
    const result = isEmbeddedResource({
      test: 'Test',
      _links: {
        self: {
          href: 'http://localhost:8080/api/v1/self/1'
        }
      }
    });

    expect(result).toBe(false);
  });

  it('object IS NOT EMBEDDED_RESOURCE with empty object', () => {
    expect(isEmbeddedResource({})).toBe(false);
  });

  it('object IS NOT EMBEDDED_RESOURCE with null object', () => {
    expect(isEmbeddedResource(null)).toBe(false);
  });

  it('object IS NOT EMBEDDED_RESOURCE with undefined object', () => {
    expect(isEmbeddedResource(undefined)).toBe(false);
  });

  it('resource object IS NOT EMBEDDED_RESOURCE', () => {
    expect(isEmbeddedResource(rawResource)).toBe(false);
  });

  it('resource collection object IS NOT EMBEDDED_RESOURCE', () => {
    expect(isEmbeddedResource(rawResourceCollection)).toBe(false);
  });

  it('paged resource collection object IS NOT EMBEDDED_RESOURCE', () => {
    expect(isEmbeddedResource(rawPagedResourceCollection)).toBe(false);
  });

  it('object IS RESOURCE with _links object WITH self link', () => {
    expect(isResource(rawResource)).toBe(true);
  });

  it('object IS RESOURCE with _links object WITH self link and _embedded props', () => {
    expect(isResource({
      ...rawResource,
      _embedded: {
        resources: [
          {
            name: 'test'
          }
        ]
      },
    })).toBe(true);
  });

  it('object IS NOT RESOURCE with empty _links object', () => {
    const result = isResource({
      _links: {}
    });

    expect(result).toBe(false);
  });

  it('object IS NOT RESOURCE with _links object WITHOUT self link', () => {
    const result = isResource({
      _links: {
        someRelation: {
          href: 'http://localhost:8080/api/v1/someRelation/1'
        }
      }
    });

    expect(result).toBe(false);
  });

  it('object IS NOT RESOURCE with empty object', () => {
    const result = isResource({});

    expect(result).toBe(false);
  });

  it('object IS NOT RESOURCE with null object', () => {
    const result = isResource(null);

    expect(result).toBe(false);
  });

  it('object IS NOT RESOURCE with undefined object', () => {
    const result = isResource(undefined);

    expect(result).toBe(false);
  });

  it('embedded resource object IS NOT RESOURCE', () => {
    expect(isResource(rawEmbeddedResource)).toBe(false);
  });

  it('resource collection object IS NOT RESOURCE', () => {
    expect(isResource(rawResourceCollection)).toBe(false);
  });

  it('paged resource collection object IS NOT RESOURCE', () => {
    expect(isResource(rawPagedResourceCollection)).toBe(false);
  });

  it('object IS RESOURCE COLLECTION with _embedded object and WITHOUT page object', () => {
    expect(isResourceCollection(rawResourceCollection)).toBe(true);
  });

  it('object IS NOT RESOURCE COLLECTION if contains more props than _embedded and _links', () => {
    expect(isResourceCollection({
      ...rawResourceCollection,
      additionalProp: 'someValue'
    })).toBe(false);
  });

  it('object IS NOT RESOURCE COLLECTION with empty object', () => {
    const result = isResourceCollection({});

    expect(result).toBe(false);
  });


  it('object IS NOT RESOURCE COLLECTION with null object', () => {
    const result = isResourceCollection(null);

    expect(result).toBe(false);
  });

  it('object IS NOT RESOURCE COLLECTION with undefined object', () => {
    const result = isResourceCollection(undefined);

    expect(result).toBe(false);
  });

  it('object IS NOT RESOURCE COLLECTION with _embedded object and WITH page object', () => {
    const result = isResourceCollection({
      _embedded: {},
      page: {}
    });

    expect(result).toBe(false);
  });

  it('embedded resource object IS NOT COLLECTION_RESOURCE', () => {
    expect(isResourceCollection(rawEmbeddedResource)).toBe(false);
  });

  it('resource object IS NOT COLLECTION_RESOURCE', () => {
    expect(isResourceCollection(rawResource)).toBe(false);
  });

  it('paged resource collection object IS NOT COLLECTION_RESOURCE', () => {
    expect(isResourceCollection(rawPagedResourceCollection)).toBe(false);
  });

  it('empty resource collection without _embedded property IS COLLECTION_RESOURCE when embeddedOptional is TRUE', () => {
    vi.spyOn(LibConfig, 'getConfig').mockReturnValue({
      ...LibConfig.DEFAULT_CONFIG,
      halFormat: {
        ...LibConfig.DEFAULT_CONFIG.halFormat,
        collections: {
          embeddedOptional: true
        }
      }
    });

    expect(isResourceCollection(rawEmptyResourceCollection)).toBe(true);
  });

  it('empty resource collection without _embedded property IS NOT COLLECTION_RESOURCE when embeddedOptional is FALSE', () => {
    vi.spyOn(LibConfig, 'getConfig').mockReturnValue({
      ...LibConfig.DEFAULT_CONFIG,
      halFormat: {
        ...LibConfig.DEFAULT_CONFIG.halFormat,
        collections: {
          embeddedOptional: false
        }
      }
    });

    expect(isResourceCollection(rawEmptyResourceCollection)).toBe(false);
  });

  it('object IS PAGED RESOURCE COLLECTION with _embedded AND page object', () => {
    expect(isPagedResourceCollection(rawPagedResourceCollection)).toBe(true);
  });

  it('object IS NOT PAGED RESOURCE COLLECTION if contains more props than _embedded, _links, page', () => {
    expect(isPagedResourceCollection({
      ...rawPagedResourceCollection,
      additionalProp: 'someValue'
    })).toBe(false);
  });

  it('object IS NOT PAGED RESOURCE COLLECTION with _embedded AND WITHOUT page object', () => {
    const result = isPagedResourceCollection({
      _embedded: {}
    });

    expect(result).toBe(false);
  });

  it('object IS NOT PAGED RESOURCE COLLECTION WITHOUT _embedded AND WITH page object', () => {
    const result = isPagedResourceCollection({
      page: {}
    });

    expect(result).toBe(false);
  });

  it('object IS NOT PAGED RESOURCE COLLECTION with empty object', () => {
    const result = isPagedResourceCollection({});

    expect(result).toBe(false);
  });

  it('object IS NOT PAGED RESOURCE COLLECTION with null object', () => {
    const result = isPagedResourceCollection(null);

    expect(result).toBe(false);
  });

  it('object IS NOT PAGED RESOURCE COLLECTION with undefined object', () => {
    const result = isPagedResourceCollection(undefined);

    expect(result).toBe(false);
  });

  it('embedded resource object IS NOT PAGE_COLLECTION_RESOURCE', () => {
    expect(isPagedResourceCollection(rawEmbeddedResource)).toBe(false);
  });

  it('resource object IS NOT PAGE_COLLECTION_RESOURCE', () => {
    expect(isPagedResourceCollection(rawResource)).toBe(false);
  });

  it('resource collection object IS NOT PAGE_COLLECTION_RESOURCE', () => {
    expect(isPagedResourceCollection(rawResourceCollection)).toBe(false);
  });

  it('empty paged resource collection without _embedded property IS PAGE_COLLECTION_RESOURCE when embeddedOptional is TRUE', () => {
    vi.spyOn(LibConfig, 'getConfig').mockReturnValue({
      ...LibConfig.DEFAULT_CONFIG,
      halFormat: {
        ...LibConfig.DEFAULT_CONFIG.halFormat,
        collections: {
          embeddedOptional: true
        }
      }
    });
    expect(isPagedResourceCollection(rawEmptyPagedResourceCollection)).toBe(true);
  });

  it('empty paged resource collection without _embedded property IS NOT PAGE_COLLECTION_RESOURCE when embeddedOptional is FALSE', () => {
    vi.spyOn(LibConfig, 'getConfig').mockReturnValue({
      ...LibConfig.DEFAULT_CONFIG,
      halFormat: {
        ...LibConfig.DEFAULT_CONFIG.halFormat,
        collections: {
          embeddedOptional: false
        }
      }
    });
    expect(isPagedResourceCollection(rawEmptyPagedResourceCollection)).toBe(false);
  });

});
