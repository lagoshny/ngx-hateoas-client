import { Observable } from 'rxjs';
import { DependencyInjector } from '../util/dependency-injector';
import { HalResourceService } from './hal-resource.service';
import { HalOption, HalSimpleOption, HttpMethod, RequestParam, ResourceOption } from '../hal-resource/model/declarations';
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

  public get(id: any, option?: HalSimpleOption): Observable<T> {
    return this.halResourceService.get(this.resourceName, id, option) as Observable<T>;
  }

  public getAll(option?: HalSimpleOption): Observable<CollectionResource<T>> {
    return this.halResourceService.getAll(this.resourceName, option);
  }

  public getAllPage(option: HalOption): Observable<PagedCollectionResource<T>> {
    return this.halResourceService.getAllPage(this.resourceName, option);
  }

  public create(entity: T): Observable<T> {
    return this.halResourceService.create(this.resourceName, entity);
  }

  public update(entity: T): Observable<T> {
    return this.halResourceService.update(entity);
  }

  public count(query?: string, requestParam?: RequestParam): Observable<number> {
    return this.halResourceService.count(this.resourceName, query, requestParam);
  }

  public patch(entity: T, resourceOption?: ResourceOption): Observable<T> {
    return this.halResourceService.patch(entity, resourceOption);
  }

  // TODO: проверить возвращаемый объект
  public delete(entity: T): Observable<any> {
    return this.halResourceService.delete(entity);
  }

  public searchCollection(query: string, option?: HalSimpleOption): Observable<CollectionResource<T>> {
    return this.halResourceService.searchCollection(this.resourceName, query, option);
  }

  public searchPage(query: string, option?: HalOption): Observable<PagedCollectionResource<T>> {
    return this.halResourceService.searchPage(this.resourceName, query, option);
  }

  public searchSingle(query: string, option?: HalSimpleOption): Observable<T> {
    return this.halResourceService.searchSingle(this.resourceName, query, option);
  }

  public customQuery(method: HttpMethod,
                     query: string,
                     body?: any,
                     option?: HalOption): Observable<any | T | CollectionResource<T> | PagedCollectionResource<T>> {
    return this.halResourceService.customQuery(this.resourceName, method, query, body, option);
  }

}
