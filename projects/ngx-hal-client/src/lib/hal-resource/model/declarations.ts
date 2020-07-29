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
 * Contains options that can be applied to the request.
 */
export interface HalOption {
  params?: RequestParam;
  page?: PageParam;
  // TODO: projection?
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
 * Additional resource options that allow configure should include or not some specific values (e.q. null values).
 */
export interface ResourceOption {
  include: Include;
}
