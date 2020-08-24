import { AbstractResourceIdentifiable } from './abstract-resource-identifiable';

// tslint:disable:variable-name
// tslint:disable:no-string-literal
class TestResourceIdentifiable extends AbstractResourceIdentifiable {
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

describe('ResourceIdentifiable', () => {
  let resourceIdentifiable: AbstractResourceIdentifiable;

  beforeEach(() => {
    resourceIdentifiable = new TestResourceIdentifiable();
  });

  it('should throw error when _links object is empty', () => {
    expect(() => {
      resourceIdentifiable['_links'] = {};
      resourceIdentifiable.getRelationLink('any');
    }).toThrowError(`Resource links is empty, can't to get relation 'any'`);
  });

  it('should throw error when _links object is null', () => {
    expect(() => {
      resourceIdentifiable['_links'] = null;
      resourceIdentifiable.getRelationLink('any');
    }).toThrowError(`Resource links is empty, can't to get relation 'any'`);
  });

  it('should throw error when _links object is undefined', () => {
    expect(() => {
      resourceIdentifiable['_links'] = undefined;
      resourceIdentifiable.getRelationLink('any');
    }).toThrowError(`Resource links is empty, can't to get relation 'any'`);
  });

  it('should throw error when try to add relation that does not exist', () => {
    expect(() => resourceIdentifiable.getRelationLink('unknown'))
      .toThrowError(`Resource relation with name 'unknown' not found`);
  });

  it('should throw error when pass relationName as null', () => {
    expect(() => resourceIdentifiable.getRelationLink(null))
      .toThrowError(`Resource relation with name 'null' not found`);
  });

  it('should throw error when pass relationName as undefined', () => {
    expect(() => resourceIdentifiable.getRelationLink(undefined))
      .toThrowError(`Resource relation with name 'undefined' not found`);
  });

  it('should throw error when passed relation link href is empty', () => {
    expect(() => resourceIdentifiable.getRelationLink('badEmptyRelation'))
      .toThrowError(`Resource relation with name 'badEmptyRelation' not found`);
  });

  it('should throw error when passed relation link href is null', () => {
    expect(() => resourceIdentifiable.getRelationLink('badNullRelation'))
      .toThrowError(`Resource relation with name 'badNullRelation' not found`);
  });

  it('should throw error when passed relation link href is undefined', () => {
    expect(() => resourceIdentifiable.getRelationLink('badUndefinedRelation'))
      .toThrowError(`Resource relation with name 'badUndefinedRelation' not found`);
  });

  it('should return relation link by relationName', () => {
    const relationLink = resourceIdentifiable.getRelationLink('product');

    expect(relationLink).toBeDefined();
    expect(relationLink.href).toBe('http://localhost:8080/api/v1/product/1');
  });

});
