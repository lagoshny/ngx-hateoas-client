import { HalConfiguration } from './hal-configuration.interface';

/**
 * Contains all configuration lib params.
 */
export class LibConfig {

  public static readonly DEFAULT_CONFIG = {
    http: {
      baseApiUrl: 'http://localhost:8080/api/v1',
    },
    logs: {
      verboseLogs: false
    },
    cache: {
      enabled: false,
      lifeTime: 5 * 60 * 1000
    }
  };

  public static config: HalConfiguration = LibConfig.DEFAULT_CONFIG;

  public static setConfig(halConfig: HalConfiguration) {
    LibConfig.config = {
      ...LibConfig.DEFAULT_CONFIG,
      ...halConfig
    };
  }

}
