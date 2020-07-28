import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { ResourceHttpService } from '../hal-resource/service/resource-http.service';
import { PagedCollectionResourceHttpService } from '../hal-resource/service/paged-collection-resource-http.service';
import { PagedCollectionResource } from '../hal-resource/model/paged-collection-resource';
import { PageParam, RequestParam, ResourceOption } from '../hal-resource/model/declarations';
import { ResourceUtils } from '../util/resource.utils';
import { Resource } from '../ngx-hal-client.module';
import { CollectionResource } from '../hal-resource/model/collection-resource';
import { CollectionResourceHttpService } from '../hal-resource/service/collection-resource-http.service';
import * as _ from 'lodash';
import { throwError as observableThrowError } from 'rxjs/internal/observable/throwError';

@Injectable({providedIn: 'root'})
export class HalResourceService<T extends Resource> {

  constructor(private resourceHttpService: ResourceHttpService<T>,
              private collectionResourceHttpService: CollectionResourceHttpService<CollectionResource<T>>,
              private pagedCollectionResourceHttpService: PagedCollectionResourceHttpService<PagedCollectionResource<T>>) {
  }

  public get(resourceName: string, id: any, requestParam?: RequestParam): Observable<T> {
    return this.resourceHttpService.get(resourceName, id, requestParam) as Observable<T>;
  }

  public getAll(resourceName: string): Observable<CollectionResource<T>> {
    return this.collectionResourceHttpService.get(resourceName);
  }

  // TODO: подумать об options и subTypes
  public getAllPage(resourceName: string, pageParam?: PageParam): Observable<PagedCollectionResource<T>> {
    return this.pagedCollectionResourceHttpService.getPage(resourceName, pageParam);
  }

  public create(resourceName: string, resource: T): Observable<T> {
    return this.resourceHttpService.post(resourceName, ResourceUtils.resolveRelations(resource));
  }

  public update(resource: T) {
    return this.resourceHttpService.putResource(resource.getSelfLinkHref(), ResourceUtils.resolveRelations(resource));
  }

  public count(resourceName: string, query: string, requestParam: RequestParam): Observable<number> {
    return this.resourceHttpService.count(resourceName, query, requestParam);
  }

  public patch(resource: T, resourceOption: ResourceOption): Observable<T> {
    return this.resourceHttpService.patchResource(resource.getSelfLinkHref(), ResourceUtils.resolveRelations(resource, resourceOption));
  }

  public delete(resource: T): Observable<any> {
    return this.resourceHttpService.deleteResource(resource.getSelfLinkHref());
  }

  public search(resourceName: string, query: string, requestParam?: RequestParam): Observable<CollectionResource<T>> {
    return this.collectionResourceHttpService.search(resourceName, query, requestParam);
  }

  public searchPage(resourceName: string, query: string, pageParam?: PageParam /*,subType?: SubTypeBuilder*/): Observable<PagedCollectionResource<T>> {
    return this.pagedCollectionResourceHttpService.search(resourceName, query, pageParam);
  }

  public searchSingle(resourceName: string, query: string, requestParam: RequestParam): Observable<T> {
    return this.resourceHttpService.search(resourceName, query, requestParam);
  }

  public collectionQuery(resourceName: string, query: string, requestParam: RequestParam): Observable<CollectionResource<T>> {
    return this.collectionResourceHttpService.get(resourceName, query, requestParam);
  }

  public collectionQueryPost(resourceName: string, query: string, body: any, requestParam: RequestParam): Observable<CollectionResource<T>> {
    return this.collectionResourceHttpService.post(resourceName, query, body, requestParam);
  }

  /**
   * Get single resource projection.
   *
   * @param resourceName name of the resource to get projection
   * @param id resource id
   * @param projectionName projection that will be applied to resource
   * @throws error when projectionName is empty
   */
  public getProjection(resourceName: string,
                       id: string,
                       projectionName: string,
                       // expireMs: number = CacheHelper.defaultExpire,
                       // isCacheActive: boolean = true
  ): Observable<T> {
    if (_.isEmpty(projectionName)) {
      return observableThrowError('no projection found');
    }

    return this.resourceHttpService.getProjection(resourceName, id, projectionName) as Observable<T>;
  }

  // TODO: а нужен ли getProjectionPage или сделать один метод с параметрами для projection
  public getProjectionCollection(resourceName: string, projectionName: string): Observable<CollectionResource<T>> {
    return this.collectionResourceHttpService.getProjection(resourceName, projectionName);
  }

}
