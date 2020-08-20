import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError as observableThrowError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { StageLogger } from '../logger/stage-logger';
import { Stage } from '../logger/stage.enum';

/**
 * Base class with common logics to perform HTTP requests.
 * TODO: should manage cache?
 */
/* tslint:disable:no-string-literal */
export class HttpExecutor {

  constructor(protected httpClient: HttpClient) {
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
   */
  public get(url: string, options?: {
    headers?: {
      [header: string]: string | string[];
    };
    observe?: 'body' | 'response';
    params?: HttpParams
  }): Observable<any> {
    HttpExecutor.logRequest('GET', url, options);
    if (!url) {
      const errMsg = 'url should be defined';
      StageLogger.stageErrorLog(Stage.HTTP_REQUEST, {error: errMsg});
      return observableThrowError(new Error(errMsg));
    }

    let response;
    if (options?.observe === 'response') {
      response = this.httpClient.get(url, {...options, observe: 'response'});
    } else {
      response = this.httpClient.get(url, {...options, observe: 'body'});
    }

    return response.pipe(
      tap((data) => {
        HttpExecutor.logResponse('GET', url, options, data);
      })
    );
  }

  /**
   * Perform POST request.
   *
   * @param url to perform request
   * @param body to send with request
   * @param options (optional) options that applied to the request
   */
  public post(url: string, body: any | null, options?: {
    headers?: HttpHeaders | {
      [header: string]: string | string[];
    };
    observe?: 'body' | 'response';
    params?: HttpParams
  }): Observable<any> {
    HttpExecutor.logRequest('POST', url, options, body);
    if (!url) {
      const errMsg = 'url should be defined';
      StageLogger.stageErrorLog(Stage.HTTP_REQUEST, {error: errMsg});
      return observableThrowError(new Error(errMsg));
    }

    let response;
    if (options?.observe === 'response') {
      response = this.httpClient.post(url, body, {...options, observe: 'response'});
    } else {
      response = this.httpClient.post(url, body, {...options, observe: 'body'});
    }

    return response.pipe(
      tap((data) => {
        HttpExecutor.logResponse('POST', url, options, data);
      })
    );
  }

  /**
   * Perform PUT request.
   *
   * @param url to perform request
   * @param body to send with request
   * @param options (optional) options that applied to the request
   */
  public put(url: string, body: any | null, options?: {
    headers?: HttpHeaders | {
      [header: string]: string | string[];
    };
    observe?: 'body' | 'response';
    params?: HttpParams
  }): Observable<any> {
    HttpExecutor.logRequest('PUT', url, options, body);
    if (!url) {
      const errMsg = 'url should be defined';
      StageLogger.stageErrorLog(Stage.HTTP_REQUEST, {error: errMsg});
      return observableThrowError(new Error(errMsg));
    }

    let response;
    if (options?.observe === 'response') {
      response = this.httpClient.put(url, body, {...options, observe: 'response'});
    } else {
      response = this.httpClient.put(url, body, {...options, observe: 'body'});
    }

    return response.pipe(
      tap((data) => {
        HttpExecutor.logResponse('PUT', url, options, data);
      })
    );
  }

  /**
   * Perform PATCH request.
   *
   * @param url to perform request
   * @param body to send with request
   * @param options (optional) options that applied to the request
   */
  public patch(url: string, body: any | null, options?: {
    headers?: HttpHeaders | {
      [header: string]: string | string[];
    };
    observe?: 'body' | 'response';
    params?: HttpParams
  }): Observable<any> {
    HttpExecutor.logRequest('PATCH', url, options, body);
    if (!url) {
      const errMsg = 'url should be defined';
      StageLogger.stageErrorLog(Stage.HTTP_REQUEST, {error: errMsg});
      return observableThrowError(new Error(errMsg));
    }

    let response;
    if (options?.observe === 'response') {
      response = this.httpClient.patch(url, body, {...options, observe: 'response'});
    } else {
      response = this.httpClient.patch(url, body, {...options, observe: 'body'});
    }

    return response.pipe(
      tap((data) => {
        HttpExecutor.logResponse('PATCH', url, options, data);
      })
    );
  }

  /**
   * Perform DELETE request.
   *
   * @param url to perform request
   * @param options (optional) options that applied to the request
   */
  public delete(url: string, options?: {
    headers?: HttpHeaders | {
      [header: string]: string | string[];
    };
    observe?: 'body' | 'response';
    params?: HttpParams
  }): Observable<any> {
    HttpExecutor.logRequest('DELETE', url, options);
    if (!url) {
      const errMsg = 'url should be defined';
      StageLogger.stageErrorLog(Stage.HTTP_REQUEST, {error: errMsg});
      return observableThrowError(new Error(errMsg));
    }

    let response;
    if (options?.observe === 'response') {
      response = this.httpClient.delete(url, {...options, observe: 'response'});
    } else {
      response = this.httpClient.delete(url, {...options, observe: 'body'});
    }

    return response.pipe(
      tap((data) => {
        HttpExecutor.logResponse('DELETE', url, options, data);
      })
    );
  }

}
