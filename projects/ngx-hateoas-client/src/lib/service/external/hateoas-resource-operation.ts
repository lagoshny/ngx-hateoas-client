import { Observable } from 'rxjs';
import { DependencyInjector } from '../../util/dependency-injector';
import { HateoasResourceService } from './hateoas-resource.service';
import { GetOption, HttpMethod, PagedGetOption, RequestBody, RequestOption } from '../../model/declarations';
import { Resource } from '../../model/resource/resource';
import { PagedResourceCollection } from '../../model/resource/paged-resource-collection';
import { ResourceCollection } from '../../model/resource/resource-collection';
import { HttpResponse } from '@angular/common/http';

/**
 * Main resource operation class.
 * Extend this class to create resource service.
 */
export class HateoasResourceOperation<T extends Resource> {

  private readonly resourceName: string;

  private hateoasResourceService: HateoasResourceService<T>;

  constructor(resourceName: string) {
    this.resourceName = resourceName;
    this.hateoasResourceService = DependencyInjector.get(HateoasResourceService) as HateoasResourceService<T>;
  }

  /**
   * {@link HateoasResourceService#getResource}.
   */
  public getResource(id: number | string, options?: GetOption): Observable<T> {
    return this.hateoasResourceService.getResource(this.resourceName, id, options) as Observable<T>;
  }

  /**
   * {@link HateoasResourceService#getCollection}.
   */
  public getCollection(options?: GetOption): Observable<ResourceCollection<T>> {
    return this.hateoasResourceService.getCollection(this.resourceName, options);
  }

  /**
   * {@link HateoasResourceService#getPage}.
   */
  public getPage(options?: PagedGetOption): Observable<PagedResourceCollection<T>> {
    return this.hateoasResourceService.getPage(this.resourceName, options);
  }

  /**
   * {@link HateoasResourceService#createResource}.
   */
  public createResource(requestBody: RequestBody<T>): Observable<T> {
    return this.hateoasResourceService.createResource(this.resourceName, requestBody);
  }

  /**
   * {@link HateoasResourceService#updateResource}.
   */
  public updateResource(entity: T, requestBody?: RequestBody<any>): Observable<T | any> {
    return this.hateoasResourceService.updateResource(entity, requestBody);
  }

  /**
   * {@link HateoasResourceService#updateResourceById}.
   */
  public updateResourceById(id: number | string, requestBody: RequestBody<any>): Observable<T | any> {
    return this.hateoasResourceService.updateResourceById(this.resourceName, id, requestBody);
  }

  /**
   * {@link HateoasResourceService#patchResource}.
   */
  public patchResource(entity: T, requestBody?: RequestBody<any>): Observable<T | any> {
    return this.hateoasResourceService.patchResource(entity, requestBody);
  }

  /**
   * {@link HateoasResourceService#patchResourceById}.
   */
  public patchResourceById(id: number | string, requestBody: RequestBody<any>): Observable<T | any> {
    return this.hateoasResourceService.patchResourceById(this.resourceName, id, requestBody);
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
    return this.hateoasResourceService.deleteResourceById(this.resourceName, id, options);
  }

  /**
   * {@see ResourceCollectionHttpService#search}
   */
  public searchCollection(query: string, options?: GetOption): Observable<ResourceCollection<T>> {
    return this.hateoasResourceService.searchCollection(this.resourceName, query, options);
  }

  /**
   * {@see PagedResourceCollection#search}
   */
  public searchPage(query: string, options?: PagedGetOption): Observable<PagedResourceCollection<T>> {
    return this.hateoasResourceService.searchPage(this.resourceName, query, options);
  }

  /**
   * {@see ResourceHttpService#search}
   */
  public searchSingle(query: string, options?: GetOption): Observable<T> {
    return this.hateoasResourceService.searchSingle(this.resourceName, query, options);
  }

  /**
   * {@see ResourceHttpService#customQuery}
   */
  public customQuery<R>(method: HttpMethod,
                        query: string,
                        requestBody?: RequestBody<any>,
                        options?: PagedGetOption): Observable<R> {
    return this.hateoasResourceService.customQuery(this.resourceName, method, query, requestBody, options);
  }

  /**
   * {@see ResourceHttpService#customSearchQuery}
   */
  public customSearchQuery<R>(method: HttpMethod,
                              searchQuery: string,
                              requestBody?: RequestBody<any>,
                              options?: PagedGetOption): Observable<R> {
    return this.hateoasResourceService.customSearchQuery(this.resourceName, method, searchQuery, requestBody, options);
  }

}
