import { Observable } from 'rxjs';
import { DependencyInjector } from '../../util/dependency-injector';
import { HalResourceService } from './hal-resource.service';
import { GetOption, HttpMethod, PagedGetOption, RequestBody, RequestOption } from '../../model/declarations';
import { Resource } from '../../model/resource/resource';
import { PagedResourceCollection } from '../../model/resource/paged-resource-collection';
import { ResourceCollection } from '../../model/resource/resource-collection';

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
   * {@link HalResourceService#getResource}.
   */
  public getResource(id: number | string, options?: GetOption): Observable<T> {
    return this.halResourceService.getResource(this.resourceName, id, options) as Observable<T>;
  }

  /**
   * {@link HalResourceService#getCollection}.
   */
  public getCollection(options?: GetOption): Observable<ResourceCollection<T>> {
    return this.halResourceService.getCollection(this.resourceName, options);
  }

  /**
   * {@link HalResourceService#getPage}.
   */
  public getPage(options?: PagedGetOption): Observable<PagedResourceCollection<T>> {
    return this.halResourceService.getPage(this.resourceName, options);
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
  public updateResource(entity: T, requestBody?: RequestBody<any>): Observable<T | any> {
    return this.halResourceService.updateResource(entity, requestBody);
  }

  /**
   * {@link HalResourceService#updateResourceById}.
   */
  public updateResourceById(id: number | string, requestBody: RequestBody<any>): Observable<T | any> {
    return this.halResourceService.updateResourceById(this.resourceName, id, requestBody);
  }

  /**
   * {@link HalResourceService#patchResource}.
   */
  public patchResource(entity: T, requestBody?: RequestBody<any>): Observable<T | any> {
    return this.halResourceService.patchResource(entity, requestBody);
  }

  /**
   * {@link HalResourceService#patchResourceById}.
   */
  public patchResourceById(id: number | string, requestBody: RequestBody<any>): Observable<T | any> {
    return this.halResourceService.patchResourceById(this.resourceName, id, requestBody);
  }

  /**
   * {@link HalResourceService#deleteResource}.
   */
  public deleteResource(entity: T, options?: RequestOption): Observable<T | any> {
    return this.halResourceService.deleteResource(entity, options);
  }

  /**
   * {@link HalResourceService#deleteResourceById}.
   */
  public deleteResourceById(id: number | string, options?: RequestOption): Observable<T | any> {
    return this.halResourceService.deleteResourceById(this.resourceName, id, options);
  }

  /**
   * {@see ResourceCollectionHttpService#search}
   */
  public searchCollection(query: string, options?: GetOption): Observable<ResourceCollection<T>> {
    return this.halResourceService.searchCollection(this.resourceName, query, options);
  }

  /**
   * {@see PagedResourceCollection#search}
   */
  public searchPage(query: string, options?: PagedGetOption): Observable<PagedResourceCollection<T>> {
    return this.halResourceService.searchPage(this.resourceName, query, options);
  }

  /**
   * {@see ResourceHttpService#search}
   */
  public searchSingle(query: string, options?: GetOption): Observable<T> {
    return this.halResourceService.searchSingle(this.resourceName, query, options);
  }

  /**
   * {@see ResourceHttpService#customQuery}
   */
  public customQuery<R>(method: HttpMethod,
                        query: string,
                        requestBody?: RequestBody<any>,
                        options?: PagedGetOption): Observable<R> {
    return this.halResourceService.customQuery(this.resourceName, method, query, requestBody, options);
  }

  /**
   * {@see ResourceHttpService#customSearchQuery}
   */
  public customSearchQuery<R>(method: HttpMethod,
                              searchQuery: string,
                              requestBody?: RequestBody<any>,
                              options?: PagedGetOption): Observable<R> {
    return this.halResourceService.customSearchQuery(this.resourceName, method, searchQuery, requestBody, options);
  }

}
