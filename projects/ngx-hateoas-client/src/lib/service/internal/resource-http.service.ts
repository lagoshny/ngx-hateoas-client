import { Injectable } from '@angular/core';
import { Observable, throwError as observableThrowError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { ResourceUtils } from '../../util/resource.utils';
import { BaseResource } from '../../model/resource/base-resource';
import { DependencyInjector } from '../../util/dependency-injector';
import { UrlUtils } from '../../util/url.utils';
import { getResourceType, isResource } from '../../model/resource-type';
import { GetOption, RequestOption } from '../../model/declarations';
import { HttpExecutor } from '../http-executor';
import { LibConfig } from '../../config/lib-config';
import { Stage } from '../../logger/stage.enum';
import { StageLogger } from '../../logger/stage-logger';
import { ValidationUtils } from '../../util/validation.utils';
import { toString } from 'lodash-es';
import { CacheKey } from './cache/model/cache-key';
import { ResourceCacheService } from './cache/resource-cache.service';

/**
 * Get instance of the ResourceHttpService by Angular DependencyInjector.
 */
export function getResourceHttpService(): ResourceHttpService {
  return DependencyInjector.get(ResourceHttpService);
}

/**
 * Service to perform HTTP requests to get {@link Resource} type.
 */
@Injectable({
  providedIn: 'root',
})
export class ResourceHttpService extends HttpExecutor {

  constructor(httpClient: HttpClient,
              cacheService: ResourceCacheService) {
    super(httpClient, cacheService);
  }

  /**
   * Perform GET request to retrieve resource.
   *
   * @param url to perform request
   * @param options request options
   * @throws error when required params are not valid or returned resource type is not resource
   */
  public get<T extends BaseResource>(url: string,
                                     options?: GetOption): Observable<T> {
    const httpOptions = UrlUtils.convertToHttpOptions(options);
    return super.getHttp(url, httpOptions, options?.useCache)
      .pipe(
        map((data: any) => {
          if (!isResource(data)) {
            if (LibConfig.config.cache.enabled) {
              this.cacheService.evictResource(CacheKey.of(url, httpOptions));
            }
            const errMsg = `You try to get wrong resource type: expected Resource type, actual ${ getResourceType(data) } type.`;
            StageLogger.stageErrorLog(Stage.INIT_RESOURCE, {
              options,
              error: errMsg
            });
            throw new Error(errMsg);
          }

          return ResourceUtils.instantiateResource(data, httpOptions?.params?.has('projection')) as T;
        }),
        catchError(error => observableThrowError(error)));
  }

  /**
   * Perform POST request.
   *
   * @param url to perform request
   * @param body request body
   * @param options request options
   * @throws error when required params are not valid
   */
  public post(url: string, body: any | null, options?: RequestOption): Observable<any> {
    return super.postHttp(url, body, UrlUtils.convertToHttpOptions(options))
      .pipe(
        map((data: any) => {
          if (isResource(data)) {
            return ResourceUtils.instantiateResource(data);
          }
          return data;
        }),
        catchError(error => observableThrowError(error))
      );
  }

  /**
   * Perform PUT request.
   *
   * @param url to perform request
   * @param body request body
   * @param options request options
   * @throws error when required params are not valid
   */
  public put(url: string, body: any | null, options?: RequestOption): Observable<any> {
    return super.putHttp(url, body, UrlUtils.convertToHttpOptions(options))
      .pipe(
        map((data: any) => {
          if (isResource(data)) {
            return ResourceUtils.instantiateResource(data);
          }
          return data;
        }),
        catchError(error => observableThrowError(error))
      );
  }

  /**
   * Perform PATCH request.
   *
   * @param url to perform request
   * @param body request body
   * @param options request options
   * @throws error when required params are not valid
   */
  public patch(url: string, body: any | null, options?: RequestOption): Observable<any> {
    return super.patchHttp(url, body, UrlUtils.convertToHttpOptions(options))
      .pipe(
        map((data: any) => {
          if (isResource(data)) {
            return ResourceUtils.instantiateResource(data);
          }

          return data;
        }),
        catchError(error => observableThrowError(error))
      );
  }

  /**
   * Perform DELETE request.
   *
   * @param url to perform request
   * @param options request options
   * @throws error when required params are not valid
   */
  public delete(url: string, options?: RequestOption): Observable<any> {
    return super.deleteHttp(url, {
      ...UrlUtils.convertToHttpOptions(options),
      observe: options?.observe ? options?.observe : 'response'
    })
      .pipe(
        map((data: any) => {
          if (isResource(data)) {
            return ResourceUtils.instantiateResource(data);
          }
          return data;
        }),
        catchError(error => observableThrowError(error))
      );
  }

  /**
   * Perform get resource request with url built by the resource name.
   *
   * @param resourceName used to build root url to the resource
   * @param id resource id
   * @param options (optional) options that applied to the request
   * @throws error when required params are not valid
   */
  public getResource<T extends BaseResource>(resourceName: string,
                                             id: number | string,
                                             options?: GetOption): Observable<T> {
    ValidationUtils.validateInputParams({resourceName, id});

    const url = UrlUtils.generateResourceUrl(UrlUtils.getApiUrl(), resourceName).concat('/', toString(id));

    StageLogger.stageLog(Stage.PREPARE_URL, {
      result: url,
      urlParts: `baseUrl: '${ UrlUtils.getApiUrl() }', resource: '${ resourceName }', id: '${ id }'`,
      options
    });

    return this.get(url, options);
  }

  /**
   * Perform POST resource request with url built by the resource name.
   *
   * @param resourceName to be post
   * @param body resource to create
   * @param options (optional) options that applied to the request
   * @throws error when required params are not valid
   */
  public postResource(resourceName: string,
                      body: BaseResource,
                      options?: RequestOption): Observable<any> {
    ValidationUtils.validateInputParams({resourceName, body});

    const url = UrlUtils.generateResourceUrl(UrlUtils.getApiUrl(), resourceName);

    StageLogger.stageLog(Stage.PREPARE_URL, {
      result: url,
      urlParts: `baseUrl: '${ UrlUtils.getApiUrl() }', resource: '${ resourceName }'`,
      options
    });

    return this.post(url, body, options);
  }

  /**
   * Perform PATCH resource request with url built by the resource name and resource id.
   *
   * @param resourceName to be patched
   * @param id resource id
   * @param body contains data to patch resource properties
   * @param options (optional) options that applied to the request
   * @throws error when required params are not valid
   */
  public patchResource(resourceName: string,
                       id: number | string,
                       body: any,
                       options?: RequestOption): Observable<any> {
    ValidationUtils.validateInputParams({resourceName, id, body});

    const url = UrlUtils.generateResourceUrl(UrlUtils.getApiUrl(), resourceName, toString(id));

    StageLogger.stageLog(Stage.PREPARE_URL, {
      result: url,
      urlParts: `baseUrl: '${ UrlUtils.getApiUrl() }', resource: '${ resourceName }', resourceId: '${ id }'`,
      options
    });

    return this.patch(url, body, options);
  }

  /**
   * Perform PUT resource request with url built by the resource name and resource id.
   *
   * @param resourceName to be put
   * @param id resource id
   * @param body contains data to replace resource properties
   * @param options (optional) options that applied to the request
   * @throws error when required params are not valid
   */
  public putResource(resourceName: string,
                     id: number | string,
                     body: any,
                     options?: RequestOption): Observable<any> {
    ValidationUtils.validateInputParams({resourceName, id, body});

    const url = UrlUtils.generateResourceUrl(UrlUtils.getApiUrl(), resourceName, toString(id));

    StageLogger.stageLog(Stage.PREPARE_URL, {
      result: url,
      urlParts: `baseUrl: '${ UrlUtils.getApiUrl() }', resource: '${ resourceName }', resourceId: '${ id }'`,
      options
    });

    return this.put(url, body, options);
  }

  /**
   * Perform DELETE resource request with url built by the resource name and resource id.
   *
   * @param resourceName to be deleted
   * @param id resource id
   * @param options (optional) additional options that will be applied to the request
   * @throws error when required params are not valid
   */
  public deleteResource(resourceName: string,
                        id: number | string,
                        options?: RequestOption): Observable<any> {
    ValidationUtils.validateInputParams({resourceName, id});

    const url = UrlUtils.generateResourceUrl(UrlUtils.getApiUrl(), resourceName, toString(id));

    StageLogger.stageLog(Stage.PREPARE_URL, {
      result: url,
      urlParts: `baseUrl: '${ UrlUtils.getApiUrl() }', resource: '${ resourceName }', resourceId: '${ id }'`,
      options
    });

    return this.delete(url, options);
  }

  /**
   * Perform search single resource request with url built by the resource name.
   *
   * @param resourceName used to build root url to the resource
   * @param searchQuery name of the search method
   * @param options (optional) options that applied to the request
   * @throws error when required params are not valid
   */
  public search<T extends BaseResource>(resourceName: string,
                                        searchQuery: string,
                                        options?: GetOption): Observable<T> {
    ValidationUtils.validateInputParams({resourceName, searchQuery});

    const url = UrlUtils.generateResourceUrl(UrlUtils.getApiUrl(), resourceName).concat('/search/' + searchQuery);

    StageLogger.stageLog(Stage.PREPARE_URL, {
      result: url,
      urlParts: `baseUrl: '${ UrlUtils.getApiUrl() }', resource: '${ resourceName }', searchQuery: '${ searchQuery }'`,
      options
    });

    return this.get(url, options);
  }

}
