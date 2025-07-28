/* tslint:disable:no-string-literal */
import {SimpleEmbeddedResource} from './resources.test';

describe('EmbeddedResource', () => {

  it('should has not self resource link', () => {
    const embeddedResource = new SimpleEmbeddedResource();
    expect(() => {
      embeddedResource.getRelationLink('self');
    }).toThrowError(`Resource '${embeddedResource.constructor.name}' has not relation link with the name 'self'.`);
  });

});

