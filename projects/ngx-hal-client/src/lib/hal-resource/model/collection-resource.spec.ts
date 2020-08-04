/* tslint:disable:no-string-literal */
import { CollectionResource } from './collection-resource';
import { SimpleCollectionResource } from './resources.test';

describe('CollectionResource', () => {

  it('should create empty collection resource object', () => {
    const collectionResource = new CollectionResource();

    expect(collectionResource.resources.length).toBe(0);
    expect(collectionResource['_links']).toBe(undefined);
  });

  it('should copy data from passed collection resource object', () => {
    const existResource = new SimpleCollectionResource();
    const collectionResource = new CollectionResource(existResource);

    expect(collectionResource.resources.length).toBe(1);
    expect(collectionResource['_links']).toBeDefined();
    expect(collectionResource['_links'].self.href).toBe('http://localhost:8080/api/v1/collectionResource/1');
  });

});
