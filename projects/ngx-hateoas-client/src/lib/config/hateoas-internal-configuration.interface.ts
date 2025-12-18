import {
  DEFAULT_ROUTE_NAME,
  HateoasConfiguration,
  MultipleResourceRoutes,
  ResourceRoute
} from './hateoas-configuration.interface';
import { CacheMode } from '../model/declarations';

export interface ResolvedHateoasConfig extends HateoasConfiguration{
  http: MultipleResourceRoutes;

  logs: {
    verboseLogs: boolean;
  };

  cache: {
    enabled: boolean;
    mode: CacheMode;
    lifeTime: number;
  };

  pagination: {
    defaultPage: {
      size: number;
      page: number;
    };
  };

  halFormat: {
    json: {
      convertEmptyObjectToNull: boolean;
    };
    collections: {
      embeddedOptional: boolean;
    };
  };

  isProduction: boolean;
}

export function toMultipleResourceRoutes(
  http: ResourceRoute | MultipleResourceRoutes,
): MultipleResourceRoutes {
  if (isSingleResourceRoute(http)) {
    return {
      [DEFAULT_ROUTE_NAME]: http,
    };
  }
  return http;
}

function isSingleResourceRoute(
  http: ResourceRoute | MultipleResourceRoutes
): http is ResourceRoute {
  return 'rootUrl' in http;
}
