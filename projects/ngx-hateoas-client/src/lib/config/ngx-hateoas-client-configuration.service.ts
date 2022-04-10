import { Injectable, Injector } from '@angular/core';
import { DependencyInjector } from '../util/dependency-injector';
import { LibConfig } from './lib-config';
import { HateoasConfiguration } from './hateoas-configuration.interface';
import { ConsoleLogger } from '../logger/console-logger';
import { ResourceUtils } from '../util/resource.utils';
import { Resource } from '../model/resource/resource';
import { ResourceCollection } from '../model/resource/resource-collection';
import { EmbeddedResource } from '../model/resource/embedded-resource';
import { PagedResourceCollection } from '../model/resource/paged-resource-collection';
import { ValidationUtils } from '../util/validation.utils';

/**
 * This service for configuration library.
 *
 * You should inject this service in your main AppModule and pass
 * configuration using {@link #configure()} method.
 */
@Injectable({
  providedIn: 'root',
})
export class NgxHateoasClientConfigurationService {

  constructor(private injector: Injector) {
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
  public configure(config: HateoasConfiguration): void {
    ValidationUtils.validateInputParams({config, baseApi: config?.http?.rootUrl});

    LibConfig.setConfig(config);

    ConsoleLogger.prettyInfo('HateoasClient was configured with options', {
      rootUrl: config.http.rootUrl
    });
  }

}
