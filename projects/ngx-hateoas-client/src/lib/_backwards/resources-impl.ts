import { BaseResource } from '../model/resource/base-resource';
import { Resource } from '../model/resource/resource';
import { EmbeddedResource } from '../model/resource/embedded-resource';
import { OldBaseResource } from './hal-client/model/old-base-resource';
import * as _ from 'lodash';

export class BaseResourceImpl extends BaseResource {

  constructor(oldBaseResource: OldBaseResource) {
    super();

    for (const k in oldBaseResource) {
      if (_.isFunction(oldBaseResource[k])) {
        return;
      }
      this[k] = oldBaseResource[k];
    }
  }

}

export class ResourceImpl extends Resource {
  constructor(oldBaseResource: OldBaseResource) {
    super();

    for (const k in oldBaseResource) {
      if (_.isFunction(oldBaseResource[k])) {
        return;
      }
      this[k] = oldBaseResource[k];
    }
  }
}
