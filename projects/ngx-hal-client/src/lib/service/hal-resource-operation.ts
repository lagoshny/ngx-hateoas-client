import { Observable } from 'rxjs';
import { DependencyInjector } from '../util/dependency-injector';
import { HalResourceService } from './hal-resource.service';
import { GetOption, HttpMethod, PagedGetOption, RequestBody, RequestOption, RequestParam } from '../hal-resource/model/declarations';
import { Resource } from '../hal-resource/model/resource';
import { PagedResourceCollection } from '../hal-resource/model/paged-resource-collection';
import { ResourceCollection } from '../hal-resource/model/resource-collection';

/**
 * Main resource operation class.
 * Extend this class to create resource service.
 */
export class HalResourceOperation<T extends Resource> {

  private readonly resourceName: string;

  private halResourceService: HalResourceService<T>;

  constructor(resourceName: string) {
    this.resourceName = resourceName;
    this.halResourceService = DependencyInjector.get(HalResourceService) as HalResourceService<T>;
  }

  /**
   * {@link HalResourceService#get}.
   */
  public get(id: any, option?: GetOption): Observable<T> {
    return this.halResourceService.get(this.resourceName, id, option) as Observable<T>;
  }

  /**
   * {@link HalResourceService#getAll}.
   */
  public getAll(option?: GetOption): Observable<ResourceCollection<T>> {
    return this.halResourceService.getAll(this.resourceName, option);
  }

  /**
   * {@link HalResourceService#getAllPage}.
   */
  public getAllPage(option: PagedGetOption): Observable<PagedResourceCollection<T>> {
    return this.halResourceService.getAllPage(this.resourceName, option);
  }

  /**
   * {@link HalResourceService#createResource}.
   */
  public createResource(requestBody: RequestBody<T>): Observable<T> {
    return this.halResourceService.createResource(this.resourceName, requestBody);
  }

  /**
   * {@link HalResourceService#updateResource}.
   */
  public updateResource(requestBody: RequestBody<T>): Observable<T> {
    return this.halResourceService.updateResource(requestBody);
  }

  /**
   * {@link HalResourceService#count}.
   */
  public count(query?: string, requestParam?: RequestParam): Observable<number> {
    return this.halResourceService.count(this.resourceName, query, requestParam);
  }

  /**
   * {@link HalResourceService#patchResource}.
   */
  public patchResource(requestBody: RequestBody<T>): Observable<T> {
    return this.halResourceService.patchResource(requestBody);
  }

  /**
   * {@link HalResourceService#deleteResource}.
   */
  public deleteResource(entity: T, options?: RequestOption): Observable<T | any> {
    return this.halResourceService.deleteResource(entity, options);
  }

  /**
   * {@see ResourceCollectionHttpService#search}
   */
  public searchCollection(query: string, option?: GetOption): Observable<ResourceCollection<T>> {
    return this.halResourceService.searchCollection(this.resourceName, query, option);
  }

  /**
   * {@see PagedResourceCollection#search}
   */
  public searchPage(query: string, option?: PagedGetOption): Observable<PagedResourceCollection<T>> {
    return this.halResourceService.searchPage(this.resourceName, query, option);
  }

  /**
   * {@see ResourceHttpService#search}
   */
  public searchSingle(query: string, option?: GetOption): Observable<T> {
    return this.halResourceService.searchSingle(this.resourceName, query, option);
  }

  /**
   * {@see CommonHttpService#customQuery}
   */
  public customQuery(method: HttpMethod,
                     query: string,
                     requestBody: RequestBody<any>,
                     option?: PagedGetOption): Observable<any | T | ResourceCollection<T> | PagedResourceCollection<T>> {
    return this.halResourceService.customQuery(this.resourceName, method, query, requestBody, option);
  }

}
