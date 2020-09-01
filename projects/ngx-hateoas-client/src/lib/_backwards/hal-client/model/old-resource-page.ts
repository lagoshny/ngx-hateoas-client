/* tslint:disable:no-string-literal */
import { Observable, throwError as observableThrowError } from 'rxjs';
import { OldResource } from './old-resource';
import { HttpParams } from '@angular/common/http';
import { OldSort } from './interfaces';
import * as _ from 'lodash';
import { UrlUtils } from '../../../util/url.utils';
import { getPagedResourceCollectionHttpService } from '../../../service/internal/paged-resource-collection-http.service';
import { PagedResourceCollection } from '../../../model/resource/paged-resource-collection';
import { map } from 'rxjs/operators';

export class OldResourcePage<T extends OldResource> {

  public selfUri: string;
  public nextUri: string;
  public prevUri: string;
  public firstUri: string;
  public lastUri: string;

  public totalElements: number;
  public totalPages: number;
  public pageNumber: number;

  public resources: Array<T>;

  private resourceType: T;

  constructor(pagedResourceCollection: PagedResourceCollection<any>) {
    this.resources = pagedResourceCollection.resources;

    this.totalElements = pagedResourceCollection.totalElements;
    this.totalPages = pagedResourceCollection.totalPages;
    this.pageNumber = pagedResourceCollection.pageNumber;

    this.selfUri = _.result(pagedResourceCollection, 'selfLink.href', null);
    this.nextUri = _.result(pagedResourceCollection, 'nextLink.href', null);
    this.prevUri = _.result(pagedResourceCollection, 'prevLink.href', null);
    this.firstUri = _.result(pagedResourceCollection, 'firstLink.href', null);
    this.lastUri = _.result(pagedResourceCollection, 'lastLink.href', null);
  }

  hasFirst(): boolean {
    return !!this.firstUri;
  }

  hasLast(): boolean {
    return !!this.lastUri;
  }

  hasNext(): boolean {
    return !!this.nextUri;
  }

  hasPrev(): boolean {
    return !!this.prevUri;
  }

  first(): Observable<OldResourcePage<T>> {
    return this.doRequest(this.firstUri);
  }

  last(): Observable<OldResourcePage<T>> {
    return this.doRequest(this.lastUri);
  }

  next(): Observable<OldResourcePage<T>> {
    return this.doRequest(this.nextUri);
  }

  prev(): Observable<OldResourcePage<T>> {
    return this.doRequest(this.prevUri);
  }

  page(pageNumber: number): Observable<OldResourcePage<T>> {
    const uri = UrlUtils.removeTemplateParams(this.selfUri);
    let httpParams = new HttpParams({fromString: uri});
    httpParams = httpParams.set('page', pageNumber.toString());

    return this.doRequest(httpParams.toString());
  }

  size(size: number): Observable<OldResourcePage<T>> {
    const uri = UrlUtils.removeTemplateParams(this.selfUri);
    let httpParams = new HttpParams({fromString: uri});
    httpParams = httpParams.set('size', size.toString());

    return this.doRequest(httpParams.toString());
  }

  sortElements(...sort: OldSort[]): Observable<OldResourcePage<T>> {
    const uri = UrlUtils.removeTemplateParams(this.selfUri);
    let httpParams = new HttpParams({fromString: uri});
    sort.forEach((s: OldSort) => {
      httpParams = httpParams.append('sort', `${ s.path },${ s.order }`);
    });

    return this.doRequest(httpParams.toString());
  }

  private doRequest(uri: string): Observable<OldResourcePage<T>> {
    if (uri) {
      return getPagedResourceCollectionHttpService()
        .get(uri)
        .pipe(
          map(value => {
            return new OldResourcePage<T>(value);
          })
        ) as Observable<OldResourcePage<T>>;
    }
    return observableThrowError(`no ${ uri } link defined`);
  }

}
