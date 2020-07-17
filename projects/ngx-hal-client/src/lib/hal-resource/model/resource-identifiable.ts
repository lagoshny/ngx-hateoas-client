export interface Link {
  [key: string]: {
    href: string;
    templated?: boolean;
  };
}


export abstract class ResourceIdentifiable {

  /**
   * List of links related with resource.
   */
  protected _links: Link;

}
