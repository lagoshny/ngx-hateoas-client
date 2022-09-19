import { LibConfig } from '../config/lib-config';
import { CacheMode } from '../model/declarations';
import { isBoolean } from 'lodash-es';

export class CacheUtils {

  /**
   * Checks that cache is enabled and applying used cached mode.
   *
   * When mode is CacheMode.ALWAYS then only when passed param useCache === false will not be using cache.
   * When mode is CacheMode.ON_DEMAND then only when passed param useCache === true be using cache.
   *
   * @param useCache desired param can be undefined when caller has not passed it
   */
  public static shouldUseCache(useCache: boolean): boolean {
    return LibConfig.getConfig().cache.enabled &&
      ((CacheMode.ALWAYS === LibConfig.getConfig().cache.mode && (!isBoolean(useCache) || useCache))
      || (CacheMode.ON_DEMAND === LibConfig.getConfig().cache.mode && isBoolean(useCache) && useCache));
  }

}
