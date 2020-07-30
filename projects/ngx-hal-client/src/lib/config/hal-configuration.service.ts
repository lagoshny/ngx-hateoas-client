import { Injectable, Injector } from '@angular/core';
import { DependencyInjector } from '../util/dependency-injector';
import { HttpConfigService } from './http-config.service';
import { HalConfiguration } from './hal-configuration.interface';
import { ConsoleLogger } from '../logger/console-logger';
import { ResourceUtils } from '../util/resource.utils';
import { Resource } from '../hal-resource/model/resource';
import { CollectionResource } from '../hal-resource/model/collection-resource';
import { EmbeddedResource } from '../hal-resource/model/embedded-resource';
import { PagedCollectionResource } from '../hal-resource/model/paged-collection-resource';

/**
 * This service for configuration library.
 *
 * You should inject this service in your main AppModule and pass
 * configuration using {@link #configure()} method.
 */
@Injectable()
export class HalConfigurationService {

  constructor(private injector: Injector,
              private httpConfig: HttpConfigService) {
    DependencyInjector.injector = injector;
    // Setting resource types to prevent circular dependencies
    ResourceUtils.useResourceType(Resource);
    ResourceUtils.useCollectionResourceType(CollectionResource);
    ResourceUtils.usePagedCollectionResourceType(PagedCollectionResource);
    ResourceUtils.useEmbeddedResourceType(EmbeddedResource);
  }

  /**
   * Configure library with client params.
   *
   * @param config suitable client properties needed to properly library work
   */
  public configure(config: HalConfiguration): void {
    this.httpConfig.baseApiUrl = config.baseApiUrl;
    ConsoleLogger.enabled = config.verboseLogs;
  }

}
