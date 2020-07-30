import { ResourceIdentifiable } from './resource-identifiable';
import { BaseResource } from './base-resource';

/**
 * Collection of resources without pagination.
 *
 * If you want to have a pagination {@see PagedResourceCollection}.
 */
export class CollectionResource<T extends BaseResource> extends ResourceIdentifiable {

  public resources: Array<T> = [];

  /**
   * Collection resource constructor.
   * If passed param then it used as a copy constructor.
   *
   * @param that (optional) another collection resource using to copy data from to current object
   */
  constructor(that?: CollectionResource<T>) {
    super();
    if (that) {
      this._links = that._links;
      this.resources = that.resources;
    }
  }

}
