import { describe, expect, it, vi } from 'vitest';
import { LibConfig } from '../config/lib-config';
import { CacheUtils } from './cache.utils';
import { CacheMode } from '../model/declarations';

describe('CacheUtils', () => {

  it('should NOT USE cache when cache enabled is FALSE', () => {
    vi.spyOn(LibConfig, 'getConfig').mockReturnValue({
      ...LibConfig.DEFAULT_CONFIG,
      cache: {
        ...LibConfig.DEFAULT_CONFIG.cache,
        enabled: false
      }
    });

    const result = CacheUtils.shouldUseCache(true);

    expect(result).toBe(false);
  });

  it('should NOT USE cache when cache enabled is FALSE and mode is ALWAYS', () => {
    vi.spyOn(LibConfig, 'getConfig').mockReturnValue({
      ...LibConfig.DEFAULT_CONFIG,
      cache: {
        ...LibConfig.DEFAULT_CONFIG.cache,
        enabled: false,
        mode: CacheMode.ALWAYS
      }
    });

    const result = CacheUtils.shouldUseCache(true);

    expect(result).toBe(false);
  });

  it('should NOT USE cache when cache enabled is FALSE and mode is ON_DEMAND', () => {
    vi.spyOn(LibConfig, 'getConfig').mockReturnValue({
      ...LibConfig.DEFAULT_CONFIG,
      cache: {
        ...LibConfig.DEFAULT_CONFIG.cache,
        enabled: false,
        mode: CacheMode.ON_DEMAND
      }
    });

    const result = CacheUtils.shouldUseCache(true);

    expect(result).toBe(false);
  });

  it('should USE cache when mode is ALWAYS and useCache is TRUE', () => {
    vi.spyOn(LibConfig, 'getConfig').mockReturnValue({
      ...LibConfig.DEFAULT_CONFIG,
      cache: {
        ...LibConfig.DEFAULT_CONFIG.cache,
        enabled: true,
        mode: CacheMode.ALWAYS
      }
    });

    const result = CacheUtils.shouldUseCache(true);

    expect(result).toBe(true);
  });

  it('should USE cache when mode is ALWAYS and useCache is UNDEFINED', () => {
    vi.spyOn(LibConfig, 'getConfig').mockReturnValue({
      ...LibConfig.DEFAULT_CONFIG,
      cache: {
        ...LibConfig.DEFAULT_CONFIG.cache,
        enabled: true,
        mode: CacheMode.ALWAYS
      }
    });

    const result = CacheUtils.shouldUseCache(undefined);

    expect(result).toBe(true);
  });

  it('should NOT USE cache when mode is ALWAYS and useCache is FALSE', () => {
    vi.spyOn(LibConfig, 'getConfig').mockReturnValue({
      ...LibConfig.DEFAULT_CONFIG,
      cache: {
        ...LibConfig.DEFAULT_CONFIG.cache,
        enabled: true,
        mode: CacheMode.ALWAYS
      }
    });

    const result = CacheUtils.shouldUseCache(false);

    expect(result).toBe(false);
  });

  it('should NOT USE cache when mode is ON_DEMAND and useCache is FALSE', () => {
    vi.spyOn(LibConfig, 'getConfig').mockReturnValue({
      ...LibConfig.DEFAULT_CONFIG,
      cache: {
        ...LibConfig.DEFAULT_CONFIG.cache,
        enabled: true,
        mode: CacheMode.ON_DEMAND
      }
    });

    const result = CacheUtils.shouldUseCache(false);

    expect(result).toBe(false);
  });

  it('should NOT USE cache when mode is ON_DEMAND and useCache is UNDEFINED', () => {
    vi.spyOn(LibConfig, 'getConfig').mockReturnValue({
      ...LibConfig.DEFAULT_CONFIG,
      cache: {
        ...LibConfig.DEFAULT_CONFIG.cache,
        enabled: true,
        mode: CacheMode.ON_DEMAND
      }
    });

    const result = CacheUtils.shouldUseCache(undefined);

    expect(result).toBe(false);
  });

  it('should USE cache when mode is ON_DEMAND and useCache is TRUE', () => {
    vi.spyOn(LibConfig, 'getConfig').mockReturnValue({
      ...LibConfig.DEFAULT_CONFIG,
      cache: {
        ...LibConfig.DEFAULT_CONFIG.cache,
        enabled: true,
        mode: CacheMode.ON_DEMAND,
      }
    });

    const result = CacheUtils.shouldUseCache(true);

    expect(result).toBe(true);
  });

});
