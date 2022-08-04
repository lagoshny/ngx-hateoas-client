/**
 * Describe all client configuration params.
 */
import { Resource } from '../model/resource/resource';
import { EmbeddedResource } from '../model/resource/embedded-resource';

export const DEFAULT_ROUTE_NAME = 'defaultRoute';

/**
 * Used to specify additional {@link Resource} options.
 */
export interface ResourceOption {
  /**
   * Name of the route that configured in {@link HateoasConfiguration#http} as {@link MultipleResourceRoutes}.
   * Be default used route with name 'defaultRoute'.
   *
   * See more about this option in <a href="https://github.com/lagoshny/ngx-hateoas-client/blob/master/README.md#options">documentation</a>.
   */
  routeName?: string;
}

/**
 * Used to specify additional resource property options.
 */
export interface PropertyOption {
  /**
   * Param allows to specify another JSON name property that should be match to current one.
   */
  name?: string;
  /**
   * Should try to get property value from JSON response by name that match with this property
   * name ignoring case-sensitive when perform resource {@code DESERIALIZATION} operation.
   *
   * When performing resource {@code SERIALIZATION} for the request,
   * then property name will be passed as specified in `name` param of this decorator or class property name when `name` param is empty.
   */
  ignoreCase?: boolean;
}

export interface ResourcePropertyConfig {
  deserialize: {
    /**
     * As key value used, passed in {@link PropertyOption#name} value.
     * When {@link PropertyOption#ignoreCase} is true, then key added in lower-case.
     */
    [deserializePropKey: string]: {
      /**
       * Target property name that will be assigned to resource class after parsing from response.
       * Used value as real class property name.
       */
      propName: string;
      ignoreCase: boolean;
    }
  };
  serialize: {
    /**
     * As key value used real class property name.
     */
    [serializePropKey: string]: {
      /**
       * Target property name that will be passed in request.
       * Used value passed in {@link PropertyOption#name}.
       */
      propName: string;
    }
  };
}

/**
 * Resource route config that defined where from retrieve resources.
 * If you use this config, then a default route created with name 'defaultRoute' will be assigned to all resources.
 */
export interface ResourceRoute {
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
 * Defines several resource routes.
 */
export interface MultipleResourceRoutes {
  /**
   * Each resource route is declared as {@link ResourceRoute} object with root and proxy url if need it.
   * Specified route name  is used in {@link ResourceOption#routeName} to retrieve resource by this route.
   *
   * If you want to declare only one route, you need to use default route name as 'defaultRoute' or use simple {@link ResourceRoute} config.
   */
  [routeName: string]: ResourceRoute;
}

export interface HateoasConfiguration {

  /**
   * Http options.
   * {@link ResourceRoute} declare common resource route that created with default name 'defaultRoute'.
   * {@link MultipleResourceRoutes} declare several resource routes,
   * to define default route in this case, use default route name 'defaultRoute'.
   */
  http: ResourceRoute | MultipleResourceRoutes;

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

  /**
   * Additional configuration to specify settings for HAL format.
   */
  halFormat?: {
    collections?: {
      /**
       * If {@code true}, then for empty collections, not required to specify _embedded property.
       * When {@code false} (be default), you need to specify empty _embedded property for empty collections.
       *
       * By default, Spring Data REST includes empty _embedded property for empty collections,
       * but when using Spring HATEOAS you need to do it manually.
       *
       * Recommending use Spring Data REST approach and return empty _embedded property for empty collection
       * for more predictable determine resource type algorithm.
       */
      embeddedOptional: boolean;
    }
  };

}
