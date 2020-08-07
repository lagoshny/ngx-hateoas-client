import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResourceHttpService } from '../hal-resource/service/resource-http.service';
import { PagedCollectionResourceHttpService } from '../hal-resource/service/paged-collection-resource-http.service';
import { PagedCollectionResource } from '../hal-resource/model/paged-collection-resource';
import { GetOption, HttpMethod, PagedGetOption, RequestBody, RequestOption, RequestParam } from '../hal-resource/model/declarations';
import { ResourceUtils } from '../util/resource.utils';
import { Resource } from '../ngx-hal-client.module';
import { CollectionResource } from '../hal-resource/model/collection-resource';
import { CollectionResourceHttpService } from '../hal-resource/service/collection-resource-http.service';
import { CommonHttpService } from '../hal-resource/service/common-http.service';
import { UrlUtils } from '../util/url.utils';

/**
 * Service to operate with {@link Resource}.
 *
 * Can be injected as standalone service to work with {@link Resource}.
 */
@Injectable()
export class HalResourceService<T extends Resource> {

  constructor(private commonHttpService: CommonHttpService,
              private resourceHttpService: ResourceHttpService<T>,
              private collectionResourceHttpService: CollectionResourceHttpService<CollectionResource<T>>,
              private pagedCollectionResourceHttpService: PagedCollectionResourceHttpService<PagedCollectionResource<T>>) {
  }

  /**
   * Get resource by id.
   *
   * @param resourceName used to build root url to the resource
   * @param id resource id
   * @param options (optional) options that should be applied to the request
   */
  public get(resourceName: string, id: any, options?: GetOption): Observable<T> {
    return this.resourceHttpService.getResource(resourceName, id, options) as Observable<T>;
  }

  /**
   * Get collection of the resource by id.
   *
   * @param resourceName used to build root url to the resource
   * @param options (optional) options that should be applied to the request
   */
  public getAll(resourceName: string, options?: GetOption): Observable<CollectionResource<T>> {
    return this.collectionResourceHttpService.getResourceCollection(resourceName, null, options);
  }

  /**
   * Get paged collection of the resource by id.
   *
   * @param resourceName used to build root url to the resource
   * @param options (optional) options that should be applied to the request
   */
  public getAllPage(resourceName: string, options?: PagedGetOption): Observable<PagedCollectionResource<T>> {
    return this.pagedCollectionResourceHttpService.getResourcePage(resourceName, null, options);
  }

  /**
   * Create resource.
   *
   * @param resourceName used to build root url to the resource
   * @param requestBody that contains the body directly and optional body values option {@link ValuesOption}
   */
  public createResource(resourceName: string, requestBody: RequestBody<T>): Observable<T> {
    const body = ResourceUtils.resolveValues(requestBody);

    return this.resourceHttpService.postResource(resourceName, body);
  }

  /**
   * Update resource.
   *
   * @param requestBody that contains the body directly and optional body values option {@link ValuesOption}
   */
  public updateResource(requestBody: RequestBody<T>): Observable<T> {
    const resource = ResourceUtils.initResource(requestBody.body) as Resource;
    const body = ResourceUtils.resolveValues({body: resource, valuesOption: requestBody?.valuesOption});

    return this.resourceHttpService.put(resource.getSelfLinkHref(), body);
  }

  /**
   * Perform GET request to get count value.
   *
   * @param resourceName used to build root url to the resource
   * @param countQuery name of the count method
   * @param requestParam (optional) http request params that applied to the request
   */
  public count(resourceName: string, countQuery: string, requestParam: RequestParam): Observable<number> {
    return this.resourceHttpService.count(resourceName, countQuery, requestParam);
  }

  /**
   * Patch resource.
   *
   * @param requestBody that contains the body directly and optional body values option {@link ValuesOption}
   */
  public patchResource(requestBody: RequestBody<T>): Observable<T | any> {
    const resource = ResourceUtils.initResource(requestBody?.body) as Resource;
    const body = ResourceUtils.resolveValues({body: resource, valuesOption: requestBody?.valuesOption});

    return this.resourceHttpService.patch(resource.getSelfLinkHref(), body);
  }

  /**
   * Delete resource.
   *
   * @param entity to delete
   * @param options (optional) options that should be applied to the request
   */
  public deleteResource(entity: T, options?: RequestOption): Observable<T | any> {
    const resource = ResourceUtils.initResource(entity) as Resource;
    const httpParams = UrlUtils.convertToHttpParams({params: options?.params});

    return this.resourceHttpService.delete(resource.getSelfLinkHref(),
      {observe: options?.observe, params: httpParams});
  }

  /**
   * {@see CollectionResourceHttpService#search}
   */
  public searchCollection(resourceName: string, searchQuery: string, option?: GetOption): Observable<CollectionResource<T>> {
    return this.collectionResourceHttpService.search(resourceName, searchQuery, option);
  }

  /**
   * {@see PagedCollectionResource#search}
   */
  public searchPage(resourceName: string, searchQuery: string, option?: PagedGetOption): Observable<PagedCollectionResource<T>> {
    return this.pagedCollectionResourceHttpService.search(resourceName, searchQuery, option);
  }

  /**
   * {@see ResourceHttpService#search}
   */
  public searchSingle(resourceName: string, searchQuery: string, option?: GetOption): Observable<T> {
    return this.resourceHttpService.search(resourceName, searchQuery, option);
  }

  /**
   * {@see CommonHttpService#customQuery}
   */
  public customQuery(resourceName: string,
                     method: HttpMethod,
                     query: string,
                     requestBody: RequestBody<any>,
                     options: PagedGetOption): Observable<any | T | CollectionResource<T> | PagedCollectionResource<T>> {
    const body = ResourceUtils.resolveValues(requestBody);

    return this.commonHttpService.customQuery(resourceName, method, query, body, options);
  }

}
