import { HalOptions, HalParam, LinkOptions } from '../model/interfaces';
import * as _ from 'lodash';
import { GetOption, PagedGetOption, RequestOption } from '../../../model/declarations';

export class OptionUtils {

  static convertToGetOption(options: HalOptions): GetOption {
    if (!options || _.isEmpty(options)) {
      return;
    }
    const result: GetOption = {};
    if (options.sort) {
      result.sort = {};
      options.sort.forEach(value => {
        result.sort[value.path] = value.order;
      });
    }
    if (options.params) {
      result.params = {};
      options.params.forEach(value => {
        result.params[value.key] = value.value;
      });
    }

    return result;
  }

  static halParamToGetOption(options: HalParam[]): GetOption {
    if (!options || _.isEmpty(options)) {
      return;
    }
    const result: GetOption = {};
    options.forEach(value => {
      result.params = {};
      result.params[value.key] = value.value;
    });

    return result;
  }

  static convertToPagedGetOption(options: HalOptions): PagedGetOption {
    if (!options || _.isEmpty(options)) {
      return;
    }
    const result: PagedGetOption = this.convertToGetOption(options);
    if (options.size) {
      result.pageParams = {};
      result.pageParams.size = options.size;
    }

    return result;
  }


  static convertToRequestOption(options: LinkOptions): GetOption {
    if (!options || _.isEmpty(options)) {
      return;
    }
    const result: RequestOption = {};
    if (options.params) {
      result.params = {};
      result.params = options.params;
    }
    return result;
  }
}
