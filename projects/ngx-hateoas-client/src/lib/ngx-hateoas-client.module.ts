import { ModuleWithProviders, NgModule } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HalConfigurationService } from './config/hal-configuration.service';
import { HttpConfigService } from './config/http-config.service';
import { CacheService } from './service/cache.service';
import { HalResourceService } from './service/external/hal-resource.service';
import { ResourceHttpService } from './service/internal/resource-http.service';
import { PagedResourceCollectionHttpService } from './service/internal/paged-resource-collection-http.service';
import { ResourceCollectionHttpService } from './service/internal/resource-collection-http.service';
import { CommonResourceHttpService } from './service/internal/common-resource-http.service';

export { HalConfiguration } from './config/hal-configuration.interface';
export { HalConfigurationService } from './config/hal-configuration.service';
export { Resource } from './model/resource/resource';
export { EmbeddedResource } from './model/resource/embedded-resource';
export { ResourceCollection } from './model/resource/resource-collection';
export { PagedResourceCollection } from './model/resource/paged-resource-collection';
export { SortOrder, Include, HttpMethod } from './model/declarations';
export { HalResourceOperation } from './service/external/hal-resource-operation';
export { HalResourceService } from './service/external/hal-resource.service';

@NgModule({
  imports: [
    HttpClientModule
  ],
  declarations: [],
  providers: [
    HttpClient,
    HttpConfigService,
    CacheService,
    HalResourceService,
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
        HalConfigurationService
      ]
    };
  }
}
