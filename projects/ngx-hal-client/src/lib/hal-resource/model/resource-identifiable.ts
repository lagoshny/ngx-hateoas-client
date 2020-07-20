import { Link } from './declarations';

/**
 *  Common class that identify resource by links.
 */
export abstract class ResourceIdentifiable {

  /**
   * List of links related with resource.
   */
  protected _links: Link;

}
