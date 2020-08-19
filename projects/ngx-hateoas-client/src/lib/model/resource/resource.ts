import { BaseResource } from './base-resource';
import { getResourceHttpService } from '../../service/internal/resource-http.service';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as _ from 'lodash';
import { ResourceUtils } from '../../util/resource.utils';
import { UrlUtils } from '../../util/url.utils';
import { LinkData } from '../declarations';
import { ConsoleLogger } from '../../logger/console-logger';
import { tap } from 'rxjs/operators';
import { Stage } from '../../logger/stage.enum';

/**
 * Resource class.
 * Should be extended by client model classes that represent entity objects.
 *
 * If you have an embedded entity then consider to use the {@link EmbeddedResource} class.
 */
// tslint:disable:variable-name
export class Resource extends BaseResource {

  /**
   * Resource should has self link.
   */
  protected _links: {
    self: LinkData;
    [key: string]: LinkData;
  };

  /**
   * Contains information about the resource name as it appears in the resource response in an array of the links.
   */
  private resourceName: string;

  /**
   * Allows to find out if a resource is of the desired type by the resource name.
   *
   * @param typeOrName if passed type then compared resource name with type class name
   *        else comparing passed name with resource name
   */
  public isResourceOf<T extends Resource>(typeOrName: (new() => T) | string): boolean {
    if (_.isObject(typeOrName)) {
      const that = new typeOrName() as T;

      const result = _.eq(_.toLower(this.resourceName), _.toLower(that.constructor.name));

      ConsoleLogger.prettyInfo('IS_RESOURCE_OF', {
        result,
        isType: true,
        type: typeOrName,
        constructorTypeName: that.constructor.name,
        thisResourceName: this.resourceName
      });

      return result;
    } else {

      const result = _.eq(_.toLower(this.resourceName), _.toLower(typeOrName));

      ConsoleLogger.prettyInfo('IS_RESOURCE_OF', {
        result,
        isType: false,
        name: typeOrName,
        thisResourceName: this.resourceName
      });

      return result;
    }
  }

  /**
   * Adds the passed entity to the resource collection behind the relation name.
   *
   * @param relationName used to get the specific resource relation link to the resource collection
   * @param entity that should be added to the resource collection
   * @throws error if no link is found by passed relation name
   */
  public addRelation<T extends Resource>(relationName: string, entity: T): Observable<HttpResponse<any>> {
    ConsoleLogger.resourcePrettyInfo(`${ this.resourceName } ADD_RELATION`, `STAGE ${ Stage.BEGIN }`, {
      relationName,
      entity: JSON.stringify(entity, null, 2)
    });

    const relationLink = this.getRelationLink(relationName);
    const url = relationLink.templated ? UrlUtils.removeTemplateParams(relationLink.href) : relationLink.href;
    const resource = ResourceUtils.initResource(entity) as Resource;

    return getResourceHttpService().post(url, resource.getSelfLinkHref(), {
      observe: 'response',
      headers: new HttpHeaders({'Content-Type': 'text/uri-list'})
    }).pipe(
      tap(() => {
        ConsoleLogger.resourcePrettyInfo(`${ this.resourceName } ADD_RELATION`, `STAGE ${ Stage.END }`, {
          result: `relation ${ relationName } added successful`
        });
      })
    );
  }

  /**
   * Bind the passed entity to this resource by the relation name.
   *
   * @param relationName with which will be associated passed entity to this resource
   * @param entity that should be bind to this resource
   * @throws error if no link is found by passed relation name
   */
  public bindRelation<T extends Resource>(relationName: string, entity: T): Observable<HttpResponse<any>> {
    ConsoleLogger.resourcePrettyInfo(`${ this.resourceName } BIND_RELATION`, `STAGE ${ Stage.BEGIN }`, {
      relationName,
      entity: JSON.stringify(entity, null, 2)
    });

    const relationLink = this.getRelationLink(relationName);
    const url = relationLink.templated ? UrlUtils.removeTemplateParams(relationLink.href) : relationLink.href;
    const resource = ResourceUtils.initResource(entity) as Resource;

    return getResourceHttpService().put(url, resource.getSelfLinkHref(), {
      observe: 'response',
      headers: new HttpHeaders({'Content-Type': 'text/uri-list'})
    }).pipe(
      tap(() => {
        ConsoleLogger.resourcePrettyInfo(`${ this.resourceName } BIND_RELATION`, `STAGE ${ Stage.END }`, {
          result: `relation ${ relationName } bind successful`
        });
      })
    );
  }

  /**
   * Unbind all/single resource(s) by the relation name.
   *
   * If behind relation name is link to collection of the resources then it means
   * that all resources will be unbind.
   *
   * @param relationName used to get relation link to unbind
   * @throws error if no link is found by passed relation name
   */
  public clearRelation<T extends Resource>(relationName: string): Observable<HttpResponse<any>> {
    ConsoleLogger.resourcePrettyInfo(`${ this.resourceName } CLEAR_RELATION`, `STAGE ${ Stage.BEGIN }`, {
      relationName,
    });

    const relationLink = this.getRelationLink(relationName);
    const url = relationLink.templated ? UrlUtils.removeTemplateParams(relationLink.href) : relationLink.href;

    return getResourceHttpService().put(url, '', {
      observe: 'response',
      headers: new HttpHeaders({'Content-Type': 'text/uri-list'})
    }).pipe(
      tap(() => {
        ConsoleLogger.resourcePrettyInfo(`${ this.resourceName } CLEAR_RELATION`, `STAGE ${ Stage.END }`, {
          result: `relation ${ relationName } will be cleared successful`
        });
      })
    );
  }

  /**
   * Unbind the single resource by the relation name.
   *
   * If behind relation name is link to collection of the resources then it means that
   * only passed entity will be unbind from collection of the resource.
   *
   * @param relationName used to get relation link to unbind
   * @param entity that should be unbind from this resource
   * @throws error if no link is found by passed relation name
   */
  public deleteRelation<T extends Resource>(relationName: string, entity: T): Observable<HttpResponse<any>> {
    ConsoleLogger.resourcePrettyInfo(`${ this.resourceName } DELETE_RELATION`, `STAGE ${ Stage.BEGIN }`, {
      relationName,
      entity: JSON.stringify(entity, null, 2)
    });

    const relationLink = this.getRelationLink(relationName);
    const url = relationLink.templated ? UrlUtils.removeTemplateParams(relationLink.href) : relationLink.href;
    const resource = ResourceUtils.initResource(entity) as Resource;
    const resourceId = _.last(_.split(resource.getSelfLinkHref(), '/'));

    if (_.isNil(resourceId) || resourceId === '') {
      ConsoleLogger.prettyError(`STAGE ${ Stage.PREPARE_URL }`, {
        step: 'ResolveResourceId',
        error: 'Passed resource self link should has id',
        selfLink: resource.getSelfLinkHref()
      });
      throw Error('Passed resource self link should has id');
    }

    ConsoleLogger.prettyInfo(`STAGE ${ Stage.PREPARE_URL }`, {
      step: 'ResolveResourceId',
      result: resourceId,
    });

    return getResourceHttpService().delete(url + '/' + resourceId, {
      observe: 'response'
    }).pipe(
      tap(() => {
        ConsoleLogger.resourcePrettyInfo(`${ this.resourceName } DELETE_RELATION`, `STAGE ${ Stage.END }`, {
          result: `relation ${ relationName } was deleted successful`
        });
      })
    );
  }

  public getSelfLinkHref(): string {
    return this._links.self.href;
  }

}
