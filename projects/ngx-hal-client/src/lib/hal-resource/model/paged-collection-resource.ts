import { CollectionResource } from './collection-resource';
import { BaseResource } from './base-resource';
import { Observable } from 'rxjs';
import { getPagedCollectionResourceHttpService } from '../service/paged-collection-resource-http.service';
import { throwError as observableThrowError } from 'rxjs/internal/observable/throwError';
import { HalParam } from '../../service/hal-resource-operation';
import { UrlUtils } from '../../util/url.utils';
import { PageData } from './interface/page-data';
import * as _ from 'lodash';
import { ConsoleLogger } from '../../logger/console-logger';

/**
 * Params allow control page settings.
 */
export interface HalPageParam {
  /**
   * Number of page.
   */
  page?: number;

  /**
   * Page size.
   */
  size?: number;

  /**
   * Sorting options for page data.
   */
  sort?: Sort;
}

export type SortOrder = 'DESC' | 'ASC';

export interface Sort {
  /**
   * Name of the property to sort.
   */
  [propertyToSort: string]: SortOrder;
}

/**
 * A resource type that adds pagination functionality.
 */
export class PagedCollectionResource<T extends BaseResource> extends CollectionResource<T> {

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
   * Create a new paged collection resource from collection resource with page data.
   *
   * @param resourceCollection collection that will be paged
   * @param pageData holds data about count pages, page size etc.
   */
  constructor(resourceCollection: CollectionResource<T>, pageData?: PageData) {
    super(resourceCollection);
    if (pageData) {
      this.totalElements = pageData.page ? pageData.page.totalElements : 0;
      this.totalPages = pageData.page ? pageData.page.totalPages : 1;
      this.pageNumber = pageData.page ? pageData.page.number : 0;
      this.pageSize = pageData.page ? pageData.page.size : 20;

      this.selfUri = pageData._links && pageData._links.self ? pageData._links.self.href : undefined;
      this.nextUri = pageData._links && pageData._links.next ? pageData._links.next.href : undefined;
      this.prevUri = pageData._links && pageData._links.prev ? pageData._links.prev.href : undefined;
      this.firstUri = pageData._links && pageData._links.first ? pageData._links.first.href : undefined;
      this.lastUri = pageData._links && pageData._links.last ? pageData._links.last.href : undefined;
    }
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

  public first(): Observable<PagedCollectionResource<T>> {
    return doRequest(this.firstUri);
  }

  public last(): Observable<PagedCollectionResource<T>> {
    return doRequest(this.lastUri);
  }

  public next(): Observable<PagedCollectionResource<T>> {
    return doRequest(this.nextUri);
  }

  public prev(): Observable<PagedCollectionResource<T>> {
    return doRequest(this.prevUri);
  }

  /**
   * Perform query with custom page data.
   * That allows you change page size, current page or sort options.
   *
   * @param pageParam holds data about new page param
   * @throws error when passed inconsistent data
   */
  public customPage(pageParam: HalPageParam): Observable<PagedCollectionResource<T>> {
    ConsoleLogger.prettyInfo('Preparing custom page request');
    if (!_.isNumber(pageParam.page) || pageParam.page < 0) {
      pageParam.page = this.pageNumber;
      ConsoleLogger.prettyInfo('Page number is not passed will be used current value', {currentPageNumber: this.pageNumber});
    }
    if (!_.isNumber(pageParam.size) || pageParam.size < 0) {
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

function doRequest<T extends BaseResource>(uri: string, pageParams?: HalPageParam): Observable<PagedCollectionResource<T>> {
  if (!uri) {
    ConsoleLogger.error('During page request error occurs: url is empty');
    return observableThrowError(`During page request error occurs: url is empty`);
  }

  let httpParams;
  if (pageParams) {
    httpParams = UrlUtils.convertToHttpParams(pageParams as HalParam);
  }

  return getPagedCollectionResourceHttpService()
    .getResourcePage(UrlUtils.removeUrlTemplateVars(uri), {params: httpParams}) as Observable<PagedCollectionResource<T>>;
}
