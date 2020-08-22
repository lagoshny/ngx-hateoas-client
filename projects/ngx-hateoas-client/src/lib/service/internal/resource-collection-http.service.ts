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
import { ValidationUtils } from '../../util/validation.utils';
import { CacheKey } from '../../model/cache/cache-key';

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
   * @param useCache value {@code true} if need to use cache, {@code false} otherwise
   * @throws error when required params are not valid or returned resource type is not collection of the resources
   */
  public get(url: string,
             options?: {
               headers?: {
                 [header: string]: string | string[];
               };
               params?: HttpParams
             },
             useCache: boolean = true): Observable<T> {
    if (useCache) {
      const cachedValue = this.cacheService.getValue(CacheKey.of(url, options));
      if (cachedValue != null) {
        return observableOf(cachedValue);
      }
    }

    return super.get(url, {...options, observe: 'body'})
      .pipe(
        map((data: any) => {
          if (!isResourceCollection(data)) {
            const errMsg = 'You try to get wrong resource type, expected resource collection type.';
            StageLogger.stageErrorLog(Stage.INIT_RESOURCE, {error: errMsg});
            throw new Error(errMsg);
          }

          const resourceCollection: T = ResourceUtils.instantiateResourceCollection(data);
          if (useCache) {
            this.cacheService.putValue(CacheKey.of(url, options), resourceCollection);
          }

          return resourceCollection;
        }),
        catchError(error => observableThrowError(error)));
  }

  /**
   * Perform get resource collection request with url built by the resource name.
   *
   * @param resourceName used to build root url to the resource
   * @param options (optional) options that applied to the request
   * @throws error when required params are not valid
   */
  public getResourceCollection(resourceName: string, options?: GetOption): Observable<T> {
    ValidationUtils.validateInputParams({resourceName});

    const url = UrlUtils.generateResourceUrl(this.httpConfig.baseApiUrl, resourceName);
    const httpParams = UrlUtils.convertToHttpParams(options);

    return this.get(url, {params: httpParams}, options?.useCache);
  }

  /**
   *  Perform search resource collection request with url built by the resource name.
   *
   * @param resourceName used to build root url to the resource
   * @param searchQuery name of the search method
   * @param options (optional) options that applied to the request
   * @throws error when required params are not valid
   */
  public search(resourceName: string, searchQuery: string, options?: GetOption): Observable<T> {
    ValidationUtils.validateInputParams({resourceName, searchQuery});

    const url = UrlUtils.generateResourceUrl(this.httpConfig.baseApiUrl, resourceName).concat('/search/' + searchQuery);
    const httpParams = UrlUtils.convertToHttpParams(options);

    return this.get(url, {params: httpParams}, options?.useCache);
  }

}
