import { HateoasConfiguration, HttpConfig, MultiHttpConfig } from './hateoas-configuration.interface';

/**
 * Contains all configuration lib params.
 */
// tslint:disable:no-string-literal
export class LibConfig {

  public static readonly DEFAULT_CONFIG = {
    http: {
      default: {
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

  public static getSourceByAlias(alias: string): HttpConfig {
    return LibConfig.config.http[alias];
  }

  public static getSources(): MultiHttpConfig {
    return LibConfig.config.http as MultiHttpConfig;
  }

}
