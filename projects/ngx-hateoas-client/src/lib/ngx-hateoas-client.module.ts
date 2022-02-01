import { ModuleWithProviders, NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { NgxHateoasClientConfigurationService } from './config/ngx-hateoas-client-configuration.service';
import { HateoasResourceService } from './service/external/hateoas-resource.service';
import { ResourceHttpService } from './service/internal/resource-http.service';
import { PagedResourceCollectionHttpService } from './service/internal/paged-resource-collection-http.service';
import { ResourceCollectionHttpService } from './service/internal/resource-collection-http.service';
import { CommonResourceHttpService } from './service/internal/common-resource-http.service';
import { ResourceCacheService } from './service/internal/cache/resource-cache.service';

export { NgxHateoasClientConfigurationService } from './config/ngx-hateoas-client-configuration.service';
export { Resource } from './model/resource/resource';
export { EmbeddedResource } from './model/resource/embedded-resource';
export { ResourceCollection } from './model/resource/resource-collection';
export { PagedResourceCollection } from './model/resource/paged-resource-collection';
export { Sort, SortOrder, Include, HttpMethod, ProjectionRelType } from './model/declarations';
export { HateoasResourceOperation } from './service/external/hateoas-resource-operation';
export { HateoasResourceService } from './service/external/hateoas-resource.service';
export { HateoasResource, HateoasEmbeddedResource, HateoasProjection, ProjectionRel } from './model/decorators';

@NgModule({
  imports: [
    HttpClientModule
  ]
})
export class NgxHateoasClientModule {
  static forRoot(): ModuleWithProviders<NgxHateoasClientModule> {
    return {
      ngModule: NgxHateoasClientModule,
      providers: [
        NgxHateoasClientConfigurationService,
        CommonResourceHttpService,
        ResourceHttpService,
        ResourceCollectionHttpService,
        PagedResourceCollectionHttpService,
        HateoasResourceService,
        ResourceCacheService
      ]
    };
  }

  constructor(config: NgxHateoasClientConfigurationService) {
  }

}
