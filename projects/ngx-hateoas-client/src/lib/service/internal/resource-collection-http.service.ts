import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CacheService } from '../cache.service';
import { HttpConfigService } from '../../config/http-config.service';
import { Observable, of as observableOf, throwError as observableThrowError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { isResourceCollection } from '../../model/resource-type';
import { ResourceUtils } from '../../util/resource.utils';
import { ResourceCollection } from '../../model/resource/resource-collection';
import { BaseResource } from '../../model/resource/base-resource';
import { DependencyInjector } from '../../util/dependency-injector';
import { GetOption } from '../../model/declarations';
import { UrlUtils } from '../../util/url.utils';
import { HttpExecutor } from '../http-executor';
import { StageLogger } from '../../logger/stage-logger';
import { Stage } from '../../logger/stage.enum';

export function getResourceCollectionHttpService(): ResourceCollectionHttpService<ResourceCollection<BaseResource>> {
  return DependencyInjector.get(ResourceCollectionHttpService);
}

/**
 * Service to perform HTTP requests to get {@link ResourceCollection} type.
 */
@Injectable()
export class ResourceCollectionHttpService<T extends ResourceCollection<BaseResource>> extends HttpExecutor {

  constructor(httpClient: HttpClient,
              public cacheService: CacheService<T>,
              private httpConfig: HttpConfigService) {
    super(httpClient);
  }

  /**
   * Perform GET request to retrieve collection of the resources.
   *
   * @param url to perform request
   * @param options request options
   * @throws error if returned resource type is not collection of the resources
   */
  public get(url: string, options?: {
    headers?: {
      [header: string]: string | string[];
    };
    params?: HttpParams
  }): Observable<T> {
    if (this.cacheService.hasResource(url)) {
      return observableOf(this.cacheService.getResource());
    }

    return super.get(url, {...options, observe: 'body'})
      .pipe(
        map((data: any) => {
          if (!isResourceCollection(data)) {
            const errMsg = 'You try to get wrong resource type, expected resource collection type.';
            StageLogger.stageErrorLog(Stage.INIT_RESOURCE, {error: errMsg});
            throw new Error(errMsg);
          }

          const resource: T = ResourceUtils.instantiateResourceCollection(data);
          this.cacheService.putResource(url, resource);
          return resource;
        }),
        catchError(error => observableThrowError(error)));
  }

  /**
   * Perform get resource collection request with url built by the resource name.
   *
   * @param resourceName used to build root url to the resource
   * @param query (optional) url path that applied to the result url at the end
   * @param option (optional) options that applied to the request
   */
  public getResourceCollection(resourceName: string, query?: string, option?: GetOption): Observable<T> {
    if (!resourceName) {
      return observableThrowError(new Error('resource name should be defined'));
    }
    const url = UrlUtils.generateResourceUrl(this.httpConfig.baseApiUrl, resourceName, query);
    const httpParams = UrlUtils.convertToHttpParams(option);

    return this.get(url, {params: httpParams});
  }

  /**
   *  Perform search resource collection request with url built by the resource name.
   *
   * @param resourceName used to build root url to the resource
   * @param searchQuery name of the search method
   * @param option (optional) options that applied to the request
   */
  public search(resourceName: string, searchQuery: string, option?: GetOption): Observable<T> {
    if (!resourceName) {
      return observableThrowError(new Error('resource name should be defined'));
    }
    if (!searchQuery) {
      return observableThrowError(new Error('search query should be defined'));
    }
    const url = UrlUtils.generateResourceUrl(this.httpConfig.baseApiUrl, resourceName).concat('/search/' + searchQuery);
    const httpParams = UrlUtils.convertToHttpParams(option);

    return this.get(url, {params: httpParams});
  }

}
