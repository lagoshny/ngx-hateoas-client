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
import { GetOption, RequestParam } from '../../model/declarations';
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
   * @throws error if returned resource type is not resource
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
   * Perform GET request to get count value.
   *
   * @param resourceName used to build root url to the resource
   * @param countQuery name of the count method
   * @param requestParam (optional) http request params that applied to the request
   */
  public count(resourceName: string, countQuery?: string, requestParam?: RequestParam): Observable<number> {
    ValidationUtils.validateInputParams({resourceName});

    const url = UrlUtils.generateResourceUrl(this.httpConfig.baseApiUrl, resourceName)
      .concat('/search/' + (_.isNil(countQuery) ? 'countAll' : countQuery));

    StageLogger.stageLog(Stage.PREPARE_URL, {
      result: url,
      urlParts: `baseUrl: '${ this.httpConfig.baseApiUrl }', resource: '${ resourceName }', countQuery: '${ countQuery ? countQuery : 'countAll' }'`,
      requestParam
    });

    return super.get(url, {params: UrlUtils.convertToHttpParams({params: requestParam}), observe: 'body'})
      .pipe(
        map((data: any) => {
          if (_.isNil(data) || _.isNaN(_.toNumber(data))) {
            const errMsg = `Returned value ${ data } should be number.`;
            StageLogger.stageErrorLog(Stage.RESPONSE_BAD_RESULT, {error: errMsg});
            throw Error(errMsg);
          }

          return _.toNumber(data);
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
  public getResource(resourceName: string, id: number, option?: GetOption): Observable<T> {
    ValidationUtils.validateInputParams({resourceName, id});

    const url = UrlUtils.generateResourceUrl(this.httpConfig.baseApiUrl, resourceName).concat('/', _.toString(id));

    StageLogger.stageLog(Stage.PREPARE_URL, {
      result: url,
      urlParts: `baseUrl: '${ this.httpConfig.baseApiUrl }', resource: '${ resourceName }', id: '${ id }'`,
      options: option
    });

    return this.get(url, {params: UrlUtils.convertToHttpParams(option)});
  }

  /**
   * Perform post resource request with url built by the resource name.
   *
   * @param resourceName used to build root url to the resource
   * @param body resource to pass as body
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
   * Perform search single resource request with url built by the resource name.
   *
   * @param resourceName used to build root url to the resource
   * @param searchQuery name of the search method
   * @param option (optional) options that applied to the request
   */
  public search(resourceName: string, searchQuery: string, option?: GetOption): Observable<T> {
    ValidationUtils.validateInputParams({resourceName, searchQuery});

    const url = UrlUtils.generateResourceUrl(this.httpConfig.baseApiUrl, resourceName).concat('/search/' + searchQuery);

    StageLogger.stageLog(Stage.PREPARE_URL, {
      result: url,
      urlParts: `baseUrl: '${ this.httpConfig.baseApiUrl }', resource: '${ resourceName }', searchQuery: '${ searchQuery }'`
    });

    return this.get(url, {params: UrlUtils.convertToHttpParams(option)});
  }

}
