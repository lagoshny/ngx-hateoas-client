import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResourceHttpService } from '../internal/resource-http.service';
import { PagedResourceCollectionHttpService } from '../internal/paged-resource-collection-http.service';
import { PagedResourceCollection } from '../../model/resource/paged-resource-collection';
import { GetOption, HttpMethod, PagedGetOption, RequestBody, RequestOption, RequestParam } from '../../model/declarations';
import { ResourceUtils } from '../../util/resource.utils';
import { ResourceCollection } from '../../model/resource/resource-collection';
import { ResourceCollectionHttpService } from '../internal/resource-collection-http.service';
import { CommonResourceHttpService } from '../internal/common-resource-http.service';
import { UrlUtils } from '../../util/url.utils';
import { tap } from 'rxjs/operators';
import { Resource } from '../../model/resource/resource';
import { StageLogger } from '../../logger/stage-logger';
import { ValidationUtils } from '../../util/validation.utils';

/**
 * Service to operate with {@link Resource}.
 *
 * Can be injected as standalone service to work with {@link Resource}.
 */

/* tslint:disable:no-string-literal */
@Injectable()
export class HalResourceService<T extends Resource> {

  constructor(private commonHttpService: CommonResourceHttpService,
              private resourceHttpService: ResourceHttpService<T>,
              private resourceCollectionHttpServiceSpy: ResourceCollectionHttpService<ResourceCollection<T>>,
              private pagedResourceCollectionHttpService: PagedResourceCollectionHttpService<PagedResourceCollection<T>>) {
  }

  /**
   * Get resource by id.
   *
   * @param resourceName used to build root url to the resource
   * @param id resource id
   * @param options (optional) options that should be applied to the request
   */
  public get(resourceName: string, id: any, options?: GetOption): Observable<T> {
    StageLogger.resourceBeginLog(resourceName, 'ResourceService GET_RESOURCE', {id, options});
    ValidationUtils.validateInputParams({resourceName, id});

    return this.resourceHttpService.getResource(resourceName, id, options)
      .pipe(tap(() => {
        StageLogger.resourceEndLog(resourceName, 'ResourceService GET_RESOURCE',
          {result: `get resource '${ resourceName }' was successful`});
      })) as Observable<T>;
  }

  /**
   * Get collection of the resource by id.
   *
   * @param resourceName used to build root url to the resource
   * @param options (optional) options that should be applied to the request
   */
  public getAll(resourceName: string, options?: GetOption): Observable<ResourceCollection<T>> {
    StageLogger.resourceBeginLog(resourceName, 'ResourceService GET_ALL', {options});
    ValidationUtils.validateInputParams({resourceName});

    return this.resourceCollectionHttpServiceSpy.getResourceCollection(resourceName, null, options)
      .pipe(tap(() => {
        StageLogger.resourceEndLog(resourceName, 'ResourceService GET_ALL',
          {result: `get all resources by '${ resourceName }' was successful`});
      }));
  }

  /**
   * Get paged collection of the resource by id.
   *
   * @param resourceName used to build root url to the resource
   * @param options (optional) options that should be applied to the request
   */
  public getAllPage(resourceName: string, options?: PagedGetOption): Observable<PagedResourceCollection<T>> {
    StageLogger.resourceBeginLog(resourceName, 'ResourceService GET_ALL_PAGE', {options});
    ValidationUtils.validateInputParams({resourceName});

    return this.pagedResourceCollectionHttpService.getResourcePage(resourceName, null, options)
      .pipe(tap(() => {
        StageLogger.resourceEndLog(resourceName, 'ResourceService GET_ALL_PAGE',
          {result: `get all page resources by '${ resourceName }' was successful`});
      }));
  }

  /**
   * Create resource.
   *
   * @param resourceName used to build root url to the resource
   * @param requestBody that contains the body directly and optional body values option {@link ValuesOption}
   */
  public createResource(resourceName: string, requestBody: RequestBody<T>): Observable<T> {
    StageLogger.resourceBeginLog(resourceName, 'ResourceService CREATE_RESOURCE', {requestBody});
    ValidationUtils.validateInputParams({resourceName, requestBody});

    const body = ResourceUtils.resolveValues(requestBody);

    return this.resourceHttpService.postResource(resourceName, body)
      .pipe(tap(() => {
        StageLogger.resourceEndLog(resourceName, 'ResourceService CREATE_RESOURCE',
          {result: `resource '${ resourceName }' was created successful`});
      }));
  }

  /**
   * Update resource.
   *
   * @param requestBody that contains the body directly and optional body values option {@link ValuesOption}
   */
  public updateResource(requestBody: RequestBody<T>): Observable<T> {
    StageLogger.resourceBeginLog(requestBody?.body, 'ResourceService UPDATE_RESOURCE', {requestBody});
    ValidationUtils.validateInputParams({requestBody});

    const resource = ResourceUtils.initResource(requestBody.body) as Resource;
    const body = ResourceUtils.resolveValues({body: resource, valuesOption: requestBody?.valuesOption});

    return this.resourceHttpService.put(resource.getSelfLinkHref(), body)
      .pipe(tap(() => {
        StageLogger.resourceEndLog(requestBody?.body, 'ResourceService CREATE_RESOURCE',
          {result: `resource '${ resource['resourceName'] }' was updated successful`});
      }));
  }

