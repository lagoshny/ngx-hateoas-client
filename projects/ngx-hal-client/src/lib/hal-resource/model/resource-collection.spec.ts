/* tslint:disable:no-string-literal */
import { ResourceCollection } from './resource-collection';
import { SimpleResourceCollection } from './resources.test';

describe('ResourceCollection', () => {

  it('should create empty resource collection object', () => {
    const resourceCollection = new ResourceCollection();

    expect(resourceCollection.resources.length).toBe(0);
    expect(resourceCollection['_links']).toBe(undefined);
  });

  it('should copy data from passed resource collection object', () => {
    const existResource = new SimpleResourceCollection();
    const resourceCollection = new ResourceCollection(existResource);

    expect(resourceCollection.resources.length).toBe(1);
    expect(resourceCollection['_links']).toBeDefined();
    expect(resourceCollection['_links'].self.href).toBe('http://localhost:8080/api/v1/resourceCollection/1');
  });

});
