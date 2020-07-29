import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResourceHttpService } from '../hal-resource/service/resource-http.service';
import { PagedCollectionResourceHttpService } from '../hal-resource/service/paged-collection-resource-http.service';
import { PagedCollectionResource } from '../hal-resource/model/paged-collection-resource';
import { HalOption, HalSimpleOption, HttpMethod, RequestParam, ResourceOption } from '../hal-resource/model/declarations';
import { ResourceUtils } from '../util/resource.utils';
import { Resource } from '../ngx-hal-client.module';
import { CollectionResource } from '../hal-resource/model/collection-resource';
import { CollectionResourceHttpService } from '../hal-resource/service/collection-resource-http.service';
import { CommonHttpService } from '../hal-resource/service/common-http.service';

@Injectable()
export class HalResourceService<T extends Resource> {

  constructor(private commonHttpService: CommonHttpService<T | CollectionResource<T> | PagedCollectionResource<T>>,
              private resourceHttpService: ResourceHttpService<T>,
              private collectionResourceHttpService: CollectionResourceHttpService<CollectionResource<T>>,
              private pagedCollectionResourceHttpService: PagedCollectionResourceHttpService<PagedCollectionResource<T>>) {
  }

  public get(resourceName: string, id: any, option?: HalSimpleOption): Observable<T> {
    return this.resourceHttpService.getResource(resourceName, id, option) as Observable<T>;
  }

  public getAll(resourceName: string, option?: HalSimpleOption): Observable<CollectionResource<T>> {
    return this.collectionResourceHttpService.getResourceCollection(resourceName, null, option);
  }

  public getAllPage(resourceName: string, option?: HalOption): Observable<PagedCollectionResource<T>> {
    return this.pagedCollectionResourceHttpService.getResourcePage(resourceName, null, option);
  }

  public create(resourceName: string, resource: T): Observable<T> {
    return this.resourceHttpService.postResource(resourceName, ResourceUtils.resolveRelations(resource));
  }

  public update(entity: T) {
    const resource = ResourceUtils.initResource(entity) as Resource;
    return this.resourceHttpService.put(resource.getSelfLinkHref(), ResourceUtils.resolveRelations(resource));
  }

  public count(resourceName: string, query: string, requestParam: RequestParam): Observable<number> {
    return this.resourceHttpService.count(resourceName, query, requestParam);
  }

  public patch(entity: T, resourceOption: ResourceOption): Observable<T> {
    const resource = ResourceUtils.initResource(entity) as Resource;
    return this.resourceHttpService.patch(resource.getSelfLinkHref(), ResourceUtils.resolveRelations(resource, resourceOption));
  }

  public delete(entity: T): Observable<any> {
    const resource = ResourceUtils.initResource(entity) as Resource;
    return this.resourceHttpService.delete(resource.getSelfLinkHref());
  }

  public searchCollection(resourceName: string, query: string, option?: HalSimpleOption): Observable<CollectionResource<T>> {
    return this.collectionResourceHttpService.search(resourceName, query, option);
  }

  public searchPage(resourceName: string, query: string, option?: HalOption): Observable<PagedCollectionResource<T>> {
    return this.pagedCollectionResourceHttpService.search(resourceName, query, option);
  }

  public searchSingle(resourceName: string, query: string, option?: HalSimpleOption): Observable<T> {
    return this.resourceHttpService.search(resourceName, query, option);
  }

  public customQuery(resourceName: string,
                     method: HttpMethod,
                     query: string,
                     body: any,
                     option: HalOption): Observable<any | T | CollectionResource<T> | PagedCollectionResource<T>> {
    return this.commonHttpService.customQuery(resourceName, method, query, body, option);
  }
}
