import { ResourceIdentifiable } from './resource-identifiable';

// tslint:disable:variable-name
// tslint:disable:no-string-literal
class TestResourceIdentifiable extends ResourceIdentifiable {
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
  let resourceIdentifiable: ResourceIdentifiable;

  beforeEach(() => {
    resourceIdentifiable = new TestResourceIdentifiable();
  });

  it('should throw error when _links object is empty', () => {
    try {
      resourceIdentifiable['_links'] = {};
      resourceIdentifiable.getRelationLink('any');
    } catch (error) {
      expect(error.message).toBe('Resource links is empty, can\'t to get relation: any');
    }
  });

  it('should throw error when _links object is null', () => {
    try {
      resourceIdentifiable['_links'] = null;
      resourceIdentifiable.getRelationLink('any');
    } catch (error) {
      expect(error.message).toBe('Resource links is empty, can\'t to get relation: any');
    }
  });

  it('should throw error when _links object is undefined', () => {
    try {
      resourceIdentifiable['_links'] = undefined;
      resourceIdentifiable.getRelationLink('any');
    } catch (error) {
      expect(error.message).toBe('Resource links is empty, can\'t to get relation: any');
    }
  });

  it('should throw error when try to add relation that does not exist', () => {
    try {
      resourceIdentifiable.getRelationLink('unknown');
    } catch (error) {
      expect(error.message).toBe('No resource relation found');
    }
  });

  it('should throw error when pass relationName as null', () => {
    try {
      resourceIdentifiable.getRelationLink(null);
    } catch (error) {
      expect(error.message).toBe('No resource relation found');
    }
  });

  it('should throw error when pass relationName as undefined', () => {
    try {
      resourceIdentifiable.getRelationLink(undefined);
    } catch (error) {
      expect(error.message).toBe('No resource relation found');
    }
  });

  it('should throw error when passed relation link href is empty', () => {
    try {
      resourceIdentifiable.getRelationLink('badEmptyRelation');
    } catch (error) {
      expect(error.message).toBe('No resource relation found');
    }
  });

  it('should throw error when passed relation link href is null', () => {
    try {
      resourceIdentifiable.getRelationLink('badNullRelation');
    } catch (error) {
      expect(error.message).toBe('No resource relation found');
    }
  });

  it('should throw error when passed relation link href is undefined', () => {
    try {
      resourceIdentifiable.getRelationLink('badUndefinedRelation');
    } catch (error) {
      expect(error.message).toBe('No resource relation found');
    }
  });

  it('should return relation link by relationName', () => {
    const relationLink = resourceIdentifiable.getRelationLink('product');

    expect(relationLink).toBeDefined();
    expect(relationLink.href).toBe('http://localhost:8080/api/v1/product/1');
  });

});
