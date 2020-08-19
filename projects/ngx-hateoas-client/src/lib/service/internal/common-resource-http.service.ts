import { ResourceIdentifiable } from '../../model/resource/resource-identifiable';
import { HttpExecutor } from '../http-executor';
import { Injectable } from '@angular/core';
import { Observable, throwError as observableThrowError } from 'rxjs';
import { HttpMethod, PagedGetOption } from '../../model/declarations';
import { UrlUtils } from '../../util/url.utils';
import { HttpClient } from '@angular/common/http';
import { CacheService } from '../cache.service';
import { HttpConfigService } from '../../config/http-config.service';
import { map } from 'rxjs/operators';
import { isPagedResourceCollection, isResource, isResourceCollection } from '../../model/resource-type';
import { ResourceUtils } from '../../util/resource.utils';
import { ConsoleLogger } from '../../logger/console-logger';
import { Stage } from '../../logger/stage.enum';

/**
 * Service to perform HTTP requests to get any type of the {@link Resource}, {@link PagedResourceCollection}, {@link ResourceCollection}.
 */
@Injectable()
export class CommonResourceHttpService extends HttpExecutor {

  constructor(httpClient: HttpClient,
              public cacheService: CacheService<ResourceIdentifiable>,
              private httpConfig: HttpConfigService) {
    super(httpClient);
  }

  /**
   * Perform custom HTTP request.
   *
   * Return type depends on result data it can be {@link Resource}, {@link ResourceCollection},
   * {@link PagedResourceCollection} or any data.
   *
   * @param resourceName used to build root url to the resource
   * @param method HTTP method that will be perform {@link HttpMethod}
   * @param query url path that applied to the result url at the end
   * @param body (optional) request body
   * @param option (optional) options that applied to the request
   */
  public customQuery(resourceName: string, method: HttpMethod, query: string, body?: any, option?: PagedGetOption): any {
    if (!resourceName) {
      return observableThrowError(new Error('resource name should be defined'));
    }
    if (!query) {
      return observableThrowError(new Error('query should be defined'));
    }

    const url = UrlUtils.generateResourceUrl(this.httpConfig.baseApiUrl, resourceName, query);
    const httpParams = UrlUtils.convertToHttpParams(option);

    ConsoleLogger.prettyInfo(`STAGE ${ Stage.PREPARE_URL }`, {
      result: url,
      urlParts: `baseUrl: '${ this.httpConfig.baseApiUrl }', resource: '${ resourceName }', query: '${ query }'`,
    });

    ConsoleLogger.prettyInfo(`STAGE ${ Stage.HTTP_REQUEST }`, {
      method,
      url,
      params: httpParams,
      body: body ? JSON.stringify(body, null, 4) : ''
    });

    let result: Observable<any>;
    switch (method) {
      case HttpMethod.GET:
        result = super.get(url, {params: httpParams, observe: 'body'});
        break;
      case HttpMethod.POST:
        result = super.post(url, body, {params: httpParams, observe: 'body'});
        break;
      case HttpMethod.PUT:
        result = super.put(url, body, {params: httpParams, observe: 'body'});
        break;
      case HttpMethod.PATCH:
        result = super.patch(url, body, {params: httpParams, observe: 'body'});
        break;
      default:
        return observableThrowError(new Error(`allowed ony GET/POST/PUT/PATCH http methods you pass ${ method }`));
    }

    return result.pipe(
      map(data => {
        ConsoleLogger.prettyInfo(`STAGE ${ Stage.HTTP_RESPONSE }`, {
          url,
          params: httpParams,
          result: JSON.stringify(data, null, 4)
        });

        if (isPagedResourceCollection(data)) {
          return ResourceUtils.instantiatePagedResourceCollection(data);
        } else if (isResourceCollection(data)) {
          return ResourceUtils.instantiateResourceCollection(data);
        } else if (isResource(data)) {
          return ResourceUtils.instantiateResource(data);
        } else {
          return data;
        }
      })
    );
  }

}
