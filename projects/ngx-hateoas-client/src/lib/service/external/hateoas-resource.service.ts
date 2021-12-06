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
export class HateoasResourceService {

  constructor(private commonHttpService: CommonResourceHttpService,
              private resourceHttpService: ResourceHttpService,
              private resourceCollectionHttpService: ResourceCollectionHttpService,
              private pagedResourceCollectionHttpService: PagedResourceCollectionHttpService) {
  }

  /**
   * Get resource by id.
   *
   * @param resourceType resource for which will perform request
   * @param id resource id
   * @param options (optional) options that should be applied to the request
   * @throws error when required params are not valid
   */
  public getResource<T extends Resource>(resourceType: new () => T, id: number | string, options?: GetOption): Observable<T> {
    ValidationUtils.validateInputParams({resourceType, id});
    const resourceName = resourceType['__resourceName__'];
    options = ResourceUtils.fillProjectionNameFromResourceType(resourceType, options);
    StageLogger.resourceBeginLog(resourceName, 'ResourceService GET_RESOURCE', {id, options});

    return this.resourceHttpService.getResource<T>(resourceName, id, options)
      .pipe(tap(() => {
        StageLogger.resourceEndLog(resourceName, 'ResourceService GET_RESOURCE',
          {result: `get resource '${ resourceName }' was successful`});
      }));
  }

  /**
   * Get collection of the resource by id.
   *
   * @param resourceType resource for which will perform request
   * @param options (optional) options that should be applied to the request
   * @throws error when required params are not valid
   */
  public getCollection<T extends Resource>(resourceType: new () => T, options?: GetOption): Observable<ResourceCollection<T>> {
    ValidationUtils.validateInputParams({resourceType});
    const resourceName = resourceType['__resourceName__'];
    options = ResourceUtils.fillProjectionNameFromResourceType(resourceType, options);
    StageLogger.resourceBeginLog(resourceName, 'ResourceService GET_COLLECTION', {options});

    return this.resourceCollectionHttpService.getResourceCollection<ResourceCollection<T>>(resourceName, options)
      .pipe(tap(() => {
        StageLogger.resourceEndLog(resourceName, 'ResourceService GET_COLLECTION',
          {result: `get all resources by '${ resourceName }' was successful`});
      }));
  }

  /**
   * Get paged collection of the resource by id.
   *
   * @param resourceType resource for which will perform request
   * @param options (optional) options that should be applied to the request
   * @throws error when required params are not valid
   */
  public getPage<T extends Resource>(resourceType: new () => T, options?: PagedGetOption): Observable<PagedResourceCollection<T>> {
    ValidationUtils.validateInputParams({resourceType});
    const resourceName = resourceType['__resourceName__'];
    options = ResourceUtils.fillProjectionNameFromResourceType(resourceType, options);
    StageLogger.resourceBeginLog(resourceName, 'ResourceService GET_PAGE', {options});

    return this.pagedResourceCollectionHttpService.getResourcePage<PagedResourceCollection<T>>(resourceName, options)
      .pipe(tap(() => {
        StageLogger.resourceEndLog(resourceName, 'ResourceService GET_PAGE',
          {result: `get all page resources by '${ resourceName }' was successful`});
      }));
  }

