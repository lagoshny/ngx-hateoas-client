import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of as observableOf } from 'rxjs';
import { tap } from 'rxjs/operators';
import { StageLogger } from '../logger/stage-logger';
import { Stage } from '../logger/stage.enum';
import { ValidationUtils } from '../util/validation.utils';
import { CacheKey } from './internal/cache/model/cache-key';
import { isResourceObject } from '../model/resource-type';
import { ResourceCacheService } from './internal/cache/resource-cache.service';

/**
 * Base class with common logics to perform HTTP requests.
 */

/* tslint:disable:no-string-literal */
export class HttpExecutor {

  constructor(protected httpClient: HttpClient,
              protected cacheService: ResourceCacheService) {
  }

  private static logRequest(method: string,
                            url: string,
                            options: {
                              headers?: HttpHeaders | { [p: string]: string | string[] };
                              observe?: 'body' | 'response';
                              params?: HttpParams
                            },
                            body?: any) {
    const params = {
      method,
      url,
      params: options?.params?.keys().length > 0 ? options?.params.toString() : '',
    };
    if (body) {
      params['body'] = body;
    }
    StageLogger.stageLog(Stage.HTTP_REQUEST, params);
  }

  private static logResponse(method: string,
                             url: string,
                             options: {
                               headers?: HttpHeaders | { [p: string]: string | string[] };
                               observe?: 'body' | 'response';
                               params?: HttpParams
                             },
                             data: any) {
    StageLogger.stageLog(Stage.HTTP_RESPONSE, {
      method,
      url,
      params: options?.params?.keys().length > 0 ? options?.params.toString() : '',
      result: data
    });
  }

  /**
   * Perform GET request.
   *
   * @param url to perform request
   * @param options (optional) options that applied to the request
   * @param useCache value {@code true} if need to use cache, {@code false} otherwise
   * @throws error when required params are not valid
   */
  public getHttp(url: string,
                 options?: {
                   headers?: {
                     [header: string]: string | string[];
                   };
                   observe?: 'body' | 'response';
                   params?: HttpParams
                 },
                 useCache: boolean = true): Observable<any> {
    ValidationUtils.validateInputParams({url});
    if (this.cacheService.enabled && useCache) {
      const cachedValue = this.cacheService.getResource(CacheKey.of(url, options));
      if (cachedValue != null) {
        return observableOf(cachedValue);
      }
    }
    HttpExecutor.logRequest('GET', url, options);

    let response;
    if (options?.observe === 'response') {
      response = this.httpClient.get(url, {...options, observe: 'response'});
    } else {
      response = this.httpClient.get(url, {...options, observe: 'body'});
    }

    return response.pipe(
      tap((data: any) => {
        HttpExecutor.logResponse('GET', url, options, data);
        if (this.cacheService.enabled && useCache && isResourceObject(data)) {
          this.cacheService.putResource(CacheKey.of(url, options), data);
        }
      })
    );
  }

  /**
   * Perform POST request.
   *
   * @param url to perform request
   * @param body to send with request
   * @param options (optional) options that applied to the request
   * @throws error when required params are not valid
   */
  public postHttp(url: string, body: any | null, options?: {
    headers?: HttpHeaders | {
      [header: string]: string | string[];
    };
    observe?: 'body' | 'response';
    params?: HttpParams
  }): Observable<any> {
    HttpExecutor.logRequest('POST', url, options, body);
    ValidationUtils.validateInputParams({url});

    let response;
    if (options?.observe === 'response') {
      response = this.httpClient.post(url, body, {...options, observe: 'response'});
    } else {
      response = this.httpClient.post(url, body, {...options, observe: 'body'});
    }

    return response.pipe(
      tap((data) => {
        HttpExecutor.logResponse('POST', url, options, data);
        if (this.cacheService.enabled) {
          this.cacheService.evictResource(CacheKey.of(url, options));
        }
      })
    );
  }

  /**
   * Perform PUT request.
   *
   * @param url to perform request
   * @param body to send with request
   * @param options (optional) options that applied to the request
   * @throws error when required params are not valid
   */
  public putHttp(url: string, body: any | null, options?: {
    headers?: HttpHeaders | {
      [header: string]: string | string[];
    };
    observe?: 'body' | 'response';
    params?: HttpParams
  }): Observable<any> {
    HttpExecutor.logRequest('PUT', url, options, body);
    ValidationUtils.validateInputParams({url});

    let response;
    if (options?.observe === 'response') {
      response = this.httpClient.put(url, body, {...options, observe: 'response'});
    } else {
      response = this.httpClient.put(url, body, {...options, observe: 'body'});
    }

    return response.pipe(
      tap((data) => {
        HttpExecutor.logResponse('PUT', url, options, data);
        if (this.cacheService.enabled) {
          this.cacheService.evictResource(CacheKey.of(url, options));
        }
      })
    );
  }

  /**
   * Perform PATCH request.
   *
   * @param url to perform request
   * @param body to send with request
   * @param options (optional) options that applied to the request
   * @throws error when required params are not valid
   */
  public patchHttp(url: string, body: any | null, options?: {
    headers?: HttpHeaders | {
      [header: string]: string | string[];
    };
    observe?: 'body' | 'response';
    params?: HttpParams
  }): Observable<any> {
    HttpExecutor.logRequest('PATCH', url, options, body);
    ValidationUtils.validateInputParams({url});

    let response;
    if (options?.observe === 'response') {
      response = this.httpClient.patch(url, body, {...options, observe: 'response'});
    } else {
      response = this.httpClient.patch(url, body, {...options, observe: 'body'});
    }

    return response.pipe(
      tap((data) => {
        HttpExecutor.logResponse('PATCH', url, options, data);
        if (this.cacheService.enabled) {
          this.cacheService.evictResource(CacheKey.of(url, options));
        }
      })
    );
  }

  /**
   * Perform DELETE request.
   *
   * @param url to perform request
   * @param options (optional) options that applied to the request
   * @throws error when required params are not valid
   */
  public deleteHttp(url: string, options?: {
    headers?: HttpHeaders | {
      [header: string]: string | string[];
    };
    observe?: 'body' | 'response';
    params?: HttpParams
  }): Observable<any> {
    HttpExecutor.logRequest('DELETE', url, options);
    ValidationUtils.validateInputParams({url});

    let response;
    if (options?.observe === 'response') {
      response = this.httpClient.delete(url, {...options, observe: 'response'});
    } else {
      response = this.httpClient.delete(url, {...options, observe: 'body'});
    }

    return response.pipe(
      tap((data) => {
        HttpExecutor.logResponse('DELETE', url, options, data);
        if (this.cacheService.enabled) {
          this.cacheService.evictResource(CacheKey.of(url, options));
        }
      })
    );
  }

}
