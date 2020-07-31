import { HttpParams } from '@angular/common/http';
import { isResource } from '../hal-resource/model/resource-type';
import * as _ from 'lodash';
import { Resource } from '../hal-resource/model/resource';
import uriTemplates from 'uri-templates';
import { PagedGetOption, RequestParam } from '../hal-resource/model/declarations';

export class UrlUtils {

  /**
   * Convert passed params to the {@link HttpParams}.
   *
   * @param options which need to convert
   * @param httpParams (optional) if passed then will be applied to this one, otherwise created a new one
   */
  public static convertToHttpParams(options: PagedGetOption, httpParams?: HttpParams): HttpParams {
    let resultParams = httpParams ? httpParams : new HttpParams();
    if (_.isEmpty(options)) {
      return resultParams;
    }

    if (_.isObject(options.params) && !_.isEmpty(options.params)) {
      for (const [key, value] of Object.entries(options.params)) {
        if (options.params.hasOwnProperty(key)) {
          if (isResource(value)) {
            // Append resource as resource link
            resultParams = resultParams.append(key, (value as Resource).getSelfLinkHref());
          } else {
            if (key === 'projection') {
              throw Error('You should pass projection param in projection object key, not with request params!');
            }
            if (key === 'page' || key === 'size' || key === 'sort') {
              throw Error('You should pass page params in page object key, not with request params!');
            }
            // Else append simple param as is
            resultParams = resultParams.append(key, value.toString());
          }
        }
      }
    }

    if (!_.isEmpty(options.page)) {
      resultParams = resultParams.append('page', _.toString(options.page.page));
      resultParams = resultParams.append('size', _.toString(options.page.size));
      if (!_.isEmpty(options.page.sort)) {
        for (const [sortPath, sortOrder] of Object.entries(options.page.sort)) {
          resultParams = resultParams.append('sort', `${ sortPath },${ sortOrder }`);
        }
      }
    }

    if (!_.isNil(options.projection)) {
      resultParams = resultParams.append('projection', options.projection);
    }

    return resultParams;
  }

  /**
   * Generate url use base and the resource name.
   *
   * @param baseUrl will be as first part as a result url
   * @param resourceName added to the base url through slash
   */
  public static generateResourceUrl(baseUrl: string, resourceName: string): string {
    let url = baseUrl;
    if (!url.endsWith('/')) {
      url = url.concat('/');
    }
    return url.concat(resourceName);
  }

  /**
   * Clear url from template params.
   *
   * @param url to be cleaned
   */
  public static removeTemplateParams(url: string): string {
    return UrlUtils.fillTemplateParams(url, {});
  }

  /**
   * Fill url template params..
   *
   * @param url to be filled
   * @param templateParams to fill url
   */
  public static fillTemplateParams(url: string, templateParams: object): string {
    return uriTemplates(url).fill(_.isNil(templateParams) ? {} : templateParams);
  }

}
