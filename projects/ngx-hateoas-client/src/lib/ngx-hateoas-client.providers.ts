import { ENVIRONMENT_INITIALIZER, inject, Provider } from '@angular/core';
import { HateoasConfiguration } from './config/hateoas-configuration.interface';
import { NGX_HATEOAS_CONFIG } from './config/ngx-hateoas-config';
import { NgxHateoasClientConfigurationService } from './config/ngx-hateoas-client-configuration.service';
import { LibConfig } from './config/lib-config';

export { NGX_HATEOAS_CONFIG } from './config/ngx-hateoas-config';
export { NgxHateoasClientConfigurationService } from './config/ngx-hateoas-client-configuration.service';
export { Resource } from './model/resource/resource';
export { EmbeddedResource } from './model/resource/embedded-resource';
export { ResourceCollection } from './model/resource/resource-collection';
export { PagedResourceCollection } from './model/resource/paged-resource-collection';
export {
  Include,
  HttpMethod, CacheMode
} from './model/declarations';
export type {
  Sort,
  SortOrder, ProjectionRelType,
  GetOption,
  PagedGetOption,
  RequestOption,
  RequestParam
} from './model/declarations';
export { HateoasResourceOperation } from './service/external/hateoas-resource-operation';
export { HateoasResourceService } from './service/external/hateoas-resource.service';
export { HateoasResource, HateoasEmbeddedResource, HateoasProjection, ProjectionRel } from './model/decorators';

export function provideNgxHateoasClient(config: HateoasConfiguration): Provider[] {
  return [
    {
      provide: NGX_HATEOAS_CONFIG,
      useValue: config
    },
    {
      provide: ENVIRONMENT_INITIALIZER,
      multi: true,
      useFactory: () => {
        return () => {
          inject(NgxHateoasClientConfigurationService);
        };
      }
    },
  ];
}

/**
 * Only for testing purposes. Used default lib config if it is not passed.
 */
export function provideNgxHateoasClientTesting(config?: HateoasConfiguration): Provider[] {
  return [
    {
      provide: NGX_HATEOAS_CONFIG,
      useValue: config ?? LibConfig.DEFAULT_CONFIG,
    },
    {
      provide: ENVIRONMENT_INITIALIZER,
      multi: true,
      useFactory: () => {
        return () => {
          inject(NgxHateoasClientConfigurationService);
        };
      }
    },
  ];
}
