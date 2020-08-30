import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResourceHttpService } from '../internal/resource-http.service';
import { PagedResourceCollectionHttpService } from '../internal/paged-resource-collection-http.service';
import { PagedResourceCollection } from '../../model/resource/paged-resource-collection';
import { GetOption, HttpMethod, PagedGetOption, RequestBody, RequestOption } from '../../model/declarations';
import { ResourceUtils } from '../../util/resource.utils';
import { ResourceCollection } from '../../model/resource/resource-collection';
import { ResourceCollectionHttpService } from '../internal/resource-collection-http.service';
import { CommonResourceHttpService } from '../internal/common-resource-http.service';
import { UrlUtils } from '../../util/url.utils';
import { tap } from 'rxjs/operators';
import { Resource } from '../../model/resource/resource';
import { StageLogger } from '../../logger/stage-logger';
import { ValidationUtils } from '../../util/validation.utils';
import { HttpResponse } from '@angular/common/http';

/**
 * Service to operate with {@link Resource}.
 *
 * Can be injected as standalone service to work with {@link Resource}.
 */

/* tslint:disable:no-string-literal */
@Injectable()
export class HateoasResourceService<T extends Resource> {

  constructor(private commonHttpService: CommonResourceHttpService,
              private resourceHttpService: ResourceHttpService<T>,
              private resourceCollectionHttpService: ResourceCollectionHttpService<ResourceCollection<T>>,
              private pagedResourceCollectionHttpService: PagedResourceCollectionHttpService<PagedResourceCollection<T>>) {
  }

