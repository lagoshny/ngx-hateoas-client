import { Observable, throwError as observableThrowError } from 'rxjs';
import { HalOptions, HalParam, Include, OldSubTypeBuilder } from './model/interfaces';
import { DependencyInjector } from '../../util/dependency-injector';
import { OldUtils } from './util/old.utils';
import { map } from 'rxjs/operators';
import { OldResource } from './model/old-resource';
import { ResourceCollection } from '../../model/resource/resource-collection';
import { HttpMethod } from '../../model/declarations';
import { HateoasResourceService } from '../../service/external/hateoas-resource.service';
import { Resource } from '../../model/resource/resource';
import { EmbeddedResource } from '../../model/resource/embedded-resource';
import { BaseResource } from '../../model/resource/base-resource';
import { getResourceCollectionHttpService } from '../../service/internal/resource-collection-http.service';
import { getResourceHttpService } from '../../service/internal/resource-http.service';
import { HttpResponse } from '@angular/common/http';
import { OldResourcePage } from './model/old-resource-page';

function getHateoasResourceService() {
  return DependencyInjector.get(HateoasResourceService);
}

/* tslint:disable:no-string-literal */
export class OldRestService<T extends OldResource | any> {
  private readonly type: any;
  private readonly resource: string;
  public resourceArray: ResourceCollection<T | any>;

  constructor(type: new() => T, resource: string) {
    this.type = type;
    this.resource = resource;
  }

  protected handleError(error: any): Observable<never> {
    return observableThrowError(error);
  }

  public getAll(options?: HalOptions, subType?: OldSubTypeBuilder): Observable<T[]> {
    return getHateoasResourceService()
      .getCollection(this.resource, OldUtils.convertToGetOption(options))
      .pipe(
        map(value => {
          const result = [];
          if (value.resources) {
            value.resources.forEach(resource => {
              result.push(OldUtils.instantiateResource(subType, resource, this.type));
            });
          }
          return result;
        })
      );
  }

  public getAllPage(options?: HalOptions, subType?: OldSubTypeBuilder): Observable<OldResourcePage<T | any>> {
    return getHateoasResourceService().getPage(this.resource, OldUtils.convertToPagedGetOption(options))
      .pipe(
        map(value => {
          if (value.resources) {
            value.resources = value.resources.map(resource => {
              return OldUtils.instantiateResource(subType, resource, this.type);
            });
          }
          return new OldResourcePage(value);
        })
      );
  }

  public get(id: any, params?: HalParam[]): Observable<T | any> {
    return getHateoasResourceService().getResource(this.resource, id, OldUtils.halParamToGetOption(params))
      .pipe(
        map(value => {
          return OldUtils.instantiateResource(null, value, this.type);
        })
      );
  }

  public getBySelfLink(selfLink: string): Observable<T> {
    throw new Error('It is not provided any more use getResource method to replace this one');
  }

  public search(query: string, options?: HalOptions, subType?: OldSubTypeBuilder): Observable<T[]> {
    return getHateoasResourceService().searchCollection(this.resource, query, OldUtils.convertToGetOption(options))
      .pipe(
        map(value => {
          const result = [];
          if (value.resources) {
            value.resources.forEach(resource => {
              result.push(OldUtils.instantiateResource(subType, resource, this.type));
            });
          }
          return result;
        })
      );
  }

  public searchPage(query: string, options?: HalOptions, subType?: OldSubTypeBuilder): Observable<OldResourcePage<T | any>> {
    return getHateoasResourceService().searchPage(this.resource, query, OldUtils.convertToPagedGetOption(options))
      .pipe(
        map(value => {
          if (value.resources) {
            value.resources = value.resources.map(resource => {
              return OldUtils.instantiateResource(subType, resource, this.type);
            });
          }
          return new OldResourcePage(value);
        })
      );
  }

  public searchSingle(query: string, options?: HalOptions): Observable<T | any> {
    return getHateoasResourceService().searchResource(this.resource, query, OldUtils.convertToGetOption(options))
      .pipe(
        map(value => {
          return OldUtils.instantiateResource(null, value, this.type);
        })
      );
  }

