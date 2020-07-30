import { Injectable } from '@angular/core';

/**
 * Contains all configuration params associated with HTTP.
 */
@Injectable()
export class HttpConfigService {

  /**
   * {@see HalConfiguration#baseApiUrl}.
   */
  public baseApiUrl: string;

}
