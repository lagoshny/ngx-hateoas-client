import { Link, LinkData } from '../declarations';
import * as _ from 'lodash';
import { ConsoleLogger } from '../../logger/console-logger';
import { Stage } from '../../logger/stage.enum';

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
      ConsoleLogger.prettyError(`STAGE ${ Stage.PREPARE_URL }`, {
        error: `Resource links is empty, can't to get relation '${ relationName }'`,
        relationName,
        resourceLinks: JSON.stringify(this._links, null, 2)
      });

      throw Error(`Resource links is empty, can't to get relation '${ relationName }'`);
    }

    const relationLink = this._links[relationName];
    if (_.isEmpty(relationLink) || _.isEmpty(relationLink.href)) {
      ConsoleLogger.prettyError(`STAGE ${ Stage.PREPARE_URL }`, {
        error: `Resource relation with name '${ relationName }' not found`,
        relationName,
        resourceLinks: JSON.stringify(this._links, null, 2)
      });

      throw Error(`Resource relation with name '${ relationName }' not found`);
    }

    ConsoleLogger.prettyInfo(`STAGE ${ Stage.PREPARE_URL }`, {
      result: JSON.stringify(relationLink, null, 2),
      relationName,
    });

    return relationLink;
  }

}
