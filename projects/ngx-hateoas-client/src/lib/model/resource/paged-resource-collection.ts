import { ResourceCollection } from './resource-collection';
import { BaseResource } from './base-resource';
import { Observable, throwError as observableThrowError } from 'rxjs';
import { getPagedResourceCollectionHttpService } from '../../service/internal/paged-resource-collection-http.service';
import { UrlUtils } from '../../util/url.utils';
import { PageData, PageParam } from '../declarations';
import * as _ from 'lodash';
import { StageLogger } from '../../logger/stage-logger';
import { Stage } from '../../logger/stage.enum';
import { tap } from 'rxjs/operators';

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
    StageLogger.resourceBeginLog(this.resources[0], 'GET_FIRST_PAGE');
    return doRequest<T>(this.firstUri).pipe(
      tap(() => {
        StageLogger.resourceEndLog(this.resources[0], 'GET_FIRST_PAGE', {result: 'get first page was performed successful'});
      })
    );
  }

  public last(): Observable<PagedResourceCollection<T>> {
    StageLogger.resourceBeginLog(this.resources[0], 'GET_LAST_PAGE');
    return doRequest<T>(this.lastUri).pipe(
      tap(() => {
        StageLogger.resourceEndLog(this.resources[0], 'GET_LAST_PAGE', {result: 'get last page was performed successful'});
      })
    );
  }

  public next(): Observable<PagedResourceCollection<T>> {
    StageLogger.resourceBeginLog(this.resources[0], 'GET_NEXT_PAGE');
    return doRequest<T>(this.nextUri).pipe(
      tap(() => {
        StageLogger.resourceEndLog(this.resources[0], 'GET_NEXT_PAGE', {result: 'get next page was performed successful'});
      })
    );
  }

  public prev(): Observable<PagedResourceCollection<T>> {
    StageLogger.resourceBeginLog(this.resources[0], 'GET_PREV_PAGE');
    return doRequest<T>(this.prevUri).pipe(
      tap(() => {
        StageLogger.resourceEndLog(this.resources[0], 'GET_PREV_PAGE', {result: 'get prev page was performed successful'});
      })
    );
  }

  /**
   * Perform query with custom page data.
   * That allows you change page size, current page or sort options.
   *
   * @param pageParam contains data about new characteristics of the page.
   * @throws error when passed inconsistent data
   */
  public customPage(pageParam: PageParam): Observable<PagedResourceCollection<T>> {
    StageLogger.resourceBeginLog(this.resources[0], 'CustomPage', {pageParam});

    if (pageParam.page < 0) {
      pageParam.page = this.pageNumber;
      StageLogger.stageLog(Stage.PREPARE_PARAMS, {
        message: 'Page number is not passed will be used current value',
        currentPageNumber: this.pageNumber
      });
    }
    if (pageParam.size < 0) {
      pageParam.size = this.pageSize;
      StageLogger.stageLog(Stage.PREPARE_PARAMS, {
        message: 'Page size is not passed will be used current value',
        currentPageSize: this.pageSize
      });
    }

    const maxPageNumber = (this.totalElements / this.pageSize) - 1;
    if (pageParam.page > maxPageNumber) {
      const errMsg = `Error page number. Max page number is ${ maxPageNumber }`;
      StageLogger.stageErrorLog(Stage.PREPARE_PARAMS, {error: errMsg});
      return observableThrowError(errMsg);
    }
    const maxPageSize = this.totalElements / (this.pageSize + 1);
    if (pageParam.page !== 0 && pageParam.size > maxPageSize) {
      const errMsg = `Error page size. Max page size is ${ maxPageSize }`;
      StageLogger.stageErrorLog(Stage.PREPARE_PARAMS, {error: errMsg});
      return observableThrowError(errMsg);
    }

    return doRequest<T>(this.selfUri, pageParam).pipe(
      tap(() => {
        StageLogger.resourceEndLog(this.resources[0], 'CustomPage', {result: 'custom page was performed successful'});
      })
    );
  }

}

function doRequest<T extends BaseResource>(url: string, pageParams?: PageParam): Observable<PagedResourceCollection<T>> {
  StageLogger.stageLog(Stage.HTTP_REQUEST, {method: 'GET', url, pageParams});
  if (!url) {
    const errMsg = 'During page request error occurs: url is empty';
    StageLogger.stageErrorLog(Stage.HTTP_REQUEST, {error: errMsg});
    return observableThrowError(errMsg);
  }

  let httpParams;
  if (pageParams) {
    httpParams = UrlUtils.convertToHttpParams({pageParam: pageParams});
  }

  return getPagedResourceCollectionHttpService()
    .get(UrlUtils.removeTemplateParams(url), {params: httpParams}).pipe(
      tap((data) => {
        StageLogger.stageLog(Stage.HTTP_RESPONSE, {method: 'GET', url, httpParams, result: data});
      })
    ) as Observable<PagedResourceCollection<T>>;
}
