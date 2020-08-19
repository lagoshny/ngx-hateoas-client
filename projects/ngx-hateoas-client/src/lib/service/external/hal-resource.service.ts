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
import { ConsoleLogger } from '../../logger/console-logger';
import { Stage } from '../../logger/stage.enum';
import { tap } from 'rxjs/operators';
import { Resource } from '../../model/resource/resource';

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
    ConsoleLogger.resourcePrettyInfo(`ResourceService GET_RESOURCE '${ resourceName }'`, `STAGE ${ Stage.BEGIN }`, {
      id,
      options: JSON.stringify(options, null, 2)
    });

    return this.resourceHttpService.getResource(resourceName, id, options)
      .pipe(tap(() => {
        ConsoleLogger.resourcePrettyInfo(`ResourceService GET_RESOURCE '${ resourceName }'`, `STAGE ${ Stage.END }`, {
          result: `get '${ resourceName }' resource successful`
        });
      })) as Observable<T>;
  }

  /**
   * Get collection of the resource by id.
   *
   * @param resourceName used to build root url to the resource
   * @param options (optional) options that should be applied to the request
   */
  public getAll(resourceName: string, options?: GetOption): Observable<ResourceCollection<T>> {
    ConsoleLogger.resourcePrettyInfo(`ResourceService GET_ALL '${ resourceName }'`, `STAGE ${ Stage.BEGIN }`, {
      options: JSON.stringify(options, null, 2)
    });

    return this.resourceCollectionHttpServiceSpy.getResourceCollection(resourceName, null, options)
      .pipe(tap(() => {
        ConsoleLogger.resourcePrettyInfo(`ResourceService GET_ALL '${ resourceName }'`, `STAGE ${ Stage.END }`, {
          result: `get all resources by  '${ resourceName }' successful`
        });
      }));
  }

  /**
   * Get paged collection of the resource by id.
   *
   * @param resourceName used to build root url to the resource
   * @param options (optional) options that should be applied to the request
   */
  public getAllPage(resourceName: string, options?: PagedGetOption): Observable<PagedResourceCollection<T>> {
    ConsoleLogger.resourcePrettyInfo(`ResourceService GET_ALL_PAGE '${ resourceName }'`, `STAGE ${ Stage.BEGIN }`, {
      options: JSON.stringify(options, null, 2)
    });

    return this.pagedResourceCollectionHttpService.getResourcePage(resourceName, null, options)
      .pipe(tap(() => {
        ConsoleLogger.resourcePrettyInfo(`ResourceService GET_ALL_PAGE '${ resourceName }'`, `STAGE ${ Stage.END }`, {
          result: `get all page resources by  '${ resourceName }' successful`
        });
      }));
  }

  /**
   * Create resource.
   *
   * @param resourceName used to build root url to the resource
   * @param requestBody that contains the body directly and optional body values option {@link ValuesOption}
   */
  public createResource(resourceName: string, requestBody: RequestBody<T>): Observable<T> {
    ConsoleLogger.resourcePrettyInfo(`ResourceService CREATE_RESOURCE '${ resourceName }'`, `STAGE ${ Stage.BEGIN }`, {
      requestBody: JSON.stringify(requestBody, null, 2)
    });

    const body = ResourceUtils.resolveValues(requestBody);

    return this.resourceHttpService.postResource(resourceName, body)
      .pipe(tap(() => {
        ConsoleLogger.resourcePrettyInfo(`ResourceService CREATE_RESOURCE '${ resourceName }'`, `STAGE ${ Stage.END }`, {
          result: `resource  '${ resourceName }' was created successful`
        });
      }));
  }

  /**
   * Update resource.
   *
   * @param requestBody that contains the body directly and optional body values option {@link ValuesOption}
   */
  public updateResource(requestBody: RequestBody<T>): Observable<T> {
    ConsoleLogger.resourcePrettyInfo(`ResourceService UPDATE_RESOURCE ${ requestBody?.body['resourceName'] }`, `STAGE ${ Stage.BEGIN }`, {
      requestBody: JSON.stringify(requestBody, null, 2)
    });

    const resource = ResourceUtils.initResource(requestBody.body) as Resource;
    const body = ResourceUtils.resolveValues({body: resource, valuesOption: requestBody?.valuesOption});

    return this.resourceHttpService.put(resource.getSelfLinkHref(), body)
      .pipe(tap(() => {
        ConsoleLogger.resourcePrettyInfo(`ResourceService UPDATE_RESOURCE ${ requestBody?.body['resourceName'] }`, `STAGE ${ Stage.END }`, {
          result: `resource  '${ resource['resourceName'] }' was updated successful`
        });
      }));
  }

  /**
   * Perform GET request to get count value.
   *
   * @param resourceName used to build root url to the resource
   * @param countQuery name of the count method
   * @param requestParam (optional) http request params that applied to the request
   */
  public count(resourceName: string, countQuery: string, requestParam: RequestParam): Observable<number> {
    ConsoleLogger.resourcePrettyInfo(`ResourceService COUNT '${ resourceName }'`, `STAGE ${ Stage.BEGIN }`, {
      query: countQuery,
      requestParam: JSON.stringify(requestParam, null, 2)
    });

    return this.resourceHttpService.count(resourceName, countQuery, requestParam)
      .pipe(tap(() => {
        ConsoleLogger.resourcePrettyInfo(`ResourceService COUNT '${ resourceName }'`, `STAGE ${ Stage.END }`, {
          result: `count for resource  '${ resourceName }' was performed successful`
        });
      }));
  }

  /**
   * Patch resource.
   *
   * @param requestBody that contains the body directly and optional body values option {@link ValuesOption}
   */
  public patchResource(requestBody: RequestBody<T>): Observable<T | any> {
    ConsoleLogger.resourcePrettyInfo(`ResourceService PATCH_RESOURCE ${ requestBody?.body['resourceName'] }`, `STAGE ${ Stage.BEGIN }`, {
      requestBody: JSON.stringify(requestBody, null, 2)
    });

    const resource = ResourceUtils.initResource(requestBody?.body) as Resource;
    const body = ResourceUtils.resolveValues({body: resource, valuesOption: requestBody?.valuesOption});

    return this.resourceHttpService.patch(resource.getSelfLinkHref(), body)
      .pipe(tap(() => {
        ConsoleLogger.resourcePrettyInfo(`ResourceService PATCH_RESOURCE ${ requestBody?.body['resourceName'] }`, `STAGE ${ Stage.END }`, {
          result: `resource  '${ resource['resourceName'] }' was patched successful`
        });
      }));
  }

  /**
   * Delete resource.
   *
   * @param entity to delete
   * @param options (optional) options that should be applied to the request
   */
  public deleteResource(entity: T, options?: RequestOption): Observable<T | any> {
    ConsoleLogger.resourcePrettyInfo(`ResourceService DELETE_RESOURCE ${ entity['resourceName'] }`, `STAGE ${ Stage.BEGIN }`, {
      options: JSON.stringify(options, null, 2)
    });

    const resource = ResourceUtils.initResource(entity) as Resource;
    const httpParams = UrlUtils.convertToHttpParams({params: options?.params});

    return this.resourceHttpService.delete(resource.getSelfLinkHref(),
      {observe: options?.observe, params: httpParams})
      .pipe(tap(() => {
        ConsoleLogger.resourcePrettyInfo(`ResourceService DELETE_RESOURCE ${ resource['resourceName'] }`, `STAGE ${ Stage.END }`, {
          result: `resource  '${ resource['resourceName'] }' was deleted successful`
        });
      }));
  }

  /**
   * {@see ResourceCollectionHttpService#search}
   */
  public searchCollection(resourceName: string, searchQuery: string, option?: GetOption): Observable<ResourceCollection<T>> {
    ConsoleLogger.resourcePrettyInfo(`ResourceService SEARCH_COLLECTION '${ resourceName }'`, `STAGE ${ Stage.BEGIN }`, {
      query: searchQuery,
      option: JSON.stringify(option, null, 2)
    });

    return this.resourceCollectionHttpServiceSpy.search(resourceName, searchQuery, option)
      .pipe(tap(() => {
        ConsoleLogger.resourcePrettyInfo(`ResourceService SEARCH_COLLECTION '${ resourceName }'`, `STAGE ${ Stage.END }`, {
          result: `search collection by  '${ resourceName }' was successful`
        });
      }));
  }

  /**
   * {@see PagedResourceCollection#search}
   */
  public searchPage(resourceName: string, searchQuery: string, option?: PagedGetOption): Observable<PagedResourceCollection<T>> {
    ConsoleLogger.resourcePrettyInfo(`ResourceService SEARCH_PAGE '${ resourceName }'`, `STAGE ${ Stage.BEGIN }`, {
      query: searchQuery,
      option: JSON.stringify(option, null, 2)
    });

    return this.pagedResourceCollectionHttpService.search(resourceName, searchQuery, option)
      .pipe(tap(() => {
        ConsoleLogger.resourcePrettyInfo(`ResourceService SEARCH_PAGE '${ resourceName }'`, `STAGE ${ Stage.END }`, {
          result: `search page by '${ resourceName }' was successful`
        });
      }));
  }

  /**
   * {@see ResourceHttpService#search}
   */
  public searchSingle(resourceName: string, searchQuery: string, option?: GetOption): Observable<T> {
    ConsoleLogger.resourcePrettyInfo(`ResourceService SEARCH_SINGLE '${ resourceName }'`, `STAGE ${ Stage.BEGIN }`, {
      query: searchQuery,
      option: JSON.stringify(option, null, 2)
    });

    return this.resourceHttpService.search(resourceName, searchQuery, option)
      .pipe(tap(() => {
        ConsoleLogger.resourcePrettyInfo(`ResourceService SEARCH_SINGLE '${ resourceName }'`, `STAGE ${ Stage.END }`, {
          result: `search single by '${ resourceName }' was successful`
        });
      }));
  }

  /**
   * {@see CommonResourceHttpService#customQuery}
   */
  public customQuery(resourceName: string,
                     method: HttpMethod,
                     query: string,
                     requestBody?: RequestBody<any>,
                     option?: PagedGetOption): Observable<any | T | ResourceCollection<T> | PagedResourceCollection<T>> {
    ConsoleLogger.resourcePrettyInfo(`ResourceService CUSTOM_QUERY '${ resourceName }'`, `STAGE ${ Stage.BEGIN }`, {
      method: HttpMethod,
      query,
      requestBody: JSON.stringify(requestBody, null, 2),
      options: JSON.stringify(option, null, 2)
    });

    const body = ResourceUtils.resolveValues(requestBody);

    return this.commonHttpService.customQuery(resourceName, method, query, body, option)
      .pipe(tap(() => {
        ConsoleLogger.resourcePrettyInfo(`ResourceService CUSTOM_QUERY '${ resourceName }'`, `STAGE ${ Stage.END }`, {
          result: `search custom query by '${ resourceName }' was successful`
        });
      }));
  }

}
