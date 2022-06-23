import { BaseResource } from './base-resource';
import { getResourceHttpService } from '../../service/internal/resource-http.service';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResourceUtils } from '../../util/resource.utils';
import { UrlUtils } from '../../util/url.utils';
import { LinkData, RESOURCE_OPTIONS_PROP } from '../declarations';
import { tap } from 'rxjs/operators';
import { Stage } from '../../logger/stage.enum';
import { StageLogger } from '../../logger/stage-logger';
import { ValidationUtils } from '../../util/validation.utils';
import { isArray, isNil, last, split } from 'lodash-es';

/**
 * Resource class.
 * Should be extended by client model classes that represent entity objects.
 *
 * If you have an embedded entity then consider to use the {@link EmbeddedResource} class.
 */
// tslint:disable:variable-name
// tslint:disable:no-string-literal
export class Resource extends BaseResource {

  /**
   * Resource should has self link.
   */
  protected _links: {
    self: LinkData;
    [key: string]: LinkData;
  };

  /**
   * Adding passed entities to the resource collection behind the relation name.
   * Used POST method with 'Content-Type': 'text/uri-list'.
   *
   * This method DOES NOT REPLACE existing resources in the collection instead it adds new ones.
   * To replace collection resource with passed entities use {@link bindRelation} method.
   *
   * @param relationName used to get the specific resource relation link to the resource collection
   * @param entities one or more entities that should be added to the resource collection
   * @throws error when required params are not valid or link not found by relation name
   */
  public addCollectionRelation<T extends Resource>(relationName: string, entities: Array<T>): Observable<HttpResponse<any>> {
    StageLogger.resourceBeginLog(this, 'ADD_COLLECTION_RELATION', {relationName, resourceLinks: this._links, entities});
    ValidationUtils.validateInputParams({relationName, entities});

    const relationLink = this.getRelationLink(relationName);

    const body = entities
      .map(entity => {
        return ResourceUtils.initResource(entity).getSelfLinkHref();
      })
      .join('\n');

    return getResourceHttpService().post(UrlUtils.generateLinkUrl(this.constructor[RESOURCE_OPTIONS_PROP], relationLink), body, {
      observe: 'response',
      headers: new HttpHeaders({'Content-Type': 'text/uri-list'})
    }).pipe(
      tap(() => {
        StageLogger.resourceEndLog(this, 'ADD_COLLECTION_RELATION',
          {result: `collection relation ${ relationName } was updated successfully`});
      })
    );
  }

  /**
   * Bounding the passed entity or collection of entities to this resource by the relation name.
   * Used PUT method with 'Content-Type': 'text/uri-list'.
   *
   * This method also REPLACED existing resources in the collection by passed entities.
   * To add entities to collection resource use {@link addCollectionRelation} method.
   *
   * @param relationName with which will be associated passed entity to this resource
   * @param entities one or more entities that should be bind to this resource
   * @throws error when required params are not valid or link not found by relation name
   */
  public bindRelation<T extends Resource>(relationName: string, entities: T | Array<T>): Observable<HttpResponse<any>> {
    StageLogger.resourceBeginLog(this, 'BIND_RELATION', {relationName, resourceLinks: this._links, entities});
    ValidationUtils.validateInputParams({relationName, entities});

    const relationLink = this.getRelationLink(relationName);
    let body;
    if (isArray(entities)) {
      body = entities
        .map(entity => {
          return ResourceUtils.initResource(entity).getSelfLinkHref();
        })
        .join('\n');
    } else {
      body = ResourceUtils.initResource(entities).getSelfLinkHref();
    }

    return getResourceHttpService().put(UrlUtils.generateLinkUrl(this.constructor[RESOURCE_OPTIONS_PROP], relationLink), body, {
      observe: 'response',
      headers: new HttpHeaders({'Content-Type': 'text/uri-list'})
    }).pipe(
      tap(() => {
        StageLogger.resourceEndLog(this, 'BIND_RELATION', {result: `relation ${ relationName } was bound successfully`});
      })
    );
  }

