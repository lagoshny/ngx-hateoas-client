import { Observable } from 'rxjs';
import { getResourceHttpService } from '../../service/internal/resource-http.service';
import { UrlUtils } from '../../util/url.utils';
import { ResourceIdentifiable } from './resource-identifiable';
import { ResourceCollection } from './resource-collection';
import { getResourceCollectionHttpService } from '../../service/internal/resource-collection-http.service';
import { GetOption, PagedGetOption, RequestBody, RequestOption } from '../declarations';
import { HttpParams, HttpResponse } from '@angular/common/http';
import { getPagedResourceCollectionHttpService } from '../../service/internal/paged-resource-collection-http.service';
import { PagedResourceCollection } from './paged-resource-collection';
import { ResourceUtils } from '../../util/resource.utils';
import { tap } from 'rxjs/operators';
import { StageLogger } from '../../logger/stage-logger';
import { ValidationUtils } from '../../util/validation.utils';

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
  ): Observable<T> {
    StageLogger.resourceBeginLog(this, 'GET_RELATION', {relationName, options});
    ValidationUtils.validateInputParams({relationName});

    const relationLink = this.getRelationLink(relationName);
    const url = relationLink.templated
      ? UrlUtils.fillTemplateParams(relationLink.href, options)
      : relationLink.href;

    return getResourceHttpService().get(url, {
        params: relationLink.templated ? new HttpParams() : UrlUtils.convertToHttpParams(options)
      }
    ).pipe(
      tap(() => {
        StageLogger.resourceEndLog(this, 'GET_RELATION', {result: `relation ${ relationName } was got successful`});
      })
    ) as Observable<T>;
  }

  /**
   * Get collection of resources by the relation name.
   *
   * @param relationName used to get the specific relation link
   * @param options (optional) options that will be applied to the request
   * @throws error if no link is found by passed relation name
   */
  public getRelatedCollection<T extends ResourceCollection<BaseResource>>(relationName: string,
                                                                          options?: GetOption
  ): Observable<T> {
    StageLogger.resourceBeginLog(this, 'GET_RELATED_COLLECTION', {relationName, options});
    ValidationUtils.validateInputParams({relationName});

    const relationLink = this.getRelationLink(relationName);
    const url = relationLink.templated ? UrlUtils.fillTemplateParams(relationLink.href, options) : relationLink.href;

    return getResourceCollectionHttpService().get(url, {
      params: relationLink.templated ? new HttpParams() : UrlUtils.convertToHttpParams(options)
    }).pipe(
      tap(() => {
        StageLogger.resourceEndLog(this, 'GET_RELATED_COLLECTION', {result: `related collection ${ relationName } was got successful`});
      })
    ) as Observable<T>;
  }

  /**
   * Get paged collection of resources by the relation name.
   *
   * @param relationName used to get the specific relation link
   * @param options (optional) additional options that should be applied to the request
   *        if options didn't contains {@link PageParam} then will be used default page params.
   * @throws error if no link is found by passed relation name
   */
  public getRelatedPage<T extends PagedResourceCollection<BaseResource>>(relationName: string,
                                                                         options?: PagedGetOption): Observable<T> {
    StageLogger.resourceBeginLog(this, 'GET_RELATED_PAGE', {relationName, options});
    ValidationUtils.validateInputParams({relationName});

    const relationLink = this.getRelationLink(relationName);
    const url = relationLink.templated
      ? UrlUtils.fillTemplateParams(relationLink.href, options)
      : relationLink.href;

    return getPagedResourceCollectionHttpService().get(url, {
      params: relationLink.templated ? new HttpParams() : UrlUtils.convertToHttpParams(options)
    }).pipe(
      tap(() => {
        StageLogger.resourceEndLog(this, 'GET_RELATED_PAGE', {result: `related page ${ relationName } was got successful`});
      })
    ) as Observable<T>;
  }

  /**
   *  Perform POST request to the relation with the body and url params.
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
    StageLogger.resourceBeginLog(this, 'POST_RELATION', {relationName, requestBody, options});
    ValidationUtils.validateInputParams({relationName, requestBody});

    const relationLink = this.getRelationLink(relationName);
    const url = relationLink.templated ? UrlUtils.fillTemplateParams(relationLink.href, options) : relationLink.href;

    return getResourceHttpService().post(url, ResourceUtils.resolveValues(requestBody),
      {
        observe: options?.observe ? options.observe : 'body',
        params: relationLink.templated ? new HttpParams() : UrlUtils.convertToHttpParams(options)
      }).pipe(
      tap(() => {
        StageLogger.resourceEndLog(this, 'POST_RELATION', {result: `relation ${ relationName } was posted successful`});
      })
    );
  }

  /**
   * Perform PATCH request to relation with body and url params.
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
    StageLogger.resourceBeginLog(this, 'PATCH_RELATION', {relationName, requestBody, options});
    ValidationUtils.validateInputParams({relationName, requestBody});

    const relationLink = this.getRelationLink(relationName);
    const url = relationLink.templated ? UrlUtils.fillTemplateParams(relationLink.href, options) : relationLink.href;

    return getResourceHttpService().patch(url, ResourceUtils.resolveValues(requestBody),
      {
        observe: options?.observe ? options.observe : 'body',
        params: relationLink.templated ? new HttpParams() : UrlUtils.convertToHttpParams(options)
      }).pipe(
      tap(() => {
        StageLogger.resourceEndLog(this, 'PATCH_RELATION', {result: `relation ${ relationName } was patched successful`});
      })
    );
  }

  /**
   * Perform PUT request to relation with body and url params.
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
    StageLogger.resourceBeginLog(this, 'PUT_RELATION', {relationName, requestBody, options});
    ValidationUtils.validateInputParams({relationName, requestBody});

    const relationLink = this.getRelationLink(relationName);
    const url = relationLink.templated ? UrlUtils.fillTemplateParams(relationLink.href, options) : relationLink.href;

    return getResourceHttpService().put(url, ResourceUtils.resolveValues(requestBody),
      {
        observe: options?.observe ? options.observe : 'body',
        params: relationLink.templated ? new HttpParams() : UrlUtils.convertToHttpParams(options)
      }).pipe(
      tap(() => {
        StageLogger.resourceEndLog(this, 'PUT_RELATION', {result: `relation ${ relationName } was put successful`});
      })
    );
  }

}
