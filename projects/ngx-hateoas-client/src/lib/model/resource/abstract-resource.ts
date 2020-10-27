import { Link, LinkData } from '../declarations';
import { isEmpty } from 'lodash-es';

/**
 * Abstract impl identifies resource interface.
 */
export abstract class AbstractResource {

  /**
   * List of links related with the resource.
   */
    // tslint:disable-next-line:variable-name
  protected _links: Link;

  /**
   * Get relation link by relation name.
   *
   * @param relationName used to get the specific resource relation link
   * @throws error if no link is found by passed relation name
   */
  public getRelationLink(relationName: string): LinkData {
    if (isEmpty(this._links)) {
      throw new Error(`Resource links is empty, can't to get relation '${ relationName }'`);
    }

    const relationLink = this._links[relationName];
    if (isEmpty(relationLink) || isEmpty(relationLink.href)) {
      throw new Error(`Resource relation with name '${ relationName }' not found`);
    }

    return relationLink;
  }

}