  /**
   * Create resource.
   *
   * @param resourceType resource for which will perform request
   * @param requestBody that contains the body directly and optional body values option {@link ValuesOption}
   * @param options (optional) options that should be applied to the request {@link RequestOption}
   * @throws error when required params are not valid
   */
  public createResource<T extends Resource>(resourceType: new () => T,
                                            requestBody: RequestBody<T>,
                                            options?: RequestOption): Observable<T | any> {
    ValidationUtils.validateInputParams({resourceType, requestBody});
    const resourceName = resourceType['__resourceName__'];
    StageLogger.resourceBeginLog(resourceName, 'ResourceService CREATE_RESOURCE', {requestBody, options});

    const body = ResourceUtils.resolveValues(requestBody);

    return this.resourceHttpService.postResource(resourceName, body, options)
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
   * @param options (optional) options that should be applied to the request {@link RequestOption}
   * @throws error when required params are not valid
   */
  public updateResource<T extends Resource>(entity: T,
                                            requestBody?: RequestBody<any>,
                                            options?: RequestOption): Observable<T | any> {
    ValidationUtils.validateInputParams({entity});
    StageLogger.resourceBeginLog(entity, 'ResourceService UPDATE_RESOURCE', {body: requestBody ? requestBody : entity, options});

    const resource = ResourceUtils.initResource(entity) as Resource;
    const body = ResourceUtils.resolveValues(requestBody ? requestBody : {body: entity});

    return this.resourceHttpService.put(resource.getSelfLinkHref(), body, options)
      .pipe(tap(() => {
        StageLogger.resourceEndLog(entity, 'ResourceService UPDATE_RESOURCE',
          {result: `resource '${ resource['__resourceName__'] }' was updated successful`});
      }));
  }

  /**
   * Update resource by id.
   * Updating all resource properties at the time to passed body properties. If some properties are not passed then will be used null value.
   * If you need update some part resource properties, use {@link HateoasResourceService#patchResource} method.
   *
   * @param resourceType resource for which will perform request
   * @param id resource id
   * @param requestBody that contains the body directly and optional body values option {@link ValuesOption}
   * @param options (optional) options that should be applied to the request {@link RequestOption}
   * @throws error when required params are not valid
   */
  public updateResourceById<T extends Resource>(resourceType: new () => T,
                                                id: number | string,
                                                requestBody: RequestBody<any>,
                                                options?: RequestOption): Observable<T | any> {
    ValidationUtils.validateInputParams({resourceType, id, requestBody});
    const resourceName = resourceType['__resourceName__'];
    StageLogger.resourceBeginLog(resourceName, 'ResourceService UPDATE_RESOURCE_BY_ID', {id, body: requestBody, options});

    const body = ResourceUtils.resolveValues(requestBody);

    return this.resourceHttpService.putResource(resourceName, id, body, options)
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
   * @param options (optional) options that should be applied to the request {@link RequestOption}
   * @throws error when required params are not valid
   */
  public patchResource<T extends Resource>(entity: T,
                                           requestBody?: RequestBody<any>,
                                           options?: RequestOption): Observable<T | any> {
    ValidationUtils.validateInputParams({entity});
    StageLogger.resourceBeginLog(entity, 'ResourceService PATCH_RESOURCE', {body: requestBody ? requestBody : entity, options});

    const resource = ResourceUtils.initResource(entity) as Resource;
    const body = ResourceUtils.resolveValues(requestBody ? requestBody : {body: entity});

    return this.resourceHttpService.patch(resource.getSelfLinkHref(), body, options)
      .pipe(tap(() => {
        StageLogger.resourceEndLog(entity, 'ResourceService PATCH_RESOURCE',
          {result: `resource '${ entity['__resourceName__'] }' was patched successful`});
      }));
  }

  /**
   * Patch resource by id.
   * Allows fine-grained update resource properties, it means that only passed properties in body will be changed,
   * other properties stay as is.
   *
   * @param resourceType resource for which will perform request
   * @param id resource id
   * @param requestBody that contains the body directly and optional body values option {@link ValuesOption}
   * @param options (optional) options that should be applied to the request {@link RequestOption}
   * @throws error when required params are not valid
   */
  public patchResourceById<T extends Resource>(resourceType: new () => T,
                                               id: number | string,
                                               requestBody: RequestBody<any>,
                                               options?: RequestOption): Observable<T | any> {
    ValidationUtils.validateInputParams({resourceType, id, requestBody});
    const resourceName = resourceType['__resourceName__'];
    StageLogger.resourceBeginLog(resourceName, 'ResourceService PATCH_RESOURCE_BY_ID', {id, body: requestBody, options});

    const body = ResourceUtils.resolveValues(requestBody);

    return this.resourceHttpService.patchResource(resourceName, id, body, options)
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
  public deleteResource<T extends Resource>(entity: T, options?: RequestOption): Observable<HttpResponse<any> | any> {
    ValidationUtils.validateInputParams({entity});
    StageLogger.resourceBeginLog(entity, 'ResourceService DELETE_RESOURCE', {options});

    const resource = ResourceUtils.initResource(entity) as Resource;

    return this.resourceHttpService.delete(resource.getSelfLinkHref(), options)
      .pipe(tap(() => {
        StageLogger.resourceEndLog(entity, 'ResourceService DELETE_RESOURCE',
          {result: `resource '${ resource['__resourceName__'] }' was deleted successful`});
      }));
  }

  /**
   * Delete resource by id.
   *
   * @param resourceType resource for which will perform request
   * @param id resource id
   * @param options (optional) options that should be applied to the request
   * @throws error when required params are not valid
   */
  public deleteResourceById<T extends Resource>(resourceType: new () => T,
                                                id: number | string,
                                                options?: RequestOption): Observable<HttpResponse<any> | any> {
    ValidationUtils.validateInputParams({resourceType, id});
    const resourceName = resourceType['__resourceName__'];
    StageLogger.resourceBeginLog(resourceName, 'ResourceService DELETE_RESOURCE_BY_ID', {id, options});

    return this.resourceHttpService.deleteResource(resourceName, id, options)
      .pipe(tap(() => {
        StageLogger.resourceEndLog(resourceName, 'ResourceService DELETE_RESOURCE_BY_ID',
          {result: `resource '${ resourceName }' with id ${ id } was deleted successful`});
      }));
  }

  /**
   * {@see ResourceCollectionHttpService#search}
   */
  public searchCollection<T extends Resource>(resourceType: new () => T,
                                              searchQuery: string,
                                              options?: GetOption): Observable<ResourceCollection<T>> {
    ValidationUtils.validateInputParams({resourceType, searchQuery});
    const resourceName = resourceType['__resourceName__'];
    options = ResourceUtils.fillProjectionNameFromResourceType(resourceType, options);
    StageLogger.resourceBeginLog(resourceName, 'ResourceService SEARCH_COLLECTION', {query: searchQuery, options});

    return this.resourceCollectionHttpService.search<ResourceCollection<T>>(resourceName, searchQuery, options)
      .pipe(tap(() => {
        StageLogger.resourceEndLog(resourceName, 'ResourceService SEARCH_COLLECTION',
          {result: `search collection by '${ resourceName }' was performed successful`});
      }));
  }

  /**
   * {@see PagedResourceCollection#search}
   */
  public searchPage<T extends Resource>(resourceType: new () => T,
                                        searchQuery: string,
                                        options?: PagedGetOption): Observable<PagedResourceCollection<T>> {
    ValidationUtils.validateInputParams({resourceType, searchQuery});
    const resourceName = resourceType['__resourceName__'];
    options = ResourceUtils.fillProjectionNameFromResourceType(resourceType, options);
    StageLogger.resourceBeginLog(resourceName, 'ResourceService SEARCH_PAGE', {query: searchQuery, options});

    return this.pagedResourceCollectionHttpService.search<PagedResourceCollection<T>>(resourceName, searchQuery, options)
      .pipe(tap(() => {
        StageLogger.resourceEndLog(resourceName, 'ResourceService SEARCH_PAGE',
          {result: `search page by '${ resourceName }' was performed successful`});
      }));
  }

  /**
   * {@see ResourceHttpService#search}
   */
  public searchResource<T extends Resource>(resourceType: new () => T, searchQuery: string, options?: GetOption): Observable<T> {
    ValidationUtils.validateInputParams({resourceType, searchQuery});
    const resourceName = resourceType['__resourceName__'];
    options = ResourceUtils.fillProjectionNameFromResourceType(resourceType, options);
    StageLogger.resourceBeginLog(resourceName, 'ResourceService SEARCH_SINGLE', {query: searchQuery, options});

    return this.resourceHttpService.search<T>(resourceName, searchQuery, options)
      .pipe(tap(() => {
        StageLogger.resourceEndLog(resourceName, 'ResourceService SEARCH_SINGLE',
          {result: `search single by '${ resourceName }' was performed successful`});
      }));
  }

  /**
   * {@see CommonResourceHttpService#customQuery}
   */
  public customQuery<R>(resourceType: new () => Resource,
                        method: HttpMethod,
                        query: string,
                        requestBody?: RequestBody<any>,
                        options?: PagedGetOption): Observable<R> {
    ValidationUtils.validateInputParams({resourceType, method, query});
    const resourceName = resourceType['__resourceName__'];
    options = ResourceUtils.fillProjectionNameFromResourceType(resourceType, options);
    StageLogger.resourceBeginLog(resourceName, 'ResourceService CUSTOM_QUERY', {
      method: HttpMethod,
      query,
      requestBody,
      options
    });

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
  public customSearchQuery<R>(resourceType: new () => Resource,
                              method: HttpMethod,
                              searchQuery: string,
                              requestBody?: RequestBody<any>,
                              options?: PagedGetOption): Observable<R> {
    ValidationUtils.validateInputParams({resourceType, method, searchQuery});
    const resourceName = resourceType['__resourceName__'];
    options = ResourceUtils.fillProjectionNameFromResourceType(resourceType, options);
    StageLogger.resourceBeginLog(resourceName, 'ResourceService CUSTOM_SEARCH_QUERY', {
      method: HttpMethod,
      searchQuery,
      requestBody,
      options
    });

    const body = ResourceUtils.resolveValues(requestBody);
    const query = `/search${ searchQuery.startsWith('/') ? searchQuery : '/' + searchQuery }`;
    return this.commonHttpService.customQuery(resourceName, method, query, body, options)
      .pipe(tap(() => {
        StageLogger.resourceEndLog(resourceName, 'ResourceService CUSTOM_SEARCH_QUERY',
          {result: `custom search query by '${ resourceName }' was performed successful`});
      })) as Observable<R>;
  }

}
