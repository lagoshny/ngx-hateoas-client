import {Link, LinkData, Template, Templates} from '../declarations'
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

  protected _templates?: Templates;

  /**
   * Get relation link by relation name.
   *
   * @param relationName used to get the specific resource relation link
   * @throws error if no link is found by passed relation name
   */
  public getRelationLink(relationName: string): LinkData {
    if (isEmpty(this._links)) {
      throw new Error(`Resource '${ this.constructor.name }' relation links are empty, can not to get relation with the name '${ relationName }'.`);
    }

    const relationLink = this._links[relationName];
    if (isEmpty(relationLink) || isEmpty(relationLink.href)) {
      throw new Error(`Resource '${ this.constructor.name }' has not relation link with the name '${ relationName }'.`);
    }

    return relationLink;
  }

  /**
   * Checks if relation link is present.
   *
   * @param relationName used to check for the specified relation name
   * @returns true if link is present, false otherwise
   */
  public hasRelation(relationName: string): boolean {
    if (isEmpty(this._links)) {
      return false;
    } else {
      return !isEmpty(this._links[relationName]);
    }
  }



  /**
   * Checks if template is present.
   *
   * @param templateName used to check for the specified template name
   * @returns true if template is present, false otherwise
   */
  public hasTemplate(templateName: string): boolean {
    if (isEmpty(this._templates)) {
      return false;
    } else {
      return !isEmpty(this._templates[templateName]);
    }
  }

  /**
   * Get template by template name.
   *
   * @param templateName used to get the specific resource template
   * @throws error if no template is found by passed template name
   */
  public getTemplate(templateName: string): Template {
    if (isEmpty(this._templates)) {
      throw new Error(`Resource '${ this.constructor.name }' templates are empty, can not to get template with the name '${ templateName }'.`);
    }

    const template = this._templates[templateName];
    if (isEmpty(template)) {
      throw new Error(`Resource '${ this.constructor.name }' has no template with the name '${ templateName }'.`);
    }

    return template;
  }

}
