import { Injectable } from '@angular/core';
import { BaseResource } from '../../model/resource/base-resource';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CacheService } from '../cache.service';
import { HttpConfigService } from '../../config/http-config.service';
import { PagedResourceCollection } from '../../model/resource/paged-resource-collection';
import { ConsoleLogger } from '../../logger/console-logger';
import { catchError, map } from 'rxjs/operators';
import * as _ from 'lodash';
import { isPagedResourceCollection } from '../../model/resource-type';
import { Observable, of as observableOf, throwError as observableThrowError } from 'rxjs';
import { ResourceUtils } from '../../util/resource.utils';
import { UrlUtils } from '../../util/url.utils';
import { DependencyInjector } from '../../util/dependency-injector';
import { PagedGetOption, PageParam } from '../../model/declarations';
import { HttpExecutor } from '../http-executor';

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
              public cacheService: CacheService<T>,
              private httpConfig: HttpConfigService) {
    super(httpClient);
  }

  /**
   * Perform GET request to retrieve paged collection of the resources.
   *
   * @param url to perform request
   * @param options request options
   * @throws error if returned resource type is not paged collection of the resources
   */
  public get(url: string, options?: {
    headers?: {
      [header: string]: string | string[];
    };
    params?: HttpParams | {
      [param: string]: string | string[];
    }
  }): Observable<T> {
    if (this.cacheService.hasResource(url)) {
      return observableOf(this.cacheService.getResource());
    }

    ConsoleLogger.prettyInfo('GET_PAGED_COLLECTION_RESOURCE REQUEST', {
      url,
      params: options?.params
    });

    return super.get(url, {...options, observe: 'body'}).pipe(
      map((data: any) => {
        ConsoleLogger.prettyInfo('GET_PAGED_COLLECTION_RESOURCE RESPONSE', {
          url,
          params: options?.params,
          body: JSON.stringify(data, null, 4)
        });

        if (!isPagedResourceCollection(data)) {
          ConsoleLogger.error('You try to get wrong resource type, expected paged resource collection type.');
          throw Error('You try to get wrong resource type, expected paged resource collection type.');
        }
        const resource: T = ResourceUtils.instantiatePagedResourceCollection(data);
        this.cacheService.putResource(url, resource);

        return resource;
      }),
      catchError(error => observableThrowError(error)));
  }

  /**
   * Perform get paged resource collection request with url built by the resource name.
   *
   * @param resourceName used to build root url to the resource
   * @param query (optional) url path that applied to the result url at the end
   * @param option (optional) options that applied to the request
   */
  public getResourcePage(resourceName: string, query?: string, option?: PagedGetOption): Observable<T> {
    if (!resourceName) {
      return observableThrowError(new Error('resource name should be defined'));
    }
    const url = UrlUtils.removeTemplateParams(UrlUtils.generateResourceUrl(this.httpConfig.baseApiUrl, resourceName, query));
    const pagedOption = !_.isEmpty(option) ? option : {};
    if (_.isEmpty(pagedOption.page)) {
      pagedOption.page = PagedResourceCollectionHttpService.DEFAULT_PAGE;
    }
    return this.get(url, {params: UrlUtils.convertToHttpParams(pagedOption)});
  }

  /**
   *  Perform search paged resource collection request with url built by the resource name.
   *
   * @param resourceName used to build root url to the resource
   * @param searchQuery name of the search method
   * @param option (optional) options that applied to the request
   */
  public search(resourceName: string, searchQuery: string, option?: PagedGetOption): Observable<T> {
    if (!resourceName) {
      return observableThrowError(new Error('resource name should be defined'));
    }
    if (!searchQuery) {
      return observableThrowError(new Error('search query should be defined'));
    }
    const url = UrlUtils.removeTemplateParams(
      UrlUtils.generateResourceUrl(this.httpConfig.baseApiUrl, resourceName)).concat('/search/' + searchQuery);
    const pagedOption = !_.isEmpty(option) ? option : {};
    if (_.isEmpty(pagedOption.page)) {
      pagedOption.page = PagedResourceCollectionHttpService.DEFAULT_PAGE;
    }
    return this.get(url, {params: UrlUtils.convertToHttpParams(pagedOption)});
  }

}
