import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CacheService } from './cache.service';
import { HttpConfigService } from '../../config/http-config.service';
import { Observable, of as observableOf } from 'rxjs';
import { ConsoleLogger } from '../../logger/console-logger';
import { catchError, map } from 'rxjs/operators';
import * as _ from 'lodash';
import { isCollectionResource } from '../model/resource-type';
import { throwError as observableThrowError } from 'rxjs/internal/observable/throwError';
import { ResourceUtils } from '../../util/resource.utils';
import { CollectionResource } from '../model/collection-resource';
import { BaseResource } from '../model/base-resource';
import { DependencyInjector } from '../../util/dependency-injector';
import { RequestParam } from '../model/declarations';
import { UrlUtils } from '../../util/url.utils';

export function getCollectionResourceHttpService(): CollectionResourceHttpService<CollectionResource<BaseResource>> {
  return DependencyInjector.get(CollectionResourceHttpService);
}

@Injectable({providedIn: 'root'})
export class CollectionResourceHttpService<T extends CollectionResource<BaseResource>> {


  constructor(private httpClient: HttpClient,
              private cacheService: CacheService<T>,
              private httpConfig: HttpConfigService) {
  }

  public getResourceCollection(url: string, options?: {
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

  public postResourceCollection(url: string, body: any | null, options?: {
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

  public get(resourceName: string, query?: string, requestParam?: RequestParam): Observable<T> {
    const url = UrlUtils.generateResourceUrl(this.httpConfig.baseApiUrl, resourceName).concat(query ? query : '');
    const httpParams = UrlUtils.convertToHttpParams(requestParam);

    return this.getResourceCollection(url, {params: httpParams});
  }

  public post(resourceName: string, query: string, body: any, requestParam?: RequestParam): Observable<T> {
    const url = UrlUtils.generateResourceUrl(this.httpConfig.baseApiUrl, resourceName).concat(query);
    const httpParams = UrlUtils.convertToHttpParams(requestParam);

    return this.postResourceCollection(url, body, {params: httpParams});
  }

  public search(resourceName: string, query: string, requestParam?: RequestParam): Observable<T> {
    const url = UrlUtils.generateResourceUrl(this.httpConfig.baseApiUrl, resourceName).concat('/search/' + query);
    const httpParams = UrlUtils.convertToHttpParams(requestParam);

    return this.getResourceCollection(url, {params: httpParams});
  }

  public getProjection(resourceName: string,
                       projectionName: string,
                       // expireMs: number = CacheHelper.defaultExpire,
                       // isCacheActive: boolean = true
  ): Observable<T> {
    const url = UrlUtils.generateResourceUrl(this.httpConfig.baseApiUrl, resourceName)
      .concat('?projection=' + projectionName);

    return this.getResourceCollection(url);
  }

}
