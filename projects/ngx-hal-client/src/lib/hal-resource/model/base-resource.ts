import { Observable, throwError as observableThrowError } from 'rxjs';
import * as _ from 'lodash';
import { getHttpResourceService } from '../service/resource-http.service';
import { UrlUtils } from '../../util/url.utils';
import { HalParam } from '../../service/hal-resource.service';
import { ObjectUtils } from '../../util/object.utils';
import uriTemplates from 'uri-templates';

export interface Link {
  href: string;
  templated?: boolean;
}

export interface Links {
  [key: string]: Link;
}


// TODO: надо что-то делать с сервисом, делать через статику.... иначе лишние поля
export abstract class BaseResource {

  public _links: Links;

  /**
   * Get resource relation.
   */
  public getRelation<T extends BaseResource>(resourceType: new() => T,
                                             relation: string,
                                             // builder?: SubTypeBuilder,
                                             // expireMs: number = CacheHelper.defaultExpire,
                                             // isCacheActive: boolean = true
  ): Observable<T> {
    const relationLink = this._links[relation];
    if (_.isEmpty(relationLink.href)) {
      return observableThrowError('no relation found');
    }
    const uri = relationLink.templated ? UrlUtils.removeUrlTemplateVars(relationLink.href) : relationLink.href;
    return getHttpResourceService().getResource(new resourceType(), uri);
  }

  public getProjection<T extends BaseResource>(type: new() => T,
                                               resource: string,
                                               id: string,
                                               projectionName: string,
                                               // expireMs: number = CacheHelper.defaultExpire,
                                               // isCacheActive: boolean = true
  ): Observable<BaseResource> {
    if (_.isEmpty(projectionName)) {
      return observableThrowError('no projection found');
    }

    return getHttpResourceService().getProjection(new type(), resource, id, projectionName);
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
  //   const result: ResourceArray<T> = new ResourceArray<T>(ObjectUtils.isNullOrUndefined(embedded) ? '_embedded' : embedded);
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
  //       .pipe(map((array: ResourceArray<T>) => {
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
  //   const result: ResourceArray<T> = new ResourceArray<T>('_embedded');
  //
  //   if (CacheHelper.ifPresent(uri, null, null, isCacheActive)) {
  //     return observableOf(CacheHelper.getArray(uri));
  //   }
  //   return this.resourceClientService.getResource(uri)
  //     .pipe(
  //       map(response => ResourceUtils.instantiateResourceCollection<T>(type, response, result)),
  //       map((array: ResourceArray<T>) => {
  //         CacheHelper.putArray(uri, array.result, expireMs);
  //         return array.result;
  //       })
  //     );
  // }

  // Perform post request for relation with body and url params
  public postRelation(relation: string, body: any, params?: HalParam): Observable<any> {
    const relationLink = this._links[relation];
    if (_.isEmpty(relationLink.href)) {
      return observableThrowError('no relation found');
    }

    // TODO: подумать о логировании и о strict params и проверить template
    let httpParams;
    let url = relationLink.href;
    if (!_.isEmpty(params)) {
      if (relationLink.templated) {
        // TODO: проверить как рабоатет темплейтные парамтеры
        url = uriTemplates(url).fillFromObject(params);
      } else {
        httpParams = UrlUtils.convertToHttpParams(params);
      }
    }

    return getHttpResourceService().postResource(ObjectUtils.clone(this), url, body,
      httpParams ? {params: httpParams} : {});
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
