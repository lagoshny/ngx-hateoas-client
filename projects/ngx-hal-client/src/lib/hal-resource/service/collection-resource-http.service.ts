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
import { HalSimpleOption } from '../model/declarations';
import { UrlUtils } from '../../util/url.utils';
import { HttpService } from './http.service';

export function getCollectionResourceHttpService(): CollectionResourceHttpService<CollectionResource<BaseResource>> {
  return DependencyInjector.get(CollectionResourceHttpService);
}

@Injectable({providedIn: 'root'})
export class CollectionResourceHttpService<T extends CollectionResource<BaseResource>> extends HttpService<T> {

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
    ConsoleLogger.prettyInfo('GET_COLLECTION_RESOURCE REQUEST', {
      url,
      params: options?.params
    });

    return super.get(url, options)
      .pipe(
        map((data: any) => {
          ConsoleLogger.prettyInfo('GET_COLLECTION_RESOURCE RESPONSE', {
            url,
            params: options?.params,
            body: JSON.stringify(data, null, 4)
          });

          if (!_.isEmpty(data)) {
            if (!isCollectionResource(data)) {
              ConsoleLogger.error('You try to get wrong resource type, expected collection resource type.');
              return observableThrowError('You try to get wrong resource type, expected collection resource type.');
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
    ConsoleLogger.prettyInfo('POST_COLLECTION_RESOURCE REQUEST', {
      url,
      body,
      params: options?.params
    });

    return super.post(url, body, options)
      .pipe(
        map((data: any) => {
          ConsoleLogger.prettyInfo('POST_COLLECTION_RESOURCE RESPONSE', {
            url,
            params: options?.params,
            body: JSON.stringify(data, null, 4)
          });

          if (!_.isEmpty(data)) {
            if (!isCollectionResource(data)) {
              ConsoleLogger.error('You try to get wrong resource type, expected collection resource type.');
              return observableThrowError('You try to get wrong resource type, expected collection resource type.');
            }
            return ResourceUtils.instantiateCollectionResource(data);
          }

          return data;
        }),
        catchError(error => observableThrowError(error)));
  }

  public getResourceCollection(resourceName: string, query?: string, option?: HalSimpleOption): Observable<T> {
    const url = UrlUtils.generateResourceUrl(this.httpConfig.baseApiUrl, resourceName).concat(query ? query : '');
    const httpParams = UrlUtils.convertToHttpParams(option);

    return this.get(url, {params: httpParams});
  }

  public search(resourceName: string, query: string, option?: HalSimpleOption): Observable<T> {
    const url = UrlUtils.generateResourceUrl(this.httpConfig.baseApiUrl, resourceName).concat('/search/' + query);
    const httpParams = UrlUtils.convertToHttpParams(option);

    return this.get(url, {params: httpParams});
  }

}
