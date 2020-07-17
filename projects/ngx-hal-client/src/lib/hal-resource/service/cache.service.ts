import { Injectable } from '@angular/core';
import { ResourceIdentifiable } from '../model/resource-identifiable';

@Injectable({providedIn: 'root'})
export class CacheService<T extends ResourceIdentifiable> {

  public hasResource(url: string): boolean {
    return false;
  }

  public getResource(): T {
    return null;
  }

  public putResource(url: string, resource: T) {
  }

  public evictResource(url: string) {
  }

  public getResourceCollection(): T {
    return null;
  }

  public putResourceCollection(url: string, resource: T) {
  }


}
