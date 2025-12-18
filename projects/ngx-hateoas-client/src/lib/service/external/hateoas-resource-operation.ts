import { Observable } from 'rxjs';
import { DependencyInjector } from '../../util/dependency-injector';
import { HateoasResourceService } from './hateoas-resource.service';
import { GetOption, HttpMethod, PagedGetOption, RequestBody, RequestOption } from '../../model/declarations';
import { Resource } from '../../model/resource/resource';
import { PagedResourceCollection } from '../../model/resource/paged-resource-collection';
import { ResourceCollection } from '../../model/resource/resource-collection';
import { HttpResponse } from '@angular/common/http';
import { ResourceCtor } from '../../model/decorators';

/**
 * Main resource operation class.
 * Extend this class to create resource service.
 */
export class HateoasResourceOperation<T extends Resource> {

  private readonly resourceType: ResourceCtor<T>;

  private hateoasResourceService: HateoasResourceService;

  constructor(resourceType: ResourceCtor<T>) {
    this.resourceType = resourceType;
    this.hateoasResourceService = DependencyInjector.get(HateoasResourceService);
  }

  /**
   * {@link HateoasResourceService#getResource}.
   */
  public getResource(id: number | string, options?: GetOption): Observable<T> {
    return this.hateoasResourceService.getResource(this.resourceType, id, options) as Observable<T>;
  }

  /**
   * {@link HateoasResourceService#getCollection}.
   */
  public getCollection(options?: GetOption): Observable<ResourceCollection<T>> {
    return this.hateoasResourceService.getCollection(this.resourceType, options);
  }

  /**
   * {@link HateoasResourceService#getPage}.
   */
  public getPage(options?: PagedGetOption): Observable<PagedResourceCollection<T>> {
    return this.hateoasResourceService.getPage(this.resourceType, options);
  }

  /**
   * {@link HateoasResourceService#createResource}.
   */
  public createResource(requestBody: RequestBody<T>, options?: RequestOption): Observable<any> {
    return this.hateoasResourceService.createResource(this.resourceType, requestBody, options);
  }

  /**
   * {@link HateoasResourceService#updateResource}.
   */
  public updateResource(entity: T, requestBody?: RequestBody<any>, options?: RequestOption): Observable<T | any> {
    return this.hateoasResourceService.updateResource(entity, requestBody, options);
  }

  /**
   * {@link HateoasResourceService#updateResourceById}.
   */
  public updateResourceById(id: number | string, requestBody: RequestBody<any>, options?: RequestOption): Observable<T | any> {
    return this.hateoasResourceService.updateResourceById(this.resourceType, id, requestBody, options);
  }

  /**
   * {@link HateoasResourceService#patchResource}.
   */
  public patchResource(entity: T, requestBody?: RequestBody<any>, options?: RequestOption): Observable<T | any> {
    return this.hateoasResourceService.patchResource(entity, requestBody, options);
  }

  /**
   * {@link HateoasResourceService#patchResourceById}.
   */
  public patchResourceById(id: number | string, requestBody: RequestBody<any>, options?: RequestOption): Observable<T | any> {
    return this.hateoasResourceService.patchResourceById(this.resourceType, id, requestBody, options);
  }

  /**
   * {@link HateoasResourceService#deleteResource}.
   */
  public deleteResource(entity: T, options?: RequestOption): Observable<HttpResponse<any> | any> {
    return this.hateoasResourceService.deleteResource(entity, options);
  }

  /**
   * {@link HateoasResourceService#deleteResourceById}.
   */
  public deleteResourceById(id: number | string, options?: RequestOption): Observable<HttpResponse<any> | any> {
    return this.hateoasResourceService.deleteResourceById(this.resourceType, id, options);
  }

  /**
   * {@see ResourceCollectionHttpService#search}
   */
  public searchCollection(query: string, options?: GetOption): Observable<ResourceCollection<T>> {
    return this.hateoasResourceService.searchCollection(this.resourceType, query, options);
  }

  /**
   * {@see PagedResourceCollection#search}
   */
  public searchPage(query: string, options?: PagedGetOption): Observable<PagedResourceCollection<T>> {
    return this.hateoasResourceService.searchPage(this.resourceType, query, options);
  }

  /**
   * {@see ResourceHttpService#search}
   */
  public searchResource(query: string, options?: GetOption): Observable<T> {
    return this.hateoasResourceService.searchResource(this.resourceType, query, options);
  }

  /**
   * {@see ResourceHttpService#customQuery}
   */
  public customQuery<R>(method: HttpMethod,
                        query: string,
                        requestBody?: RequestBody<any>,
                        options?: PagedGetOption): Observable<R> {
    return this.hateoasResourceService.customQuery(this.resourceType, method, query, requestBody, options);
  }

  /**
   * {@see ResourceHttpService#customSearchQuery}
   */
  public customSearchQuery<R>(method: HttpMethod,
                              searchQuery: string,
                              requestBody?: RequestBody<any>,
                              options?: PagedGetOption): Observable<R> {
    return this.hateoasResourceService.customSearchQuery(this.resourceType, method, searchQuery, requestBody, options);
  }

}
