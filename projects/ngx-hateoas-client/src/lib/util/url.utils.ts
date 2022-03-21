import { HttpParams } from '@angular/common/http';
import { isResource } from '../model/resource-type';
import { Resource } from '../model/resource/resource';
import { GetOption, HttpClientOptions, LinkData, PagedGetOption, Sort } from '../model/declarations';
import { ValidationUtils } from './validation.utils';
import { LibConfig } from '../config/lib-config';
import { isArray, isEmpty, isNil, isObject, toString } from 'lodash-es';
import { UriTemplate } from 'uri-templates-es';

export class UrlUtils {

  /**
   * Convert passed params to the {@link HttpParams}.
   *
   * @param options which need to convert
   * @param httpParams (optional) if passed then will be applied to this one, otherwise created a new one
   */
  public static convertToHttpParams(options: PagedGetOption, httpParams?: HttpParams): HttpParams {
    let resultParams = httpParams ? httpParams : new HttpParams();
    if (isEmpty(options) || isNil(options)) {
      return resultParams;
    }
    UrlUtils.checkDuplicateParams(options);

    if (isObject(options.params) && !isEmpty(options.params)) {
      for (const [key, value] of Object.entries(options.params)) {
        if (options.params.hasOwnProperty(key)) {
          if (isResource(value)) {
            // Append resource as resource link
            resultParams = resultParams.append(key, (value as Resource).getSelfLinkHref());
          } else if (isArray(options.params[key])) {
            // Append arrays params as repeated key with each value from array
            (options.params[key] as Array<any>).forEach((item) => {
              resultParams = resultParams.append(`${ key.toString() }`, item);
            });
          } else {
            // Else append simple param as is
            resultParams = resultParams.append(key, value.toString());
          }
        }
      }
    }

    if (!isEmpty(options.pageParams)) {
      resultParams = resultParams.append('page', toString(options.pageParams.page));
      resultParams = resultParams.append('size', toString(options.pageParams.size));
    }
    if (!isEmpty(options.sort)) {
      resultParams = UrlUtils.generateSortParams(options.sort, resultParams);
    }

    return resultParams;
  }

  /**
   * Convert ngx-hateoas-client option to Angular HttpClient.
   * @param options ngx-hateoas-client options
   */
  public static convertToHttpOptions(options: PagedGetOption): HttpClientOptions {
    if (isEmpty(options) || isNil(options)) {
      return {};
    }

    return {
      params: UrlUtils.convertToHttpParams(options),
      headers: options.headers,
      observe: options.observe,
      reportProgress: options.reportProgress,
      withCredentials: options.withCredentials,
    };
  }

  /**
   * Generate link url.
   * If proxyUrl is not empty then relation url will be use proxy.
   *
   * @param relationLink resource link to which need to generate the url
   * @param options (optional) additional options that should be applied to the request
   * @throws error when required params are not valid
   */
  public static generateLinkUrl(relationLink: LinkData, options?: PagedGetOption): string {
    ValidationUtils.validateInputParams({relationLink, linkUrl: relationLink?.href});
    let url;
    if (options && !isEmpty(options)) {
      url = relationLink.templated ? UrlUtils.fillTemplateParams(relationLink.href, options) : relationLink.href;
    } else {
      url = relationLink.templated ? UrlUtils.removeTemplateParams(relationLink.href) : relationLink.href;
    }
    if (LibConfig.config.http.proxyUrl) {
      return url.replace(LibConfig.config.http.rootUrl, LibConfig.config.http.proxyUrl);
    }
    return url;
  }

  /**
   * Return server api url based on proxy url when it is not empty or root url otherwise.
   */
  public static getApiUrl(): string {
    if (LibConfig.config.http.proxyUrl) {
      return LibConfig.config.http.proxyUrl;
    } else {
      return LibConfig.config.http.rootUrl;
    }
  }

