import { Injectable } from '@angular/core';
import { Observable, of as observableOf, throwError as observableThrowError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { HttpConfigService } from '../../config/http-config.service';
import { CacheService } from './cache.service';
import { catchError, map } from 'rxjs/operators';
import { ResourceUtils } from '../../util/resource.utils';
import { BaseResource } from '../model/base-resource';
import { DependencyInjector } from '../../util/dependency-injector';
import { UrlUtils } from '../../util/url.utils';
import * as _ from 'lodash';
import { ConsoleLogger } from '../../logger/console-logger';
import { isEmbeddedResource, isResource } from '../model/resource-type';
import { RequestParam, ResourceOption } from '../model/declarations';

export function getResourceHttpService(): ResourceHttpService<BaseResource> {
  return DependencyInjector.get(ResourceHttpService);
}

@Injectable({providedIn: 'root'})
export class ResourceHttpService<T extends BaseResource> {

  constructor(private httpClient: HttpClient,
              private cacheService: CacheService<T>,
              private httpConfig: HttpConfigService) {
  }

  public getResource(url: string, options?: {
    headers?: {
      [header: string]: string | string[];
    };
    observe?: 'body' | 'response';
    params?: HttpParams | {
      [param: string]: string | string[];
    }
  }): Observable<T> {
    ConsoleLogger.prettyInfo('GET_RESOURCE REQUEST', {
      // resource: resourceType.constructor.name,
      url,
      params: options?.params
    });

    if (this.cacheService.hasResource(url)) {
      return observableOf(this.cacheService.getResource());
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

  public postResource(url: string, body: any | null, options?: {
    headers?: HttpHeaders | {
      [header: string]: string | string[];
    };
    observe?: 'body' | 'response';
    params?: HttpParams | {
      [param: string]: string | string[];
    }
  }): Observable<any> {

    ConsoleLogger.prettyInfo('POST_RESOURCE REQUEST', {
      // resource: resourceType.constructor.name,
      url,
      params: options?.params,
      body: JSON.stringify(body, null, 4)
    });

    let response;
    if (options?.observe === 'response') {
      response = this.httpClient.post(url, body, {...options, observe: 'response'});
    } else {
      response = this.httpClient.post(url, body, {...options, observe: 'body'});
    }

    return response.pipe(
      map((data: any) => {
        ConsoleLogger.prettyInfo('POST_RESOURCE RESPONSE', {
          // resource: resourceType.constructor.name,
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

  public putResource(url: string, body: any | null, options?: {
    headers?: HttpHeaders | {
      [header: string]: string | string[];
    };
    observe?: 'body' | 'response';
    params?: HttpParams | {
      [param: string]: string | string[];
    }
  }): Observable<any> {

    ConsoleLogger.prettyInfo('PUT_RESOURCE REQUEST', {
      // resource: resourceType.constructor.name,
      url,
      params: options?.params,
      body: JSON.stringify(body, null, 4)
    });

    let response;
    if (options?.observe === 'response') {
      response = this.httpClient.put(url, body, {...options, observe: 'response'});
    } else {
      response = this.httpClient.put(url, body, {...options, observe: 'body'});
    }

    return response.pipe(
      map((data: any) => {
        ConsoleLogger.prettyInfo('PUT_RESOURCE RESPONSE', {
          // resource: resourceType.constructor.name,
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

  public patchResource(url: string, body: any | null, options?: {
    headers?: HttpHeaders | {
      [header: string]: string | string[];
    };
    observe?: 'body' | 'response';
    params?: HttpParams | {
      [param: string]: string | string[];
    }
  }): Observable<any> {

    ConsoleLogger.prettyInfo('PATH_RESOURCE REQUEST', {
      // resource: resourceType.constructor.name,
      url,
      params: options?.params,
      body: JSON.stringify(body, null, 4)
    });

    let response;
    if (options?.observe === 'response') {
      response = this.httpClient.patch(url, body, {...options, observe: 'response'});
    } else {
      response = this.httpClient.patch(url, body, {...options, observe: 'body'});
    }

    return response.pipe(
      map((data: any) => {
        ConsoleLogger.prettyInfo('PATH_RESOURCE RESPONSE', {
          // resource: resourceType.constructor.name,
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

  public deleteResource(url: string, options?: {
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

    let response;
    if (options?.observe === 'response') {
      response = this.httpClient.delete(url, {...options, observe: 'response'});
    } else {
      response = this.httpClient.delete(url, {...options, observe: 'body'});
    }

    return response.pipe(
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

    return this.httpClient.get(url, {params: httpParams})
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

    // return this.getResource(url, {params: httpParams}) as Observable<number>;
  }


  //
  // public putResource(url: string, body: any | null, options?: {
  //   headers?: HttpHeaders | {
  //     [header: string]: string | string[];
  //   };
  //   observe?: 'body' | 'response';
  //   params?: HttpParams | {
  //     [param: string]: string | string[];
  //   }
  // }): Observable<any> {
  //   if (options?.observe === 'response') {
  //     return this.httpClient.put(url, body, {...options, observe: 'response'});
  //   } else {
  //     return this.httpClient.put(url, body, {...options, observe: 'body'});
  //   }
  // }
  //
  // public patchResource(url: string, body: any | null, options?: {
  //   headers?: HttpHeaders | {
  //     [header: string]: string | string[];
  //   };
  //   observe?: 'body' | 'response';
  //   params?: HttpParams | {
  //     [param: string]: string | string[];
  //   }
  // }): Observable<any> {
  //   if (options?.observe === 'response') {
  //     return this.httpClient.patch(url, body, {...options, observe: 'response'});
  //   } else {
  //     return this.httpClient.patch(url, body, {...options, observe: 'body'});
  //   }
  // }
  //
  // public deleteResource(url: string, options?: {
  //   headers?: HttpHeaders | {
  //     [header: string]: string | string[];
  //   };
  //   observe?: 'body' | 'response';
  //   params?: HttpParams | {
  //     [param: string]: string | string[];
  //   }
  // }): Observable<any> {
  //   if (options?.observe === 'response') {
  //     return this.httpClient.delete(url, {...options, observe: 'response'});
  //   } else {
  //     return this.httpClient.delete(url, {...options, observe: 'body'});
  //   }
  // }


  // public generateResourceUrl(resource?: string): string {
  //   let url = this.httpConfig.getURL();
  //   if (!url.endsWith('/')) {
  //     url = url.concat('/');
  //   }
  //   if (resource) {
  //     return url.concat(resource);
  //   }
  //
  //   url = url.replace('{?projection}', '');
  //   return url;
  // }

  public getProjection(resourceName: string,
                       id: string,
                       projectionName: string,
                       // expireMs: number = CacheHelper.defaultExpire,
                       // isCacheActive: boolean = true
  ): Observable<BaseResource> {
    const uri = UrlUtils.generateResourceUrl(this.httpConfig.baseApiUrl, resourceName)
      .concat('/', id)
      .concat('?projection=' + projectionName);

    return this.getResource(uri);
  }


  public get(resourceName: string, id: any, requestParam?: RequestParam): Observable<T> {
    const uri = UrlUtils.generateResourceUrl(this.httpConfig.baseApiUrl, resourceName).concat('/', id);
    const httpParams = UrlUtils.convertToHttpParams(requestParam);

    return this.getResource(uri, {params: httpParams});
  }

  public post(resourceName: string, body: any): Observable<T> {
    const uri = UrlUtils.generateResourceUrl(this.httpConfig.baseApiUrl, resourceName);

    return this.postResource(uri, body);
  }

  public put(resourceName: string, body: any): Observable<T> {
    const uri = UrlUtils.generateResourceUrl(this.httpConfig.baseApiUrl, resourceName);

    return this.putResource(uri, body);
  }

  public patch(resourceName: string, body: any): Observable<T> {
    const uri = UrlUtils.generateResourceUrl(this.httpConfig.baseApiUrl, resourceName);

    return this.patchResource(uri, body);
  }

}
