import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResourceHttpService } from '../internal/resource-http.service';
import { PagedResourceCollectionHttpService } from '../internal/paged-resource-collection-http.service';
import { PagedResourceCollection } from '../../model/resource/paged-resource-collection';
import { GetOption, HttpMethod, PagedGetOption, RequestBody, RequestOption, RequestParam } from '../../model/declarations';
import { ResourceUtils } from '../../util/resource.utils';
import { Resource } from '../../ngx-hateoas-client.module';
import { ResourceCollection } from '../../model/resource/resource-collection';
import { ResourceCollectionHttpService } from '../internal/resource-collection-http.service';
import { CommonResourceHttpService } from '../internal/common-resource-http.service';
import { UrlUtils } from '../../util/url.utils';

/**
 * Service to operate with {@link Resource}.
 *
 * Can be injected as standalone service to work with {@link Resource}.
 */
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
    return this.resourceHttpService.getResource(resourceName, id, options) as Observable<T>;
  }

  /**
   * Get collection of the resource by id.
   *
   * @param resourceName used to build root url to the resource
   * @param options (optional) options that should be applied to the request
   */
  public getAll(resourceName: string, options?: GetOption): Observable<ResourceCollection<T>> {
    return this.resourceCollectionHttpServiceSpy.getResourceCollection(resourceName, null, options);
  }

  /**
   * Get paged collection of the resource by id.
   *
   * @param resourceName used to build root url to the resource
   * @param options (optional) options that should be applied to the request
   */
  public getAllPage(resourceName: string, options?: PagedGetOption): Observable<PagedResourceCollection<T>> {
    return this.pagedResourceCollectionHttpService.getResourcePage(resourceName, null, options);
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
   * {@see ResourceCollectionHttpService#search}
   */
  public searchCollection(resourceName: string, searchQuery: string, option?: GetOption): Observable<ResourceCollection<T>> {
    return this.resourceCollectionHttpServiceSpy.search(resourceName, searchQuery, option);
  }

  /**
   * {@see PagedResourceCollection#search}
   */
  public searchPage(resourceName: string, searchQuery: string, option?: PagedGetOption): Observable<PagedResourceCollection<T>> {
    return this.pagedResourceCollectionHttpService.search(resourceName, searchQuery, option);
  }

  /**
   * {@see ResourceHttpService#search}
   */
  public searchSingle(resourceName: string, searchQuery: string, option?: GetOption): Observable<T> {
    return this.resourceHttpService.search(resourceName, searchQuery, option);
  }

  /**
   * {@see CommonResourceHttpService#customQuery}
   */
  public customQuery(resourceName: string,
                     method: HttpMethod,
                     query: string,
                     requestBody?: RequestBody<any>,
                     options?: PagedGetOption): Observable<any | T | ResourceCollection<T> | PagedResourceCollection<T>> {
    const body = ResourceUtils.resolveValues(requestBody);

    return this.commonHttpService.customQuery(resourceName, method, query, body, options);
  }

}
