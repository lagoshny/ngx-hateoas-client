import url from 'url';
import { ObjectUtils } from './object.utils';

export class UrlUtils {

  private static readonly URL_TEMPLATE_VAR_REGEXP = /{[^}]*}/g;
  private static readonly EMPTY_STRING = '';

  public static removeUrlTemplateVars(srcUrl: string) {
    return srcUrl.replace(UrlUtils.URL_TEMPLATE_VAR_REGEXP, UrlUtils.EMPTY_STRING);
  }

  public static convertToHttpParams(params: HalParam, httpParams?: HttpParams): HttpParams {
    let resultParams = httpParams ? httpParams : new HttpParams();
    if (_.isObject(params)) {
      for (const [key, value] of Object.entries(params)) {
        if (params.hasOwnProperty(key)) {
          const paramValue = isResource(value)
            ? value.getSelfLinkHref()
            : value.toString();

          resultParams = resultParams.append(key, paramValue);
        }
      }
    }

    return resultParams;
  }

}
