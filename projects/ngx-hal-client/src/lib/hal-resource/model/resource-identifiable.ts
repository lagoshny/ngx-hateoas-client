export interface Link {
  /**
   * Link name.
   */
  [key: string]: {
    /**
     * Link url.
     */
    href: string;
    /**
     * {@code true} if <b>href</b> has template, {@code false} otherwise.
     */
    templated?: boolean;
  };
}

/**
 *  Common class that identify resource by links.
 */
export abstract class ResourceIdentifiable {

  /**
   * List of links related with resource.
   */
  protected _links: Link;

}
