import { Link, LinkData } from './declarations';
import * as _ from 'lodash';
import { throwError } from 'rxjs';

/**
 *  Identifies resource classes.
 */
export abstract class ResourceIdentifiable {

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
    if (_.isEmpty(this._links)) {
      throw Error(`Resource links is empty, can't to get relation: ${ relationName }`);
    }

    const relationLink = this._links[relationName];
    if (_.isEmpty(relationLink) || _.isEmpty(relationLink.href)) {
      throw Error('No resource relation found');
    }

    return relationLink;
  }

}
