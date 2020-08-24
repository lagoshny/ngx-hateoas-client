import { HttpParams } from '@angular/common/http';
import { isResource } from '../model/resource-type';
import * as _ from 'lodash';
import { Resource } from '../model/resource/resource';
import uriTemplates from 'uri-templates';
import { GetOption, PagedGetOption, Sort } from '../model/declarations';
import { ValidationUtils } from './validation.utils';

export class UrlUtils {

  /**
   * Convert passed params to the {@link HttpParams}.
   *
   * @param options which need to convert
   * @param httpParams (optional) if passed then will be applied to this one, otherwise created a new one
   */
  public static convertToHttpParams(options: PagedGetOption, httpParams?: HttpParams): HttpParams {
    let resultParams = httpParams ? httpParams : new HttpParams();
    if (_.isEmpty(options) || _.isNil(options)) {
      return resultParams;
    }
    UrlUtils.checkDuplicateParams(options);

    if (_.isObject(options.params) && !_.isEmpty(options.params)) {
      for (const [key, value] of Object.entries(options.params)) {
        if (options.params.hasOwnProperty(key)) {
          if (isResource(value)) {
            // Append resource as resource link
            resultParams = resultParams.append(key, (value as Resource).getSelfLinkHref());
          } else {
            // Else append simple param as is
            resultParams = resultParams.append(key, value.toString());
          }
        }
      }
    }

    if (!_.isEmpty(options.pageParams)) {
      resultParams = resultParams.append('page', _.toString(options.pageParams.page));
      resultParams = resultParams.append('size', _.toString(options.pageParams.size));
      resultParams = UrlUtils.generateSortParams(options.pageParams.sort, resultParams);
    }

    return resultParams;
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

    const resultUrl = uriTemplates(url).fill(_.isNil(paramsWithoutSortParam) ? {} : paramsWithoutSortParam);
    if (options?.pageParams) {
      const sortParams = UrlUtils.generateSortParams(options.pageParams.sort);
      if (sortParams.keys().length > 0) {
        return resultUrl.concat(resultUrl.includes('?') ? '&' : '').concat(sortParams.toString());
      }
    }

    return resultUrl;
  }

  private static generateSortParams(sort: Sort, httpParams?: HttpParams): HttpParams {
    let resultParams = httpParams ? httpParams : new HttpParams();
    if (!_.isEmpty(sort)) {
      for (const [sortPath, sortOrder] of Object.entries(sort)) {
        resultParams = resultParams.append('sort', `${ sortPath },${ sortOrder }`);
      }
    }

    return resultParams;
  }

  private static checkDuplicateParams(options: GetOption): void {
    if (_.isEmpty(options) || _.isEmpty(options.params)) {
      return;
    }
    if ('page' in options.params || 'size' in options.params || 'sort' in options.params) {
      throw Error('Please, pass page params in page object key, not with params object!');
    }
  }

}
