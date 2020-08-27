import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LibConfig } from '../../config/lib-config';
import { Observable, throwError as observableThrowError } from 'rxjs';
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
import { CacheKey } from './cache/model/cache-key';
import { ResourceCacheService } from './cache/resource-cache.service';

export function getResourceCollectionHttpService(): ResourceCollectionHttpService<ResourceCollection<BaseResource>> {
  return DependencyInjector.get(ResourceCollectionHttpService);
}

/**
 * Service to perform HTTP requests to get {@link ResourceCollection} type.
 */
@Injectable()
export class ResourceCollectionHttpService<T extends ResourceCollection<BaseResource>> extends HttpExecutor {

  constructor(httpClient: HttpClient,
              cacheService: ResourceCacheService) {
    super(httpClient, cacheService);
  }

  /**
   * Perform GET request to retrieve collection of the resources.
   *
   * @param url to perform request
   * @param options request options
   * @throws error when required params are not valid or returned resource type is not collection of the resources
   */
  public get(url: string,
             options?: GetOption): Observable<T> {
    const httpOptions = {params: UrlUtils.convertToHttpParams(options)};
    return super.getHttp(url, httpOptions)
      .pipe(
        map((data: any) => {
          if (!isResourceCollection(data)) {
            if (LibConfig.config.cache.enabled) {
              this.cacheService.evictResource(CacheKey.of(url, httpOptions));
            }
            const errMsg = 'You try to get wrong resource type, expected resource collection type.';
            StageLogger.stageErrorLog(Stage.INIT_RESOURCE, {error: errMsg});
            throw new Error(errMsg);
          }

          return ResourceUtils.instantiateResourceCollection(data) as T;
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

    const url = UrlUtils.generateResourceUrl(UrlUtils.getApiUrl(), resourceName);

    StageLogger.stageLog(Stage.PREPARE_URL, {
      result: url,
      urlParts: `baseUrl: '${ UrlUtils.getApiUrl() }', resource: '${ resourceName }'`
    });

    return this.get(url, options);
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

    const url = UrlUtils.generateResourceUrl(UrlUtils.getApiUrl(), resourceName).concat('/search/' + searchQuery);

    StageLogger.stageLog(Stage.PREPARE_URL, {
      result: url,
      urlParts: `baseUrl: '${ UrlUtils.getApiUrl() }', resource: '${ resourceName }', searchQuery: '${ searchQuery }'`
    });

    return this.get(url, options);
  }

}
