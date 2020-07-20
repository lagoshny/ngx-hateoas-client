import { Resource } from './resource';

export interface Link {
  /**
   * Link name.
   */
  [key: string]: {
    /**
     * Link url.
     */
    href: string;
    /**
     * {@code true} if <b>href</b> has template, {@code false} otherwise.
     */
    templated?: boolean;
  };
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

export interface RequestParam {
  [paramName: string]: Resource | string | number | boolean | Sort;
}
