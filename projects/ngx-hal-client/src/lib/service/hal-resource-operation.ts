import { Observable } from 'rxjs/internal/Observable';
import { DependencyInjector } from '../util/dependency-injector';
import { HalResourceService } from './hal-resource.service';
import { PageParam, RequestParam, ResourceOption } from '../hal-resource/model/declarations';
import { Resource } from '../hal-resource/model/resource';
import { PagedCollectionResource } from '../hal-resource/model/paged-collection-resource';
import { CollectionResource } from '../hal-resource/model/collection-resource';

export class HalResourceOperation<T extends Resource> {

  private readonly resourceName: string;

  private halResourceService: HalResourceService<T>;

  constructor(resourceName: string) {
    this.resourceName = resourceName;
    this.halResourceService = DependencyInjector.get(HalResourceService) as HalResourceService<T>;
  }

  public get(id: any, requestParam?: RequestParam): Observable<T> {
    return this.halResourceService.get(this.resourceName, id, requestParam) as Observable<T>;
  }

  // TODO: подумать об options
  public getAll(subType?: any): Observable<CollectionResource<T>> {
    return this.halResourceService.getAll(this.resourceName);
  }

  // TODO: подумать об options
  public getAllPage(pageParam?: PageParam): Observable<PagedCollectionResource<T>> {
    return this.halResourceService.getAllPage(this.resourceName, pageParam);
  }

  public create(resource: T): Observable<T> {
    return this.halResourceService.create(this.resourceName, resource);
  }

  public update(resource: T): Observable<T> {
    return this.halResourceService.update(resource);
  }

  public count(query?: string, requestParam?: RequestParam): Observable<number> {
    return this.halResourceService.count(this.resourceName, query, requestParam);
  }

  public patch(resource: T, resourceOption?: ResourceOption): Observable<T> {
    return this.halResourceService.patch(resource, resourceOption);
  }

  // TODO: проверить возвращаемый объект
  public delete(resource: T): Observable<any> {
    return this.halResourceService.delete(resource);
  }

  public search(query: string, requestParam?: RequestParam/*, subType?: SubTypeBuilder*/): Observable<CollectionResource<T>> {
    return this.halResourceService.search(this.resourceName, query, requestParam);
  }

  public searchPage(query: string, pageParam?: PageParam /*,subType?: SubTypeBuilder*/): Observable<PagedCollectionResource<T>> {
    return this.halResourceService.searchPage(this.resourceName, query, pageParam);
  }

  public searchSingle(query: string, requestParam?: RequestParam): Observable<T> {
    return this.halResourceService.searchSingle(this.resourceName, query, requestParam);
  }

  // TODO: подумать об передачи HalParam и возвращать либо PagedCollection либо просто Collection
  public collectionQuery(query: string, requestParam?: RequestParam /*,subType?: SubTypeBuilder*/): Observable<CollectionResource<T>> {
    return this.halResourceService.collectionQuery(this.resourceName, query, requestParam);
  }

  // TODO: подумать об унификации такого метода для коллекций, одного ресурса и для страниц
  public collectionQueryPost(query: string, body?: any, requestParam?: RequestParam /*, subType?: SubTypeBuilder*/): Observable<CollectionResource<T>> {
    return this.halResourceService.collectionQueryPost(this.resourceName, query, body, requestParam);
  }

  public getProjection(id: string,
                       projectionName: string,
                       // expireMs: number = CacheHelper.defaultExpire,
                       // isCacheActive: boolean = true
  ): Observable<T> {
    return this.halResourceService.getProjection(this.resourceName, id, projectionName);
  }

  public getProjectionCollection(projectionName: string
                                 // expireMs: number = CacheHelper.defaultExpire,
                                 // isCacheActive: boolean = true
  ): Observable<CollectionResource<T>> {
    return this.halResourceService.getProjectionCollection(this.resourceName, projectionName);
  }

}
