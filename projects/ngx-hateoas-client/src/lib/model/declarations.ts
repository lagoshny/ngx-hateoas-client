import { Resource } from './resource/resource';

/**
 * Resource link object.
 */
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
 * Interface that allows to identify that object is resource when it is has a links object.
 */
export interface ResourceIdentifiable {

  /**
   * List of links related with the resource.
   */
  _links: Link;
}

/**
 * Extend {@link GetOption} with page param.
 */
export interface PagedGetOption extends GetOption {
  pageParams?: PageParam;
}

/**
 * Contains options that can be applied to the GET request.
 */
export interface GetOption {
  params?: {
    [paramName: string]: Resource | string | number | boolean;
    projection?: string;
  };
  /**
   * Sorting options.
   */
  sort?: Sort;
  useCache?: boolean;
}

/**
 * Contains options that can be applied to POST/PUT/PATCH/DELETE request.
 */
export interface RequestOption {
  params?: RequestParam;
  observe?: 'body' | 'response';
}


/**
 * Request params that will be applied to the result url as http request params.
 *
 * Should not contains params as: 'projection' and {@link PageParam} properties.
 * If want pass this params then use suitable properties from {@link GetOption} or {@link PagedGetOption},
 * otherwise exception will be thrown.
 */
export interface RequestParam {
  [paramName: string]: Resource | string | number | boolean;
}

/**
 * Page content params.
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
}

/**
 * Page params with sort option.
 */
export interface SortedPageParam {
  /**
   * Page content params.
   */
  pageParams?: PageParam;
  /**
   * Sorting options.
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
 * Page resource response from Spring application.
 */
export interface PageData {
  page: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
  _links?: {
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
}

export enum Include {
  NULL_VALUES = 'NULL_VALUES'
}

/**
 * Include options that allow configure should include or not some specific values
 * (e.q. null values).
 */
export interface ValuesOption {
  include: Include;
}

/**
 * Request body object.
 */
export interface RequestBody<T> {
  /**
   * Any object that will be passed as request body.
   */
  body: T;
  /**
   * Use this param to influence on body values that you want include or not.
   */
  valuesOption?: ValuesOption;
}

/**
 * Supported http methods for custom query.
 */
export enum HttpMethod {
  GET = 'GET', POST = 'POST', PUT = 'PUT', PATCH = 'PATCH'
}
