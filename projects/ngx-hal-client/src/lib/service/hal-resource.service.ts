import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResourceHttpService } from '../hal-resource/service/resource-http.service';
import { PagedCollectionResourceHttpService } from '../hal-resource/service/paged-collection-resource-http.service';
import { PagedCollectionResource } from '../hal-resource/model/paged-collection-resource';
import { GetOption, HttpMethod, PagedGetOption, RequestBody, RequestOption, RequestParam } from '../hal-resource/model/declarations';
import { ResourceUtils } from '../util/resource.utils';
import { Resource } from '../ngx-hal-client.module';
import { CollectionResource } from '../hal-resource/model/collection-resource';
import { CollectionResourceHttpService } from '../hal-resource/service/collection-resource-http.service';
import { CommonHttpService } from '../hal-resource/service/common-http.service';
import { UrlUtils } from '../util/url.utils';

@Injectable()
export class HalResourceService<T extends Resource> {

  constructor(private commonHttpService: CommonHttpService<T | CollectionResource<T> | PagedCollectionResource<T>>,
              private resourceHttpService: ResourceHttpService<T>,
              private collectionResourceHttpService: CollectionResourceHttpService<CollectionResource<T>>,
              private pagedCollectionResourceHttpService: PagedCollectionResourceHttpService<PagedCollectionResource<T>>) {
  }

  public get(resourceName: string, id: any, option?: GetOption): Observable<T> {
    return this.resourceHttpService.getResource(resourceName, id, option) as Observable<T>;
  }

  public getAll(resourceName: string, option?: GetOption): Observable<CollectionResource<T>> {
    return this.collectionResourceHttpService.getResourceCollection(resourceName, null, option);
  }

  public getAllPage(resourceName: string, option?: PagedGetOption): Observable<PagedCollectionResource<T>> {
    return this.pagedCollectionResourceHttpService.getResourcePage(resourceName, null, option);
  }

  public create(resourceName: string, requestBody: RequestBody<T>): Observable<T> {
    const body = ResourceUtils.resolveValues(requestBody);

    return this.resourceHttpService.postResource(resourceName, body);
  }

  public update(requestBody: RequestBody<T>): Observable<T> {
    const resource = ResourceUtils.initResource(requestBody.body) as Resource;
    const body = ResourceUtils.resolveValues({body: resource, valuesOption: requestBody?.valuesOption});

    return this.resourceHttpService.put(resource.getSelfLinkHref(), body);
  }

  public count(resourceName: string, query: string, requestParam: RequestParam): Observable<number> {
    return this.resourceHttpService.count(resourceName, query, requestParam);
  }

  public patch(requestBody: RequestBody<T>): Observable<T | any> {
    const resource = ResourceUtils.initResource(requestBody?.body) as Resource;
    const body = ResourceUtils.resolveValues({body: resource, valuesOption: requestBody?.valuesOption});

    return this.resourceHttpService.patch(resource.getSelfLinkHref(), body);
  }

  public delete(entity: T, options?: RequestOption): Observable<T | any> {
    const resource = ResourceUtils.initResource(entity) as Resource;
    const httpParams = UrlUtils.convertToHttpParams({params: options?.params});

    return this.resourceHttpService.delete(resource.getSelfLinkHref(),
      {observe: options?.observe, params: httpParams});
  }

  public searchCollection(resourceName: string, query: string, option?: GetOption): Observable<CollectionResource<T>> {
    return this.collectionResourceHttpService.search(resourceName, query, option);
  }

  public searchPage(resourceName: string, query: string, option?: PagedGetOption): Observable<PagedCollectionResource<T>> {
    return this.pagedCollectionResourceHttpService.search(resourceName, query, option);
  }

  public searchSingle(resourceName: string, query: string, option?: GetOption): Observable<T> {
    return this.resourceHttpService.search(resourceName, query, option);
  }

  public customQuery(resourceName: string,
                     method: HttpMethod,
                     query: string,
                     requestBody: RequestBody<any>,
                     options: PagedGetOption): Observable<any | T | CollectionResource<T> | PagedCollectionResource<T>> {
    const body = ResourceUtils.resolveValues(requestBody);

    return this.commonHttpService.customQuery(resourceName, method, query, body, options);
  }

}
