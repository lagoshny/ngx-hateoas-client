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
  protected getRelationLink(relationName: string): LinkData {
    if (isEmpty(this._links)) {
      throw new Error(`Resource '${ this.constructor.name }' relation links are empty, can not to get relation with the name '${ relationName }'.`);
    }

    const relationLink = this._links[relationName];
    if (isEmpty(relationLink) || isEmpty(relationLink.href)) {
      throw new Error(`Resource '${ this.constructor.name }' has not relation link with the name '${ relationName }'.`);
    }

    return relationLink;
  }

}
