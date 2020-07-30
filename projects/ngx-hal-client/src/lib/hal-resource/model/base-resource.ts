import { Observable } from 'rxjs';
import { getResourceHttpService } from '../service/resource-http.service';
import { UrlUtils } from '../../util/url.utils';
import { ResourceIdentifiable } from './resource-identifiable';
import { CollectionResource } from './collection-resource';
import { getCollectionResourceHttpService } from '../service/collection-resource-http.service';
import { HalOption, HalSimpleOption, RequestBody, RequestParam } from './declarations';
import { HttpResponse } from '@angular/common/http';
import { getPagedCollectionResourceHttpService } from '../service/paged-collection-resource-http.service';
import { PagedCollectionResource } from './paged-collection-resource';
import { isResource } from './resource-type';
import { ResourceUtils } from '../../util/resource.utils';

/**
 * Common resource class.
 * This class Holds all common logic for resource.
 */
export abstract class BaseResource extends ResourceIdentifiable {

  /**
   * Get single resource by relation name.
   *
   * @param relationName relation that need to get
   * @param options
   * @throws error when link by relation doesn't exist
   */
  public getRelation<T extends BaseResource>(relationName: string,
                                             options?: HalSimpleOption
                                             // expireMs: number = CacheHelper.defaultExpire,
                                             // isCacheActive: boolean = true
  ): Observable<T> {
    const relationLink = this.getRelationLink(relationName);
    const url = relationLink.templated ? UrlUtils.removeUrlTemplateVars(relationLink.href) : relationLink.href;
    const httpParams = UrlUtils.convertToHttpParams(options);

    return getResourceHttpService().get(url, {params: httpParams}) as Observable<T>;
  }

  /**
   * Get collection of the resources by relation name.
   *
   * @param relationName relation that need to get
   * @param options <b>not required</b> additional options that need to apply to the request
   * @throws error when link by relation doesn't exist
   */
  public getRelatedCollection<T extends CollectionResource<BaseResource>>(relationName: string,
                                                                          options?: HalSimpleOption
                                                                          // embedded?: string,
                                                                          // expireMs: number = CacheHelper.defaultExpire,
                                                                          // isCacheActive: boolean = true
  ): Observable<T> {
    const relationLink = this.getRelationLink(relationName);
    const url = relationLink.templated ? UrlUtils.removeUrlTemplateVars(relationLink.href) : relationLink.href;
    const httpParams = UrlUtils.convertToHttpParams(options);

    return getCollectionResourceHttpService().get(url, {params: httpParams}) as Observable<T>;
  }

  // TODO: проверить, что будет если вернётся не page
  public getRelatedPage<T extends PagedCollectionResource<BaseResource>>(relationName: string,
                                                                         options?: HalOption
                                                                         // embedded?: string,
                                                                         // expireMs: number = CacheHelper.defaultExpire,
                                                                         // isCacheActive: boolean = true
  ): Observable<T> {
    const relationLink = this.getRelationLink(relationName);
    const uri = relationLink.templated ? UrlUtils.removeUrlTemplateVars(relationLink.href) : relationLink.href;
    const httpParams = UrlUtils.convertToHttpParams(options);

    return getPagedCollectionResourceHttpService().get(uri, {params: httpParams}) as Observable<T>;
  }

  /**
   *  Perform post request to relation with body and url params.
   *
   * @param relationName relation that need to get
   * @param requestBody
   * @param params http request params that will be applied to result url
   * @throws error when link by relation doesn't exist
   */
  public postRelation(relationName: string,
                      requestBody: RequestBody,
                      params?: RequestParam): Observable<HttpResponse<any>> {
    const relationLink = this.getRelationLink(relationName);
    const url = relationLink.templated ? UrlUtils.removeUrlTemplateVars(relationLink.href) : relationLink.href;
    const httpParams = UrlUtils.convertToHttpParams({params});
    if (isResource(requestBody.body)) {
      requestBody.body = ResourceUtils.resolveRelations(requestBody.body, requestBody.resourceRelation);
    }

    return getResourceHttpService()
      .post(url, requestBody.body, {observe: 'response', params: httpParams});
  }

  /**
   *  Perform patch request to relation with body and url params.
   *
   * @param relationName relation that need to get
   * @param requestBody body to post request
   * @param params http request params that will be applied to result url
   * @throws error when link by relation doesn't exist
   */
  public patchRelation(relationName: string,
                       requestBody: RequestBody,
                       params?: RequestParam): Observable<HttpResponse<any>> {
    const relationLink = this.getRelationLink(relationName);
    const url = relationLink.templated ? UrlUtils.removeUrlTemplateVars(relationLink.href) : relationLink.href;
    const httpParams = UrlUtils.convertToHttpParams({params});
    if (isResource(requestBody.body)) {
      requestBody.body = ResourceUtils.resolveRelations(requestBody.body, requestBody.resourceRelation);
    }

    return getResourceHttpService()
      .patch(url, requestBody.body, {observe: 'response', params: httpParams});
  }

  /**
   *  Perform put request to relation with body and url params.
   *
   * @param relationName relation that need to get
   * @param requestBody
   * @param params http request params that will be applied to result url
   * @throws error when link by relation doesn't exist
   */
  public putRelation(relationName: string,
                     requestBody: RequestBody,
                     params?: RequestParam): Observable<HttpResponse<any>> {
    const relationLink = this.getRelationLink(relationName);
    const url = relationLink.templated ? UrlUtils.removeUrlTemplateVars(relationLink.href) : relationLink.href;
    // TODO: подумать о логировании и о strict params и проверить template
    const httpParams = UrlUtils.convertToHttpParams({params});
    if (isResource(requestBody.body)) {
      requestBody.body = ResourceUtils.resolveRelations(requestBody.body, requestBody.resourceRelation);
    }

    return getResourceHttpService()
      .put(url, requestBody.body, {observe: 'response', params: httpParams});
  }

}
