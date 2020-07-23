import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { ResourceHttpService } from '../hal-resource/service/resource-http.service';
import { PagedCollectionResourceHttpService } from '../hal-resource/service/paged-collection-resource-http.service';
import { PagedCollectionResource } from '../hal-resource/model/paged-collection-resource';
import { PageParam, RequestParam, ResourceOption } from '../hal-resource/model/declarations';
import { ResourceUtils } from '../util/resource.utils';
import { Resource } from '../ngx-hal-client.module';

@Injectable({providedIn: 'root'})
export class HalResourceService<T extends Resource> {

  constructor(private resourceHttpService: ResourceHttpService<T>,
              private pagedCollectionResourceHttpService: PagedCollectionResourceHttpService<PagedCollectionResource<T>>) {
  }

  public get(resourceName: string, id: any, requestParam?: RequestParam): Observable<T> {
    return this.resourceHttpService.get(resourceName, id, requestParam) as Observable<T>;
  }

  // TODO: подумать об options и subTypes
  public getAllPage(resourceName: string, pageParam?: PageParam, subType?: any): Observable<PagedCollectionResource<T>> {
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

}
