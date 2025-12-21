import { HttpParams } from '@angular/common/http';
import { isResource } from '../model/resource-type';
import { Resource } from '../model/resource/resource';
import { GetOption, HttpClientOptions, LinkData, PagedGetOption, Sort } from '../model/declarations';
import { ValidationUtils } from './validation.utils';
import { LibConfig } from '../config/lib-config';
import { isArray, isEmpty, isNil, isObject, toString } from 'lodash-es';
import { UriTemplate } from 'uri-templates-es';
import { DEFAULT_ROUTE_NAME, MultipleResourceRoutes, ResourceRoute } from '../config/hateoas-configuration.interface';
import { ConsoleLogger } from '../logger/console-logger';

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
              resultParams = resultParams.append(`${key.toString()}`, item);
            });
          } else if (key && value) {
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
  public static convertToHttpOptions(options?: PagedGetOption): HttpClientOptions {
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
    ValidationUtils.validateInputParams({ relationLink, linkUrl: relationLink?.href });
    let url;
    if (options && !isEmpty(options)) {
      url = relationLink.templated ? UrlUtils.fillTemplateParams(relationLink.href, options) : relationLink.href;
    } else {
      url = relationLink.templated ? UrlUtils.removeTemplateParams(relationLink.href) : relationLink.href;
    }

    const route = UrlUtils.guessResourceRoute(url);
    if (route.proxyUrl) {
      return url.replace(route.rootUrl, route.proxyUrl);
    }
    return url;
  }

  /**
   * Return server api url based on proxy url when it is not empty or root url otherwise.
   *
   * @param routeName resource route name that configured in {@link MultipleResourceRoutes}.
   */
  public static getApiUrl(routeName?: string): string {
    const route = UrlUtils.getRouteByName(routeName ?? DEFAULT_ROUTE_NAME);
    if (route.proxyUrl) {
      return route.proxyUrl;
    } else {
      return route.rootUrl;
    }
  }

  /**
   * Try to determine resource route by passed resource url.
   * @param url resource url
   */
  public static guessResourceRoute(url: string): ResourceRoute {
    let resourceRoute: ResourceRoute | undefined;
    for (const [routeName] of Object.entries(UrlUtils.getRoutes())) {
      const route = UrlUtils.getRouteByName(routeName);
      const lowerCaseUrl = url.toLowerCase();
      if (lowerCaseUrl.includes(route.rootUrl.toLowerCase())
        || (!isEmpty(route.proxyUrl) && route.proxyUrl && lowerCaseUrl.includes(route.proxyUrl.toLowerCase()))) {
        resourceRoute = route;
        break;
      }
    }

    if (isEmpty(resourceRoute)) {
      throw new Error(`Failed to determine resource route by url: ${url}`);
    }

    return resourceRoute;
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
    ValidationUtils.validateInputParams({ baseUrl, resourceName });

    let url = baseUrl;
    if (!url.endsWith('/')) {
      url = url.concat('/');
    }
    return url.concat(resourceName).concat(query ? `${query.startsWith('/') ? query : '/' + query}` : '');
  }

  /**
   * Retrieve a resource name from resource url.
   *
   * @param url resource url
   */
  public static getResourceNameFromUrl(url: string): string {
    ValidationUtils.validateInputParams({ url });
    const lowerCaseUrl = url.toLowerCase();
    const resourceRoute = UrlUtils.guessResourceRoute(url);

    let baseUrl;
    if (lowerCaseUrl.includes(resourceRoute.rootUrl)) {
      baseUrl = resourceRoute.rootUrl;
    } else if (!isEmpty(resourceRoute.proxyUrl) && resourceRoute.proxyUrl
      && lowerCaseUrl.includes(resourceRoute.proxyUrl)) {
      baseUrl = resourceRoute.proxyUrl;
    } else {
      throw new Error(`Failed to determine resource name from url: ${url}, found resource route ${JSON.stringify(resourceRoute)}`);
    }

    if (!baseUrl.endsWith('/')) {
      baseUrl = baseUrl.concat('/');
    }

    return url.toLowerCase().replace(`${baseUrl}`, '').split('/')[0];
  }

  /**
   * Clear url from template params.
   *
   * @param url to be cleaned
   * @throws error when required params are not valid
   */
  public static removeTemplateParams(url: string): string {
    ValidationUtils.validateInputParams({ url });

    return UrlUtils.fillTemplateParams(url, {});
  }

  /**
   * Clear all url params.
   *
   * @param url to clear params
   * @throws error when required params are not valid
   */
  public static clearUrlParams(url: string): string {
    ValidationUtils.validateInputParams({ url });
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
    ValidationUtils.validateInputParams({ url });
    UrlUtils.checkDuplicateParams(options);

    /*
       Sort params will be applied through Http request params not with template params
       because often sort params is not present in template params then sort params need to put through Http request params.
       But when sort params present in template params we need to avoid duplication sort params from Http request params
       and template params therefore we need to add it in one place.
    */
    const paramsWithoutSortParam = {
      ...options,
      ...options?.params,
      ...options?.pageParams,
    };
    return new UriTemplate(url).fill(isNil(paramsWithoutSortParam) ? {} : paramsWithoutSortParam);
  }

  public static fillDefaultPageDataIfNoPresent(options?: PagedGetOption) {
    const pagedOptions = !isEmpty(options) ? options : {};
    if (isEmpty(pagedOptions.pageParams)) {
      pagedOptions.pageParams = LibConfig.getConfig().pagination.defaultPage;
    } else if (!pagedOptions.pageParams.size) {
      pagedOptions.pageParams.size = LibConfig.getConfig().pagination.defaultPage.size;
    } else if (!pagedOptions.pageParams.page) {
      pagedOptions.pageParams.page = LibConfig.getConfig().pagination.defaultPage.page;
    }

    return pagedOptions;
  }

  private static generateSortParams(sort: Sort, httpParams?: HttpParams): HttpParams {
    let resultParams = httpParams ? httpParams : new HttpParams();
    if (!isEmpty(sort)) {
      for (const [sortPath, sortOrder] of Object.entries(sort)) {
        resultParams = resultParams.append('sort', `${sortPath},${sortOrder}`);
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

  public static getRouteByName(routeName: string): ResourceRoute {
    const route = LibConfig.getConfig().http[routeName];
    if (isEmpty(route)) {
      ConsoleLogger.error(`No Resource route found by name: '${routeName}'. Check you configuration. Read more about this ...`, {
        availableRoutes: UrlUtils.getRoutes()
      });
      throw Error(`No Resource route found by name: '${routeName}'.`);
    }

    return route;
  }

  public static getRoutes(): MultipleResourceRoutes {
    return LibConfig.getConfig().http as MultipleResourceRoutes;
  }

}
