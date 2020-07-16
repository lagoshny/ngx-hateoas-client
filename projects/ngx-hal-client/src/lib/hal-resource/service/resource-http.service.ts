import { Injectable } from '@angular/core';
import { Observable, of as observableOf, throwError as observableThrowError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { HttpConfigService } from '../../config/http-config.service';
import { CacheService } from './cache.service';
import { catchError, map } from 'rxjs/operators';
import { ResourceUtils } from '../../util/resource.utils';
import { BaseResource } from '../model/base-resource';
import { DependencyInjector } from '../../util/dependency-injector';
import { HalParam } from '../../service/hal-resource.service';
import { UrlUtils } from '../../util/url.utils';
import * as _ from 'lodash';
import { ConsoleLogger } from '../../logger/console-logger';

export function getHttpResourceService(): ResourceHttpService<BaseResource> {
  return DependencyInjector.get(ResourceHttpService);
}

@Injectable({providedIn: 'root'})
export class ResourceHttpService<T extends BaseResource> {

  constructor(private httpClient: HttpClient,
              private cacheService: CacheService,
              private httpConfig: HttpConfigService) {
  }

  public getResource(resourceType: T, url: string, options?: {
    headers?: {
      [header: string]: string | string[];
    };
    observe?: 'body' | 'response';
    params?: HttpParams | {
      [param: string]: string | string[];
    }
  }): Observable<any> {

    ConsoleLogger.prettyInfo('GET_RESOURCE REQUEST', {
      resource: resourceType.constructor.name,
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
          resource: resourceType.constructor.name,
          url,
          params: options?.params,
          body: JSON.stringify(data, null, 4)
        });

        const resource: T = ResourceUtils.instantiateResource(resourceType, data);
        this.cacheService.putResource(url, resource);

        return resource;
      }),
      catchError(error => observableThrowError(error)));
  }

  public postResource(resourceType: T, url: string, body: any | null, options?: {
    headers?: HttpHeaders | {
      [header: string]: string | string[];
    };
    observe?: 'body' | 'response';
    params?: HttpParams | {
      [param: string]: string | string[];
    }
  }): Observable<any> {

    ConsoleLogger.prettyInfo('POST_RESOURCE REQUEST', {
      resource: resourceType.constructor.name,
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
          resource: resourceType.constructor.name,
          url,
          params: options?.params,
          body: JSON.stringify(data, null, 4)
        });

        this.cacheService.evictResource(url);
        if (!_.isEmpty(data)) {
          return ResourceUtils.instantiateResource(resourceType, data);
        }
        return data;
      }),
      catchError(error => observableThrowError(error))
    );
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

  public getProjection(resourceType: T,
                       resourceName: string,
                       id: string,
                       projectionName: string,
                       // expireMs: number = CacheHelper.defaultExpire,
                       // isCacheActive: boolean = true
  ): Observable<BaseResource> {
    const uri = this.generateResourceUrl(resourceName).concat('/', id).concat('?projection=' + projectionName);

    return this.getResource(resourceType, uri);
  }


  public get(resourceType: new() => T, resourceName: string, id: any, params?: HalParam): Observable<T> {
    const uri = this.generateResourceUrl(resourceName).concat('/', id);
    const httpParams = UrlUtils.convertToHttpParams(params);

    return this.getResource(new resourceType(), uri, {params: httpParams});
  }

  public generateResourceUrl(resource?: string): string {
    let url = this.httpConfig.baseApiUrl;
    if (!url.endsWith('/')) {
      url = url.concat('/');
    }
    if (resource) {
      return url.concat(resource);
    }

    url = url.replace('{?projection}', '');
    return url;
  }

}
