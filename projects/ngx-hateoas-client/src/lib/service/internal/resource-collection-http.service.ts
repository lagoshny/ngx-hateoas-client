import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LibConfig } from '../../config/lib-config';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { getResourceType, isResourceCollection } from '../../model/resource-type';
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
import { ResourceOption } from '../../config/hateoas-configuration.interface';

export function getResourceCollectionHttpService(): ResourceCollectionHttpService {
  return DependencyInjector.get(ResourceCollectionHttpService);
}

/**
 * Service to perform HTTP requests to get {@link ResourceCollection} type.
 */
@Injectable({
  providedIn: 'root',
})
export class ResourceCollectionHttpService extends HttpExecutor {

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
  public get<T extends ResourceCollection<BaseResource>>(url: string,
                                                         options?: GetOption): Observable<T> {
    const httpOptions = UrlUtils.convertToHttpOptions(options);

    return super.getHttp(url, httpOptions, options?.useCache)
      .pipe(
        map((data: any) => {
          if (!isResourceCollection(data)) {
            if (LibConfig.getConfig().cache.enabled) {
              this.cacheService.evictResource(CacheKey.of(url, httpOptions));
            }
            const errMsg = `You try to get the wrong resource type: expected ResourceCollection type,` +
            ` actual ${getResourceType(data)} type.`;
            StageLogger.stageErrorLog(Stage.INIT_RESOURCE, { error: errMsg, options });
            throw new Error(errMsg);
          }

          return ResourceUtils.instantiateResourceCollection(data, httpOptions?.params?.has('projection')) as T;
        }),
        catchError(error => throwError(() => error)));
  }

  /**
   * Perform get resource collection request with url built by the resource name.
   *
   * @param resourceName used to build root url to the resource
   * @param resourceOptions additional resource options {@link ResourceOption}
   * @param options (optional) options that applied to the request
   * @throws error when required params are not valid
   */
  public getResourceCollection<T extends ResourceCollection<BaseResource>>(resourceName: string,
                                                                           resourceOptions: ResourceOption,
                                                                           options?: GetOption): Observable<T> {
    ValidationUtils.validateInputParams({ resourceName });
    const url = UrlUtils.generateResourceUrl(UrlUtils.getApiUrl(resourceOptions.routeName), resourceName);

    StageLogger.stageLog(Stage.PREPARE_URL, {
      result: url,
      urlParts: `baseUrl: '${UrlUtils.getApiUrl(resourceOptions.routeName)}', resource: '${resourceName}'`,
      options
    });

    return this.get(url, options);
  }

  /**
   *  Perform search resource collection request with url built by the resource name.
   *
   * @param resourceName used to build root url to the resource
   * @param resourceOptions additional resource options {@link ResourceOption}
   * @param searchQuery name of the search method
   * @param options (optional) options that applied to the request
   * @throws error when required params are not valid
   */
  public search<T extends ResourceCollection<BaseResource>>(resourceName: string,
                                                            resourceOptions: ResourceOption,
                                                            searchQuery: string,
                                                            options?: GetOption): Observable<T> {
    ValidationUtils.validateInputParams({ resourceName, searchQuery });

    const url = UrlUtils.generateResourceUrl(UrlUtils.getApiUrl(resourceOptions.routeName), resourceName)
      .concat('/search/' + searchQuery);

    StageLogger.stageLog(Stage.PREPARE_URL, {
      result: url,
      urlParts: `baseUrl: '${UrlUtils.getApiUrl(resourceOptions.routeName)}', resource: '${resourceName}', searchQuery: '${searchQuery}'`,
      options
    });

    return this.get(url, options);
  }

}
