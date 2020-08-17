import { ResourceCollection } from './resource-collection';
import { BaseResource } from './base-resource';
import { Observable, throwError as observableThrowError } from 'rxjs';
import { getPagedResourceCollectionHttpService } from '../../service/internal/paged-resource-collection-http.service';
import { UrlUtils } from '../../util/url.utils';
import { ConsoleLogger } from '../../logger/console-logger';
import { PageData, PageParam } from '../declarations';
import * as _ from 'lodash';

/**
 * Collection of resources with pagination.
 */
export class PagedResourceCollection<T extends BaseResource> extends ResourceCollection<T> {

  private readonly selfUri: string;
  private readonly nextUri: string;
  private readonly prevUri: string;
  private readonly firstUri: string;
  private readonly lastUri: string;

  public readonly totalElements: number;
  public readonly totalPages: number;
  public readonly pageNumber: number;
  public readonly pageSize: number;

  /**
   * Create a new paged resource collection from resource collection with the page data.
   *
   * @param resourceCollection collection that will be paged
   * @param pageData contains data about characteristics of the page.
   */
  constructor(resourceCollection: ResourceCollection<T>, pageData?: PageData) {
    super(resourceCollection);
    this.totalElements = _.result(pageData, 'page.totalElements', 0);
    this.totalPages = _.result(pageData, 'page.totalPages', 1);
    this.pageSize = _.result(pageData, 'page.size', 20);
    this.pageNumber = _.result(pageData, 'page.number', 0);

    this.selfUri = _.result(pageData, '_links.self.href', null);
    this.nextUri = _.result(pageData, '_links.next.href', null);
    this.prevUri = _.result(pageData, '_links.prev.href', null);
    this.firstUri = _.result(pageData, '_links.first.href', null);
    this.lastUri = _.result(pageData, '_links.last.href', null);
  }

  public hasFirst(): boolean {
    return !!this.firstUri;
  }

  public hasLast(): boolean {
    return !!this.lastUri;
  }

  public hasNext(): boolean {
    return !!this.nextUri;
  }

  public hasPrev(): boolean {
    return !!this.prevUri;
  }

  public first(): Observable<PagedResourceCollection<T>> {
    return doRequest(this.firstUri);
  }

  public last(): Observable<PagedResourceCollection<T>> {
    return doRequest(this.lastUri);
  }

  public next(): Observable<PagedResourceCollection<T>> {
    return doRequest(this.nextUri);
  }

  public prev(): Observable<PagedResourceCollection<T>> {
    return doRequest(this.prevUri);
  }

  /**
   * Perform query with custom page data.
   * That allows you change page size, current page or sort options.
   *
   * @param pageParam contains data about new characteristics of the page.
   * @throws error when passed inconsistent data
   */
  public customPage(pageParam: PageParam): Observable<PagedResourceCollection<T>> {
    ConsoleLogger.prettyInfo('Preparing custom page request');
    if (pageParam.page < 0) {
      pageParam.page = this.pageNumber;
      ConsoleLogger.prettyInfo('Page number is not passed will be used current value', {currentPageNumber: this.pageNumber});
    }
    if (pageParam.size < 0) {
      pageParam.size = this.pageSize;
      ConsoleLogger.prettyInfo('Page size is not passed will be used current value', {currentPageSize: this.pageSize});
    }

    const maxPageNumber = (this.totalElements / this.pageSize) - 1;
    if (pageParam.page > maxPageNumber) {
      ConsoleLogger.error(`Error page number. Max page number is ${ maxPageNumber }`);
      return observableThrowError(`Error page number. Max page number is ${ maxPageNumber }`);
    }
    const maxPageSize = this.totalElements / (this.pageSize + 1);
    if (pageParam.page !== 0 && pageParam.size > maxPageSize) {
      ConsoleLogger.error(`Error page size. Max page size is ${ maxPageSize }`);
      return observableThrowError(`Error page size. Max page size is ${ maxPageSize }`);
    }

    ConsoleLogger.prettyInfo('Custom page request prepared with params', {
      rawUrl: this.selfUri,
      sort: JSON.stringify(pageParam.sort, null, 4),
      page: pageParam.page,
      size: pageParam.size
    });
    return doRequest(this.selfUri, pageParam);
  }

}

function doRequest<T extends BaseResource>(uri: string, pageParams?: PageParam): Observable<PagedResourceCollection<T>> {
  if (!uri) {
    ConsoleLogger.error('During page request error occurs: url is empty');
    return observableThrowError(`During page request error occurs: url is empty`);
  }

  let httpParams;
  if (pageParams) {
    httpParams = UrlUtils.convertToHttpParams({page: pageParams});
  }

  return getPagedResourceCollectionHttpService()
    .get(UrlUtils.removeTemplateParams(uri), {params: httpParams}) as Observable<PagedResourceCollection<T>>;
}
