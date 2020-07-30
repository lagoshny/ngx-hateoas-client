import { Resource } from './resource';

export interface Link {
  /**
   * Link name.
   */
  [key: string]: LinkData;
}

export interface LinkData {
  /**
   * Link url.
   */
  href: string;
  /**
   * {@code true} if <b>href</b> has template, {@code false} otherwise.
   */
  templated?: boolean;
}

/**
 * Extend {@link GetOption} to adds page param.
 */
export interface PagedGetOption extends GetOption {
  page?: PageParam;
}

/**
 * Contains options that can be applied to the request.
 */
export interface GetOption {
  params?: RequestParam;
  projection?: string;
}


/**
 * Request params that will be applied to the result url as http request params.
 */
export interface RequestParam {
  [paramName: string]: Resource | string | number | boolean | Sort;
}

/**
 * Params allow control page settings.
 */
export interface PageParam {
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
 * Object that returns from paged request to Spring application.
 */
export interface PageData {
  _links: {
    first: {
      href: string
    };
    prev?: {
      href: string
    };
    self: {
      href: string
    };
    next?: {
      href: string
    };
    last: {
      href: string
    };
  };
  page: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
}

export enum Include {
  NULL_VALUES = 'NULL_VALUES'
}

/**
 * Additional resource options that allow configure should include or not some specific values
 * (e.q. null values).
 */
export interface ResourceValuesOption {
  include: Include;
}

/**
 * Request body object.
 */
export interface RequestBody {
  /**
   * Any object that will be passed as request body.
   */
  body: any;
  /**
   * When body is {@link Resource} type then this param influence on include
   * some value types of resource or not.
   */
  resourceValues?: ResourceValuesOption;
}

/**
 * Supported http methods for custom query
 */
export enum HttpMethod {
  GET = 'GET', POST = 'POST', PUT = 'PUT', PATCH = 'PATCH'
}
