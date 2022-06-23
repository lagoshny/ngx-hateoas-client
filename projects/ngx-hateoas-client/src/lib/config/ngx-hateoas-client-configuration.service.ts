import { Injectable, Injector } from '@angular/core';
import { DependencyInjector } from '../util/dependency-injector';
import { LibConfig } from './lib-config';
import { HateoasConfiguration, HttpConfig } from './hateoas-configuration.interface';
import { ConsoleLogger } from '../logger/console-logger';
import { ResourceUtils } from '../util/resource.utils';
import { Resource } from '../model/resource/resource';
import { ResourceCollection } from '../model/resource/resource-collection';
import { EmbeddedResource } from '../model/resource/embedded-resource';
import { PagedResourceCollection } from '../model/resource/paged-resource-collection';
import { ValidationUtils } from '../util/validation.utils';
import { isObject } from 'lodash-es';

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

  private static isSingleSource(config: HateoasConfiguration): boolean {
    return 'rootUrl' in config.http && isObject(config.http['rootUrl']);
  }

  /**
   * Configure library with client params.
   *
   * @param config suitable client properties needed to properly library work
   */
  public configure(config: HateoasConfiguration): void {
    if (NgxHateoasClientConfigurationService.isSingleSource(config)) {
      config = {
        ...config,
        http: {
          default: {...config.http as HttpConfig}
        }
      };
    }

    for (const [key, value] of Object.entries(config.http)) {
      ValidationUtils.validateInputParams({config, baseApi: value.rootUrl});
    }

    // const httpParams: Array<HttpConfig> = [];
    // if (isArray(config?.http)) {
    //   ValidationUtils.validateInputParams({config, baseApi: config?.http[0]?.rootUrl});
    //   httpParams.push(...config?.http);
    // } else {
    //   ValidationUtils.validateInputParams({config, baseApi: config?.http?.rootUrl});
    //   httpParams.push(config?.http);
    // }
    LibConfig.setConfig(config);

    // TODO: проверить на нескольких урлах
    ConsoleLogger.prettyInfo('HateoasClient was configured with options', config.http);
  }

}
