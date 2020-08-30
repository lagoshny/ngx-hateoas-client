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
import { OptionUtils } from '../util/option.utils';
import deprecated from 'deprecated-decorator';
import { Resource } from '../../../model/resource/resource';
import { HateoasResourceOperation } from '../../../service/external/hateoas-resource-operation';
import { HateoasResourceService } from '../../../service/external/hateoas-resource.service';

@deprecated('BaseResource')
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
        if (builder && builder.subtypes && builder.subtypes.size > 0) {
          const subtype = builder.subtypes.get(value['resourceName']);
          return new subtype(value);
        } else {
          return new OldBaseResource(value);
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
          return new OldBaseResource(value);
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
    return currentBaseResource.getRelatedCollection(relation, OptionUtils.convertToGetOption(options)).pipe(
      map(value => {
        const result = [];
        if (value.resources) {
          value.resources.forEach(resource => {
            if (builder && builder.subtypes && builder.subtypes.size > 0) {
              const subtype = builder.subtypes.get(value['resourceName']);
              result.push(new subtype(value));
            } else {
              result.push(new OldBaseResource(resource));
            }
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
              result.push(new OldBaseResource(resource));
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
    return currentBaseResource.addRelation(relation, [paramResource]);
  }

  // Bind the given resource to this resource by the given relation
  public updateRelation<T extends OldBaseResource>(relation: string, resource: T): Observable<any> {
    const currentBaseResource = new ResourceImpl(this);
    const paramResource = new ResourceImpl(resource);
    return currentBaseResource.updateRelation(relation, paramResource);
  }

  // Bind the given resource to this resource by the given relation
  public substituteRelation<T extends OldBaseResource>(relation: string, resource: T): Observable<any> {
    const currentBaseResource = new ResourceImpl(this);
    const paramResource = new ResourceImpl(resource);
    return currentBaseResource.bindRelation(relation, paramResource);
  }

  // Unbind the resource with the given relation from this resource
  public deleteRelation<T extends OldBaseResource>(relation: string, resource: T): Observable<any> {
    const currentBaseResource = new ResourceImpl(this);
    const paramResource = new ResourceImpl(resource);
    return currentBaseResource.deleteRelation(relation, paramResource);
  }

  // Perform post request for relation with body and url params
  public postRelation(relation: string, body: any, options?: LinkOptions): Observable<any> {
    const currentBaseResource = new ResourceImpl(this);
    return currentBaseResource.postRelation(relation, {body: body}, OptionUtils.convertToRequestOption(options));
  }

  // Perform patch request for relation with body and url params
  public patchRelation(relation: string, body: any, options?: LinkOptions): Observable<any> {
    const currentBaseResource = new ResourceImpl(this);
    return currentBaseResource.postRelation(relation, {body: body}, OptionUtils.convertToRequestOption(options));
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
