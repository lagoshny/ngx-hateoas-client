import { Injectable } from '@angular/core';
import { BaseResource } from '../../model/resource/base-resource';
import { HttpClient } from '@angular/common/http';
import { CacheService } from '../cache.service';
import { HttpConfigService } from '../../config/http-config.service';
import { PagedResourceCollection } from '../../model/resource/paged-resource-collection';
import { catchError, map } from 'rxjs/operators';
import * as _ from 'lodash';
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
import { CacheKey } from '../../model/cache/cache-key';

/**
 * Get instance of the PagedResourceCollectionHttpService by Angular DependencyInjector.
 */
export function getPagedResourceCollectionHttpService(): PagedResourceCollectionHttpService<PagedResourceCollection<BaseResource>> {
  return DependencyInjector.get(PagedResourceCollectionHttpService);
}

/**
 * Service to perform HTTP requests to get {@link PagedResourceCollection} type.
 */
@Injectable()
export class PagedResourceCollectionHttpService<T extends PagedResourceCollection<BaseResource>> extends HttpExecutor {

  private static readonly DEFAULT_PAGE: PageParam = {
    page: 0,
    size: 20,
  };

  constructor(httpClient: HttpClient,
              cacheService: CacheService<T>,
              private httpConfig: HttpConfigService) {
    super(httpClient, cacheService);
  }

  /**
   * Perform GET request to retrieve paged collection of the resources.
   *
   * @param url to perform request
   * @param options request options
   * @throws error when required params are not valid or returned resource type is not paged collection of the resources
   */
  public get(url: string,
             options?: PagedGetOption): Observable<T> {
    const httpOptions = {params: UrlUtils.convertToHttpParams(options)};
    return super.getHttp(url, httpOptions, options?.useCache).pipe(
      map((data: any) => {
        if (!isPagedResourceCollection(data)) {
          this.cacheService.evictValue(CacheKey.of(url, httpOptions));
          const errMsg = 'You try to get wrong resource type, expected paged resource collection type.';
          StageLogger.stageErrorLog(Stage.INIT_RESOURCE, {error: errMsg});
          throw Error(errMsg);
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
  public getResourcePage(resourceName: string, options?: PagedGetOption): Observable<T> {
    ValidationUtils.validateInputParams({resourceName});

    const url = UrlUtils.removeTemplateParams(UrlUtils.generateResourceUrl(this.httpConfig.baseApiUrl, resourceName));

    StageLogger.stageLog(Stage.PREPARE_URL, {
      result: url,
      urlParts: `baseUrl: '${ this.httpConfig.baseApiUrl }', resource: '${ resourceName }'`
    });

    const pagedOption = !_.isEmpty(options) ? options : {};
    if (_.isEmpty(pagedOption.pageParams)) {
      pagedOption.pageParams = PagedResourceCollectionHttpService.DEFAULT_PAGE;
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
  public search(resourceName: string, searchQuery: string, options?: PagedGetOption): Observable<T> {
    ValidationUtils.validateInputParams({resourceName, searchQuery});

    const url = UrlUtils.removeTemplateParams(
      UrlUtils.generateResourceUrl(this.httpConfig.baseApiUrl, resourceName)).concat('/search/' + searchQuery);

    StageLogger.stageLog(Stage.PREPARE_URL, {
      result: url,
      urlParts: `baseUrl: '${ this.httpConfig.baseApiUrl }', resource: '${ resourceName }'`
    });

    const pagedOption = !_.isEmpty(options) ? options : {};
    if (_.isEmpty(pagedOption.pageParams)) {
      pagedOption.pageParams = PagedResourceCollectionHttpService.DEFAULT_PAGE;
    }
    return this.get(url, pagedOption);
  }

}
