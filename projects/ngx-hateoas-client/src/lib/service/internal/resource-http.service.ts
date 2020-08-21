import { Injectable } from '@angular/core';
import { Observable, of as observableOf, throwError as observableThrowError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { ResourceUtils } from '../../util/resource.utils';
import { BaseResource } from '../../model/resource/base-resource';
import { DependencyInjector } from '../../util/dependency-injector';
import { UrlUtils } from '../../util/url.utils';
import * as _ from 'lodash';
import { isResource } from '../../model/resource-type';
import { GetOption } from '../../model/declarations';
import { HttpExecutor } from '../http-executor';
import { CacheService } from '../cache.service';
import { HttpConfigService } from '../../config/http-config.service';
import { Stage } from '../../logger/stage.enum';
import { StageLogger } from '../../logger/stage-logger';
import { ValidationUtils } from '../../util/validation.utils';

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
export class ResourceHttpService<T extends BaseResource> extends HttpExecutor {

  constructor(httpClient: HttpClient,
              public cacheService: CacheService<T>,
              private httpConfig: HttpConfigService) {
    super(httpClient);
  }

  /**
   * Perform GET request to retrieve resource.
   *
   * @param url to perform request
   * @param options request options
   * @throws error when required params are not valid or returned resource type is not resource
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
          if (!isResource(data)) {
            const errMsg = 'You try to get wrong resource type, expected single resource.';
            StageLogger.stageErrorLog(Stage.INIT_RESOURCE, {
              error: errMsg
            });
            throw Error(errMsg);
          }

          const resource: T = ResourceUtils.instantiateResource(data);
          this.cacheService.putResource(url, resource);

          return resource;
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
  public post(url: string, body: any | null, options?: {
    headers?: HttpHeaders | {
      [header: string]: string | string[];
    };
    observe?: 'body' | 'response';
    params?: HttpParams
  }): Observable<any> {
    return super.post(url, body, options)
      .pipe(
        map((data: any) => {
          this.cacheService.evictResource(url);
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
  public put(url: string, body: any | null, options?: {
    headers?: HttpHeaders | {
      [header: string]: string | string[];
    };
    observe?: 'body' | 'response';
    params?: HttpParams
  }): Observable<any> {
    return super.put(url, body, options)
      .pipe(
        map((data: any) => {
          this.cacheService.evictResource(url);
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
  public patch(url: string, body: any | null, options?: {
    headers?: HttpHeaders | {
      [header: string]: string | string[];
    };
    observe?: 'body' | 'response';
    params?: HttpParams
  }): Observable<any> {
    return super.patch(url, body, options)
      .pipe(
        map((data: any) => {
          this.cacheService.evictResource(url);
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
  public delete(url: string, options?: {
    headers?: HttpHeaders | {
      [header: string]: string | string[];
    };
    observe?: 'body' | 'response';
    params?: HttpParams
  }): Observable<any> {
    return super.delete(url, options)
      .pipe(
        map((data: any) => {
          this.cacheService.evictResource(url);
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
  public getResource(resourceName: string, id: number | string, options?: GetOption): Observable<T> {
    ValidationUtils.validateInputParams({resourceName, id});

    const url = UrlUtils.generateResourceUrl(this.httpConfig.baseApiUrl, resourceName).concat('/', _.toString(id));

    StageLogger.stageLog(Stage.PREPARE_URL, {
      result: url,
      urlParts: `baseUrl: '${ this.httpConfig.baseApiUrl }', resource: '${ resourceName }', id: '${ id }'`,
      options
    });

    return this.get(url, {params: UrlUtils.convertToHttpParams(options)});
  }

  /**
   * Perform POST resource request with url built by the resource name.
   *
   * @param resourceName to be post
   * @param body resource to create
   * @throws error when required params are not valid
   */
  public postResource(resourceName: string, body: BaseResource): Observable<T> {
    ValidationUtils.validateInputParams({resourceName, body});

    const url = UrlUtils.generateResourceUrl(this.httpConfig.baseApiUrl, resourceName);

    StageLogger.stageLog(Stage.PREPARE_URL, {
      result: url,
      urlParts: `baseUrl: '${ this.httpConfig.baseApiUrl }', resource: '${ resourceName }'`
    });

    return this.post(url, body, {observe: 'body'});
  }

  /**
   * Perform PATCH resource request with url built by the resource name and resource id.
   *
   * @param resourceName to be patched
   * @param id resource id
   * @param body contains data to patch resource properties
   * @throws error when required params are not valid
   */
  public patchResource(resourceName: string, id: number | string, body: any): Observable<T | any> {
    ValidationUtils.validateInputParams({resourceName, id, body});

    const url = UrlUtils.generateResourceUrl(this.httpConfig.baseApiUrl, resourceName, _.toString(id));

    StageLogger.stageLog(Stage.PREPARE_URL, {
      result: url,
      urlParts: `baseUrl: '${ this.httpConfig.baseApiUrl }', resource: '${ resourceName }', resourceId: '${ id }'`
    });

    return this.patch(url, body, {observe: 'body'});
  }

  /**
   * Perform PUT resource request with url built by the resource name and resource id.
   *
   * @param resourceName to be put
   * @param id resource id
   * @param body contains data to replace resource properties
   * @throws error when required params are not valid
   */
  public putResource(resourceName: string, id: number | string, body: any): Observable<T | any> {
    ValidationUtils.validateInputParams({resourceName, id, body});

    const url = UrlUtils.generateResourceUrl(this.httpConfig.baseApiUrl, resourceName, _.toString(id));

    StageLogger.stageLog(Stage.PREPARE_URL, {
      result: url,
      urlParts: `baseUrl: '${ this.httpConfig.baseApiUrl }', resource: '${ resourceName }', resourceId: '${ id }'`
    });

    return this.put(url, body, {observe: 'body'});
  }

  /**
   * Perform DELETE resource request with url built by the resource name and resource id.
   *
   * @param resourceName to be deleted
   * @param id resource id
   * @param options (optional) additional options that will be applied to the request
   * @throws error when required params are not valid
   */
  public deleteResource(resourceName: string, id: number | string, options?: {
    headers?: HttpHeaders | {
      [header: string]: string | string[];
    };
    observe?: 'body' | 'response';
    params?: HttpParams
  }): Observable<T | any> {
    ValidationUtils.validateInputParams({resourceName, id});

    const url = UrlUtils.generateResourceUrl(this.httpConfig.baseApiUrl, resourceName, _.toString(id));

    StageLogger.stageLog(Stage.PREPARE_URL, {
      result: url,
      urlParts: `baseUrl: '${ this.httpConfig.baseApiUrl }', resource: '${ resourceName }', resourceId: '${ id }'`
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
  public search(resourceName: string, searchQuery: string, options?: GetOption): Observable<T> {
    ValidationUtils.validateInputParams({resourceName, searchQuery});

    const url = UrlUtils.generateResourceUrl(this.httpConfig.baseApiUrl, resourceName).concat('/search/' + searchQuery);

    StageLogger.stageLog(Stage.PREPARE_URL, {
      result: url,
      urlParts: `baseUrl: '${ this.httpConfig.baseApiUrl }', resource: '${ resourceName }', searchQuery: '${ searchQuery }'`
    });

    return this.get(url, {params: UrlUtils.convertToHttpParams(options)});
  }

}
