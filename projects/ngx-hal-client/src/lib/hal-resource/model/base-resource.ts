import { Observable } from 'rxjs';
import { getResourceHttpService } from '../service/resource-http.service';
import { UrlUtils } from '../../util/url.utils';
import { ResourceIdentifiable } from './resource-identifiable';
import { CollectionResource } from './collection-resource';
import { getCollectionResourceHttpService } from '../service/collection-resource-http.service';
import { GetOption, PagedGetOption, RequestBody, RequestOption } from './declarations';
import { HttpResponse } from '@angular/common/http';
import { getPagedCollectionResourceHttpService } from '../service/paged-collection-resource-http.service';
import { PagedCollectionResource } from './paged-collection-resource';
import { ResourceUtils } from '../../util/resource.utils';

/**
 * Common resource class.
 */
export abstract class BaseResource extends ResourceIdentifiable {

  /**
   * Get single resource by the relation name.
   *
   * @param relationName used to get the specific relation link
   * @param options (optional) options that should be applied to the request
   * @throws error if no link is found by passed relation name
   */
  public getRelation<T extends BaseResource>(relationName: string,
                                             options?: GetOption
                                             // expireMs: number = CacheHelper.defaultExpire,
                                             // isCacheActive: boolean = true
  ): Observable<T> {
    const relationLink = this.getRelationLink(relationName);
    const url = relationLink.templated ? UrlUtils.removeTemplateParams(relationLink.href) : relationLink.href;
    const httpParams = UrlUtils.convertToHttpParams(options);

    return getResourceHttpService().get(url, {params: httpParams}) as Observable<T>;
  }

  /**
   * Get collection of resources by the relation name.
   *
   * @param relationName used to get the specific relation link
   * @param options (optional) options that will be applied to the request
   * @throws error if no link is found by passed relation name
   */
  public getRelatedCollection<T extends CollectionResource<BaseResource>>(relationName: string,
                                                                          options?: GetOption
                                                                          // embedded?: string,
                                                                          // expireMs: number = CacheHelper.defaultExpire,
                                                                          // isCacheActive: boolean = true
  ): Observable<T> {
    const relationLink = this.getRelationLink(relationName);
    const url = relationLink.templated ? UrlUtils.removeTemplateParams(relationLink.href) : relationLink.href;
    const httpParams = UrlUtils.convertToHttpParams(options);

    return getCollectionResourceHttpService().get(url, {params: httpParams}) as Observable<T>;
  }

  /**
   * Get paged collection of resources by the relation name.
   *
   * @param relationName used to get the specific relation link
   * @param options (optional) additional options that should be applied to the request
   *        if options didn't contains {@link PageParam} then will be used default page params.
   * @throws error if no link is found by passed relation name
   */
  public getRelatedPage<T extends PagedCollectionResource<BaseResource>>(relationName: string,
                                                                         options?: PagedGetOption
                                                                         // embedded?: string,
                                                                         // expireMs: number = CacheHelper.defaultExpire,
                                                                         // isCacheActive: boolean = true
  ): Observable<T> {
    const relationLink = this.getRelationLink(relationName);
    const uri = relationLink.templated ? UrlUtils.removeTemplateParams(relationLink.href) : relationLink.href;
    const httpParams = UrlUtils.convertToHttpParams(options);

    return getPagedCollectionResourceHttpService().get(uri, {params: httpParams}) as Observable<T>;
  }

  /**
   *  Perform post request to the relation with the body and url params.
   *  By default return {@link HttpResponse<any>} if you want change it, pass observe type in options.
   *
   * @param relationName used to get the specific relation link
   * @param requestBody that contains the body directly and optional body values option {@link ValuesOption}
   * @param options (optional) request options that will be applied to the request
   * @throws error if no link is found by passed relation name
   */
  public postRelation(relationName: string,
                      requestBody: RequestBody<any>,
                      options?: RequestOption): Observable<any> {
    const relationLink = this.getRelationLink(relationName);
    const url = relationLink.templated ? UrlUtils.fillTemplateParams(relationLink.href, options?.templateParams) : relationLink.href;
    const httpParams = UrlUtils.convertToHttpParams({params: options?.params});
    const body = ResourceUtils.resolveValues(requestBody);
    const observe = options?.observe ? options.observe : 'response';

    return getResourceHttpService().post(url, body, {observe, params: httpParams});
  }

  /**
   * Perform patch request to relation with body and url params.
   * By default return {@link HttpResponse<any>} if you want change it, pass observe type in options.
   *
   * @param relationName used to get the specific relation link
   * @param requestBody contains the body directly and body values option {@link ValuesOption}
   *        to clarify what specific values need to be included or not included in result request body
   * @param options (optional) request options that will be applied to the request
   * @throws error if no link is found by passed relation name
   */
  public patchRelation(relationName: string,
                       requestBody: RequestBody<any>,
                       options?: RequestOption): Observable<any> {
    const relationLink = this.getRelationLink(relationName);
    const url = relationLink.templated ? UrlUtils.fillTemplateParams(relationLink.href, options?.templateParams) : relationLink.href;
    const httpParams = UrlUtils.convertToHttpParams({params: options?.params});
    const body = ResourceUtils.resolveValues(requestBody);
    const observe = options?.observe ? options.observe : 'response';

    return getResourceHttpService().patch(url, body, {observe, params: httpParams});
  }

  /**
   * Perform put request to relation with body and url params.
   * By default return {@link HttpResponse<any>} if you want change it, pass observe type in options.
   *
   * @param relationName used to get the specific relation link
   * @param requestBody contains the body directly and body values option {@link ValuesOption}
   *        to clarify what specific values need to be included or not included in result request body
   * @param options (optional) request options that will be applied to the request
   * @throws error if no link is found by passed relation name
   */
  public putRelation(relationName: string,
                     requestBody: RequestBody<any>,
                     options?: RequestOption): Observable<any> {
    const relationLink = this.getRelationLink(relationName);
    const url = relationLink.templated ? UrlUtils.fillTemplateParams(relationLink.href, options?.templateParams) : relationLink.href;
    const httpParams = UrlUtils.convertToHttpParams({params: options?.params});
    const body = ResourceUtils.resolveValues(requestBody);
    const observe = options?.observe ? options.observe : 'response';

    return getResourceHttpService().put(url, body, {observe, params: httpParams});
  }

}
