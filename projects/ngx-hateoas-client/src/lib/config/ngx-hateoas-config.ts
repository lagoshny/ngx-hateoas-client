import { InjectionToken } from '@angular/core';
import { HateoasConfiguration } from './hateoas-configuration.interface';

export const NGX_HATEOAS_CONFIG = new InjectionToken<HateoasConfiguration>('NGX_HATEOAS_CONFIG');
