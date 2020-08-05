/* tslint:disable:no-string-literal */
import { EmbeddedResource } from './embedded-resource';
import { SimpleEmbeddedResource } from './resources.test';

describe('EmbeddedResource', () => {

  it('should has not self resource link', () => {
    try {
      const embeddedResource = new SimpleEmbeddedResource();
      embeddedResource.getRelationLink('self');
    } catch (e) {
      expect(e.message).toBe('No resource relation found');
    }
  });

});

