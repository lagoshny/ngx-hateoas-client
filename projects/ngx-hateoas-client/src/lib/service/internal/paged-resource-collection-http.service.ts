import { Injectable } from '@angular/core';
import { BaseResource } from '../../model/resource/base-resource';
import { HttpClient } from '@angular/common/http';
import { LibConfig } from '../../config/lib-config';
import { PagedResourceCollection } from '../../model/resource/paged-resource-collection';
import { catchError, map } from 'rxjs/operators';
import { isPagedResourceCollection } from '../../model/resource-type';
import { Observable, throwError as observableThrowError } from 'rxjs';
import { ResourceUtils } from '../../util/resource.utils';
import { UrlUtils } from '../../util/url.utils';
import { DependencyInjector } from '../../util/dependency-injector';
import { PagedGetOption, PageParam } from '../../model/declarations';
import { HttpExecutor } from '../http-executor';
import { StageLogger } from '../../logger/stage-logger';
import { Stage } from '../../logger/stage.enum';
import { ValidationUtils } from '../../util/validation.utils';
import { CacheKey } from './cache/model/cache-key';
import { ResourceCacheService } from './cache/resource-cache.service';
import { isEmpty } from 'lodash-es';

/**
 * Get instance of the PagedResourceCollectionHttpService by Angular DependencyInjector.
 */
export function getPagedResourceCollectionHttpService(): PagedResourceCollectionHttpService {
  return DependencyInjector.get(PagedResourceCollectionHttpService);
}

/**
 * Service to perform HTTP requests to get {@link PagedResourceCollection} type.
 */
@Injectable()
export class PagedResourceCollectionHttpService extends HttpExecutor {

  private static readonly DEFAULT_PAGE: PageParam = {
    page: 0,
    size: 20,
  };

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
    const httpOptions = {params: UrlUtils.convertToHttpParams(options)};
    return super.getHttp(url, httpOptions, options?.useCache)
      .pipe(
        map((data: any) => {
          if (!isPagedResourceCollection(data)) {
            if (LibConfig.config.cache.enabled) {
              this.cacheService.evictResource(CacheKey.of(url, httpOptions));
            }
            const errMsg = 'You try to get wrong resource type, expected paged resource collection type.';
            StageLogger.stageErrorLog(Stage.INIT_RESOURCE, {error: errMsg});
            throw new Error(errMsg);
          }

          return ResourceUtils.instantiatePagedResourceCollection(data) as T;
        }),
        catchError(error => observableThrowError(error)));
  }

  /**
   * Perform get paged resource collection request with url built by the resource name.
   *
   * @param resourceName used to build root url to the resource
   * @param options (optional) options that applied to the request
   * @throws error when required params are not valid
   */
  public getResourcePage<T extends PagedResourceCollection<BaseResource>>(resourceName: string,
                                                                          options?: PagedGetOption): Observable<T> {
    ValidationUtils.validateInputParams({resourceName});

    const url = UrlUtils.removeTemplateParams(UrlUtils.generateResourceUrl(UrlUtils.getApiUrl(), resourceName));

    StageLogger.stageLog(Stage.PREPARE_URL, {
      result: url,
      urlParts: `baseUrl: '${ UrlUtils.getApiUrl() }', resource: '${ resourceName }'`
    });

    const pagedOption = !isEmpty(options) ? options : {};
    if (isEmpty(pagedOption.pageParams)) {
      pagedOption.pageParams = PagedResourceCollectionHttpService.DEFAULT_PAGE;
    } else if (!pagedOption.pageParams.size) {
      pagedOption.pageParams.size = PagedResourceCollectionHttpService.DEFAULT_PAGE.size;
    } else if (!pagedOption.pageParams.page) {
      pagedOption.pageParams.page = PagedResourceCollectionHttpService.DEFAULT_PAGE.page;
    }
    return this.get(url, pagedOption);
  }

  /**
   *  Perform search paged resource collection request with url built by the resource name.
   *
   * @param resourceName used to build root url to the resource
   * @param searchQuery name of the search method
   * @param options (optional) options that applied to the request
   * @throws error when required params are not valid
   */
  public search<T extends PagedResourceCollection<BaseResource>>(resourceName: string,
                                                                 searchQuery: string,
                                                                 options?: PagedGetOption): Observable<T> {
    ValidationUtils.validateInputParams({resourceName, searchQuery});

    const url = UrlUtils.removeTemplateParams(
      UrlUtils.generateResourceUrl(UrlUtils.getApiUrl(), resourceName)).concat('/search/' + searchQuery);

    StageLogger.stageLog(Stage.PREPARE_URL, {
      result: url,
      urlParts: `baseUrl: '${ UrlUtils.getApiUrl() }', resource: '${ resourceName }'`
    });

    const pagedOption = !isEmpty(options) ? options : {};
    if (isEmpty(pagedOption.pageParams)) {
      pagedOption.pageParams = PagedResourceCollectionHttpService.DEFAULT_PAGE;
    } else if (!pagedOption.pageParams.size) {
      pagedOption.pageParams.size = PagedResourceCollectionHttpService.DEFAULT_PAGE.size;
    } else if (!pagedOption.pageParams.page) {
      pagedOption.pageParams.page = PagedResourceCollectionHttpService.DEFAULT_PAGE.page;
    }
    return this.get(url, pagedOption);
  }

}
