import { ResourceIdentifiable } from './resource-identifiable';
import { BaseResource } from './base-resource';

/**
 * Represent collection of resources without pagination.
 *
 * If you need pagination, consider {@see PagedResourceCollection}.
 */
export class CollectionResource<T extends BaseResource> extends ResourceIdentifiable {

  public resources: Array<T> = [];

  /**
   * Create collection resource.
   *
   * @param that <b>not required</b> if present, it used as copy constructor
   */
  constructor(that?: CollectionResource<T>) {
    super();
    if (that) {
      this._links = that._links;
      this.resources = that.resources;
    }
  }

}
