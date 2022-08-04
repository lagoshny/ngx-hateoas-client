import { ModuleWithProviders, NgModule } from '@angular/core';
import { NgxHateoasClientConfigurationService } from './config/ngx-hateoas-client-configuration.service';
import { HateoasResourceService } from './service/external/hateoas-resource.service';

export { NgxHateoasClientConfigurationService } from './config/ngx-hateoas-client-configuration.service';
export { Resource } from './model/resource/resource';
export { EmbeddedResource } from './model/resource/embedded-resource';
export { ResourceCollection } from './model/resource/resource-collection';
export { PagedResourceCollection } from './model/resource/paged-resource-collection';
export { Sort, SortOrder, Include, HttpMethod, ProjectionRelType, GetOption, PagedGetOption, RequestOption, RequestParam } from './model/declarations';
export { HateoasResourceOperation } from './service/external/hateoas-resource-operation';
export { HateoasResourceService } from './service/external/hateoas-resource.service';
export { HateoasResource, HateoasEmbeddedResource, HateoasProjection, ProjectionRel, JsonProperty } from './model/decorators';

@NgModule()
export class NgxHateoasClientModule {
  static forRoot(): ModuleWithProviders<NgxHateoasClientModule> {
    return {
      ngModule: NgxHateoasClientModule
    };
  }

  constructor(config: NgxHateoasClientConfigurationService) {
  }

}
