import { Injectable } from '@angular/core';
import { Observable, throwError as observableThrowError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { ResourceUtils } from '../../util/resource.utils';
import { BaseResource } from '../model/base-resource';
import { DependencyInjector } from '../../util/dependency-injector';
import { UrlUtils } from '../../util/url.utils';
import * as _ from 'lodash';
import { ConsoleLogger } from '../../logger/console-logger';
import { isEmbeddedResource, isResource } from '../model/resource-type';
import { HalOption, HalSimpleOption, RequestParam } from '../model/declarations';
import { HttpService } from './http.service';
import { CacheService } from './cache.service';
import { HttpConfigService } from '../../config/http-config.service';

export function getResourceHttpService(): ResourceHttpService<BaseResource> {
  return DependencyInjector.get(ResourceHttpService);
}

@Injectable({providedIn: 'root'})
export class ResourceHttpService<T extends BaseResource> extends HttpService<T> {

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
    ConsoleLogger.prettyInfo('GET_RESOURCE REQUEST', {
      url,
      params: options?.params
    });

    return super.get(url, options)
      .pipe(
        map((data: any) => {
          ConsoleLogger.prettyInfo('GET_RESOURCE RESPONSE', {
            url,
            params: options?.params,
            body: JSON.stringify(data, null, 4)
          });

          if (!_.isEmpty(data)) {
            if (!isResource(data) && !isEmbeddedResource(data)) {
              ConsoleLogger.error('You try to get wrong resource type, expected single resource.');
              return observableThrowError('You try to get wrong resource type, expected single resource.');
            }

            const resource: T = ResourceUtils.instantiateResource(data);
            this.cacheService.putResource(url, resource);
            return resource;
          }

          return data;
        }),
        catchError(error => observableThrowError(error)));
  }

  public post(url: string, body: any | null, options?: {
    headers?: HttpHeaders | {
      [header: string]: string | string[];
    };
    observe?: 'body' | 'response';
    params?: HttpParams | {
      [param: string]: string | string[];
    }
  }): Observable<any> {
    ConsoleLogger.prettyInfo('POST_RESOURCE REQUEST', {
      url,
      params: options?.params,
      body: JSON.stringify(body, null, 4)
    });

    return super.post(url, body, options)
      .pipe(
        map((data: any) => {
          ConsoleLogger.prettyInfo('POST_RESOURCE RESPONSE', {
            url,
            params: options?.params,
            body: JSON.stringify(data, null, 4)
          });

          // this.cacheService.evictResource(url);
          // TODO: а надо ли тут создавать ресурс?
          if (!_.isEmpty(data) && (isResource(data) || isEmbeddedResource(data))) {
            return ResourceUtils.instantiateResource(data);
          }
          return data;
        }),
        catchError(error => observableThrowError(error))
      );
  }

  public put(url: string, body: any | null, options?: {
    headers?: HttpHeaders | {
      [header: string]: string | string[];
    };
    observe?: 'body' | 'response';
    params?: HttpParams | {
      [param: string]: string | string[];
    }
  }): Observable<any> {
    ConsoleLogger.prettyInfo('PUT_RESOURCE REQUEST', {
      url,
      params: options?.params,
      body: JSON.stringify(body, null, 4)
    });

    return super.put(url, body, options)
      .pipe(
        map((data: any) => {
          ConsoleLogger.prettyInfo('PUT_RESOURCE RESPONSE', {
            url,
            params: options?.params,
            body: JSON.stringify(data, null, 4)
          });

          // TODO: а надо ли тут создавать ресурс?
          if (!_.isEmpty(data) && (isResource(data) || isEmbeddedResource(data))) {
            return ResourceUtils.instantiateResource(data);
          }
          return data;
        }),
        catchError(error => observableThrowError(error))
      );
  }

  public patch(url: string, body: any | null, options?: {
    headers?: HttpHeaders | {
      [header: string]: string | string[];
    };
    observe?: 'body' | 'response';
    params?: HttpParams | {
      [param: string]: string | string[];
    }
  }): Observable<any> {
    ConsoleLogger.prettyInfo('PATH_RESOURCE REQUEST', {
      url,
      params: options?.params,
      body: JSON.stringify(body, null, 4)
    });

    return super.patch(url, body, options)
      .pipe(
        map((data: any) => {
          ConsoleLogger.prettyInfo('PATH_RESOURCE RESPONSE', {
            url,
            params: options?.params,
            body: JSON.stringify(data, null, 4)
          });

          this.cacheService.evictResource(url);

          // TODO: а надо ли тут создавать ресурс?
          if (!_.isEmpty(data) && (isResource(data) || isEmbeddedResource(data))) {
            return ResourceUtils.instantiateResource(data);
          }

          return data;
        }),
        catchError(error => observableThrowError(error))
      );
  }

  public delete(url: string, options?: {
    headers?: HttpHeaders | {
      [header: string]: string | string[];
    };
    observe?: 'body' | 'response';
    params?: HttpParams | {
      [param: string]: string | string[];
    }
  }): Observable<any> {
    ConsoleLogger.prettyInfo('DELETE_RESOURCE REQUEST', {
      url,
      params: options?.params
    });

    return super.delete(url, options)
      .pipe(
        map((data: any) => {
          ConsoleLogger.prettyInfo('DELETE_RESOURCE RESPONSE', {
            url,
            params: options?.params,
            body: JSON.stringify(data, null, 4)
          });

          this.cacheService.evictResource(url);
          // TODO: а надо ли тут создавать ресурс?
          if (!_.isEmpty(data) && (isResource(data) || isEmbeddedResource(data))) {
            return ResourceUtils.instantiateResource(data);
          }

          return data;
        }),
        catchError(error => observableThrowError(error))
      );
  }

  public count(resourceName: string, query: string, params?: RequestParam): Observable<number> {
    const url = UrlUtils.generateResourceUrl(this.httpConfig.baseApiUrl, resourceName)
      .concat('/search/' + (query === undefined ? 'countAll' : query));
    const httpParams = UrlUtils.convertToHttpParams(params);

    ConsoleLogger.prettyInfo('COUNT REQUEST', {
      url,
      params
    });

    return super.get(url, {params: httpParams})
      .pipe(
        map((data: any) => {
          ConsoleLogger.prettyInfo('COUNT RESPONSE', {
            url,
            params,
            data
          });
          return data as number;
        }),
        catchError(error => observableThrowError(error))
      );
  }

  public getProjection(resourceName: string,
                       id: string,
                       projectionName: string,
                       // expireMs: number = CacheHelper.defaultExpire,
                       // isCacheActive: boolean = true
  ): Observable<BaseResource> {
    const uri = UrlUtils.generateResourceUrl(this.httpConfig.baseApiUrl, resourceName)
      .concat('/', id)
      .concat('?projection=' + projectionName);

    return this.get(uri);
  }


  public getResource(resourceName: string, id: any, option?: HalSimpleOption): Observable<T> {
    const uri = UrlUtils.generateResourceUrl(this.httpConfig.baseApiUrl, resourceName).concat('/', id);
    const httpParams = UrlUtils.convertToHttpParams(option);

    return this.get(uri, {params: httpParams});
  }

  public postResource(resourceName: string, body: any): Observable<T> {
    const uri = UrlUtils.generateResourceUrl(this.httpConfig.baseApiUrl, resourceName);

    return this.post(uri, body);
  }

  public putResource(resourceName: string, body: any): Observable<T> {
    const uri = UrlUtils.generateResourceUrl(this.httpConfig.baseApiUrl, resourceName);

    return this.put(uri, body);
  }

  public patchResource(resourceName: string, body: any): Observable<T> {
    const uri = UrlUtils.generateResourceUrl(this.httpConfig.baseApiUrl, resourceName);

    return this.patch(uri, body);
  }

  public search(resourceName: string, query: string, option?: HalSimpleOption): Observable<T> {
    const url = UrlUtils.generateResourceUrl(this.httpConfig.baseApiUrl, resourceName).concat('/search/' + query);
    const httpParams = UrlUtils.convertToHttpParams(option);

    return this.get(url, {params: httpParams});
  }

}