  /**
   * Get resource by id.
   *
   * @param resourceName used to build root url to the resource
   * @param id resource id
   * @param options (optional) options that should be applied to the request
   * @throws error when required params are not valid
   */
  public getResource(resourceName: string, id: number | string, options?: GetOption): Observable<T> {
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
   * @throws error when required params are not valid
   */
  public getCollection(resourceName: string, options?: GetOption): Observable<ResourceCollection<T>> {
    StageLogger.resourceBeginLog(resourceName, 'ResourceService GET_COLLECTION', {options});
    ValidationUtils.validateInputParams({resourceName});

    return this.resourceCollectionHttpService.getResourceCollection(resourceName, options)
      .pipe(tap(() => {
        StageLogger.resourceEndLog(resourceName, 'ResourceService GET_COLLECTION',
          {result: `get all resources by '${ resourceName }' was successful`});
      }));
  }

  /**
   * Get paged collection of the resource by id.
   *
   * @param resourceName used to build root url to the resource
   * @param options (optional) options that should be applied to the request
   * @throws error when required params are not valid
   */
  public getPage(resourceName: string, options?: PagedGetOption): Observable<PagedResourceCollection<T>> {
    StageLogger.resourceBeginLog(resourceName, 'ResourceService GET_PAGE', {options});
    ValidationUtils.validateInputParams({resourceName});

    return this.pagedResourceCollectionHttpService.getResourcePage(resourceName, options)
      .pipe(tap(() => {
        StageLogger.resourceEndLog(resourceName, 'ResourceService GET_PAGE',
          {result: `get all page resources by '${ resourceName }' was successful`});
      }));
  }

  /**
   * Create resource.
   *
   * @param resourceName used to build root url to the resource
   * @param requestBody that contains the body directly and optional body values option {@link ValuesOption}
   * @throws error when required params are not valid
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
   * Updating all resource properties at the time to passed body properties. If some properties are not passed then will be used null value.
   * If you need update some part resource properties, use {@link HateoasResourceService#patchResource} method.
   *
   * @param entity to update
   * @param requestBody that contains the body directly and optional body values option {@link ValuesOption}
   * @throws error when required params are not valid
   */
  public updateResource(entity: T, requestBody?: RequestBody<any>): Observable<T | any> {
    StageLogger.resourceBeginLog(entity, 'ResourceService UPDATE_RESOURCE', {body: requestBody ? requestBody : entity});
    ValidationUtils.validateInputParams({entity});

    const resource = ResourceUtils.initResource(entity) as Resource;
    const body = ResourceUtils.resolveValues(requestBody ? requestBody : {body: entity});

    return this.resourceHttpService.put(resource.getSelfLinkHref(), body)
      .pipe(tap(() => {
        StageLogger.resourceEndLog(entity, 'ResourceService UPDATE_RESOURCE',
          {result: `resource '${ resource['resourceName'] }' was updated successful`});
      }));
  }

  /**
   * Update resource by id.
   * Updating all resource properties at the time to passed body properties. If some properties are not passed then will be used null value.
   * If you need update some part resource properties, use {@link HateoasResourceService#patchResource} method.
   *
   * @param resourceName to update
   * @param id resource id
   * @param requestBody that contains the body directly and optional body values option {@link ValuesOption}
   * @throws error when required params are not valid
   */
  public updateResourceById(resourceName: string, id: number | string, requestBody: RequestBody<any>): Observable<T | any> {
    StageLogger.resourceBeginLog(resourceName, 'ResourceService UPDATE_RESOURCE_BY_ID', {id, body: requestBody});
    ValidationUtils.validateInputParams({resourceName, id, requestBody});

    const body = ResourceUtils.resolveValues(requestBody);

    return this.resourceHttpService.putResource(resourceName, id, body)
      .pipe(tap(() => {
        StageLogger.resourceEndLog(resourceName, 'ResourceService UPDATE_RESOURCE_BY_ID',
          {result: `resource '${ resourceName }' with id ${ id } was updated successful`});
      }));
  }

  /**
   * Patch resource.
   * Allows fine-grained update resource properties, it means that only passed properties in body will be changed,
   * other properties stay as is.
   *
   * @param entity to patch
   * @param requestBody (optional) contains the body that will be patched resource and optional body values option {@link ValuesOption}
   *        if not passed then entity will be passed as body directly
   * @throws error when required params are not valid
   */
  public patchResource(entity: T, requestBody?: RequestBody<any>): Observable<T | any> {
    StageLogger.resourceBeginLog(entity, 'ResourceService PATCH_RESOURCE', {body: requestBody ? requestBody : entity});
    ValidationUtils.validateInputParams({entity});

    const resource = ResourceUtils.initResource(entity) as Resource;
    const body = ResourceUtils.resolveValues(requestBody ? requestBody : {body: entity});

    return this.resourceHttpService.patch(resource.getSelfLinkHref(), body)
      .pipe(tap(() => {
        StageLogger.resourceEndLog(entity, 'ResourceService PATCH_RESOURCE',
          {result: `resource '${ entity['resourceName'] }' was patched successful`});
      }));
  }

  /**
   * Patch resource by id.
   * Allows fine-grained update resource properties, it means that only passed properties in body will be changed,
   * other properties stay as is.
   *
   * @param resourceName to patch
   * @param id resource id
   * @param requestBody that contains the body directly and optional body values option {@link ValuesOption}
   * @throws error when required params are not valid
   */
  public patchResourceById(resourceName: string, id: number | string, requestBody: RequestBody<any>): Observable<T | any> {
    StageLogger.resourceBeginLog(resourceName, 'ResourceService PATCH_RESOURCE_BY_ID', {id, body: requestBody});
    ValidationUtils.validateInputParams({resourceName, id, requestBody});

    const body = ResourceUtils.resolveValues(requestBody);

    return this.resourceHttpService.patchResource(resourceName, id, body)
      .pipe(tap(() => {
        StageLogger.resourceEndLog(resourceName, 'ResourceService PATCH_RESOURCE_BY_ID',
          {result: `resource '${ resourceName }' with id ${ id } was patched successful`});
      }));
  }

  /**
   * Delete resource.
   *
   * @param entity to delete
   * @param options (optional) options that should be applied to the request
   * @throws error when required params are not valid
   */
  public deleteResource(entity: T, options?: RequestOption): Observable<HttpResponse<any> | any> {
    StageLogger.resourceBeginLog(entity, 'ResourceService DELETE_RESOURCE', {options});
    ValidationUtils.validateInputParams({entity});

    const resource = ResourceUtils.initResource(entity) as Resource;
    const httpParams = UrlUtils.convertToHttpParams({params: options?.params});

    return this.resourceHttpService.delete(resource.getSelfLinkHref(),
      {observe: options?.observe ? options?.observe : 'response', params: httpParams})
      .pipe(tap(() => {
        StageLogger.resourceEndLog(entity, 'ResourceService DELETE_RESOURCE',
          {result: `resource '${ resource['resourceName'] }' was deleted successful`});
      }));
  }

  /**
   * Delete resource by id.
   *
   * @param resourceName to delete
   * @param id resource id
   * @param options (optional) options that should be applied to the request
   * @throws error when required params are not valid
   */
  public deleteResourceById(resourceName: string, id: number | string, options?: RequestOption): Observable<HttpResponse<any> | any> {
    StageLogger.resourceBeginLog(resourceName, 'ResourceService DELETE_RESOURCE_BY_ID', {id, options});
    ValidationUtils.validateInputParams({resourceName, id});

    const httpParams = UrlUtils.convertToHttpParams({params: options?.params});

    return this.resourceHttpService.deleteResource(resourceName, id,
      {observe: options?.observe ? options?.observe : 'response', params: httpParams})
      .pipe(tap(() => {
        StageLogger.resourceEndLog(resourceName, 'ResourceService DELETE_RESOURCE_BY_ID',
          {result: `resource '${ resourceName }' with id ${ id } was deleted successful`});
      }));
  }

  /**
   * {@see ResourceCollectionHttpService#search}
   */
  public searchCollection(resourceName: string, searchQuery: string, options?: GetOption): Observable<ResourceCollection<T>> {
    StageLogger.resourceBeginLog(resourceName, 'ResourceService SEARCH_COLLECTION', {query: searchQuery, options});
    ValidationUtils.validateInputParams({resourceName, searchQuery});

    return this.resourceCollectionHttpService.search(resourceName, searchQuery, options)
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
  public customQuery<R>(resourceName: string,
                        method: HttpMethod,
                        query: string,
                        requestBody?: RequestBody<any>,
                        options?: PagedGetOption): Observable<R> {
    StageLogger.resourceBeginLog(resourceName, 'ResourceService CUSTOM_QUERY', {method: HttpMethod, query, requestBody, options});
    ValidationUtils.validateInputParams({resourceName, method, query});

    const body = ResourceUtils.resolveValues(requestBody);

    return this.commonHttpService.customQuery(resourceName, method, query, body, options)
      .pipe(tap(() => {
        StageLogger.resourceEndLog(resourceName, 'ResourceService CUSTOM_QUERY',
          {result: `custom query by '${ resourceName }' was performed successful`});
      })) as Observable<R>;
  }

  /**
   * Differences between {@link HateoasResourceService#customQuery} and this method
   * that this one puts 'search' path to the result url automatically.
   *
   * {@see CommonResourceHttpService#customQuery}
   */
  public customSearchQuery<R>(resourceName: string,
                              method: HttpMethod,
                              searchQuery: string,
                              requestBody?: RequestBody<any>,
                              options?: PagedGetOption): Observable<R> {
    StageLogger.resourceBeginLog(resourceName, 'ResourceService CUSTOM_SEARCH_QUERY', {
      method: HttpMethod,
      searchQuery,
      requestBody,
      options
    });
    ValidationUtils.validateInputParams({resourceName, method, searchQuery});

    const body = ResourceUtils.resolveValues(requestBody);
    const query = `/search${ searchQuery.startsWith('/') ? searchQuery : '/' + searchQuery }`;
    return this.commonHttpService.customQuery(resourceName, method, query, body, options)
      .pipe(tap(() => {
        StageLogger.resourceEndLog(resourceName, 'ResourceService CUSTOM_SEARCH_QUERY',
          {result: `custom search query by '${ resourceName }' was performed successful`});
      })) as Observable<R>;
  }

}
