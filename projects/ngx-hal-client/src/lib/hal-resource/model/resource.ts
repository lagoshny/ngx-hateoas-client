import { BaseResource } from './base-resource';
import { getResourceHttpService } from '../service/resource-http.service';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as _ from 'lodash';

export class Resource extends BaseResource {
  //
  /**
   * RESPONSE WITH OBSERVE BODY
   * Body: null
   * Status 204
   * VersionHTTP/1.1
   * Transferred993 B (0 B size)
   * Referrer Policyno-referrer-when-downgrade
   * @param relationName
   * @param resource
   */
  // // Adds the given resource to the bound collection by the relation
  public addRelation<T extends Resource>(relationName: string, resource: T): Observable<HttpResponse<any>> {
    const relationLink = this.getRelationLink(relationName);

    return getResourceHttpService().postResource(relationLink.href, resource.getSelfLinkHref(), {
      observe: 'response',
      headers: new HttpHeaders({'Content-Type': 'text/uri-list'})
    });
  }

  // Bind the given resource to this resource by the given relation
  public bindRelation<T extends Resource>(relationName: string, resource: T): Observable<HttpResponse<any>> {
    const relationLink = this.getRelationLink(relationName);

    return getResourceHttpService().putResource(relationLink.href, resource.getSelfLinkHref(), {
      observe: 'response',
      headers: new HttpHeaders({'Content-Type': 'text/uri-list'})
    });
  }

  /**
   * Delete all relation resources. Replace with empty object.
   * @param relationName
   */
  public clearRelation<T extends Resource>(relationName: string): Observable<HttpResponse<any>> {
    const relationLink = this.getRelationLink(relationName);
    return getResourceHttpService().putResource(relationLink.href, '', {
      observe: 'response',
      headers: new HttpHeaders({'Content-Type': 'text/uri-list'})
    });
  }

  // Unbind the resource with the given relation from this resource
  public deleteRelation<T extends Resource>(relationName: string, resource: T): Observable<HttpResponse<any>> {
    const relationLink = this.getRelationLink(relationName);
    const resourceId = _.last(_.split(resource.getSelfLinkHref(), '/'));

    if (_.isUndefined(resourceId) || _.isNull(resourceId)) {
      throw Error('relation should has id');
    }

    return getResourceHttpService().deleteResource(relationLink.href + '/' + resourceId, {
      observe: 'response'
    });
  }

  public getSelfLinkHref(): string {
    return this.getRelationLink('self').href;
  }

}
