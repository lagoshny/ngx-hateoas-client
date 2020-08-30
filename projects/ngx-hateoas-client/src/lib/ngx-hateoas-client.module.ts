import { ModuleWithProviders, NgModule } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HateoasConfigurationService } from './config/hateoas-configuration.service';
import { LibConfig } from './config/lib-config';
import { HateoasResourceService } from './service/external/hateoas-resource.service';
import { ResourceHttpService } from './service/internal/resource-http.service';
import { PagedResourceCollectionHttpService } from './service/internal/paged-resource-collection-http.service';
import { ResourceCollectionHttpService } from './service/internal/resource-collection-http.service';
import { CommonResourceHttpService } from './service/internal/common-resource-http.service';
import { ResourceCacheService } from './service/internal/cache/resource-cache.service';

export { HateoasConfiguration } from './config/hateoas-configuration.interface';
export { HateoasConfigurationService } from './config/hateoas-configuration.service';
export { Resource } from './model/resource/resource';
export { EmbeddedResource } from './model/resource/embedded-resource';
export { ResourceCollection } from './model/resource/resource-collection';
export { PagedResourceCollection } from './model/resource/paged-resource-collection';
export { Sort, SortOrder, Include, HttpMethod } from './model/declarations';
export { HateoasResourceOperation } from './service/external/hateoas-resource-operation';
export { HateoasResourceService } from './service/external/hateoas-resource.service';

export * from './_backwards/hal-client/hal-client-exports';

@NgModule({
  imports: [
    HttpClientModule
  ],
  declarations: [],
  providers: [
    HttpClient,
    LibConfig,
    ResourceCacheService,
    HateoasResourceService,
    CommonResourceHttpService,
    ResourceHttpService,
    ResourceCollectionHttpService,
    PagedResourceCollectionHttpService
  ],
  exports: [HttpClientModule]
})
export class NgxHateoasClientModule {
  static forRoot(): ModuleWithProviders<NgxHateoasClientModule> {
    return {
      ngModule: NgxHateoasClientModule,
      providers: [
        HttpClient,
        HateoasConfigurationService
      ]
    };
  }
}
