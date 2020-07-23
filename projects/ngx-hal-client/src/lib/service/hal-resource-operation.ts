import { Observable } from 'rxjs/internal/Observable';
import { DependencyInjector } from '../util/dependency-injector';
import { HalResourceService } from './hal-resource.service';
import { PageParam, RequestParam, ResourceOption } from '../hal-resource/model/declarations';
import { Resource } from '../hal-resource/model/resource';
import { PagedCollectionResource } from '../hal-resource/model/paged-collection-resource';

export class HalResourceOperation<T extends Resource> {

  private readonly resourceName: string;
  // public resourceArray: ResourceCollection<T>;
  // private resourceService: ResourceService;

  private halResourceService: HalResourceService<T>;

  // private resourceHttpService: ResourceHttpService<BaseResource>;

  constructor(resourceName: string) {
    this.resourceName = resourceName;
    this.halResourceService = DependencyInjector.get(HalResourceService) as HalResourceService<T>;
  }

  public get(id: any, requestParam?: RequestParam): Observable<T> {
    return this.halResourceService.get(this.resourceName, id, requestParam) as Observable<T>;
  }

  // TODO: подумать об options и subTypes
  public getAllPage(pageParam?: PageParam, subType?: any): Observable<PagedCollectionResource<T>> {
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

  //
  // public getBySelfLink(selfLink: string): Observable<T> {
  //   return this.resourceService.getBySelfLink(this.type, selfLink);
  // }
  //
  // public search(query: string, options?: HalOptions, subType?: SubTypeBuilder): Observable<T[]> {
  //   return this.resourceService.search(this.type, query, this.resourceName, this.embedded, options, subType).pipe(
  //     mergeMap((resourceArray: ResourceCollection<T>) => {
  //       if (options && options.notPaged && !ObjectUtils.isNullOrUndefined(resourceArray.firstUri)) {
  //         options.notPaged = false;
  //         options.size = resourceArray.totalElements;
  //         return this.search(query, options, subType);
  //       } else {
  //         this.resourceArray = resourceArray;
  //         return observableOf(resourceArray.result);
  //       }
  //     }));
  // }
  //
  // public searchPage(query: string, options?: HalOptions, subType?: SubTypeBuilder): Observable<ResourcePage<T>> {
  //   return this.resourceService.search(this.type, query, this.resourceName, this.embedded, options, subType)
  //     .pipe(
  //       mergeMap((resourceArray: ResourceCollection<T>) => {
  //         return observableOf(new ResourcePage<T>(resourceArray));
  //       })
  //     );
  // }
  //
  // public searchSingle(query: string, options?: HalOptions): Observable<T> {
  //   return this.resourceService.searchSingle(this.type, query, this.resourceName, options);
  // }
  //
  // public customQuery(query: string, options?: HalOptions, subType?: SubTypeBuilder): Observable<T[]> {
  //   return this.resourceService.customQuery(this.type, query, this.resourceName, this.embedded, options, subType).pipe(
  //     mergeMap((resourceArray: ResourceCollection<T>) => {
  //       if (options && options.notPaged && !ObjectUtils.isNullOrUndefined(resourceArray.firstUri)) {
  //         options.notPaged = false;
  //         options.size = resourceArray.totalElements;
  //         return this.customQuery(query, options, subType);
  //       } else {
  //         this.resourceArray = resourceArray;
  //         return observableOf(resourceArray.result);
  //       }
  //     }));
  // }
  //
  // public customQueryPost(query: string, options?: HalOptions, body?: any, subType?: SubTypeBuilder): Observable<T[]> {
  //   return this.resourceService.customQueryPost(this.type, query, this.resourceName, this.embedded, options, body, subType).pipe(
  //     mergeMap((resourceArray: ResourceCollection<T>) => {
  //       if (options && options.notPaged && !ObjectUtils.isNullOrUndefined(resourceArray.firstUri)) {
  //         options.notPaged = false;
  //         options.size = resourceArray.totalElements;
  //         return this.customQueryPost(query, options, body, subType);
  //       } else {
  //         this.resourceArray = resourceArray;
  //         return observableOf(resourceArray.result);
  //       }
  //     }));
  // }
  //
  // public getByRelationArray(relation: string, builder?: SubTypeBuilder): Observable<T[]> {
  //   return this.resourceService.getByRelationArray(this.type, relation, this.embedded, builder).pipe(
  //     map((resourceArray: ResourceCollection<T>) => {
  //       this.resourceArray = resourceArray;
  //       return resourceArray.result;
  //     }));
  // }
  //
  // public getByRelation(relation: string): Observable<T> {
  //   return this.resourceService.getByRelation(this.type, relation);
  // }
  //
  //
  // public totalElement(): number {
  //   if (this.resourceArray && this.resourceArray.totalElements) {
  //     return this.resourceArray.totalElements;
  //   }
  //   return 0;
  // }
  //
  // public totalPages(): number {
  //   if (this.resourceArray && this.resourceArray.totalPages) {
  //     return this.resourceArray.totalPages;
  //   }
  //   return 1;
  // }
  //
  // public hasFirst(): boolean {
  //   if (this.resourceArray) {
  //     return this.resourceService.hasFirst(this.resourceArray);
  //   }
  //   return false;
  // }
  //
  // public hasNext(): boolean {
  //   if (this.resourceArray) {
  //     return this.resourceService.hasNext(this.resourceArray);
  //   }
  //   return false;
  // }
  //
  // public hasPrev(): boolean {
  //   if (this.resourceArray) {
  //     return this.resourceService.hasPrev(this.resourceArray);
  //   }
  //   return false;
  // }
  //
  // public hasLast(): boolean {
  //   if (this.resourceArray) {
  //     return this.resourceService.hasLast(this.resourceArray);
  //   }
  //   return false;
  // }
  //
  // public next(): Observable<T[]> {
  //   if (this.resourceArray) {
  //     return this.resourceService.next(this.resourceArray, this.type).pipe(
  //       map((resourceArray: ResourceCollection<T>) => {
  //         this.resourceArray = resourceArray;
  //         return resourceArray.result;
  //       }));
  //   } else {
  //     observableThrowError('no resourceArray found');
  //   }
  // }
  //
  // public prev(): Observable<T[]> {
  //   if (this.resourceArray) {
  //     return this.resourceService.prev(this.resourceArray, this.type).pipe(
  //       map((resourceArray: ResourceCollection<T>) => {
  //         this.resourceArray = resourceArray;
  //         return resourceArray.result;
  //       }));
  //   } else {
  //     observableThrowError('no resourceArray found');
  //   }
  // }
  //
  // public first(): Observable<T[]> {
  //   if (this.resourceArray) {
  //     return this.resourceService.first(this.resourceArray, this.type)
  //       .pipe(
  //         map((resourceArray: ResourceCollection<T>) => {
  //           this.resourceArray = resourceArray;
  //           return resourceArray.result;
  //         })
  //       );
  //   } else {
  //     observableThrowError('no resourceArray found');
  //   }
  // }
  //
  // public last(): Observable<T[]> {
  //   if (this.resourceArray) {
  //     return this.resourceService.last(this.resourceArray, this.type)
  //       .pipe(
  //         map((resourceArray: ResourceCollection<T>) => {
  //           this.resourceArray = resourceArray;
  //           return resourceArray.result;
  //         })
  //       );
  //   } else {
  //     observableThrowError('no resourceArray found');
  //   }
  // }
  //
  // public page(pageNumber: number): Observable<T[]> {
  //   if (this.resourceArray) {
  //     return this.resourceService.page(this.resourceArray, this.type, pageNumber).pipe(
  //       map((resourceArray: ResourceCollection<T>) => {
  //         this.resourceArray = resourceArray;
  //         return resourceArray.result;
  //       }));
  //   } else {
  //     observableThrowError('no resourceArray found');
  //   }
  // }

}
