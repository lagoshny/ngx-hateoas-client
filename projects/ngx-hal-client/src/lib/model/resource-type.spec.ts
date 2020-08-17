import { isResourceCollection, isEmbeddedResource, isPagedResourceCollection, isResource } from './resource-type';
import { rawResourceCollection, rawEmbeddedResource, rawPagedResourceCollection, rawResource } from './resource/resources.test';

describe('ResourceType', () => {

  it('object IS EMBEDDED_RESOURCE with _links object WITHOUT self link', () => {
    const result = isEmbeddedResource({
      _links: {
        someRelation: {
          href: 'http://localhost:8080/api/v1/someRelation/1'
        }
      }
    });

    expect(result).toBeTrue();
  });

  it('object IS EMBEDDED_RESOURCE with empty _links object', () => {
    expect(isEmbeddedResource({_links: {}})).toBeTrue();
  });


  it('object IS NOT EMBEDDED_RESOURCE with _links object WITH self link', () => {
    const result = isEmbeddedResource({
      _links: {
        self: {
          href: 'http://localhost:8080/api/v1/self/1'
        }
      }
    });

    expect(result).toBeFalse();
  });

  it('object IS NOT EMBEDDED_RESOURCE with empty object', () => {
    expect(isEmbeddedResource({})).toBeFalse();
  });

  it('object IS NOT EMBEDDED_RESOURCE with null object', () => {
    expect(isEmbeddedResource(null)).toBeFalse();
  });

  it('object IS NOT EMBEDDED_RESOURCE with undefined object', () => {
    expect(isEmbeddedResource(undefined)).toBeFalse();
  });

  it('resource object IS NOT EMBEDDED_RESOURCE', () => {
    expect(isEmbeddedResource(rawResource)).toBeFalse();
  });

  it('resource collection object IS NOT EMBEDDED_RESOURCE', () => {
    expect(isEmbeddedResource(rawResourceCollection)).toBeFalse();
  });

  it('paged resource collection object IS NOT EMBEDDED_RESOURCE', () => {
    expect(isEmbeddedResource(rawPagedResourceCollection)).toBeFalse();
  });

  it('object IS RESOURCE with _links object WITH self link', () => {
    expect(isResource(rawResource)).toBeTrue();
  });

  it('object IS NOT RESOURCE with empty _links object', () => {
    const result = isResource({
      _links: {}
    });

    expect(result).toBeFalse();
  });

  it('object IS NOT RESOURCE with _links object WITHOUT self link', () => {
    const result = isResource({
      _links: {
        someRelation: {
          href: 'http://localhost:8080/api/v1/someRelation/1'
        }
      }
    });

    expect(result).toBeFalse();
  });

  it('object IS NOT RESOURCE with empty object', () => {
    const result = isResource({});

    expect(result).toBeFalse();
  });

  it('object IS NOT RESOURCE with null object', () => {
    const result = isResource(null);

    expect(result).toBeFalse();
  });

  it('object IS NOT RESOURCE with undefined object', () => {
    const result = isResource(undefined);

    expect(result).toBeFalse();
  });

  it('embedded resource object IS NOT RESOURCE', () => {
    expect(isResource(rawEmbeddedResource)).toBeFalse();
  });

  it('resource collection object IS NOT RESOURCE', () => {
    expect(isResource(rawResourceCollection)).toBeFalse();
  });

  it('paged resource collection object IS NOT RESOURCE', () => {
    expect(isResource(rawPagedResourceCollection)).toBeFalse();
  });

  it('object IS RESOURCE COLLECTION with _embedded object and WITHOUT page object', () => {
    expect(isResourceCollection(rawResourceCollection)).toBeTrue();
  });

  it('object IS NOT RESOURCE COLLECTION with empty object', () => {
    const result = isResourceCollection({});

    expect(result).toBeFalse();
  });


  it('object IS NOT RESOURCE COLLECTION with null object', () => {
    const result = isResourceCollection(null);

    expect(result).toBeFalse();
  });

  it('object IS NOT RESOURCE COLLECTION with undefined object', () => {
    const result = isResourceCollection(undefined);

    expect(result).toBeFalse();
  });

  it('object IS NOT RESOURCE COLLECTION with _embedded object and WITH page object', () => {
    const result = isResourceCollection({
      _embedded: {},
      page: {}
    });

    expect(result).toBeFalse();
  });

  it('embedded resource object IS NOT COLLECTION_RESOURCE', () => {
    expect(isResourceCollection(rawEmbeddedResource)).toBeFalse();
  });

  it('resource object IS NOT COLLECTION_RESOURCE', () => {
    expect(isResourceCollection(rawResource)).toBeFalse();
  });

  it('paged resource collection object IS NOT COLLECTION_RESOURCE', () => {
    expect(isResourceCollection(rawPagedResourceCollection)).toBeFalse();
  });

  it('object IS PAGED RESOURCE COLLECTION with _embedded AND page object', () => {
    expect(isPagedResourceCollection(rawPagedResourceCollection)).toBeTrue();
  });

  it('object IS NOT PAGED RESOURCE COLLECTION with _embedded AND WITHOUT page object', () => {
    const result = isPagedResourceCollection({
      _embedded: {}
    });

    expect(result).toBeFalse();
  });

  it('object IS NOT PAGED RESOURCE COLLECTION WITHOUT _embedded AND WITH page object', () => {
    const result = isPagedResourceCollection({
      page: {}
    });

    expect(result).toBeFalse();
  });

  it('object IS NOT PAGED RESOURCE COLLECTION with empty object', () => {
    const result = isPagedResourceCollection({});

    expect(result).toBeFalse();
  });

  it('object IS NOT PAGED RESOURCE COLLECTION with null object', () => {
    const result = isPagedResourceCollection(null);

    expect(result).toBeFalse();
  });

  it('object IS NOT PAGED RESOURCE COLLECTION with undefined object', () => {
    const result = isPagedResourceCollection(undefined);

    expect(result).toBeFalse();
  });

  it('embedded resource object IS NOT PAGE_COLLECTION_RESOURCE', () => {
    expect(isPagedResourceCollection(rawEmbeddedResource)).toBeFalse();
  });

  it('resource object IS NOT PAGE_COLLECTION_RESOURCE', () => {
    expect(isPagedResourceCollection(rawResource)).toBeFalse();
  });

  it('resource collection object IS NOT PAGE_COLLECTION_RESOURCE', () => {
    expect(isPagedResourceCollection(rawResourceCollection)).toBeFalse();
  });

});
