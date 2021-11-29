import { AbstractResource } from './abstract-resource';

// tslint:disable:variable-name
// tslint:disable:no-string-literal
class TestAbstractResource extends AbstractResource {
  _links = {
    product: {
      href: 'http://localhost:8080/api/v1/product/1'
    },
    badEmptyRelation: {
      href: ''
    },
    badNullRelation: {
      href: null
    },
    badUndefinedRelation: {
      href: undefined
    }
  };
}

class TestLinkAbstractResource extends AbstractResource {
  _links = {
    self: {
      href: "http://localhost:8080/api/v1/linkResource/1"
    }
  }
}

class TestEmptyLinkAbstractResource extends AbstractResource{
  _links = {}
}

describe('AbstractResource', () => {
  let abstractResource: AbstractResource;
  let linkAbstractResource: AbstractResource;
  let emptyLinkAbstractResource: AbstractResource;

  beforeEach(() => {
    abstractResource = new TestAbstractResource();
    linkAbstractResource = new TestLinkAbstractResource();
    emptyLinkAbstractResource = new TestEmptyLinkAbstractResource();
  });

  it('should throw error when _links object is empty', () => {
    expect(() => {
      abstractResource['_links'] = {};
      abstractResource.getRelationLink('any');
    }).toThrowError(`Resource 'TestAbstractResource' relation links are empty, can not to get relation with the name 'any'.`);
  });

  it('should throw error when _links object is null', () => {
    expect(() => {
      abstractResource['_links'] = null;
      abstractResource.getRelationLink('any');
    }).toThrowError(`Resource 'TestAbstractResource' relation links are empty, can not to get relation with the name 'any'.`);
  });

  it('should throw error when _links object is undefined', () => {
    expect(() => {
      abstractResource['_links'] = undefined;
      abstractResource.getRelationLink('any');
    }).toThrowError(`Resource 'TestAbstractResource' relation links are empty, can not to get relation with the name 'any'.`);
  });

  it('should throw error when try to add relation that does not exist', () => {
    expect(() => abstractResource.getRelationLink('unknown'))
      .toThrowError(`Resource 'TestAbstractResource' has not relation link with the name 'unknown'.`);
  });

  it('should throw error when pass relationName as null', () => {
    expect(() => abstractResource.getRelationLink(null))
      .toThrowError(`Resource 'TestAbstractResource' has not relation link with the name 'null'.`);
  });

  it('should throw error when pass relationName as undefined', () => {
    expect(() => abstractResource.getRelationLink(undefined))
      .toThrowError(`Resource 'TestAbstractResource' has not relation link with the name 'undefined'.`);
  });

  it('should throw error when passed relation link href is empty', () => {
    expect(() => abstractResource.getRelationLink('badEmptyRelation'))
      .toThrowError(`Resource 'TestAbstractResource' has not relation link with the name 'badEmptyRelation'.`);
  });

  it('should throw error when passed relation link href is null', () => {
    expect(() => abstractResource.getRelationLink('badNullRelation'))
      .toThrowError(`Resource 'TestAbstractResource' has not relation link with the name 'badNullRelation'.`);
  });

  it('should throw error when passed relation link href is undefined', () => {
    expect(() => abstractResource.getRelationLink('badUndefinedRelation'))
      .toThrowError(`Resource 'TestAbstractResource' has not relation link with the name 'badUndefinedRelation'.`);
  });

  it('should return relation link by relationName', () => {
    const relationLink = abstractResource.getRelationLink('product');

    expect(relationLink).toBeDefined();
    expect(relationLink.href).toBe('http://localhost:8080/api/v1/product/1');
  });

  it('should return false if relation link is not present', () => {
    expect(linkAbstractResource.hasRelation('products')).toBeFalse();
  });

  it('should return true if relation link is present',  () => {
    expect(linkAbstractResource.hasRelation('self')).toBeTrue();
  });

  it('should return false if relation links are empty', () => {
    expect(emptyLinkAbstractResource.hasRelation('self')).toBeFalse();
    expect(emptyLinkAbstractResource.hasRelation('products')).toBeFalse();
  });

});
