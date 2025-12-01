import { ENVIRONMENT_INITIALIZER, EnvironmentProviders, inject, makeEnvironmentProviders } from '@angular/core';
import { HateoasConfiguration } from './config/hateoas-configuration.interface';
import { NGX_HATEOAS_CONFIG } from './config/ngx-hateoas-config';
import { NgxHateoasClientConfigurationService } from './config/ngx-hateoas-client-configuration.service';

export { NGX_HATEOAS_CONFIG } from './config/ngx-hateoas-config';
export { NgxHateoasClientConfigurationService } from './config/ngx-hateoas-client-configuration.service';
export { Resource } from './model/resource/resource';
export { EmbeddedResource } from './model/resource/embedded-resource';
export { ResourceCollection } from './model/resource/resource-collection';
export { PagedResourceCollection } from './model/resource/paged-resource-collection';
export {
  Sort,
  SortOrder,
  Include,
  HttpMethod,
  ProjectionRelType,
  GetOption,
  PagedGetOption,
  RequestOption,
  RequestParam,
  CacheMode
} from './model/declarations';
export { HateoasResourceOperation } from './service/external/hateoas-resource-operation';
export { HateoasResourceService } from './service/external/hateoas-resource.service';
export { HateoasResource, HateoasEmbeddedResource, HateoasProjection, ProjectionRel } from './model/decorators';

export function provideNgxHateoasClient(config: HateoasConfiguration): EnvironmentProviders {
  return makeEnvironmentProviders([
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
  ]);
}
