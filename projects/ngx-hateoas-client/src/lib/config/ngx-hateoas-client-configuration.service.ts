import { Injectable, Injector } from '@angular/core';
import { DependencyInjector } from '../util/dependency-injector';
import { LibConfig } from './lib-config';
import { DEFAULT_ROUTE_NAME, HateoasConfiguration, ResourceRoute } from './hateoas-configuration.interface';
import { ConsoleLogger } from '../logger/console-logger';
import { ResourceUtils } from '../util/resource.utils';
import { Resource } from '../model/resource/resource';
import { ResourceCollection } from '../model/resource/resource-collection';
import { EmbeddedResource } from '../model/resource/embedded-resource';
import { PagedResourceCollection } from '../model/resource/paged-resource-collection';
import { ValidationUtils } from '../util/validation.utils';
import { isString } from 'lodash-es';

/**
 * This service for configuration library.
 *
 * You should inject this service in your main AppModule and pass
 * configuration using {@link #configure()} method.
 */
// tslint:disable:no-string-literal
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

  private static isSimpleRouteConfig(config: HateoasConfiguration): boolean {
    return 'rootUrl' in config.http && isString(config.http['rootUrl']);
  }

  /**
   * Configure library with client params.
   *
   * @param config suitable client properties needed to properly library work
   */
  public configure(config: HateoasConfiguration): void {
    if (NgxHateoasClientConfigurationService.isSimpleRouteConfig(config)) {
      config = {
        ...config,
        http: {
          [DEFAULT_ROUTE_NAME]: {...config.http as ResourceRoute}
        }
      };
    }
    for (const [, value] of Object.entries(config.http)) {
      ValidationUtils.validateInputParams({config, baseApi: value.rootUrl});
    }
    LibConfig.setConfig(config);

    ConsoleLogger.objectPrettyInfo('HateoasClient was configured with options', config);
  }

}
