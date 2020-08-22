import { HttpParams } from '@angular/common/http';

export class CacheKey {

  public value: string;

  constructor(private readonly url: string, private readonly options: {
    observe?: 'body' | 'response';
    params?: HttpParams
  }) {
    this.value = `url=${ this.url }`;
    if (options) {
      if (options.params && options.params.keys().length > 0) {
        this.value += `&params=${ this.options?.params?.toString() }`;
      }
      if (options.observe) {
        this.value += `&observe=${ this.options?.observe }`;
      }
    }
  }

  public static of(url: string, params: {
    observe?: 'body' | 'response';
    params?: HttpParams
  }): CacheKey {
    return new CacheKey(url, params);
  }

}
