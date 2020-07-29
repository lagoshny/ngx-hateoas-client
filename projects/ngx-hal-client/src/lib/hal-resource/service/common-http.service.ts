import { ResourceIdentifiable } from '../model/resource-identifiable';
import { HttpService } from './http.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HalOption, HttpMethod } from '../model/declarations';
import { UrlUtils } from '../../util/url.utils';
import { HttpClient } from '@angular/common/http';
import { CacheService } from './cache.service';
import { HttpConfigService } from '../../config/http-config.service';
import { map } from 'rxjs/operators';
import * as _ from 'lodash';
import { isCollectionResource, isPagedCollectionResource, isResource } from '../model/resource-type';
import { ResourceUtils } from '../../util/resource.utils';
import { ConsoleLogger } from '../../logger/console-logger';

@Injectable({providedIn: 'root'})
export class CommonHttpService<T extends ResourceIdentifiable> extends HttpService<T> {

  constructor(httpClient: HttpClient,
              cacheService: CacheService<T>,
              private httpConfig: HttpConfigService) {
    super(httpClient, cacheService);
  }

  public customQuery(resourceName: string, method: HttpMethod, query: string, body: any, option: HalOption): any {
    const url = UrlUtils.generateResourceUrl(this.httpConfig.baseApiUrl, resourceName).concat(query ? query : '');
    const httpParams = UrlUtils.convertToHttpParams(option);
    ConsoleLogger.prettyInfo(`CUSTOM_QUERY_${ method } REQUEST`, {
      url,
      params: httpParams,
      body: body ? JSON.stringify(body, null, 4) : ''
    });

    let result: Observable<any>;
    switch (method) {
      case HttpMethod.GET:
        result = this.get(url, {params: httpParams});
        break;
      case HttpMethod.POST:
        result = this.post(url, body, {params: httpParams});
        break;
      case HttpMethod.PUT:
        result = this.put(url, body, {params: httpParams});
        break;
      case HttpMethod.PATCH:
        result = this.patch(url, body, {params: httpParams});
        break;
    }

    return result.pipe(
      map(data => {
        ConsoleLogger.prettyInfo(`CUSTOM_QUERY_${ method } RESPONSE`, {
          url,
          params: httpParams,
          body: JSON.stringify(data, null, 4)
        });

        if (!_.isEmpty(data)) {
          if (isPagedCollectionResource(data)) {
            return ResourceUtils.instantiatePagedCollectionResource(data);
          } else if (isCollectionResource(data)) {
            return ResourceUtils.instantiateCollectionResource(data);
          } else if (isResource(data)) {
            return ResourceUtils.instantiateResource(data);
          } else {
            return data;
          }
        }
      })
    );
  }

}
