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
import { Stage } from '../../logger/stage.enum';
import { StageLogger } from '../../logger/stage-logger';
import { ValidationUtils } from '../../util/validation.utils';

/**
 * Service to perform HTTP requests to get any type of the {@link Resource}, {@link PagedResourceCollection}, {@link ResourceCollection}.
 */
@Injectable()
export class CommonResourceHttpService extends HttpExecutor {

  constructor(httpClient: HttpClient,
              cacheService: CacheService<ResourceIdentifiable>,
              private httpConfig: HttpConfigService) {
    super(httpClient, cacheService);
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
   * @param options (optional) options that applied to the request
   * @throws error when required params are not valid
   */
  public customQuery(resourceName: string, method: HttpMethod, query: string, body?: any, options?: PagedGetOption): Observable<any> {
    ValidationUtils.validateInputParams({resourceName, method, query});

    const url = UrlUtils.generateResourceUrl(this.httpConfig.baseApiUrl, resourceName, query);
    const httpParams = UrlUtils.convertToHttpParams(options);

    StageLogger.stageLog(Stage.PREPARE_URL, {
      result: url,
      urlParts: `baseUrl: '${ this.httpConfig.baseApiUrl }', resource: '${ resourceName }', query: '${ query }'`
    });

    let result: Observable<any>;
    switch (method) {
      case HttpMethod.GET:
        result = super.getHttp(url, {params: httpParams, observe: 'body'}, false);
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
        const errMsg = `allowed ony GET/POST/PUT/PATCH http methods you pass ${ method }`;
        StageLogger.stageErrorLog(Stage.HTTP_REQUEST, {error: errMsg});
        return observableThrowError(new Error(errMsg));
    }

    return result.pipe(
      map(data => {
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
