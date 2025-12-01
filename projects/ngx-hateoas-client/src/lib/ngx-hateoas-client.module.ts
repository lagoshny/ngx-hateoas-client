import {ModuleWithProviders, NgModule} from '@angular/core';
import {NgxHateoasClientConfigurationService} from './config/ngx-hateoas-client-configuration.service';

@NgModule()
export class NgxHateoasClientModule {

  /**
   * NgModule style lib configuration.
   *
   * @deprecated: configure lib using standalone provider: [provideNgxHateoasClient].
   * How to configure it now see <a href="https://github.com/lagoshny/ngx-hateoas-client?tab=readme-ov-file#migrate-to-standalone">here</a>.
   *
   * Warning: this configuration method will be removed in the next lib releases.
   */
  static forRoot(): ModuleWithProviders<NgxHateoasClientModule> {
    return {
      ngModule: NgxHateoasClientModule
    };
  }

  constructor(config: NgxHateoasClientConfigurationService) {
  }

}
