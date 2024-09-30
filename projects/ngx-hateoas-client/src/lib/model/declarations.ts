import { Resource } from './resource/resource';
import { BaseResource } from './resource/base-resource';
import { EmbeddedResource } from './resource/embedded-resource';
import { HttpHeaders, HttpParams } from '@angular/common/http';

export const RESOURCE_NAME_PROP = '__resourceName__';
export const RESOURCE_OPTIONS_PROP = '__options__';

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
 * Http options that used by Angular HttpClient.
 */
export interface HttpClientOptions {
  headers?: HttpHeaders | {
    [header: string]: string | string[];
  };
  observe?: 'body' | 'response';
  params?: HttpParams;
  reportProgress?: boolean;
  responseType?: 'json';
  withCredentials?: boolean;
}

/**
 * Extend {@link GetOption} with page param.
 */
export interface PagedGetOption extends GetOption {
  pageParams?: PageParam;
}

/**
 * Contains options that can be applied to POST/PUT/PATCH/DELETE request.
 */
export interface RequestOption {
  params?: RequestParam;
  headers?: HttpHeaders | {
    [header: string]: string | string[];
  };
  observe?: 'body' | 'response';
  reportProgress?: boolean;
  withCredentials?: boolean;
}

/**
 * Contains additional options that can be applied to the GET request.
 */
export interface GetOption extends RequestOption {
  /**
   * Sorting options.
   */
  sort?: Sort;
  useCache?: boolean;
}

/**
 * Request params that will be applied to the result url as http request params.
 *
 * Should not contains params as: 'projection' and {@link PageParam} properties.
 * If want pass this params then use suitable properties from {@link GetOption} or {@link PagedGetOption},
 * otherwise exception will be thrown.
 */
export interface RequestParam {
  [paramName: string]: Resource | string | number | boolean | Array<string> | Array<number>;
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
  /**
   * Allows to include null values to request body
   */
  NULL_VALUES = 'NULL_VALUES',
  /**
   * Not replace related resources with their self links, instead pass them as JSON objects.
   */
  REL_RESOURCES_AS_OBJECTS = 'REL_RESOURCES_AS_OBJECTS'
}

/**
 * Include options that allow configure should include or not some specific values
 * (e.q. null values).
 */
export interface ValuesOption {
  include: Include | Include[];
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

type NonResourcePropertyType<T> = {
  [K in keyof T]: T[K] extends BaseResource ? never : K;
}[keyof T];

/**
 * Type that allowed represent resource relations as resource projection excluding {@link Resource},
 * {@link EmbeddedResource} props and methods from current type.
 */
export type ProjectionRelType<T extends BaseResource> =
  Pick<T, Exclude<keyof T, keyof Resource | keyof EmbeddedResource> & NonResourcePropertyType<T>>;

/**
 * Additional cache modes.
 */
export enum CacheMode {
  /**
   * Default mode.
   * When cache enable, then all HTTP GET methods will use cache. Except methods where explicitly passed {useCache : false}.
   */
  ALWAYS = 'ALWAYS',

  /**
   * This is opposite option for ALWAYS mode.
   * When cache enable, that mode will NOT use cache by default on all HTTP GET methods.
   * Except methods where explicitly passed {useCache : true}.
   */
  ON_DEMAND = 'ON_DEMAND'
}

export type FieldType =
  | 'hidden'
  | 'text'
  | 'textarea'
  | 'search'
  | 'tel'
  | 'url'
  | 'email'
  | 'password'
  | 'number'
  | 'date'
  | 'month'
  | 'week'
  | 'time'
  | 'datetime-local'
  | 'range'
  | 'color';

export interface Template {
  /**
   * HTTP method.
   */
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  contentType?: string;
  properties: {
    /** The property name. */
    name: string;

    /** A short hint that describes the expected value of an input field */
    placeholder?: string;

    /**
     * The type of the input element that should be rendered
     * Default is 'text'
     */
    type?: FieldType;

    /**The property value. This is a valid JSON string.
     * Default is the empty string
     */
    value?: string;

    /**
     * Whether the value element contains a URI Template [RFC6570] string for the client to resolve.
     * Default is false
     */
    templated?: boolean;

    /**
     * Indicates whether the parameter is required.
     * Default is false
     */
    required?: boolean;

    /** A regular expression string to be applied to the value of the parameter. */
    regex?: string;

    /**the minimum number of characters allowed in the value property */
    minLength?: number;
    /**the maximum number of characters allowed in the value property */
    maxLength?: number;

    /** Set of possible values for the value property */
    options?: {
      inline?: string[] | Record<string, string>[];
      link?: {
        href: string,
        templated?: boolean;
        type: string
      },
      selectedValues?: string[];
      minItems?: number;
      maxItems?: number;
      promptField?: string;
      valueField?: string;
    };

    // for number type

    /** Minimum numeric value for the value setting of a property element. */
    min?: number;
    /** Maximum numeric value for the value setting of a property element. */
    max?: number;
    /** Numeric increment value for the value setting of a property element. */
    step?: number;
  }[]
  target?: string;
  title?: string;
}

export interface Templates {
  default: Template;
  [key: string]: Template;
}
