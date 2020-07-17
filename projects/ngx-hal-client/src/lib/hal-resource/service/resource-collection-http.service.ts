import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CacheService } from './cache.service';
import { HttpConfigService } from '../../config/http-config.service';
import { Observable, of as observableOf } from 'rxjs';
import { ConsoleLogger } from '../../logger/console-logger';
import { catchError, map } from 'rxjs/operators';
import * as _ from 'lodash';
import { isCollectionResource, isEmbeddedResource, isPagedCollectionResource, isResource } from '../model/defenition';
import { throwError as observableThrowError } from 'rxjs/internal/observable/throwError';
import { ResourceUtils } from '../../util/resource.utils';
import { ResourceCollection } from '../model/resource-collection';
import { BaseResource } from '../model/base-resource';
import { DependencyInjector } from '../../util/dependency-injector';

export function getResourceCollectionHttpService(): ResourceCollectionHttpService<ResourceCollection<BaseResource>> {
  return DependencyInjector.get(ResourceCollectionHttpService);
}

@Injectable({providedIn: 'root'})
export class ResourceCollectionHttpService<T extends ResourceCollection<BaseResource>> {


  constructor(private httpClient: HttpClient,
              private cacheService: CacheService<T>,
              private httpConfig: HttpConfigService) {
  }

  public getResourceCollection(resourceType: T, url: string, options?: {
    headers?: {
      [header: string]: string | string[];
    };
    observe?: 'body' | 'response';
    params?: HttpParams | {
      [param: string]: string | string[];
    }
  }): Observable<T> {

    ConsoleLogger.prettyInfo('GET_RESOURCE_COLLECTION REQUEST', {
      // resource: resourceType.constructor.name,
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
          resource: resourceType.constructor.name,
          url,
          params: options?.params,
          body: JSON.stringify(data, null, 4)
        });

        if (!_.isEmpty(data)) {
          if (isResource(data) || isEmbeddedResource(data) || isPagedCollectionResource(data)) {
            ConsoleLogger.error('You try to get single/paged resource when expected resource collection! Please, use suitable method for this.');
            return observableThrowError('You try to get single resource when expected resource collection! Please, use suitable method for this.');
          }
          if (isCollectionResource(data)) {
            const resource: T = ResourceUtils.instantiateResourceCollection(resourceType, data);
            this.cacheService.putResource(url, resource);
            return resource;
          }
        }

        return data;
      }),
      catchError(error => observableThrowError(error)));
  }

}
