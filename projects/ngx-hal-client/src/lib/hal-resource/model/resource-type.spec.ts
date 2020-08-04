import { isCollectionResource, isEmbeddedResource, isPagedCollectionResource, isResource } from './resource-type';

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
    const result = isEmbeddedResource({
      _links: {}
    });

    expect(result).toBeTrue();
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
    const result = isEmbeddedResource({});

    expect(result).toBeFalse();
  });


  it('object IS NOT EMBEDDED_RESOURCE with null object', () => {
    const result = isEmbeddedResource(null);

    expect(result).toBeFalse();
  });

  it('object IS NOT EMBEDDED_RESOURCE with undefined object', () => {
    const result = isEmbeddedResource(undefined);

    expect(result).toBeFalse();
  });

  it('object IS RESOURCE with _links object WITH self link', () => {
    const result = isResource({
      _links: {
        self: {
          href: 'http://localhost:8080/api/v1/self/1'
        }
      }
    });

    expect(result).toBeTrue();
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

  it('object IS COLLECTION RESOURCE with _embedded object and WITHOUT page object', () => {
    const result = isCollectionResource({
      _embedded: {}
    });

    expect(result).toBeTrue();
  });

  it('object IS NOT COLLECTION RESOURCE with empty object', () => {
    const result = isCollectionResource({});

    expect(result).toBeFalse();
  });


  it('object IS NOT COLLECTION RESOURCE with null object', () => {
    const result = isCollectionResource(null);

    expect(result).toBeFalse();
  });

  it('object IS NOT COLLECTION RESOURCE with undefined object', () => {
    const result = isCollectionResource(undefined);

    expect(result).toBeFalse();
  });

  it('object IS NOT COLLECTION RESOURCE with _embedded object and WITH page object', () => {
    const result = isCollectionResource({
      _embedded: {},
      page: {}
    });

    expect(result).toBeFalse();
  });


  it('object IS PAGED COLLECTION RESOURCE with _embedded AND page object', () => {
    const result = isPagedCollectionResource({
      _embedded: {},
      page: {}
    });

    expect(result).toBeTrue();
  });

  it('object IS NOT PAGED COLLECTION RESOURCE with _embedded AND WITHOUT page object', () => {
    const result = isPagedCollectionResource({
      _embedded: {}
    });

    expect(result).toBeFalse();
  });

  it('object IS NOT PAGED COLLECTION RESOURCE WITHOUT _embedded AND WITH page object', () => {
    const result = isPagedCollectionResource({
      page: {}
    });

    expect(result).toBeFalse();
  });

  it('object IS NOT PAGED COLLECTION RESOURCE with empty object', () => {
    const result = isPagedCollectionResource({});

    expect(result).toBeFalse();
  });

  it('object IS NOT PAGED COLLECTION RESOURCE with null object', () => {
    const result = isPagedCollectionResource(null);

    expect(result).toBeFalse();
  });

  it('object IS NOT PAGED COLLECTION RESOURCE with undefined object', () => {
    const result = isPagedCollectionResource(undefined);

    expect(result).toBeFalse();
  });

});
