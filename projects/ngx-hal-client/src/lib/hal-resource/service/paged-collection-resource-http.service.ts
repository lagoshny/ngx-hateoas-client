import { Injectable } from '@angular/core';
import { BaseResource } from '../model/base-resource';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CacheService } from './cache.service';
import { HttpConfigService } from '../../config/http-config.service';
import { HalPageParam, PagedCollectionResource } from '../model/paged-collection-resource';
import { Observable, of as observableOf } from 'rxjs';
import { ConsoleLogger } from '../../logger/console-logger';
import { catchError, map } from 'rxjs/operators';
import * as _ from 'lodash';
import { isPagedCollectionResource } from '../model/defenition';
import { throwError as observableThrowError } from 'rxjs/internal/observable/throwError';
import { ResourceUtils } from '../../util/resource.utils';
import { HalParam } from '../../service/hal-resource-operation';
import { UrlUtils } from '../../util/url.utils';
import { DependencyInjector } from '../../util/dependency-injector';
import { ConstantUtil } from '../../util/constant.util';

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
export class PagedCollectionResourceHttpService<T extends PagedCollectionResource<BaseResource>> {

  constructor(private httpClient: HttpClient,
              private cacheService: CacheService<T>,
              private httpConfig: HttpConfigService) {
  }

  public getResourcePage(url: string, options?: {
    headers?: {
      [header: string]: string | string[];
    };
    observe?: 'body' | 'response';
    params?: HttpParams | {
      [param: string]: string | string[];
    }
  }): Observable<T> {

    ConsoleLogger.prettyInfo('GET_RESOURCE_PAGE REQUEST', {
      url,
      params: options?.params
    });

    if (this.cacheService.hasResource(url)) {
      return observableOf(this.cacheService.getResourceCollection());
    }

    let response;
    if (options?.observe === 'response') {
      response = this.httpClient.get(url, {...options, observe: 'response'});
    } else {
      response = this.httpClient.get(url, {...options, observe: 'body'});
    }

    return response.pipe(
      map((data: any) => {
        // if (builder) {
        //   for (const embeddedClassName of Object.keys(data._links)) {
        //     if (embeddedClassName === 'self') {
        //       const href: string = data._links[embeddedClassName].href;
        //       const idx: number = href.lastIndexOf('/');
        //       const realClassName = href.replace(this.httpConfig.rootUri, '').substring(0, idx);
        //       response = ResourceUtils.searchSubtypes(builder, realClassName, response);
        //       break;
        //     }
        //   }
        // }

        ConsoleLogger.prettyInfo('GET_RESOURCE_PAGE RESPONSE', {
          url,
          params: options?.params,
          body: JSON.stringify(data, null, 4)
        });

        if (!_.isEmpty(data)) {
          if (!isPagedCollectionResource(data)) {
            ConsoleLogger.error('You try to get wrong resource type, expected paged resource collection type.');
            return observableThrowError('You try to get wrong resource type, expected paged resource collection type.');
          }
          const resource: T = ResourceUtils.instantiatePagedCollectionResource(data);
          this.cacheService.putResource(url, resource);

          return resource;
        }

        return data;
      }),
      catchError(error => observableThrowError(error)));
  }

  /**
   * Perform page request by resourceName with params.
   *
   * @param resourceName resource to perform page request
   * @param param page params
   */
  public getPage(resourceName: string, param?: HalPageParam): Observable<T> {
    const url = UrlUtils.removeUrlTemplateVars(UrlUtils.generateResourceUrl(this.httpConfig.baseApiUrl, resourceName));
    if (_.isEmpty(param)) {
      param = ConstantUtil.DEFAULT_PAGE;
    }
    const httpParams = UrlUtils.convertToHttpParams(param as HalParam);

    return this.getResourcePage(url, {params: httpParams});
  }

}
