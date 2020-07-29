import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of as observableOf } from 'rxjs';
import { CacheService } from './cache.service';
import { ResourceIdentifiable } from '../model/resource-identifiable';
import { tap } from 'rxjs/operators';

export class HttpService<T extends ResourceIdentifiable> {

  constructor(protected httpClient: HttpClient,
              protected cacheService: CacheService<T>) {
  }

  public get(url: string, options?: {
    headers?: {
      [header: string]: string | string[];
    };
    observe?: 'body' | 'response';
    params?: HttpParams | {
      [param: string]: string | string[];
    }
  }): Observable<any> {
    if (this.cacheService.hasResource(url)) {
      return observableOf(this.cacheService.getResource());
    }
    if (options?.observe === 'response') {
      return this.httpClient.get(url, {...options, observe: 'response'});
    } else {
      return this.httpClient.get(url, {...options, observe: 'body'});
    }
  }

  public post(url: string, body: any | null, options?: {
    headers?: HttpHeaders | {
      [header: string]: string | string[];
    };
    observe?: 'body' | 'response';
    params?: HttpParams | {
      [param: string]: string | string[];
    }
  }): Observable<any> {
    let response;
    if (options?.observe === 'response') {
      response = this.httpClient.post(url, body, {...options, observe: 'response'});
    } else {
      response = this.httpClient.post(url, body, {...options, observe: 'body'});
    }

    return response.pipe(
      tap(data => {
        // TODO: подумать можно ли так сделать или не стоит
        this.cacheService.evictResource(url);
        return data;
      })
    );
  }

  public put(url: string, body: any | null, options?: {
    headers?: HttpHeaders | {
      [header: string]: string | string[];
    };
    observe?: 'body' | 'response';
    params?: HttpParams | {
      [param: string]: string | string[];
    }
  }): Observable<any> {
    // TODO: подумать об удалении значений из кеша
    if (options?.observe === 'response') {
      return this.httpClient.put(url, body, {...options, observe: 'response'});
    } else {
      return this.httpClient.put(url, body, {...options, observe: 'body'});
    }
  }

  public patch(url: string, body: any | null, options?: {
    headers?: HttpHeaders | {
      [header: string]: string | string[];
    };
    observe?: 'body' | 'response';
    params?: HttpParams | {
      [param: string]: string | string[];
    }
  }): Observable<any> {
    // TODO: подумать об удалении значений из кеша
    if (options?.observe === 'response') {
      return this.httpClient.patch(url, body, {...options, observe: 'response'});
    } else {
      return this.httpClient.patch(url, body, {...options, observe: 'body'});
    }
  }

  public delete(url: string, options?: {
    headers?: HttpHeaders | {
      [header: string]: string | string[];
    };
    observe?: 'body' | 'response';
    params?: HttpParams | {
      [param: string]: string | string[];
    }
  }): Observable<any> {
    // TODO: подумать об удалении значений из кеша
    if (options?.observe === 'response') {
      return this.httpClient.delete(url, {...options, observe: 'response'});
    } else {
      return this.httpClient.delete(url, {...options, observe: 'body'});
    }
  }

}
