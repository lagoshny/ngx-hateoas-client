import { Observable, throwError as observableThrowError } from 'rxjs';
import * as _ from 'lodash';
import { getResourceHttpService } from '../service/resource-http.service';
import { UrlUtils } from '../../util/url.utils';
import uriTemplates from 'uri-templates';
import { ResourceIdentifiable } from './resource-identifiable';
import { CollectionResource } from './collection-resource';
import { getCollectionResourceHttpService } from '../service/collection-resource-http.service';
import { RequestParam } from './declarations';

export abstract class BaseResource extends ResourceIdentifiable {

  /**
   * Get resource relation.
   */
  public getRelation<T extends BaseResource>(relation: string,
                                                     // TODO: подумать об options (возможно они будут разные для GET, POST и т.д.)
                                                     // builder?: SubTypeBuilder,
                                                     // expireMs: number = CacheHelper.defaultExpire,
                                                     // isCacheActive: boolean = true
  ): Observable<T> {
    const relationLink = this._links[relation];
    if (_.isEmpty(relationLink) || _.isEmpty(relationLink.href)) {
      return observableThrowError('no relation found');
    }
    const uri = relationLink.templated ? UrlUtils.removeUrlTemplateVars(relationLink.href) : relationLink.href;

    return getResourceHttpService().getResource(uri) as Observable<T>;
  }

  public getProjection<T extends BaseResource>(resource: string,
                                               id: string,
                                               projectionName: string,
                                               // expireMs: number = CacheHelper.defaultExpire,
                                               // isCacheActive: boolean = true
  ): Observable<T> {
    if (_.isEmpty(projectionName)) {
      return observableThrowError('no projection found');
    }

    return getResourceHttpService().getProjection(resource, id, projectionName) as Observable<T>;
  }

  public getRelatedCollection<T extends CollectionResource<BaseResource>>(relation: string,
                                                                          // options?: HalOptions,
                                                                          // embedded?: string,
                                                                          // builder?: SubTypeBuilder,
                                                                          // expireMs: number = CacheHelper.defaultExpire,
                                                                          // isCacheActive: boolean = true
  ): Observable<T> {
    const relationLink = this._links[relation];
    if (_.isEmpty(relationLink) || _.isEmpty(relationLink.href)) {
      return observableThrowError('no relation found');
    }

    // TODO: добавить заполнение параметров
    const uri = relationLink.templated ? uriTemplates(relationLink.href).fill({}) : relationLink.href;

    return getCollectionResourceHttpService().getResourceCollection(uri) as Observable<T>;
  }


  // // Get collection of related resources
  // public getRelationArray<T extends Resource>(type: new() => T,
  //                                             relation: string,
  //                                             options?: HalOptions,
  //                                             embedded?: string,
  //                                             builder?: SubTypeBuilder,
  //                                             expireMs: number = CacheHelper.defaultExpire,
  //                                             isCacheActive: boolean = true): Observable<T[]> {
  //
  //   const httpParams = UrlUtils.optionParams(new HttpParams({encoder: new CustomEncoder()}), options);
  //   const result: ResourceCollection<T> = new ResourceCollection<T>(ObjectUtils.isNullOrUndefined(embedded) ? '_embedded' : embedded);
  //   if (this.existRelationLink(relation)) {
  //     if (CacheHelper.ifPresent(this.getRelationLinkHref(relation), null, options, isCacheActive)) {
  //       return observableOf(CacheHelper.getArray(this.getRelationLinkHref(relation)));
  //     }
  //
  //     // Use this obj to clear relation url from any http params template because we will pass params in request
  //     const urlAsObj = new URL(this.getRelationLinkHref(relation));
  //     return this.resourceClientService.getResource(`${ urlAsObj.origin }${ urlAsObj.pathname }`,
  //       {
  //         params: httpParams
  //       })
  //       .pipe(
  //         map(response => ResourceUtils.instantiateResourceCollection<T>(type, response, result, builder)),
  //         catchError(error => observableThrowError(error))
  //       )
  //       .pipe(map((array: ResourceCollection<T>) => {
  //         CacheHelper.putArray(this.getRelationLinkHref(relation), array.result, expireMs);
  //         return array.result;
  //       }));
  //   } else {
  //     return observableOf([]);
  //   }
  // }
  //
  // public getProjectionArray<T extends Resource>(type: new() => T,
  //                                               resource: string,
  //                                               projectionName: string,
  //                                               expireMs: number = CacheHelper.defaultExpire,
  //                                               isCacheActive: boolean = true): Observable<T[]> {
  //   const uri = this.resourceClientService.generateResourceUrl(resource).concat('?projection=' + projectionName);
  //   const result: ResourceCollection<T> = new ResourceCollection<T>('_embedded');
  //
  //   if (CacheHelper.ifPresent(uri, null, null, isCacheActive)) {
  //     return observableOf(CacheHelper.getArray(uri));
  //   }
  //   return this.resourceClientService.getResource(uri)
  //     .pipe(
  //       map(response => ResourceUtils.instantiateResourceCollection<T>(type, response, result)),
  //       map((array: ResourceCollection<T>) => {
  //         CacheHelper.putArray(uri, array.result, expireMs);
  //         return array.result;
  //       })
  //     );
  // }

