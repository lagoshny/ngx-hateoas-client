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
import { GetOption, RequestParam } from '../model/declarations';
import { HttpExecutor } from './http-executor';
import { CacheService } from './cache.service';
import { HttpConfigService } from '../../config/http-config.service';

/**
 * Get instance of the ResourceHttpService by Angular DependencyInjector.
 */
export function getResourceHttpService(): ResourceHttpService<BaseResource> {
  return DependencyInjector.get(ResourceHttpService);
}

/**
 * Service to perform HTTP requests to get {@link Resource} type.
 */
@Injectable()
export class ResourceHttpService<T extends BaseResource> extends HttpExecutor<T> {

  constructor(httpClient: HttpClient,
              cacheService: CacheService<T>,
              private httpConfig: HttpConfigService) {
    super(httpClient, cacheService);
  }

  /**
   * Perform GET request to retrieve resource.
   *
   * @param url to perform request
   * @param options request options
   * @throws error if returned resource type is not resource
   */
  public get(url: string, options?: {
    headers?: {
      [header: string]: string | string[];
    };
    params?: HttpParams | {
      [param: string]: string | string[];
    }
  }): Observable<T> {
    ConsoleLogger.prettyInfo('GET_RESOURCE REQUEST', {
      url,
      params: options?.params
    });

    return super.get(url, {...options, observe: 'body'})
      .pipe(
        map((data: any) => {
          ConsoleLogger.prettyInfo('GET_RESOURCE RESPONSE', {
            url,
            params: options?.params,
            body: JSON.stringify(data, null, 4)
          });

          if (!isResource(data) && !isEmbeddedResource(data)) {
            ConsoleLogger.error('You try to get wrong resource type, expected single resource.');
            throw Error('You try to get wrong resource type, expected single resource.');
          }

          const resource: T = ResourceUtils.instantiateResource(data);
          this.cacheService.putResource(url, resource);

          return resource;
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

          this.cacheService.evictResource(url);
          if (isResource(data) || isEmbeddedResource(data)) {
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
          if (isResource(data) || isEmbeddedResource(data)) {
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
          if (isResource(data) || isEmbeddedResource(data)) {
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
          if (isResource(data) || isEmbeddedResource(data)) {
            return ResourceUtils.instantiateResource(data);
          }

          return data;
        }),
        catchError(error => observableThrowError(error))
      );
  }

  /**
   * Perform GET request to get count value.
   *
   * @param resourceName used to build root url to the resource
   * @param countQuery name of the count method
   * @param requestParam (optional) http request params that applied to the request
   */
  public count(resourceName: string, countQuery?: string, requestParam?: RequestParam): Observable<number> {
    const url = UrlUtils.generateResourceUrl(this.httpConfig.baseApiUrl, resourceName)
      .concat('/search/' + (_.isNil(countQuery) ? 'countAll' : countQuery));
    const httpParams = UrlUtils.convertToHttpParams(requestParam);

    ConsoleLogger.prettyInfo('COUNT REQUEST', {
      url,
      params: requestParam
    });

    return super.get(url, {params: httpParams, observe: 'body'})
      .pipe(
        map((data: any) => {
          ConsoleLogger.prettyInfo('COUNT RESPONSE', {
            url,
            params: requestParam,
            data
          });
          return data as number;
        }),
        catchError(error => observableThrowError(error))
      );
  }

  /**
   * Perform get resource request with url built by the resource name.
   *
   * @param resourceName used to build root url to the resource
   * @param id resource id
   * @param option (optional) options that applied to the request
   */
  public getResource(resourceName: string, id: any, option?: GetOption): Observable<T> {
    const uri = UrlUtils.generateResourceUrl(this.httpConfig.baseApiUrl, resourceName).concat('/', id);
    const httpParams = UrlUtils.convertToHttpParams(option);

    return this.get(uri, {params: httpParams});
  }

  /**
   * Perform post resource request with url built by the resource name.
   *
   * @param resourceName used to build root url to the resource
   * @param body resource to pass as body
   */
  public postResource(resourceName: string, body: BaseResource): Observable<T> {
    const uri = UrlUtils.generateResourceUrl(this.httpConfig.baseApiUrl, resourceName);

    return this.post(uri, body, {observe: 'body'});
  }

  /**
   * Perform search single resource request with url built by the resource name.
   *
   * @param resourceName used to build root url to the resource
   * @param searchQuery name of the search method
   * @param option (optional) options that applied to the request
   */
  public search(resourceName: string, searchQuery: string, option?: GetOption): Observable<T> {
    const url = UrlUtils.generateResourceUrl(this.httpConfig.baseApiUrl, resourceName).concat('/search/' + searchQuery);
    const httpParams = UrlUtils.convertToHttpParams(option);

    return this.get(url, {params: httpParams});
  }

}
