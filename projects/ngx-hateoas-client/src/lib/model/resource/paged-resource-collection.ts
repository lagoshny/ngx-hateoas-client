import { ResourceCollection } from './resource-collection';
import { BaseResource } from './base-resource';
import { Observable, throwError as observableThrowError } from 'rxjs';
import { getPagedResourceCollectionHttpService } from '../../service/internal/paged-resource-collection-http.service';
import { UrlUtils } from '../../util/url.utils';
import { LinkData, PageData, PageParam } from '../declarations';
import * as _ from 'lodash';
import { StageLogger } from '../../logger/stage-logger';
import { Stage } from '../../logger/stage.enum';
import { tap } from 'rxjs/operators';
import { ValidationUtils } from '../../util/validation.utils';

/**
 * Collection of resources with pagination.
 */
export class PagedResourceCollection<T extends BaseResource> extends ResourceCollection<T> {

  private readonly selfUri: LinkData;
  private readonly nextUri: LinkData;
  private readonly prevUri: LinkData;
  private readonly firstUri: LinkData;
  private readonly lastUri: LinkData;

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

    this.selfUri = _.result(pageData, '_links.self', null);
    this.nextUri = _.result(pageData, '_links.next', null);
    this.prevUri = _.result(pageData, '_links.prev', null);
    this.firstUri = _.result(pageData, '_links.first', null);
    this.lastUri = _.result(pageData, '_links.last', null);
  }

  public hasFirst(): boolean {
    return !!this.firstUri && !!this.firstUri.href;
  }

  public hasLast(): boolean {
    return !!this.lastUri && !!this.lastUri.href;
  }

  public hasNext(): boolean {
    return !!this.nextUri && !!this.nextUri.href;
  }

  public hasPrev(): boolean {
    return !!this.prevUri && !!this.prevUri.href;
  }

  public first(options?: { useCache: true }): Observable<PagedResourceCollection<T>> {
    StageLogger.resourceBeginLog(this.resources[0], 'GET_FIRST_PAGE');
    if (!this.hasFirst()) {
      const errMsg = 'Page has not first url';
      StageLogger.stageErrorLog(Stage.PREPARE_URL, {error: errMsg});
      return observableThrowError(new Error(errMsg));
    }
    return doRequest<T>(this.firstUri, options?.useCache).pipe(
      tap(() => {
        StageLogger.resourceEndLog(this.resources[0], 'GET_FIRST_PAGE', {result: 'get first page was performed successful'});
      })
    );
  }

  public last(options?: { useCache: true }): Observable<PagedResourceCollection<T>> {
    StageLogger.resourceBeginLog(this.resources[0], 'GET_LAST_PAGE');
    if (!this.hasLast()) {
      const errMsg = 'Page has not last url';
      StageLogger.stageErrorLog(Stage.PREPARE_URL, {error: errMsg});
      return observableThrowError(new Error(errMsg));
    }
    return doRequest<T>(this.lastUri, options?.useCache).pipe(
      tap(() => {
        StageLogger.resourceEndLog(this.resources[0], 'GET_LAST_PAGE', {result: 'get last page was performed successful'});
      })
    );
  }

  public next(options?: { useCache: true }): Observable<PagedResourceCollection<T>> {
    StageLogger.resourceBeginLog(this.resources[0], 'GET_NEXT_PAGE');
    if (!this.hasNext()) {
      const errMsg = 'Page has not next url';
      StageLogger.stageErrorLog(Stage.PREPARE_URL, {error: errMsg});
      return observableThrowError(new Error(errMsg));
    }
    return doRequest<T>(this.nextUri, options?.useCache).pipe(
      tap(() => {
        StageLogger.resourceEndLog(this.resources[0], 'GET_NEXT_PAGE', {result: 'get next page was performed successful'});
      })
    );
  }

  public prev(options?: { useCache: true }): Observable<PagedResourceCollection<T>> {
    StageLogger.resourceBeginLog(this.resources[0], 'GET_PREV_PAGE');
    if (!this.hasPrev()) {
      const errMsg = 'Page has not prev url';
      StageLogger.stageErrorLog(Stage.PREPARE_URL, {error: errMsg});
      return observableThrowError(new Error(errMsg));
    }
    return doRequest<T>(this.prevUri, options?.useCache).pipe(
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
   * @param options (optional) additional options that will be applied to the request
   * @throws error when required params are not valid or when passed inconsistent data
   */
  public customPage(pageParam: PageParam, options?: { useCache: true }): Observable<PagedResourceCollection<T>> {
    StageLogger.resourceBeginLog(this.resources[0], 'CustomPage', {pageParam});
    ValidationUtils.validateInputParams({pageParam});

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

    return doRequest<T>(this.selfUri, options?.useCache, pageParam).pipe(
      tap(() => {
        StageLogger.resourceEndLog(this.resources[0], 'CustomPage', {result: 'custom page was performed successful'});
      })
    );
  }

}

function doRequest<T extends BaseResource>(requestLink: LinkData,
                                           useCache: boolean = true,
                                           pageParams?: PageParam): Observable<PagedResourceCollection<T>> {
  ValidationUtils.validateInputParams({requestLink});

  let httpParams;
  if (!_.isEmpty(pageParams)) {
    httpParams = UrlUtils.convertToHttpParams({pageParams});
  }

  return getPagedResourceCollectionHttpService()
    .get(UrlUtils.generateLinkUrl(requestLink), {params: httpParams, useCache}) as Observable<PagedResourceCollection<T>>;
}
