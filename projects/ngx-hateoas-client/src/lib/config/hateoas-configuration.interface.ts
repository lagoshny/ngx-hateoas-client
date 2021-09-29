/**
 * Describe all client configuration params.
 */
import { Resource } from '../model/resource/resource';
import { EmbeddedResource } from '../model/resource/embedded-resource';

export interface HateoasConfiguration {

  /**
   * Http options.
   */
  http: {
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
  };

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
   * Let to change default page params that is size = 20, page = 0.
   */
  pagination?: {
    defaultPage: {
      size: number;
      page?: number;
    }
  };

}
