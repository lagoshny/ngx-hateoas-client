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

describe('AbstractResource', () => {
  let abstractResource: AbstractResource;

  beforeEach(() => {
    abstractResource = new TestAbstractResource();
  });

  it('should throw error when _links object is empty', () => {
    expect(() => {
      abstractResource['_links'] = {};
      abstractResource.getRelationLink('any');
    }).toThrowError(`Resource links is empty, can't to get relation 'any'`);
  });

  it('should throw error when _links object is null', () => {
    expect(() => {
      abstractResource['_links'] = null;
      abstractResource.getRelationLink('any');
    }).toThrowError(`Resource links is empty, can't to get relation 'any'`);
  });

  it('should throw error when _links object is undefined', () => {
    expect(() => {
      abstractResource['_links'] = undefined;
      abstractResource.getRelationLink('any');
    }).toThrowError(`Resource links is empty, can't to get relation 'any'`);
  });

  it('should throw error when try to add relation that does not exist', () => {
    expect(() => abstractResource.getRelationLink('unknown'))
      .toThrowError(`Resource relation with name 'unknown' not found`);
  });

  it('should throw error when pass relationName as null', () => {
    expect(() => abstractResource.getRelationLink(null))
      .toThrowError(`Resource relation with name 'null' not found`);
  });

  it('should throw error when pass relationName as undefined', () => {
    expect(() => abstractResource.getRelationLink(undefined))
      .toThrowError(`Resource relation with name 'undefined' not found`);
  });

  it('should throw error when passed relation link href is empty', () => {
    expect(() => abstractResource.getRelationLink('badEmptyRelation'))
      .toThrowError(`Resource relation with name 'badEmptyRelation' not found`);
  });

  it('should throw error when passed relation link href is null', () => {
    expect(() => abstractResource.getRelationLink('badNullRelation'))
      .toThrowError(`Resource relation with name 'badNullRelation' not found`);
  });

  it('should throw error when passed relation link href is undefined', () => {
    expect(() => abstractResource.getRelationLink('badUndefinedRelation'))
      .toThrowError(`Resource relation with name 'badUndefinedRelation' not found`);
  });

  it('should return relation link by relationName', () => {
    const relationLink = abstractResource.getRelationLink('product');

    expect(relationLink).toBeDefined();
    expect(relationLink.href).toBe('http://localhost:8080/api/v1/product/1');
  });

});
