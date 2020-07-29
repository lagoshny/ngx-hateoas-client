import { Injectable } from '@angular/core';
import { BaseResource } from '../model/base-resource';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CacheService } from './cache.service';
import { HttpConfigService } from '../../config/http-config.service';
import { PagedCollectionResource } from '../model/paged-collection-resource';
import { ConsoleLogger } from '../../logger/console-logger';
import { catchError, map } from 'rxjs/operators';
import * as _ from 'lodash';
import { isCollectionResource, isPagedCollectionResource } from '../model/resource-type';
import { Observable, throwError as observableThrowError } from 'rxjs';
import { ResourceUtils } from '../../util/resource.utils';
import { UrlUtils } from '../../util/url.utils';
import { DependencyInjector } from '../../util/dependency-injector';
import { ConstantUtil } from '../../util/constant.util';
import { HalOption, PageParam, RequestParam } from '../model/declarations';
import { HttpService } from './http.service';

/**
 * Get instance of the PagedCollectionResourceHttpService by Angular DependencyInjector.
 */
export function getPagedCollectionResourceHttpService(): PagedCollectionResourceHttpService<PagedCollectionResource<BaseResource>> {
  return DependencyInjector.get(PagedCollectionResourceHttpService);
}

/**
 * Service to work with {@link PagedCollectionResource}.
 */
@Injectable({providedIn: 'root'})
export class PagedCollectionResourceHttpService<T extends PagedCollectionResource<BaseResource>> extends HttpService<T> {

  constructor(httpClient: HttpClient,
              cacheService: CacheService<T>,
              private httpConfig: HttpConfigService) {
    super(httpClient, cacheService);
  }

  public get(url: string, options?: {
    headers?: {
      [header: string]: string | string[];
    };
    observe?: 'body' | 'response';
    params?: HttpParams | {
      [param: string]: string | string[];
    }
  }): Observable<T> {
    ConsoleLogger.prettyInfo('GET_PAGED_COLLECTION_RESOURCE REQUEST', {
      url,
      params: options?.params
    });

    return super.get(url, options).pipe(
      map((data: any) => {
        ConsoleLogger.prettyInfo('GET_PAGED_COLLECTION_RESOURCE RESPONSE', {
          url,
          params: options?.params,
          body: JSON.stringify(data, null, 4)
        });

        if (!_.isEmpty(data)) {
          if (!isPagedCollectionResource(data)) {
            ConsoleLogger.error('You try to get wrong resource type, expected paged collection resource type.');
            return observableThrowError('You try to get wrong resource type, expected paged collection resource type.');
          }
          const resource: T = ResourceUtils.instantiatePagedCollectionResource(data);
          this.cacheService.putResource(url, resource);

          return resource;
        }

        return data;
      }),
      catchError(error => observableThrowError(error)));
  }

  public post(url: string, body: any | null, options?: {
    headers?: {
      [header: string]: string | string[];
    };
    observe?: 'body' | 'response';
    params?: HttpParams | {
      [param: string]: string | string[];
    }
  }): Observable<T> {
    ConsoleLogger.prettyInfo('POST_PAGED_COLLECTION_RESOURCE REQUEST', {
      url,
      body,
      params: options?.params
    });

    return super.post(url, body, options)
      .pipe(
        map((data: any) => {
          ConsoleLogger.prettyInfo('POST_PAGED_COLLECTION_RESOURCE RESPONSE', {
            url,
            params: options?.params,
            body: JSON.stringify(data, null, 4)
          });

          if (!_.isEmpty(data)) {
            if (!isPagedCollectionResource(data)) {
              ConsoleLogger.error('You try to get wrong resource type, expected paged collection resource type.');
              return observableThrowError('You try to get wrong resource type, expected paged collection resource type.');
            }
            return ResourceUtils.instantiatePagedCollectionResource(data);
          }

          return data;
        }),
        catchError(error => observableThrowError(error)));
  }

  /**
   * Perform page request by resourceName with params.
   *
   * @param resourceName resource to perform page request
   * @param query custom query path that wii be added to result url at the end
   * @param option hal option that contains all required params
   */
  public getResourcePage(resourceName: string, query?: string, option?: HalOption): Observable<T> {
    const url = UrlUtils.removeUrlTemplateVars(UrlUtils.generateResourceUrl(this.httpConfig.baseApiUrl, resourceName))
      .concat(query ? query : '');
    if (_.isEmpty(option.page)) {
      option.page = ConstantUtil.DEFAULT_PAGE;
    }
    const httpParams = UrlUtils.convertToHttpParams(option);

    return this.get(url, {params: httpParams});
  }

  public search(resourceName: string, query: string, option: HalOption): Observable<T> {
    const url = UrlUtils.removeUrlTemplateVars(
      UrlUtils.generateResourceUrl(this.httpConfig.baseApiUrl, resourceName)).concat('/search/' + query);
    if (_.isEmpty(option) || _.isEmpty(option.page)) {
      option.page = ConstantUtil.DEFAULT_PAGE;
    }
    const httpParams = UrlUtils.convertToHttpParams(option);

    return this.get(url, {params: httpParams});
  }

}
