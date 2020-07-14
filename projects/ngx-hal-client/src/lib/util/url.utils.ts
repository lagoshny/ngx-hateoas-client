import url from 'url';
import { ObjectUtils } from './object.utils';

export class UrlUtils {

    private static readonly URL_TEMPLATE_VAR_REGEXP = /{[^}]*}/g;
    private static readonly EMPTY_STRING = '';

    public static removeUrlTemplateVars(srcUrl: string) {
        return srcUrl.replace(UrlUtils.URL_TEMPLATE_VAR_REGEXP, UrlUtils.EMPTY_STRING);
    }

    public static addSlash(uri: string): string {
        const uriParsed = url.parse(uri);
        if (ObjectUtils.isNullOrUndefined(uriParsed.search) && uri && uri[uri.length - 1] !== '/') {
            return uri + '/';
        }
        return uri;
    }

}
