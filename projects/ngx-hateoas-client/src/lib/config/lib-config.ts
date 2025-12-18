import { DEFAULT_ROUTE_NAME, HateoasConfiguration } from './hateoas-configuration.interface';
import { CacheMode } from '../model/declarations';
import { ResolvedHateoasConfig, toMultipleResourceRoutes } from './hateoas-internal-configuration.interface';

/**
 * Contains all configuration lib params.
 */
// tslint:disable:no-string-literal
export class LibConfig {

  public static readonly DEFAULT_CONFIG = {
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
        embeddedOptional: false
      }
    },
    isProduction: false
  } satisfies ResolvedHateoasConfig;

  private static config: ResolvedHateoasConfig = LibConfig.DEFAULT_CONFIG;

  public static setConfig(hateoasConfiguration: HateoasConfiguration) {
    LibConfig.config = LibConfig.mergeConfigs(hateoasConfiguration);
  }

  public static getConfig(): ResolvedHateoasConfig {
    return LibConfig.config;
  }

  public static mergeConfigs(config: HateoasConfiguration): ResolvedHateoasConfig {
    const defaults = LibConfig.DEFAULT_CONFIG;

    return {
      http: toMultipleResourceRoutes(config.http ?? defaults.http),

      logs: {
        verboseLogs:
          config.logs?.verboseLogs
          ?? defaults.logs.verboseLogs,
      },

      cache: {
        enabled:
          config.cache?.enabled
          ?? defaults.cache.enabled,

        mode:
          config.cache?.mode
          ?? defaults.cache.mode,

        lifeTime:
          config.cache?.lifeTime
          ?? defaults.cache.lifeTime,
      },

      pagination: {
        defaultPage: {
          size:
            config.pagination?.defaultPage?.size
            ?? defaults.pagination.defaultPage.size,

          page:
            config.pagination?.defaultPage?.page
            ?? defaults.pagination.defaultPage.page,
        },
      },

      halFormat: {
        json: {
          convertEmptyObjectToNull:
            config.halFormat?.json?.convertEmptyObjectToNull
            ?? defaults.halFormat.json.convertEmptyObjectToNull,
        },
        collections: {
          embeddedOptional:
            config.halFormat?.collections?.embeddedOptional
            ?? defaults.halFormat.collections.embeddedOptional,
        },
      },

      isProduction:
        config.isProduction
        ?? defaults.isProduction,

      useTypes: {
        resources:
          config.useTypes?.resources
          ?? defaults.useTypes.resources,
        embeddedResources: config.useTypes?.embeddedResources
      },
    };
  }

}
