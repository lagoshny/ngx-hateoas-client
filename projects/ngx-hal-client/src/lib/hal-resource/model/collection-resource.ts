import { ResourceIdentifiable } from './resource-identifiable';
import { BaseResource } from './base-resource';

// interface EmbeddedResources<T extends ResourceIdentifiable> {
//   [key: string]: Array<T>;
// }

export class CollectionResource<T extends BaseResource> extends ResourceIdentifiable {

  // public _embedded: EmbeddedResources<T>;

  public resources: Array<T> = [];

  constructor(that?: CollectionResource<T>) {
    super();
    if (that) {
      this._links = that._links;
      this.resources = that.resources;
    }
  }

}
