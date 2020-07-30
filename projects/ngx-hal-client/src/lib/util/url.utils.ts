import { HttpParams } from '@angular/common/http';
import { isResource } from '../hal-resource/model/resource-type';
import * as _ from 'lodash';
import { Resource } from '../hal-resource/model/resource';
import uriTemplates from 'uri-templates';
import { PagedGetOption, RequestParam } from '../hal-resource/model/declarations';

export class UrlUtils {

  public static convertToHttpParams(option: PagedGetOption, httpParams?: HttpParams): HttpParams {
    let resultParams = httpParams ? httpParams : new HttpParams();
    if (_.isEmpty(option)) {
      return resultParams;
    }

    if (_.isObject(option.params) && !_.isEmpty(option.params)) {
      for (const [key, value] of Object.entries(option.params)) {
        if (option.params.hasOwnProperty(key)) {
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

    if (!_.isEmpty(option.page)) {
      resultParams = resultParams.append('page', _.toString(option.page.page));
      resultParams = resultParams.append('size', _.toString(option.page.size));
      if (!_.isEmpty(option.page.sort)) {
        for (const [sortPath, sortOrder] of Object.entries(option.page.sort)) {
          resultParams = resultParams.append('sort', `${ sortPath },${ sortOrder }`);
        }
      }
    }

    if (!_.isNil(option.projection)) {
      resultParams = resultParams.append('projection', option.projection);
    }

    return resultParams;
  }

  public static generateResourceUrl(baseUrl: string, resource: string): string {
    let url = baseUrl;
    if (!url.endsWith('/')) {
      url = url.concat('/');
    }
    return url.concat(resource);
  }

  public static removeUrlTemplateVars(url: string): string {
    return uriTemplates(url).fill({});
  }

}
