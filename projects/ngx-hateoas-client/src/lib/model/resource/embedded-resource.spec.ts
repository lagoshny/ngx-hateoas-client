/* tslint:disable:no-string-literal */
import { EmbeddedResource } from './embedded-resource';
import { SimpleEmbeddedResource } from './resources.test';

describe('EmbeddedResource', () => {

  it('should has not self resource link', () => {
    expect(() => {
      const embeddedResource = new SimpleEmbeddedResource();
      embeddedResource.getRelationLink('self');
    }).toThrowError(`Resource 'SimpleEmbeddedResource' has not relation link with the name 'self'.`);
  });

});

