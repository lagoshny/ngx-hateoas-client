import { BaseResource } from './base-resource';
import { getResourceHttpService } from '../service/resource-http.service';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as _ from 'lodash';
import { ResourceUtils } from '../../util/resource.utils';

/**
 * Resource class.
 * Should be extended by client model classes that represent entity objects.
 *
 * If you have an embedded entity then consider to use the {@link EmbeddedResource} class.
 */
export class Resource extends BaseResource {

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
      return _.eq(_.toLower(this.resourceName), _.toLower(that.constructor.name));
    } else {
      return _.eq(_.toLower(this.resourceName), _.toLower(typeOrName));
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
    const relationLink = this.getRelationLink(relationName);
    const resource = ResourceUtils.initResource(entity) as Resource;

    return getResourceHttpService().post(relationLink.href, resource.getSelfLinkHref(), {
      observe: 'response',
      headers: new HttpHeaders({'Content-Type': 'text/uri-list'})
    });
  }

  /**
   * Bind the passed entity to this resource by the relation name.
   *
   * @param relationName with which will be associated passed entity to this resource
   * @param entity that should be bind to this resource
   * @throws error if no link is found by passed relation name
   */
  public bindRelation<T extends Resource>(relationName: string, entity: T): Observable<HttpResponse<any>> {
    const relationLink = this.getRelationLink(relationName);
    const resource = ResourceUtils.initResource(entity) as Resource;

    return getResourceHttpService().put(relationLink.href, resource.getSelfLinkHref(), {
      observe: 'response',
      headers: new HttpHeaders({'Content-Type': 'text/uri-list'})
    });
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
    const relationLink = this.getRelationLink(relationName);

    return getResourceHttpService().put(relationLink.href, '', {
      observe: 'response',
      headers: new HttpHeaders({'Content-Type': 'text/uri-list'})
    });
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
    const relationLink = this.getRelationLink(relationName);
    const resource = ResourceUtils.initResource(entity) as Resource;
    const resourceId = _.last(_.split(resource.getSelfLinkHref(), '/'));

    if (_.isNil(resourceId)) {
      throw Error('relation should has id');
    }

    return getResourceHttpService().delete(relationLink.href + '/' + resourceId, {
      observe: 'response'
    });
  }

  public getSelfLinkHref(): string {
    return this.getRelationLink('self').href;
  }

}
