import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { HalParam } from './hal-resource-operation';
import { ResourceHttpService } from '../hal-resource/service/resource-http.service';
import { BaseResource } from '../hal-resource/model/base-resource';

@Injectable({providedIn: 'root'})
export class HalResourceService<T extends BaseResource> {

  constructor(private resourceHttpService: ResourceHttpService<T>) {
  }

  public get(resourceName: string, id: any, params?: HalParam): Observable<T> {
    return this.resourceHttpService.get(resourceName, id, params) as Observable<T>;
  }

}
