import { Injectable } from '@angular/core';
import { BaseResource } from '../model/base-resource';

@Injectable({providedIn: 'root'})
export class CacheService {

  public hasResource(url: string): boolean {
    return false;
  }

  public getResource(): BaseResource {
    return null;
  }

  public putResource<T extends BaseResource>(url: string, resource: T) {
  }

  public evictResource(url: string) {

  }

}
