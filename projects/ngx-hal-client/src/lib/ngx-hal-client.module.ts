import { ModuleWithProviders, NgModule } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HalConfigurationService } from './config/hal-configuration.service';
import { HttpConfigService } from './config/http-config.service';
import { CacheService } from './hal-resource/service/cache.service';
import { HalResourceService } from './service/hal-resource.service';
import { ResourceHttpService } from './hal-resource/service/resource-http.service';
import { PagedResourceCollectionHttpService } from './hal-resource/service/paged-resource-collection-http.service';
import { ResourceCollectionHttpService } from './hal-resource/service/resource-collection-http.service';
import { CommonHttpService } from './hal-resource/service/common-http.service';

export { HalConfiguration } from './config/hal-configuration.interface';
export { HalConfigurationService } from './config/hal-configuration.service';
export { Resource } from './hal-resource/model/resource';
export { EmbeddedResource } from './hal-resource/model/embedded-resource';
export { ResourceCollection } from './hal-resource/model/resource-collection';
export { PagedResourceCollection } from './hal-resource/model/paged-resource-collection';
export { SortOrder, Include, HttpMethod } from './hal-resource/model/declarations';
export { HalResourceOperation } from './service/hal-resource-operation';
export { HalResourceService } from './service/hal-resource.service';

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
    CommonHttpService,
    ResourceHttpService,
    ResourceCollectionHttpService,
    PagedResourceCollectionHttpService
  ],
  exports: [HttpClientModule]
})
export class NgxHalClientModule {
  static forRoot(): ModuleWithProviders<NgxHalClientModule> {
    return {
      ngModule: NgxHalClientModule,
      providers: [
        HttpClient,
        HalConfigurationService
      ]
    };
  }
}