  /**
   * Generate url use base and the resource name.
   *
   * @param baseUrl will be as first part as a result url
   * @param resourceName added to the base url through slash
   * @param query (optional) if passed then adds to end of the url
   * @throws error when required params are not valid
   */
  public static generateResourceUrl(baseUrl: string, resourceName: string, query?: string): string {
    ValidationUtils.validateInputParams({baseUrl, resourceName});

    let url = baseUrl;
    if (!url.endsWith('/')) {
      url = url.concat('/');
    }
    return url.concat(resourceName).concat(query ? `${ query.startsWith('/') ? query : '/' + query }` : '');
  }

  /**
   * Retrieve a resource name from resource url.
   *
   * @param url resource url
   */
  public static getResourceNameFromUrl(url: string): string {
    ValidationUtils.validateInputParams({url});

    const dividedBySlashUrl = url.toLowerCase().replace(`${ UrlUtils.getApiUrl().toLowerCase() }/`, '').split('/');
    return dividedBySlashUrl[0];
  }

  /**
   * Clear url from template params.
   *
   * @param url to be cleaned
   * @throws error when required params are not valid
   */
  public static removeTemplateParams(url: string): string {
    ValidationUtils.validateInputParams({url});

    return UrlUtils.fillTemplateParams(url, {});
  }

  /**
   * Clear all url params.
   *
   * @param url to clear params
   * @throws error when required params are not valid
   */
  public static clearUrlParams(url: string): string {
    ValidationUtils.validateInputParams({url});
    const srcUrl = new URL(url);

    return srcUrl.origin + srcUrl.pathname;
  }

  /**
   * Fill url template params.
   *
   * @param url to be filled
   * @param options contains params to apply to result url, if empty then template params will be cleared
   * @throws error when required params are not valid
   */
  public static fillTemplateParams(url: string, options: PagedGetOption): string {
    ValidationUtils.validateInputParams({url});
    UrlUtils.checkDuplicateParams(options);

    const paramsWithoutSortParam = {
      ...options,
      ...options?.params,
      ...options?.pageParams,
      /* Sets sort to null because sort is object and should be applied as multi params with sort name
         for each sort object property, but uriTemplates can't do that and we need to do it manually */
      sort: null
    };

    const resultUrl = new UriTemplate(url).fill(isNil(paramsWithoutSortParam) ? {} : paramsWithoutSortParam);
    if (options?.sort) {
      const sortParams = UrlUtils.generateSortParams(options.sort);
      if (sortParams.keys().length > 0) {
        return resultUrl.concat(resultUrl.includes('?') ? '&' : '').concat(sortParams.toString());
      }
    }

    return resultUrl;
  }

  public static fillDefaultPageDataIfNoPresent(options: PagedGetOption) {
    const pagedOptions = !isEmpty(options) ? options : {};
    if (isEmpty(pagedOptions.pageParams)) {
      pagedOptions.pageParams = LibConfig.config.pagination.defaultPage;
    } else if (!pagedOptions.pageParams.size) {
      pagedOptions.pageParams.size = LibConfig.config.pagination.defaultPage.size;
    } else if (!pagedOptions.pageParams.page) {
      pagedOptions.pageParams.page = LibConfig.config.pagination.defaultPage.page;
    }

    return pagedOptions;
  }

  private static generateSortParams(sort: Sort, httpParams?: HttpParams): HttpParams {
    let resultParams = httpParams ? httpParams : new HttpParams();
    if (!isEmpty(sort)) {
      for (const [sortPath, sortOrder] of Object.entries(sort)) {
        resultParams = resultParams.append('sort', `${ sortPath },${ sortOrder }`);
      }
    }

    return resultParams;
  }

  private static checkDuplicateParams(options: GetOption): void {
    if (isEmpty(options) || isEmpty(options.params)) {
      return;
    }
    if ('page' in options.params || 'size' in options.params) {
      throw Error('Please, pass page params in page object key, not with params object!');
    }
  }

}
