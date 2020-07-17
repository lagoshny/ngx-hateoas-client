import { Injectable, Injector } from '@angular/core';
import { DependencyInjector } from '../util/dependency-injector';
import { HttpConfigService } from './http-config.service';
import { HalConfiguration } from './hal-configuration.interface';
import { ConsoleLogger } from '../logger/console-logger';
import { ResourceUtils } from '../util/resource.utils';
import { Resource } from '../hal-resource/model/resource';
import { ResourceCollection } from '../hal-resource/model/resource-collection';
import { EmbeddedResource } from '../hal-resource/model/embedded-resource';

/**
 * Service allows pass configuration params to lib.
 */
@Injectable()
export class HalConfigurationService {

  constructor(private injector: Injector,
              private httpConfig: HttpConfigService) {
    DependencyInjector.injector = injector;
    // Sets resource types to prevent circular dependencies
    ResourceUtils.useResourceType(Resource);
    ResourceUtils.useResourceCollectionType(ResourceCollection);
    ResourceUtils.useEmbeddedResourceType(EmbeddedResource);
  }

  public configure(config: HalConfiguration): void {
    this.httpConfig.baseApiUrl = config.baseApiUrl;
    ConsoleLogger.enabled = config.verboseLogs;
  }

}