  public customQuery(query: string, options?: HalOptions, subType?: OldSubTypeBuilder): Observable<T[]> {
    return getHateoasResourceService()
      .customQuery<ResourceCollection<any>>(this.resource, HttpMethod.GET, query, null, OldUtils.convertToPagedGetOption(options))
      .pipe(
        map(value => {
          const result = [];
          if (value.resources) {
            value.resources.forEach(resource => {
              result.push(OldUtils.instantiateResource(subType, resource, this.type));
            });
          }
          return result;
        })
      );
  }

  public customQueryPost(query: string, options?: HalOptions, body?: any, subType?: OldSubTypeBuilder): Observable<T[]> {
    return getHateoasResourceService()
      .customQuery<ResourceCollection<any>>(this.resource, HttpMethod.POST, query, {body}, OldUtils.convertToPagedGetOption(options))
      .pipe(
        map(value => {
          const result = [];
          if (value.resources) {
            value.resources.forEach(resource => {
              result.push(OldUtils.instantiateResource(subType, resource, this.type));
            });
          }
          return result;
        })
      );
  }

  public getByRelationArray(relation: string, builder?: OldSubTypeBuilder): Observable<T[]> {
    // throw new Error('It is not provided any more use Resource.getRelatedCollection method to replace this one');
    return getResourceCollectionHttpService().get(relation)
      .pipe(
        map(value => {
          const result = [];
          if (value.resources) {
            value.resources.forEach(resource => {
              result.push(OldUtils.instantiateResource(builder, resource, this.type));
            });
          }
          return result;
        })
      );
  }

  public getByRelation(relation: string): Observable<T> {
    // throw new Error('It is not provided any more use Resource.getRelation method to replace this one');
    return getResourceHttpService().get(relation)
      .pipe(
        map(value => {
          return OldUtils.instantiateResource(null, value, this.type);
        })
      );
  }

  public count(query?: string, options?: HalOptions): Observable<number> {
    return getHateoasResourceService()
      .customQuery<number>(this.resource, HttpMethod.GET, `/search${ query.startsWith('/') ? query : '/' + query }`,
        null, OldUtils.convertToPagedGetOption(options));
  }

  public create(entity: any | T): Observable<any> {
    return getHateoasResourceService().createResource(this.resource, {body: entity})
      .pipe(
        map(value => {
          return OldUtils.instantiateResource(null, value, this.type);
        })
      );
  }

  public update(entity: any | T): Observable<any> {
    return getHateoasResourceService().updateResource(entity)
      .pipe(
        map(value => {
          return OldUtils.instantiateResource(null, value, this.type);
        })
      );
  }

  public patch(entity: any | T, include?: Include): Observable<any> {
    return getHateoasResourceService().patchResource(entity, {body: entity, valuesOption: {include}})
      .pipe(
        map(value => {
          return OldUtils.instantiateResource(null, value, this.type);
        })
      );
  }

  public delete(entity: any | T): Observable<object> {
    return getHateoasResourceService().deleteResource(entity)
      .pipe(
        map((value: HttpResponse<any>) => {
          if (value.body instanceof Resource || value.body instanceof BaseResource || value.body instanceof EmbeddedResource) {
            return OldUtils.instantiateResource(null, value, this.type);
          }
          return value.body;
        })
      );
  }

  public totalElement(): number {
    throw new Error('Use PagedResourceCollection to work with page');
  }

  public totalPages(): number {
    throw new Error('Use PagedResourceCollection to work with page');
  }

  public hasFirst(): boolean {
    throw new Error('Use PagedResourceCollection to work with page');
  }

  public hasNext(): boolean {
    throw new Error('Use PagedResourceCollection to work with page');
  }

  public hasPrev(): boolean {
    throw new Error('Use PagedResourceCollection to work with page');
  }

  public hasLast(): boolean {
    throw new Error('Use PagedResourceCollection to work with page');
  }

  public next(): Observable<T[]> {
    throw new Error('Use PagedResourceCollection to do page next requests');
  }

  public prev(): Observable<T[]> {
    throw new Error('Use PagedResourceCollection to do page prev requests');
  }

  public first(): Observable<T[]> {
    throw new Error('Use PagedResourceCollection to do page first requests');
  }

  public last(): Observable<T[]> {
    throw new Error('Use PagedResourceCollection to do page last requests');
  }

  public page(pageNumber: number): Observable<T[]> {
    throw new Error('Use PagedResourceCollection to do page requests');
  }
}
