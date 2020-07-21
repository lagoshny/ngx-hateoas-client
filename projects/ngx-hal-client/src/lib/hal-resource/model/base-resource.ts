import { Observable, throwError as observableThrowError } from 'rxjs';
import * as _ from 'lodash';
import { getResourceHttpService } from '../service/resource-http.service';
import { UrlUtils } from '../../util/url.utils';
import { ResourceIdentifiable } from './resource-identifiable';
import { CollectionResource } from './collection-resource';
import { getCollectionResourceHttpService } from '../service/collection-resource-http.service';
import { HalOption, RequestParam } from './declarations';
import { HttpResponse } from '@angular/common/http';

/**
 * Common single resource class.
 * This class Holds all common logic for resource.
 */
export abstract class BaseResource extends ResourceIdentifiable {

  /**
   * Get single resource by relation name.
   *
   * @param relationName relation that need to get
   * @throws error when link by relation doesn't exist
   */
  public getRelation<T extends BaseResource>(relationName: string,
                                             // builder?: SubTypeBuilder,
                                             // expireMs: number = CacheHelper.defaultExpire,
                                             // isCacheActive: boolean = true
  ): Observable<T> {
    const relationLink = this.getRelationLink(relationName);
    const uri = relationLink.templated ? UrlUtils.removeUrlTemplateVars(relationLink.href) : relationLink.href;

    return getResourceHttpService().getResource(uri) as Observable<T>;
  }

  /**
   * TODO: а нужен ли тут этот метод вообще?
   * Get single resource projection.
   *
   * @param resourceName name of the resource to get projection
   * @param id resource id
   * @param projectionName projection that will be applied to resource
   * @throws error when projectionName is empty
   */
  public getProjection<T extends BaseResource>(resourceName: string,
                                               id: string,
                                               projectionName: string,
                                               // expireMs: number = CacheHelper.defaultExpire,
                                               // isCacheActive: boolean = true
  ): Observable<T> {
    if (_.isEmpty(projectionName)) {
      return observableThrowError('no projection found');
    }

    return getResourceHttpService().getProjection(resourceName, id, projectionName) as Observable<T>;
  }

  /**
   * Get collection of the resources by relation name.
   *
   * @param relationName relation that need to get
   * @param options <b>not required</b> additional options that need to apply to the request
   * @throws error when link by relation doesn't exist
   */
  public getRelatedCollection<T extends CollectionResource<BaseResource>>(relationName: string,
                                                                          options?: HalOption
                                                                          // embedded?: string,
                                                                          // builder?: SubTypeBuilder,
                                                                          // expireMs: number = CacheHelper.defaultExpire,
                                                                          // isCacheActive: boolean = true
  ): Observable<T> {
    const relationLink = this.getRelationLink(relationName);
    const uri = relationLink.templated ? UrlUtils.removeUrlTemplateVars(relationLink.href) : relationLink.href;
    let httpParams;
    if (!_.isEmpty(options)) {
      httpParams = UrlUtils.convertToHttpParams(options.params);
      httpParams = UrlUtils.convertToHttpParams(options.page as RequestParam, httpParams);
    }

    return getCollectionResourceHttpService().getResourceCollection(uri, {params: httpParams}) as Observable<T>;
  }

  //   TODO: а нужен ли тут этот метод вообще?
  // public getProjectionArray<T extends Resource>(type: new() => T,
  //                                               resource: string,
  //                                               projectionName: string,
  //                                               expireMs: number = CacheHelper.defaultExpire,
  //                                               isCacheActive: boolean = true): Observable<T[]> {
  //   const uri = this.resourceClientService.generateResourceUrl(resource).concat('?projection=' + projectionName);
  //   const result: ResourceCollection<T> = new ResourceCollection<T>('_embedded');
  //
  //   if (CacheHelper.ifPresent(uri, null, null, isCacheActive)) {
  //     return observableOf(CacheHelper.getArray(uri));
  //   }
  //   return this.resourceClientService.getResource(uri)
  //     .pipe(
  //       map(response => ResourceUtils.instantiateResourceCollection<T>(type, response, result)),
  //       map((array: ResourceCollection<T>) => {
  //         CacheHelper.putArray(uri, array.result, expireMs);
  //         return array.result;
  //       })
  //     );
  // }

  /**
   *  Perform post request to relation with body and url params.
   *
   * @param relationName relation that need to get
   * @param body body to post request
   * @param params http request params that will be applied to result url
   * @throws error when link by relation doesn't exist
   */
  public postRelation(relationName: string, body: any, params?: RequestParam): Observable<HttpResponse<any>> {
    const relationLink = this.getRelationLink(relationName);
    // TODO: подумать о логировании и о strict params и проверить template
    let httpParams;
    const url = relationLink.templated ? UrlUtils.removeUrlTemplateVars(relationLink.href) : relationLink.href;
    if (!_.isEmpty(params)) {
      httpParams = UrlUtils.convertToHttpParams(params);
    }

    return getResourceHttpService()
      .postResource(url, body, {observe: 'response', params: httpParams});
  }

  /**
   *  Perform patch request to relation with body and url params.
   *
   * @param relationName relation that need to get
   * @param body body to post request
   * @param params http request params that will be applied to result url
   * @throws error when link by relation doesn't exist
   */
  public patchRelation(relationName: string, body: any, params?: RequestParam): Observable<HttpResponse<any>> {
    const relationLink = this.getRelationLink(relationName);
    // TODO: подумать о логировании и о strict params и проверить template
    let httpParams;
    const url = relationLink.templated ? UrlUtils.removeUrlTemplateVars(relationLink.href) : relationLink.href;
    if (!_.isEmpty(params)) {
      httpParams = UrlUtils.convertToHttpParams(params);
    }

    return getResourceHttpService()
      .patchResource(url, body, {observe: 'response', params: httpParams});
  }

}
