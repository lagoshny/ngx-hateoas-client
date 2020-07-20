import { HttpParams } from '@angular/common/http';
import { isResource } from '../hal-resource/model/resource-type';
import * as _ from 'lodash';
import { Resource } from '../hal-resource/model/resource';
import uriTemplates from 'uri-templates';
import { RequestParam } from '../hal-resource/model/declarations';

export class UrlUtils {

  public static convertToHttpParams(params: RequestParam, httpParams?: HttpParams): HttpParams {
    let resultParams = httpParams ? httpParams : new HttpParams();
    if (_.isObject(params)) {
      for (const [key, value] of Object.entries(params)) {
        if (params.hasOwnProperty(key)) {
          if (isResource(value)) {
            // Append resource as resource link
            resultParams = resultParams.append(key, (value as Resource).getSelfLinkHref());
          } else if (_.isObject(value)) {
            // Append sort params
            for (const [sortPath, sortOrder] of Object.entries(value)) {
              resultParams = resultParams.append('sort', `${ sortPath },${ sortOrder }`);
            }
          } else {
            // Else append simple param as is
            resultParams = resultParams.append(key, value.toString());
          }
        }
      }
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
