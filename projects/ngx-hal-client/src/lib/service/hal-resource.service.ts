import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { ResourceHttpService } from '../hal-resource/service/resource-http.service';
import { PagedCollectionResourceHttpService } from '../hal-resource/service/paged-collection-resource-http.service';
import { PagedCollectionResource } from '../hal-resource/model/paged-collection-resource';
import { PageParam, RequestParam } from '../hal-resource/model/declarations';
import { ResourceUtils } from '../util/resource.utils';
import { Resource } from '../ngx-hal-client.module';

@Injectable({providedIn: 'root'})
export class HalResourceService<T extends Resource> {

  constructor(private resourceHttpService: ResourceHttpService<T>,
              private pagedCollectionResourceHttpService: PagedCollectionResourceHttpService<PagedCollectionResource<T>>) {
  }

  public get(resourceName: string, id: any, params?: RequestParam): Observable<T> {
    return this.resourceHttpService.get(resourceName, id, params) as Observable<T>;
  }

  // TODO: подумать об options и subTypes
  public getAllPage(resourceName: string, options?: PageParam, subType?: any): Observable<PagedCollectionResource<T>> {
    return this.pagedCollectionResourceHttpService.getPage(resourceName, options);
  }

  public create(resourceName: string, resource: T): Observable<T> {
    return this.resourceHttpService.post(resourceName, ResourceUtils.resolveRelations(resource));
  }

}
