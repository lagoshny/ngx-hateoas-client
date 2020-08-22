import { Injectable, Injector } from '@angular/core';
import { DependencyInjector } from '../util/dependency-injector';
import { HttpConfigService } from './http-config.service';
import { HalConfiguration } from './hal-configuration.interface';
import { ConsoleLogger } from '../logger/console-logger';
import { ResourceUtils } from '../util/resource.utils';
import { Resource } from '../model/resource/resource';
import { ResourceCollection } from '../model/resource/resource-collection';
import { EmbeddedResource } from '../model/resource/embedded-resource';
import { PagedResourceCollection } from '../model/resource/paged-resource-collection';
import { CacheService } from '../service/cache.service';
import { ResourceIdentifiable } from '../model/resource/resource-identifiable';

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
    ResourceUtils.useResourceCollectionType(ResourceCollection);
    ResourceUtils.usePagedResourceCollectionType(PagedResourceCollection);
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
    CacheService.enabled = config.cache?.enabled;
    if (config.cache?.expireTime && config.cache?.expireTime > 0) {
      CacheService.expireTime = config.cache?.expireTime;
    }

    ConsoleLogger.prettyInfo('HateoasClient was configured with options', {
      baseApiUrl: config.baseApiUrl
    });
  }

}