  /**
   * Perform GET request to get count value.
   *
   * @param resourceName used to build root url to the resource
   * @param countQuery name of the count method
   * @param requestParam (optional) http request params that applied to the request
   */
  public count(resourceName: string, countQuery?: string, requestParam?: RequestParam): Observable<number> {
    StageLogger.resourceBeginLog(resourceName, 'ResourceService COUNT', {query: countQuery, requestParam});
    ValidationUtils.validateInputParams({resourceName});

    return this.resourceHttpService.count(resourceName, countQuery, requestParam)
      .pipe(tap(() => {
        StageLogger.resourceEndLog(resourceName, 'ResourceService COUNT',
          {result: `count resource '${ resourceName }' was performed successful`});
      }));
  }

  /**
   * Patch resource.
   *
   * @param requestBody that contains the body directly and optional body values option {@link ValuesOption}
   */
  public patchResource(requestBody: RequestBody<T>): Observable<T | any> {
    StageLogger.resourceBeginLog(requestBody?.body, 'ResourceService PATCH_RESOURCE', {requestBody});
    ValidationUtils.validateInputParams({requestBody});

    const resource = ResourceUtils.initResource(requestBody?.body) as Resource;
    const body = ResourceUtils.resolveValues({body: resource, valuesOption: requestBody?.valuesOption});

    return this.resourceHttpService.patch(resource.getSelfLinkHref(), body)
      .pipe(tap(() => {
        StageLogger.resourceEndLog(requestBody?.body, 'ResourceService PATCH_RESOURCE',
          {result: `resource '${ resource['resourceName'] }' was patched successful`});
      }));
  }

  /**
   * Delete resource.
   *
   * @param entity to delete
   * @param options (optional) options that should be applied to the request
   */
  public deleteResource(entity: T, options?: RequestOption): Observable<T | any> {
    StageLogger.resourceBeginLog(entity, 'ResourceService DELETE_RESOURCE', {options});
    ValidationUtils.validateInputParams({entity});

    const resource = ResourceUtils.initResource(entity) as Resource;
    const httpParams = UrlUtils.convertToHttpParams({params: options?.params});

    return this.resourceHttpService.delete(resource.getSelfLinkHref(),
      {observe: options?.observe, params: httpParams})
      .pipe(tap(() => {
        StageLogger.resourceEndLog(entity, 'ResourceService DELETE_RESOURCE',
          {result: `resource '${ resource['resourceName'] }' was deleted successful`});
      }));
  }

  /**
   * {@see ResourceCollectionHttpService#search}
   */
  public searchCollection(resourceName: string, searchQuery: string, options?: GetOption): Observable<ResourceCollection<T>> {
    StageLogger.resourceBeginLog(resourceName, 'ResourceService SEARCH_COLLECTION', {query: searchQuery, options});
    ValidationUtils.validateInputParams({resourceName, searchQuery});

    return this.resourceCollectionHttpServiceSpy.search(resourceName, searchQuery, options)
      .pipe(tap(() => {
        StageLogger.resourceEndLog(resourceName, 'ResourceService SEARCH_COLLECTION',
          {result: `search collection by '${ resourceName }' was performed successful`});
      }));
  }

  /**
   * {@see PagedResourceCollection#search}
   */
  public searchPage(resourceName: string, searchQuery: string, options?: PagedGetOption): Observable<PagedResourceCollection<T>> {
    StageLogger.resourceBeginLog(resourceName, 'ResourceService SEARCH_PAGE', {query: searchQuery, options});
    ValidationUtils.validateInputParams({resourceName, searchQuery});

    return this.pagedResourceCollectionHttpService.search(resourceName, searchQuery, options)
      .pipe(tap(() => {
        StageLogger.resourceEndLog(resourceName, 'ResourceService SEARCH_PAGE',
          {result: `search page by '${ resourceName }' was performed successful`});
      }));
  }

  /**
   * {@see ResourceHttpService#search}
   */
  public searchSingle(resourceName: string, searchQuery: string, options?: GetOption): Observable<T> {
    StageLogger.resourceBeginLog(resourceName, 'ResourceService SEARCH_SINGLE', {query: searchQuery, options});
    ValidationUtils.validateInputParams({resourceName, searchQuery});

    return this.resourceHttpService.search(resourceName, searchQuery, options)
      .pipe(tap(() => {
        StageLogger.resourceEndLog(resourceName, 'ResourceService SEARCH_SINGLE',
          {result: `search single by '${ resourceName }' was performed successful`});
      }));
  }

  /**
   * {@see CommonResourceHttpService#customQuery}
   */
  public customQuery(resourceName: string,
                     method: HttpMethod,
                     query: string,
                     requestBody?: RequestBody<any>,
                     options?: PagedGetOption): Observable<any | T | ResourceCollection<T> | PagedResourceCollection<T>> {
    StageLogger.resourceBeginLog(resourceName, 'ResourceService CUSTOM_QUERY', {method: HttpMethod, query, requestBody, options});
    ValidationUtils.validateInputParams({resourceName, method, query});

    const body = ResourceUtils.resolveValues(requestBody);

    return this.commonHttpService.customQuery(resourceName, method, query, body, options)
      .pipe(tap(() => {
        StageLogger.resourceEndLog(resourceName, 'ResourceService CUSTOM_QUERY',
          {result: `custom query by '${ resourceName }' was performed successful`});
      }));
  }

}
