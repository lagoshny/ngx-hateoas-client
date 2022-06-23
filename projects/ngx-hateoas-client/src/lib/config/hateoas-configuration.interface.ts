/**
 * Describe all client configuration params.
 */
import { Resource } from '../model/resource/resource';
import { EmbeddedResource } from '../model/resource/embedded-resource';

export const DEFAULT_SOURCE_ALIAS = 'default';

/**
 * Used to specify additional {@link Resource} options.
 */
export interface ResourceOption {
  /**
   * Alias of resource source that configured in {@link MultiHttpConfig}.
   * If you use single {@link HttpConfig} by default alias is 'default'.
   */
  sourceAlias?: string;
}

/**
 * Common http config that defined where from retrieve resources.
 */
export interface HttpConfig {
  /**
   * Root server url.
   *
   * For default Spring application it looks like: http://localhost:8080.
   */
  rootUrl: string;
  /**
   * Proxy url on which to send requests.
   * If passed then it uses to change rootUrl to proxyUrl when get relation link.
   *
   * For default Spring application it looks like: http://localhost:8080/api/v1.
   */
  proxyUrl?: string;
}

/**
 * Allow to declare several resource sources with aliases.
 */
export interface MultiHttpConfig {
  /**
   * Define several resource sources with aliases.
   * Alias it key of object. After define alias you can use it in {@link ResourceOption#sourceAlias} to specify resource source.
   */
  [alias: string]: HttpConfig;
}

export interface HateoasConfiguration {

  /**
   * Http options, allowed to define several resource sources using {@link MultiHttpConfig}.
   */
  http: HttpConfig | MultiHttpConfig;

  /**
   * Logging option.
   */
  logs?: {
    /**
     * Should print verbose logs to the console.
     */
    verboseLogs?: boolean;
  };

  /**
   * Cache options.
   */
  cache?: {
    /**
     * When {@code true} then cache will be used, {@code false} otherwise.
     */
    enabled: boolean;
    /**
     * Time in milliseconds after which cache need to be expired.
     */
    lifeTime?: number;
  };

  /**
   * Declared resource/embedded resource types that will be used to create resources from server response that contains resources.
   */
  useTypes?: {
    resources: Array<new (...args: any[]) => Resource>;
    embeddedResources?: Array<new (...args: any[]) => EmbeddedResource>;
  };

  /**
   * {@code true} when running in production environment, {@code false} otherwise.
   */
  isProduction?: boolean;

  /**
   * Specifying format for some type values.
   */
  typesFormat?: {
    /**
     * This date format will be used when parse {@link Resource} properties.
     * If the property will be match to some one of specified formats, then the property type will be as Date object.
     * Otherwise, raw type will be used as default.
     */
    date?: {
      /**
       * Date pattern.
       * The {@link https://date-fns.org} lib is used to parse date with patterns, use patterns supported by this lib.
       * See more about supported formats <a href='https://date-fns.org/v2.28.0/docs/parse'>here</a>.
       */
      patterns: Array<string>;
    }
  };

  /**
   * Let to change default page params that is size = 20, page = 0.
   */
  pagination?: {
    defaultPage: {
      size: number;
      page?: number;
    }
  };

}
