import { ResourceCollection } from './resource-collection';
import { BaseResource } from './base-resource';
import { Observable, throwError as observableThrowError } from 'rxjs';
import { getPagedResourceCollectionHttpService } from '../../service/internal/paged-resource-collection-http.service';
import { LinkData, PageData, Sort, SortedPageParam } from '../declarations';
import { StageLogger } from '../../logger/stage-logger';
import { Stage } from '../../logger/stage.enum';
import { tap } from 'rxjs/operators';
import { ValidationUtils } from '../../util/validation.utils';
import { isEmpty, isNumber, result } from 'lodash-es';

/**
 * Collection of resources with pagination.
 */
export class PagedResourceCollection<T extends BaseResource> extends ResourceCollection<T> {

  private readonly selfLink: LinkData;
  private readonly nextLink: LinkData;
  private readonly prevLink: LinkData;
  private readonly firstLink: LinkData;
  private readonly lastLink: LinkData;

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
    this.totalElements = result(pageData, 'page.totalElements', 0);
    this.totalPages = result(pageData, 'page.totalPages', 1);
    this.pageSize = result(pageData, 'page.size', 20);
    this.pageNumber = result(pageData, 'page.number', 0);

    this.selfLink = result(pageData, '_links.self', null);
    this.nextLink = result(pageData, '_links.next', null);
    this.prevLink = result(pageData, '_links.prev', null);
    this.firstLink = result(pageData, '_links.first', null);
    this.lastLink = result(pageData, '_links.last', null);
  }

  public hasFirst(): boolean {
    return !!this.firstLink && !!this.firstLink.href;
  }

  public hasLast(): boolean {
    return !!this.lastLink && !!this.lastLink.href;
  }

  public hasNext(): boolean {
    return !!this.nextLink && !!this.nextLink.href;
  }

  public hasPrev(): boolean {
    return !!this.prevLink && !!this.prevLink.href;
  }

  public first(options?: { useCache: true }): Observable<PagedResourceCollection<T>> {
    StageLogger.resourceBeginLog(this.resources[0], 'GET_FIRST_PAGE');
    if (!this.hasFirst()) {
      const errMsg = 'Page has not first url';
      StageLogger.stageErrorLog(Stage.PREPARE_URL, {error: errMsg});
      return observableThrowError(new Error(errMsg));
    }
    return doRequest<T>(this.firstLink.href, options?.useCache).pipe(
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
    return doRequest<T>(this.lastLink.href, options?.useCache).pipe(
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
    return doRequest<T>(this.nextLink.href, options?.useCache).pipe(
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
    return doRequest<T>(this.prevLink.href, options?.useCache).pipe(
      tap(() => {
        StageLogger.resourceEndLog(this.resources[0], 'GET_PREV_PAGE', {result: 'get prev page was performed successful'});
      })
    );
  }

  public page(pageNumber: number, options?: { useCache: true }): Observable<PagedResourceCollection<T>> {
    return this.customPage({pageParams: {page: pageNumber}}, options);
  }

  public size(size: number, options?: { useCache: true }): Observable<PagedResourceCollection<T>> {
    return this.customPage({pageParams: {page: 0, size}}, options);
  }

  public sortElements(sortParam: Sort, options?: { useCache: true }): Observable<PagedResourceCollection<T>> {
    return this.customPage({sort: sortParam}, options);
  }

  /**
   * Perform query with custom page data.
   * That allows you change page size, current page or sort options.
   *
   * @param params contains data about new characteristics of the page.
   * @param options (optional) additional options that will be applied to the request
   * @throws error when required params are not valid or when passed inconsistent data
   */
  public customPage(params: SortedPageParam, options?: { useCache: true }): Observable<PagedResourceCollection<T>> {
    StageLogger.resourceBeginLog(this.resources[0], 'CustomPage', {pageParam: params.pageParams});

    if (!params.pageParams || isEmpty(params.pageParams)) {
      params.pageParams = {};
      params.pageParams.page = this.pageNumber;
      params.pageParams.size = this.pageSize;
    }
    if (!isNumber(params.pageParams.page) || params.pageParams.page < 0) {
      params.pageParams.page = this.pageNumber;
      StageLogger.stageLog(Stage.PREPARE_PARAMS, {
        message: 'Page number is not passed will be used current value',
        currentPageNumber: this.pageNumber
      });
    }
    if (!isNumber(params.pageParams.size) || params.pageParams.size < 0) {
      params.pageParams.size = this.pageSize;
      StageLogger.stageLog(Stage.PREPARE_PARAMS, {
        message: 'Page size is not passed will be used current value',
        currentPageSize: this.pageSize
      });
    }

    const maxPageNumber = (this.totalElements / params.pageParams.size);
    if (params.pageParams.page > maxPageNumber) {
      const errMsg = `Error page number. Max page number is ${ parseInt(maxPageNumber + '', 10) }`;
      StageLogger.stageErrorLog(Stage.PREPARE_PARAMS, {error: errMsg});
      return observableThrowError(errMsg);
    }

    const requestUrl = new URL(this.selfLink.href);
    requestUrl.searchParams.delete('page');
    requestUrl.searchParams.delete('size');
    if (!isEmpty(params.sort)) {
      requestUrl.searchParams.delete('sort');
    }

    return doRequest<T>(requestUrl.href, options?.useCache, params).pipe(
      tap(() => {
        StageLogger.resourceEndLog(this.resources[0], 'CustomPage', {result: 'custom page was performed successful'});
      })
    );
  }

}

function doRequest<T extends BaseResource>(url: string,
                                           useCache: boolean = true,
                                           params?: SortedPageParam): Observable<PagedResourceCollection<T>> {
  ValidationUtils.validateInputParams({url});

  return getPagedResourceCollectionHttpService()
    .get(url, {...params, useCache}) as Observable<PagedResourceCollection<T>>;
}
