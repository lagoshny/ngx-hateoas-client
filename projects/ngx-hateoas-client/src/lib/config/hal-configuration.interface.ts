/**
 * Describe all client configuration params.
 */
export interface HalConfiguration {

  /**
   * Base api url on which to send requests.
   *
   * For default Spring application it looks like: http://localhost:8080/api/v1.
   */
  baseApiUrl: string;

  /**
   * Should print verbose logs to the console.
   */
  verboseLogs?: boolean;

  /**
   * Cache options.
   */
  cache?: {
    /**
     * Should app use cache.
     */
    enabled: boolean;
    /**
     * Time in seconds when cache was expired.
     */
    expireTime?: number;
  };

}
