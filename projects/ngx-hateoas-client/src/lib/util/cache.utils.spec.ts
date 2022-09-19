import { LibConfig } from '../config/lib-config';
import { CacheUtils } from './cache.utils';
import { CacheMode } from '../model/declarations';

describe('CacheUtils', () => {

  it('should NOT USE cache when cache enabled is FALSE', () => {
    spyOn(LibConfig, 'getConfig').and.returnValue({
      ...LibConfig.DEFAULT_CONFIG,
      cache: {
        enabled: false
      }
    });

    const result = CacheUtils.shouldUseCache(true);

    expect(result).toBeFalse();
  });

  it('should NOT USE cache when cache enabled is FALSE and mode is ALWAYS', () => {
    spyOn(LibConfig, 'getConfig').and.returnValue({
      ...LibConfig.DEFAULT_CONFIG,
      cache: {
        enabled: false,
        mode: CacheMode.ALWAYS
      }
    });

    const result = CacheUtils.shouldUseCache(true);

    expect(result).toBeFalse();
  });

  it('should NOT USE cache when cache enabled is FALSE and mode is ON_DEMAND', () => {
    spyOn(LibConfig, 'getConfig').and.returnValue({
      ...LibConfig.DEFAULT_CONFIG,
      cache: {
        enabled: false,
        mode: CacheMode.ON_DEMAND
      }
    });

    const result = CacheUtils.shouldUseCache(true);

    expect(result).toBeFalse();
  });

  it('should USE cache when mode is ALWAYS and useCache is TRUE', () => {
    spyOn(LibConfig, 'getConfig').and.returnValue({
      ...LibConfig.DEFAULT_CONFIG,
      cache: {
        enabled: true,
        mode: CacheMode.ALWAYS
      }
    });

    const result = CacheUtils.shouldUseCache(true);

    expect(result).toBeTrue();
  });

  it('should USE cache when mode is ALWAYS and useCache is UNDEFINED', () => {
    spyOn(LibConfig, 'getConfig').and.returnValue({
      ...LibConfig.DEFAULT_CONFIG,
      cache: {
        enabled: true,
        mode: CacheMode.ALWAYS
      }
    });

    const result = CacheUtils.shouldUseCache(undefined);

    expect(result).toBeTrue();
  });

  it('should USE cache when mode is ALWAYS and useCache is NULL', () => {
    spyOn(LibConfig, 'getConfig').and.returnValue({
      ...LibConfig.DEFAULT_CONFIG,
      cache: {
        enabled: true,
        mode: CacheMode.ALWAYS
      }
    });

    const result = CacheUtils.shouldUseCache(null);

    expect(result).toBeTrue();
  });

  it('should NOT USE cache when mode is ALWAYS and useCache is FALSE', () => {
    spyOn(LibConfig, 'getConfig').and.returnValue({
      ...LibConfig.DEFAULT_CONFIG,
      cache: {
        enabled: true,
        mode: CacheMode.ALWAYS
      }
    });

    const result = CacheUtils.shouldUseCache(false);

    expect(result).toBeFalse();
  });

  it('should NOT USE cache when mode is ON_DEMAND and useCache is FALSE', () => {
    spyOn(LibConfig, 'getConfig').and.returnValue({
      ...LibConfig.DEFAULT_CONFIG,
      cache: {
        enabled: true,
        mode: CacheMode.ON_DEMAND
      }
    });

    const result = CacheUtils.shouldUseCache(false);

    expect(result).toBeFalse();
  });

  it('should NOT USE cache when mode is ON_DEMAND and useCache is UNDEFINED', () => {
    spyOn(LibConfig, 'getConfig').and.returnValue({
      ...LibConfig.DEFAULT_CONFIG,
      cache: {
        enabled: true,
        mode: CacheMode.ON_DEMAND
      }
    });

    const result = CacheUtils.shouldUseCache(undefined);

    expect(result).toBeFalse();
  });

  it('should NOT USE cache when mode is ON_DEMAND and useCache is NULL', () => {
    spyOn(LibConfig, 'getConfig').and.returnValue({
      ...LibConfig.DEFAULT_CONFIG,
      cache: {
        enabled: true,
        mode: CacheMode.ON_DEMAND
      }
    });

    const result = CacheUtils.shouldUseCache(null);

    expect(result).toBeFalse();
  });

  it('should USE cache when mode is ON_DEMAND and useCache is TRUE', () => {
    spyOn(LibConfig, 'getConfig').and.returnValue({
      ...LibConfig.DEFAULT_CONFIG,
      cache: {
        enabled: true,
        mode: CacheMode.ON_DEMAND
      }
    });

    const result = CacheUtils.shouldUseCache(true);

    expect(result).toBeTrue();
  });

});
