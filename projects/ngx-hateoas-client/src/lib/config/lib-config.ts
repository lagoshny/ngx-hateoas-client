import { DEFAULT_ROUTE_NAME, HateoasConfiguration } from './hateoas-configuration.interface';
import { CacheMode } from '../model/declarations';

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
      mode: CacheMode.ALWAYS,
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
    halFormat: {
      json: {
        convertEmptyObjectToNull: true
      },
      collections: {
        embeddedOptional: false,
        allowTemplates: false
      }
    },
    isProduction: false
  };

  private static config: HateoasConfiguration = LibConfig.DEFAULT_CONFIG;

  public static setConfig(hateoasConfiguration: HateoasConfiguration) {
    LibConfig.config = LibConfig.mergeConfigs(hateoasConfiguration);
  }

  public static getConfig(): HateoasConfiguration {
    return LibConfig.config;
  }

  public static mergeConfigs(config: HateoasConfiguration): HateoasConfiguration {
    return {
      ...LibConfig.DEFAULT_CONFIG,
      ...config,
      halFormat: {
        json: {
          ...LibConfig.DEFAULT_CONFIG.halFormat.json,
          ...config?.halFormat?.json
        },
        collections: {
          ...LibConfig.DEFAULT_CONFIG.halFormat.collections,
          ...config?.halFormat?.collections
        }
      },
      pagination: {
        defaultPage: {
          ...LibConfig.DEFAULT_CONFIG.pagination.defaultPage,
          ...config?.pagination?.defaultPage
        }
      },
      cache: {
        ...LibConfig.DEFAULT_CONFIG.cache,
        ...config?.cache
      },
    };
  }

}
