import { Observable, throwError as observableThrowError } from 'rxjs';
import { HalOptions, HalParam, Include, SubTypeBuilder } from './model/interfaces';
import { DependencyInjector } from '../../util/dependency-injector';
import { OptionUtils } from './util/option.utils';
import { map } from 'rxjs/operators';
import { OldResource } from './model/old-resource';
import { HalResourceService } from '../../service/external/hal-resource.service';
import { ResourceCollection } from '../../model/resource/resource-collection';
import { PagedResourceCollection } from '../../model/resource/paged-resource-collection';
import { HttpMethod } from '../../model/declarations';
import deprecated from 'deprecated-decorator';

function getHateoasResourceService() {
  return DependencyInjector.get(HalResourceService);
}

@deprecated('HalResourceOperation')
export class RestService<T extends OldResource | any> {
  private readonly type: any;
  private readonly resource: string;
  public resourceArray: ResourceCollection<T | any>;

  private embedded = '_embedded';

  constructor(resource: string) {
    this.resource = resource;
  }

  protected handleError(error: any): Observable<never> {
    return observableThrowError(error);
  }

  public getAll(options?: HalOptions, subType?: SubTypeBuilder): Observable<T[]> {
    return getHateoasResourceService()
      .getCollection(this.resource, OptionUtils.convertToGetOption(options))
      .pipe(
        map(value => {
          const result = [];
          if (value.resources) {
            value.resources.forEach(resource => {
              result.push(new OldResource(resource));
            });
          }
          return result;
        })
      );
  }

  public getAllPage(options?: HalOptions, subType?: SubTypeBuilder): Observable<PagedResourceCollection<T | any>> {
    return getHateoasResourceService().getPage(this.resource, OptionUtils.convertToPagedGetOption(options))
      .pipe(
        map(value => {
          const resourceCollection = new ResourceCollection<any>();
          if (value.resources) {
            value.resources.forEach(resource => {
              resourceCollection.resources.push(new OldResource(resource));
            });
          }
          resourceCollection.resources = value.resources;
          return new PagedResourceCollection(resourceCollection);
        })
      );
  }

  public get(id: any, params?: HalParam[]): Observable<T | any> {
    return getHateoasResourceService().getResource(this.resource, id, OptionUtils.halParamToGetOption(params))
      .pipe(
        map(value => {
          return new OldResource(value);
        })
      );
  }

  public getBySelfLink(selfLink: string): Observable<T> {
    throw new Error('It is not provided any more use getResource method to replace this one');
  }

  public search(query: string, options?: HalOptions, subType?: SubTypeBuilder): Observable<T[]> {
    return getHateoasResourceService().searchCollection(this.resource, query, OptionUtils.convertToGetOption(options))
      .pipe(
        map(value => {
          const result = [];
          if (value.resources) {
            value.resources.forEach(resource => {
              result.push(new OldResource(resource));
            });
          }
          return result;
        })
      );
  }

  public searchPage(query: string, options?: HalOptions, subType?: SubTypeBuilder): Observable<PagedResourceCollection<T | any>> {
    return getHateoasResourceService().searchPage(this.resource, query, OptionUtils.convertToPagedGetOption(options))
      .pipe(
        map(value => {
          const resourceCollection = new ResourceCollection<any>();
          if (value.resources) {
            value.resources.forEach(resource => {
              resourceCollection.resources.push(new OldResource(resource));
            });
          }
          resourceCollection.resources = value.resources;
          return new PagedResourceCollection(resourceCollection);
        })
      );
  }

  public searchSingle(query: string, options?: HalOptions): Observable<T | any> {
    return getHateoasResourceService().searchSingle(this.resource, query, OptionUtils.convertToGetOption(options))
      .pipe(
        map(value => {
          return new OldResource(value);
        })
      );
  }

  public customQuery(query: string, options?: HalOptions, subType?: SubTypeBuilder): Observable<T[]> {
    return getHateoasResourceService()
      .customQuery<ResourceCollection<any>>(this.resource, HttpMethod.GET, query, null, OptionUtils.convertToPagedGetOption(options))
      .pipe(
        map(value => {
          const result = [];
          if (value.resources) {
            value.resources.forEach(resource => {
              result.push(new OldResource(resource));
            });
          }
          return result;
        })
      );
  }

  public customQueryPost(query: string, options?: HalOptions, body?: any, subType?: SubTypeBuilder): Observable<T[]> {
    return getHateoasResourceService()
      .customQuery<ResourceCollection<any>>(this.resource, HttpMethod.POST, query, {body}, OptionUtils.convertToPagedGetOption(options))
      .pipe(
        map(value => {
          const result = [];
          if (value.resources) {
            value.resources.forEach(resource => {
              result.push(new OldResource(resource));
            });
          }
          return result;
        })
      );
  }

  public getByRelationArray(relation: string, builder?: SubTypeBuilder): Observable<T[]> {
    throw new Error('It is not provided any more use Resource.getRelatedCollection method to replace this one');
  }

  public getByRelation(relation: string): Observable<T> {
    throw new Error('It is not provided any more use Resource.getRelation method to replace this one');
  }

  public count(query?: string, options?: HalOptions): Observable<number> {
    return getHateoasResourceService()
      .customQuery<number>(this.resource, HttpMethod.GET, query, null, OptionUtils.convertToPagedGetOption(options));
  }

  public create(entity: any | T): Observable<any> {
    return getHateoasResourceService().createResource(this.resource, {body: entity});
  }

  public update(entity: any | T): Observable<any>  {
    return getHateoasResourceService().updateResource(entity);
  }

  public patch(entity: any | T, include?: Include): Observable<any>  {
    return getHateoasResourceService().patchResource(entity, {body: entity, valuesOption: {include}});
  }

  public delete(entity: any | T): Observable<object> {
    return getHateoasResourceService().deleteResource(entity);
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
    return observableThrowError('Use PagedResourceCollection to do page next requests');
  }

  public prev(): Observable<T[]> {
    return observableThrowError('Use PagedResourceCollection to do page prev requests');
  }

  public first(): Observable<T[]> {
    return observableThrowError('Use PagedResourceCollection to do page first requests');
  }

  public last(): Observable<T[]> {
    return observableThrowError('Use PagedResourceCollection to do page last requests');
  }

  public page(pageNumber: number): Observable<T[]> {
    return observableThrowError('Use PagedResourceCollection to do page requests');
  }
}