  /**
   * Unbinding single resource relation behind resource name.
   * Used DELETE method to relation resource link URL.
   *
   * This method DOES NOT WORK WITH COLLECTION RESOURCE relations.
   * To clear collection resource relation use {@link unbindCollectionRelation} method.
   * To delete one resource from resource collection use {@link deleteRelation} method.
   *
   * @param relationName resource relation name to unbind
   */
  public unbindRelation<T extends Resource>(relationName: string): Observable<HttpResponse<any>> {
    StageLogger.resourceBeginLog(this, 'UNBIND_RELATION', {relationName, resourceLinks: this._links});
    ValidationUtils.validateInputParams({relationName});

    const relationLink = this.getRelationLink(relationName);

    return getResourceHttpService().delete(UrlUtils.generateLinkUrl(this.constructor[RESOURCE_OPTIONS_PROP], relationLink), {
      observe: 'response',
    }).pipe(
      tap(() => {
        StageLogger.resourceEndLog(this, 'UNBIND_RELATION', {result: `relation ${ relationName } was unbound successfully`});
      })
    );
  }

  /**
   * Unbind all resources from collection by the relation name.
   * Used PUT method with 'Content-Type': 'text/uri-list' and EMPTY body to clear relations.
   *
   * To delete one resource from collection use {@link deleteRelation} method.
   * To delete single resource relations use {@link unbindRelation} or {@link deleteRelation} methods.
   *
   * @param relationName used to get relation link to unbind
   * @throws error when required params are not valid or link not found by relation name
   */
  public unbindCollectionRelation<T extends Resource>(relationName: string): Observable<HttpResponse<any>> {
    StageLogger.resourceBeginLog(this, 'UNBIND_COLLECTION_RELATION', {relationName, resourceLinks: this._links});
    ValidationUtils.validateInputParams({relationName});

    const relationLink = this.getRelationLink(relationName);

    return getResourceHttpService().put(UrlUtils.generateLinkUrl(this.constructor[RESOURCE_OPTIONS_PROP], relationLink), '', {
      observe: 'response',
      headers: new HttpHeaders({'Content-Type': 'text/uri-list'})
    }).pipe(
      tap(() => {
        StageLogger.resourceEndLog(this, 'UNBIND_COLLECTION_RELATION', {result: `relation ${ relationName } was unbound successfully`});
      })
    );
  }

  /**
   * Deleting resource relation.
   * For collection, means that only passed entity will be unbound from the collection.
   * For single resource, deleting relation the same as @{link unbindRelation} method.
   *
   * To delete all resource relations from collection use {@link unbindCollectionRelation} method.
   *
   * @param relationName used to get relation link to unbind
   * @param entity that should be unbind from this relation
   * @throws error when required params are not valid or link not found by relation name
   */
  public deleteRelation<T extends Resource>(relationName: string, entity: T): Observable<HttpResponse<any>> {
    StageLogger.resourceBeginLog(this, 'DELETE_RELATION', {relationName, resourceLinks: this._links, entity});
    ValidationUtils.validateInputParams({relationName, entity});

    const relationLink = this.getRelationLink(relationName);
    const resource = ResourceUtils.initResource(entity) as Resource;
    const resourceId = last(split(UrlUtils.generateLinkUrl(this.constructor[RESOURCE_OPTIONS_PROP], resource._links.self), '/'));

    if (isNil(resourceId) || resourceId === '') {
      StageLogger.stageErrorLog(Stage.PREPARE_URL, {
        step: 'ResolveResourceId',
        error: 'Passed resource self link should has id',
        selfLink: UrlUtils.generateLinkUrl(this.constructor[RESOURCE_OPTIONS_PROP], resource._links.self)
      });
      throw Error('Passed resource self link should has id');
    }

    StageLogger.stageLog(Stage.PREPARE_URL, {
      step: 'ResolveResourceId',
      result: resourceId
    });

    return getResourceHttpService().delete(UrlUtils.generateLinkUrl(this.constructor[RESOURCE_OPTIONS_PROP], relationLink) + '/' + resourceId, {
      observe: 'response'
    }).pipe(
      tap(() => {
        StageLogger.resourceEndLog(this, 'DELETE_RELATION', {result: `relation ${ relationName } was deleted successfully`});
      })
    );
  }

  public getSelfLinkHref(): string {
    return this._links.self.href;
  }

}
