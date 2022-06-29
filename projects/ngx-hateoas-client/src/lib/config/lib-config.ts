import { DEFAULT_ROUTE_NAME, HateoasConfiguration } from './hateoas-configuration.interface';

/**
 * Contains all configuration lib params.
 */
// tslint:disable:no-string-literal
export class LibConfig {

  public static readonly DEFAULT_CONFIG: HateoasConfiguration = {
    http: {
      [DEFAULT_ROUTE_NAME]: {
        rootUrl: 'http://localhost:8080/api/v1'
      },
    },
    logs: {
      verboseLogs: false
    },
    cache: {
      enabled: true,
      lifeTime: 5 * 60 * 1000
    },
    useTypes: {
      resources: []
    },
    pagination: {
      defaultPage: {
        size: 20,
        page: 0
      }
    },
    isProduction: false
  };

  public static config: HateoasConfiguration = LibConfig.DEFAULT_CONFIG;

  public static setConfig(hateoasConfiguration: HateoasConfiguration) {
    LibConfig.config = {
      ...LibConfig.DEFAULT_CONFIG,
      ...hateoasConfiguration
    };
  }

  public static getConfig(): HateoasConfiguration {
    return LibConfig.config;
  }

}
