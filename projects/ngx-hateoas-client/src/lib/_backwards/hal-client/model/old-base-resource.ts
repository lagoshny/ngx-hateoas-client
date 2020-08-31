/* tslint:disable */
import { Link } from '../../../model/declarations';
import { HalOptions, LinkOptions, OldSubTypeBuilder } from './interfaces';
import { Observable } from 'rxjs';
import { UrlUtils } from '../../../util/url.utils';
import { BaseResourceImpl, ResourceImpl } from '../../resources-impl';
import { map } from 'rxjs/operators';
import { BaseResource } from '../../../model/resource/base-resource';
import * as _ from 'lodash';
import { DependencyInjector } from '../../../util/dependency-injector';
import { OldUtils } from '../util/old.utils';
import { Resource } from '../../../model/resource/resource';
import { HateoasResourceService } from '../../../service/external/hateoas-resource.service';

export class OldBaseResource {

  public proxyUrl: string;

  public rootUrl: string;

  public _links: Link;

  constructor(baseResource?: BaseResource) {
    if (baseResource) {
      for (const k in baseResource) {
        if (_.isFunction(baseResource[k])) {
          continue;
        }
        this[k] = baseResource[k];
      }
    }
  }

  public getRelation<T extends OldBaseResource>(type: { new(): T },
                                                relation: string,
                                                builder?: OldSubTypeBuilder,
                                                expireMs: number = 0,
                                                isCacheActive: boolean = true): Observable<OldBaseResource> {
    const currentBaseResource = new BaseResourceImpl(this);
    return currentBaseResource.getRelation(relation).pipe(
      map((value: Resource) => {
        if (_.isArray(value)) {
          const result = [];
          value.forEach(resource => {
            result.push(OldUtils.instantiateResource(builder, resource, type));
            return result;
          });
        } else {
          return OldUtils.instantiateResource(builder, value, type);
        }
      })
    );
  }

  public getProjection<T extends OldBaseResource>(type: { new(): T },
                                                  resource: string,
                                                  id: string,
                                                  projectionName: string,
                                                  expireMs: number = 0,
                                                  isCacheActive: boolean = true): Observable<OldBaseResource> {
    const hateoasResourceService = DependencyInjector.get(HateoasResourceService);
    return hateoasResourceService.getResource(resource, id, {params: {projection: projectionName}})
      .pipe(
        map(value => {
          return OldUtils.instantiateResource(null, value, type);
        })
      );
  }

  // Get collection of related resources
  public getRelationArray<T extends OldBaseResource>(type: { new(): T },
                                                     relation: string,
                                                     options?: HalOptions,
                                                     embedded?: string,
                                                     builder?: OldSubTypeBuilder,
                                                     expireMs: number = 0,
                                                     isCacheActive: boolean = true): Observable<T[]> {

    const currentBaseResource = new BaseResourceImpl(this);
    return currentBaseResource.getRelatedCollection(relation, OldUtils.convertToGetOption(options)).pipe(
      map(value => {
        const result = [];
        if (value.resources) {
          value.resources.forEach(resource => {
            result.push(OldUtils.instantiateResource(builder, resource, type));
          });
        }
        return result;
      })
    );
  }

  public getProjectionArray<T extends OldBaseResource>(type: { new(): T },
                                                       resource: string,
                                                       projectionName: string,
                                                       expireMs: number = 0,
                                                       isCacheActive: boolean = true): Observable<T[]> {
    const hateoasResourceService = DependencyInjector.get(HateoasResourceService);
    return hateoasResourceService.getCollection(resource, {params: {projection: projectionName}})
      .pipe(
        map(value => {
          const result = [];
          if (value.resources) {
            value.resources.forEach(resource => {
              result.push(OldUtils.instantiateResource(null, resource, type));
            });
          }
          return result;
        })
      );
  }

  // Adds the given resource to the bound collection by the relation
  public addRelation<T extends OldBaseResource>(relation: string, resource: T): Observable<any> {
    const currentBaseResource = new ResourceImpl(this);
    const paramResource = new ResourceImpl(resource);
    return currentBaseResource.bindRelation(relation, paramResource)
      .pipe(
        map(value => {
          return value.body;
        })
      );
  }

  // Bind the given resource to this resource by the given relation
  public updateRelation<T extends OldBaseResource>(relation: string, resource: T): Observable<any> {
    const currentBaseResource = new ResourceImpl(this);
    const paramResource = new ResourceImpl(resource);
    return currentBaseResource.updateRelation(relation, paramResource)
      .pipe(
        map(value => {
          return value.body;
        })
      );
  }

  // Bind the given resource to this resource by the given relation
  public substituteRelation<T extends OldBaseResource>(relation: string, resource: T): Observable<any> {
    const currentBaseResource = new ResourceImpl(this);
    const paramResource = new ResourceImpl(resource);
    return currentBaseResource.bindRelation(relation, paramResource)
      .pipe(
        map(value => {
          return value.body;
        })
      );
  }

  // Unbind the resource with the given relation from this resource
  public deleteRelation<T extends OldBaseResource>(relation: string, resource: T): Observable<any> {
    const currentBaseResource = new ResourceImpl(this);
    const paramResource = new ResourceImpl(resource);
    return currentBaseResource.deleteRelation(relation, paramResource)
      .pipe(
        map(value => {
          return value.body;
        })
      );
  }

  // Perform post request for relation with body and url params
  public postRelation(relation: string, body: any, options?: LinkOptions): Observable<any> {
    const currentBaseResource = new ResourceImpl(this);
    return currentBaseResource.postRelation(relation, {body: body}, OldUtils.convertToRequestOption(options))
      .pipe(
        map(value => {
          return OldUtils.instantiateResource(null, value, OldBaseResource);
        })
      );
  }

  // Perform patch request for relation with body and url params
  public patchRelation(relation: string, body: any, options?: LinkOptions): Observable<any> {
    const currentBaseResource = new ResourceImpl(this);
    return currentBaseResource.patchRelation(relation, {body: body}, OldUtils.convertToRequestOption(options))
      .pipe(
        map(value => {
          return OldUtils.instantiateResource(null, value, OldBaseResource);
        })
      );
  }

  protected getRelationLinkHref(relation: string) {
    if (this._links[relation].templated) {
      return UrlUtils.removeTemplateParams(this._links[relation].href);
    }
    return this._links[relation].href;
  }

  protected existRelationLink(relation: string): boolean {
    return !(_.isEmpty(this._links) || _.isEmpty(this._links[relation]));
  }

  protected getResourceUrl(resource?: string): string {
    return UrlUtils.generateResourceUrl(UrlUtils.getApiUrl(), resource);
  }

}
