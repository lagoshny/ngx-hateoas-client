import { Observable } from 'rxjs';
import { DependencyInjector } from '../util/dependency-injector';
import { HalResourceService } from './hal-resource.service';
import { GetOption, HttpMethod, PagedGetOption, RequestBody, RequestOption, RequestParam } from '../hal-resource/model/declarations';
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

  public get(id: any, option?: GetOption): Observable<T> {
    return this.halResourceService.get(this.resourceName, id, option) as Observable<T>;
  }

  public getAll(option?: GetOption): Observable<CollectionResource<T>> {
    return this.halResourceService.getAll(this.resourceName, option);
  }

  public getAllPage(option: PagedGetOption): Observable<PagedCollectionResource<T>> {
    return this.halResourceService.getAllPage(this.resourceName, option);
  }

  public create(requestBody: RequestBody<T>): Observable<T> {
    return this.halResourceService.create(this.resourceName, requestBody);
  }

  public update(requestBody: RequestBody<T>): Observable<T> {
    return this.halResourceService.update(requestBody);
  }

  public count(query?: string, requestParam?: RequestParam): Observable<number> {
    return this.halResourceService.count(this.resourceName, query, requestParam);
  }

  public patch(requestBody: RequestBody<T>): Observable<T> {
    return this.halResourceService.patch(requestBody);
  }

  public delete(entity: T, options?: RequestOption): Observable<T | any> {
    return this.halResourceService.delete(entity, options);
  }

  public searchCollection(query: string, option?: GetOption): Observable<CollectionResource<T>> {
    return this.halResourceService.searchCollection(this.resourceName, query, option);
  }

  public searchPage(query: string, option?: PagedGetOption): Observable<PagedCollectionResource<T>> {
    return this.halResourceService.searchPage(this.resourceName, query, option);
  }

  public searchSingle(query: string, option?: GetOption): Observable<T> {
    return this.halResourceService.searchSingle(this.resourceName, query, option);
  }

  public customQuery(method: HttpMethod,
                     query: string,
                     requestBody: RequestBody<any>,
                     option?: PagedGetOption): Observable<any | T | CollectionResource<T> | PagedCollectionResource<T>> {
    return this.halResourceService.customQuery(this.resourceName, method, query, requestBody, option);
  }

}
