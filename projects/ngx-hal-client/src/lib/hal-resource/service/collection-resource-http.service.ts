import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CacheService } from './cache.service';
import { HttpConfigService } from '../../config/http-config.service';
import { Observable, throwError as observableThrowError } from 'rxjs';
import { ConsoleLogger } from '../../logger/console-logger';
import { catchError, map } from 'rxjs/operators';
import * as _ from 'lodash';
import { isCollectionResource } from '../model/resource-type';
import { ResourceUtils } from '../../util/resource.utils';
import { CollectionResource } from '../model/collection-resource';
import { BaseResource } from '../model/base-resource';
import { DependencyInjector } from '../../util/dependency-injector';
import { RequestParam } from '../model/declarations';
import { UrlUtils } from '../../util/url.utils';
import { CommonHttpService } from './common-http.service';

export function getCollectionResourceHttpService(): CollectionResourceHttpService<CollectionResource<BaseResource>> {
  return DependencyInjector.get(CollectionResourceHttpService);
}

@Injectable({providedIn: 'root'})
export class CollectionResourceHttpService<T extends CollectionResource<BaseResource>> extends CommonHttpService<T> {

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
    ConsoleLogger.prettyInfo('GET_RESOURCE_COLLECTION REQUEST', {
      url,
      params: options?.params
    });

    return super.get(url, options)
      .pipe(
        map((data: any) => {
          ConsoleLogger.prettyInfo('GET_RESOURCE_COLLECTION RESPONSE', {
            url,
            params: options?.params,
            body: JSON.stringify(data, null, 4)
          });

          if (!_.isEmpty(data)) {
            if (!isCollectionResource(data)) {
              ConsoleLogger.error('You try to get wrong resource type, expected resource collection type.');
              return observableThrowError('You try to get wrong resource type, expected resource collection type.');
            }
            const resource: T = ResourceUtils.instantiateCollectionResource(data);
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
    ConsoleLogger.prettyInfo('POST_RESOURCE_COLLECTION REQUEST', {
      url,
      body,
      params: options?.params
    });

    return super.post(url, body, options)
      .pipe(
        map((data: any) => {
          ConsoleLogger.prettyInfo('POST_RESOURCE_COLLECTION RESPONSE', {
            url,
            params: options?.params,
            body: JSON.stringify(data, null, 4)
          });

          if (!_.isEmpty(data)) {
            if (!isCollectionResource(data)) {
              ConsoleLogger.error('You try to get wrong resource type, expected resource collection type.');
              return observableThrowError('You try to get wrong resource type, expected resource collection type.');
            }
            return ResourceUtils.instantiateCollectionResource(data);
          }

          return data;
        }),
        catchError(error => observableThrowError(error)));
  }

  public getResourceCollection(resourceName: string, query?: string, requestParam?: RequestParam): Observable<T> {
    const url = UrlUtils.generateResourceUrl(this.httpConfig.baseApiUrl, resourceName).concat(query ? query : '');
    const httpParams = UrlUtils.convertToHttpParams(requestParam);

    return this.get(url, {params: httpParams});
  }

  public postResourceCollection(resourceName: string, query: string, body: any, requestParam?: RequestParam): Observable<T> {
    const url = UrlUtils.generateResourceUrl(this.httpConfig.baseApiUrl, resourceName).concat(query);
    const httpParams = UrlUtils.convertToHttpParams(requestParam);

    return this.post(url, body, {params: httpParams});
  }

  public search(resourceName: string, query: string, requestParam?: RequestParam): Observable<T> {
    const url = UrlUtils.generateResourceUrl(this.httpConfig.baseApiUrl, resourceName).concat('/search/' + query);
    const httpParams = UrlUtils.convertToHttpParams(requestParam);

    return this.get(url, {params: httpParams});
  }

  public getProjection(resourceName: string,
                       projectionName: string,
                       // expireMs: number = CacheHelper.defaultExpire,
                       // isCacheActive: boolean = true
  ): Observable<T> {
    const url = UrlUtils.generateResourceUrl(this.httpConfig.baseApiUrl, resourceName)
      .concat('?projection=' + projectionName);

    return this.get(url);
  }

}
