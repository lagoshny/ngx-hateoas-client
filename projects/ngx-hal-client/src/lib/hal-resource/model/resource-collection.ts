import { ResourceIdentifiable } from './resource-identifiable';
import { BaseResource } from './base-resource';

// interface EmbeddedResources<T extends ResourceIdentifiable> {
//   [key: string]: Array<T>;
// }

export class ResourceCollection<T extends BaseResource> extends ResourceIdentifiable {

  // public _embedded: EmbeddedResources<T>;

  public resources: Array<T> = [];

}
