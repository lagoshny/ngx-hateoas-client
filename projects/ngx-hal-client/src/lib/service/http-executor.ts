import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { throwError as observableThrowError } from 'rxjs';

/**
 * Base class with common logics to perform HTTP requests.
 * TODO: should manage cache?
 */
export class HttpExecutor {

  constructor(protected httpClient: HttpClient) {
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
    params?: HttpParams | {
      [param: string]: string | string[];
    }
  }): Observable<any> {
    if (!url) {
      return observableThrowError(new Error('url should be defined'));
    }

    if (options?.observe === 'response') {
      return this.httpClient.get(url, {...options, observe: 'response'});
    } else {
      return this.httpClient.get(url, {...options, observe: 'body'});
    }
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
    params?: HttpParams | {
      [param: string]: string | string[];
    }
  }): Observable<any> {
    if (!url) {
      return observableThrowError(new Error('url should be defined'));
    }

    let response;
    if (options?.observe === 'response') {
      response = this.httpClient.post(url, body, {...options, observe: 'response'});
    } else {
      response = this.httpClient.post(url, body, {...options, observe: 'body'});
    }

    return response.pipe(
      tap(data => {
        // TODO: подумать можно ли так сделать или не стоит
        // this.cacheService.evictResource(url);
        return data;
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
    params?: HttpParams | {
      [param: string]: string | string[];
    }
  }): Observable<any> {
    if (!url) {
      return observableThrowError(new Error('url should be defined'));
    }

    // TODO: подумать об удалении значений из кеша
    if (options?.observe === 'response') {
      return this.httpClient.put(url, body, {...options, observe: 'response'});
    } else {
      return this.httpClient.put(url, body, {...options, observe: 'body'});
    }
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
    params?: HttpParams | {
      [param: string]: string | string[];
    }
  }): Observable<any> {
    if (!url) {
      return observableThrowError(new Error('url should be defined'));
    }

    // TODO: подумать об удалении значений из кеша
    if (options?.observe === 'response') {
      return this.httpClient.patch(url, body, {...options, observe: 'response'});
    } else {
      return this.httpClient.patch(url, body, {...options, observe: 'body'});
    }
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
    params?: HttpParams | {
      [param: string]: string | string[];
    }
  }): Observable<any> {
    if (!url) {
      return observableThrowError(new Error('url should be defined'));
    }

    // TODO: подумать об удалении значений из кеша
    if (options?.observe === 'response') {
      return this.httpClient.delete(url, {...options, observe: 'response'});
    } else {
      return this.httpClient.delete(url, {...options, observe: 'body'});
    }
  }

}
