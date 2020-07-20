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
