import { Injectable } from '@angular/core';
import { BaseResource } from '../../model/resource/base-resource';
import { HttpClient } from '@angular/common/http';
import { LibConfig } from '../../config/lib-config';
import { PagedResourceCollection } from '../../model/resource/paged-resource-collection';
import { catchError, map } from 'rxjs/operators';
import { getResourceType, isPagedResourceCollection } from '../../model/resource-type';
import { Observable, throwError as observableThrowError } from 'rxjs';
import { ResourceUtils } from '../../util/resource.utils';
import { UrlUtils } from '../../util/url.utils';
import { DependencyInjector } from '../../util/dependency-injector';
import { PagedGetOption } from '../../model/declarations';
import { HttpExecutor } from '../http-executor';
import { StageLogger } from '../../logger/stage-logger';
import { Stage } from '../../logger/stage.enum';
import { ValidationUtils } from '../../util/validation.utils';
import { CacheKey } from './cache/model/cache-key';
import { ResourceCacheService } from './cache/resource-cache.service';

/**
 * Get instance of the PagedResourceCollectionHttpService by Angular DependencyInjector.
 */
export function getPagedResourceCollectionHttpService(): PagedResourceCollectionHttpService {
  return DependencyInjector.get(PagedResourceCollectionHttpService);
}

/**
 * Service to perform HTTP requests to get {@link PagedResourceCollection} type.
 */
@Injectable({
  providedIn: 'root',
})
export class PagedResourceCollectionHttpService extends HttpExecutor {

  constructor(httpClient: HttpClient,
              cacheService: ResourceCacheService) {
    super(httpClient, cacheService);
  }

  /**
   * Perform GET request to retrieve paged collection of the resources.
   *
   * @param url to perform request
   * @param options request options
   * @throws error when required params are not valid or returned resource type is not paged collection of the resources
   */
  public get<T extends PagedResourceCollection<BaseResource>>(url: string,
                                                              options?: PagedGetOption): Observable<T> {
    const httpOptions = UrlUtils.convertToHttpOptions(options);

    return super.getHttp(url, httpOptions, options?.useCache)
      .pipe(
        map((data: any) => {
          if (!isPagedResourceCollection(data)) {
            if (LibConfig.config.cache.enabled) {
              this.cacheService.evictResource(CacheKey.of(url, httpOptions));
            }
            const errMsg = `You try to get wrong resource type: expected PagedResourceCollection type, actual ${ getResourceType(data) } type.`;
            StageLogger.stageErrorLog(Stage.INIT_RESOURCE, {error: errMsg, options});
            throw new Error(errMsg);
          }

          return ResourceUtils.instantiatePagedResourceCollection(data, httpOptions?.params?.has('projection')) as T;
        }),
        catchError(error => observableThrowError(error)));
  }

  /**
   * Perform get paged resource collection request with url built by the resource name.
   *
   * @param resourceName used to build root url to the resource
   * @param resourceSource alias of resource source
   * @param options (optional) options that applied to the request
   * @throws error when required params are not valid
   */
  public getResourcePage<T extends PagedResourceCollection<BaseResource>>(resourceName: string,
                                                                          resourceSource: string,
                                                                          options?: PagedGetOption): Observable<T> {
    ValidationUtils.validateInputParams({resourceName});

    const url = UrlUtils.removeTemplateParams(UrlUtils.generateResourceUrl(UrlUtils.getApiUrl(resourceSource), resourceName));

    StageLogger.stageLog(Stage.PREPARE_URL, {
      result: url,
      urlParts: `baseUrl: '${ UrlUtils.getApiUrl(resourceSource) }', resource: '${ resourceName }'`,
      options
    });

    return this.get(url, UrlUtils.fillDefaultPageDataIfNoPresent(options));
  }

  /**
   *  Perform search paged resource collection request with url built by the resource name.
   *
   * @param resourceName used to build root url to the resource
   * @param resourceSource alias of resource source
   * @param searchQuery name of the search method
   * @param options (optional) options that applied to the request
   * @throws error when required params are not valid
   */
  public search<T extends PagedResourceCollection<BaseResource>>(resourceName: string,
                                                                 resourceSource: string,
                                                                 searchQuery: string,
                                                                 options?: PagedGetOption): Observable<T> {
    ValidationUtils.validateInputParams({resourceName, searchQuery});

    const url = UrlUtils.removeTemplateParams(
      UrlUtils.generateResourceUrl(UrlUtils.getApiUrl(resourceSource), resourceName)).concat('/search/' + searchQuery);

    StageLogger.stageLog(Stage.PREPARE_URL, {
      result: url,
      urlParts: `baseUrl: '${ UrlUtils.getApiUrl(resourceSource) }', resource: '${ resourceName }'`,
      options
    });

    return this.get(url, UrlUtils.fillDefaultPageDataIfNoPresent(options));
  }

}
