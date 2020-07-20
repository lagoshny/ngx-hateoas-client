import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import {  HalParam } from './hal-resource-operation';
import { ResourceHttpService } from '../hal-resource/service/resource-http.service';
import { BaseResource } from '../hal-resource/model/base-resource';
import { PagedCollectionResourceHttpService } from '../hal-resource/service/paged-collection-resource-http.service';
import { HalPageParam, PagedCollectionResource } from '../hal-resource/model/paged-collection-resource';

@Injectable({providedIn: 'root'})
export class HalResourceService<T extends BaseResource> {

  constructor(private resourceHttpService: ResourceHttpService<T>,
              private pagedCollectionResourceHttpService: PagedCollectionResourceHttpService<PagedCollectionResource<T>>) {
  }

  public get(resourceName: string, id: any, params?: HalParam): Observable<T> {
    return this.resourceHttpService.get(resourceName, id, params) as Observable<T>;
  }

  // TODO: подумать об options и subTypes
  public getAllPage(resourceName: string, options?: HalPageParam, subType?: any): Observable<PagedCollectionResource<T>> {
    return this.pagedCollectionResourceHttpService.getPage(resourceName, options);
  }

}
