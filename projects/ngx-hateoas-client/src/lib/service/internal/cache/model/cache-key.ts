import { HttpParams } from '@angular/common/http';

/**
 * Contains all needed information about a resource.
 * It generates a string cache key to hold in a cache map from information about a resource.
 */
export class CacheKey {

  /**
   * String cache key value.
   */
  public value: string;

  private constructor(public readonly url: string, private readonly options: {
    observe?: 'body' | 'response';
    params?: HttpParams
  }) {
    this.value = `url=${ this.url }`;
    if (options) {
      if (options.params && options.params.keys().length > 0) {
        this.value += `${ this.value.includes('?') ? '&' : '?' }${ this.options?.params?.toString() }`;
      }
      if (options.observe) {
        this.value += `&observe=${ this.options?.observe }`;
      }
    }
  }

  /**
   * Create cache key from resource url and request params.
   *
   * @param url resource url
   * @param params request params
   */
  public static of(url: string, params: {
    observe?: 'body' | 'response';
    params?: HttpParams
  }): CacheKey {
    return new CacheKey(url, params);
  }

}