  // Perform post request for relation with body and url params
  public postRelation(relation: string, body: any, params?: RequestParam): Observable<any> {
    const relationLink = this._links[relation];
    if (_.isEmpty(relationLink) || _.isEmpty(relationLink.href)) {
      return observableThrowError('no relation found');
    }

    // TODO: подумать о логировании и о strict params и проверить template
    let httpParams;
    let url = relationLink.href;
    if (!_.isEmpty(params)) {
      if (relationLink.templated) {
        url = uriTemplates(url).fillFromObject(params);
      } else {
        httpParams = UrlUtils.convertToHttpParams(params);
      }
    }

    return getResourceHttpService()
      .postResource(url, body, httpParams ? {params: httpParams} : {});
  }

  // // Perform patch request for relation with body and url params
  // public patchRelation(relation: string, body: any, options?: LinkOptions): Observable<any> {
  //   if (!this.existRelationLink(relation)) {
  //     return observableThrowError('no relation found');
  //   }
  //   if (!ObjectUtils.isNullOrUndefined(options) && !ObjectUtils.isNullOrUndefined(options.params)) {
  //     if (this._links[relation].templated
  //       && !ObjectUtils.isNullOrUndefined(options.strictParams) && options.strictParams) {
  //       CacheHelper.evictEntityLink(this.getRelationLinkHref(relation));
  //
  //       const uriTemplate = uriTemplates(this._links[relation].href);
  //       const url = uriTemplate.fillFromObject(options.params);
  //
  //       return this.resourceClientService.patchResource(url, body)
  //         .pipe(
  //           map(data => ResourceUtils.instantiateResource(ObjectUtils.clone(this), data))
  //         );
  //     }
  //
  //     const httpParams = UrlUtils.linkParamsToHttpParams(options.params);
  //     CacheHelper.evictEntityLink(this.getRelationLinkHref(relation));
  //
  //     return this.resourceClientService.patchResource(this.getRelationLinkHref(relation), body,
  //       {
  //         params: httpParams
  //       })
  //       .pipe(
  //         map(data => ResourceUtils.instantiateResource(ObjectUtils.clone(this), data))
  //       );
  //   }
  //
  //   return this.resourceClientService.patchResource(this.getRelationLinkHref(relation), body)
  //     .pipe(
  //       map(data => ResourceUtils.instantiateResource(ObjectUtils.clone(this), data))
  //     );
  // }

  // protected existRelationLink(relation: string): boolean {
  // return !ObjectUtils.isNullOrUndefined(this._links) && !ObjectUtils.isNullOrUndefined(this._links[relation]);
  // }

  protected getRelationLinkHref(relation: string) {
    if (this._links[relation].templated) {
      return UrlUtils.removeUrlTemplateVars(this._links[relation].href);
    }

    return this._links[relation].href;
  }

}
