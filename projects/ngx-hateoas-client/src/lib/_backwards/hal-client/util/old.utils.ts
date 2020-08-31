import { HalOptions, HalParam, LinkOptions, OldSubTypeBuilder } from '../model/interfaces';
import * as _ from 'lodash';
import { GetOption, PagedGetOption, RequestOption } from '../../../model/declarations';
import { OldBaseResource } from '../model/old-base-resource';
import { BaseResource } from '../../../model/resource/base-resource';

/* tslint:disable */
export class OldUtils {

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

  static getSubtypeIgnoreCase(subtype: OldSubTypeBuilder, resourceName: string) {
    let result = null;
    if (subtype && subtype.subtypes && subtype.subtypes.size > 0 && resourceName) {
      for (const subtypeName of subtype.subtypes.keys()) {
        if (subtypeName.toLowerCase() === resourceName.toLowerCase()) {
          result = subtype.subtypes.get(subtypeName);
          break;
        }
      }
    }
    return result;
  }

  static instantiateSubtype(subtypeType: new() => OldBaseResource, baseResource: BaseResource) {
    const subtype = new subtypeType();
    for (const k in baseResource) {
      if (_.isFunction(baseResource[k]) || k === 'resourceName') {
        continue;
      }
      subtype[k] = baseResource[k];
    }
    return subtype;
  }

  static instantiateResource(subTypeBuilder: OldSubTypeBuilder, resource: any, defaultType: new(baseResource) => OldBaseResource): any {
    if (subTypeBuilder && resource['resourceName'] && this.getSubtypeIgnoreCase(subTypeBuilder, resource['resourceName'])) {
      const subtype = OldUtils.getSubtypeIgnoreCase(subTypeBuilder, resource['resourceName']);
      return OldUtils.instantiateSubtype(subtype, resource);
    }

    return new defaultType(resource);
  }
}
