import { Link, LinkData } from './declarations';
import * as _ from 'lodash';

/**
 *  Common class that identify resource by links.
 */
export abstract class ResourceIdentifiable {

  /**
   * List of links related with resource.
   */
  protected _links: Link;

  public getRelationLink(relation: string): LinkData {
    if (_.isEmpty(this._links)) {
      throw Error(`Resource links is empty, can't to get relation: ${ relation }`);
    }

    const relationLink = this._links[relation];
    if (_.isEmpty(relationLink) || _.isEmpty(relationLink.href)) {
      throw Error(`No resource relation found`);
    }

    return relationLink;
  }

  // public getRelationLinks(): Link {
  //   if (_.isEmpty(this._links)) {
  //     throw Error(`Resource links is empty, can't to get relation: ${ relation }`);
  //   }
  //
  //   const relationLink = this._links[relation];
  //   if (_.isEmpty(relationLink) || _.isEmpty(relationLink.href)) {
  //     throw Error(`No resource relation found`);
  //   }
  //
  //   return relationLink;
  // }

}
