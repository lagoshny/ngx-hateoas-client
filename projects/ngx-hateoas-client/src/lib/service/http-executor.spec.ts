import { beforeEach, describe, expect, it, vi } from 'vitest';
import { HttpExecutor } from './http-executor';
import { of } from 'rxjs';
import { rawResource } from '../model/resource/resources.test-utils';
import { LibConfig } from '../config/lib-config';

describe('HttpExecutor', () => {
    let httpExecutor: HttpExecutor;
    let httpClientSpy: any;
    let cacheServiceSpy: any;

    beforeEach(() => {
        httpClientSpy = {
            get: vi.fn(),
            post: vi.fn(),
            patch: vi.fn(),
            put: vi.fn(),
            delete: vi.fn()
        };

        cacheServiceSpy = {
            putResource: vi.fn(),
            getResource: vi.fn(),
            evictResource: vi.fn()
        };

        httpExecutor = new HttpExecutor(httpClientSpy, cacheServiceSpy);
    });

    it('GET should throw error when passed url is empty', () => {
        expect(() => httpExecutor.getHttp(''))
            .toThrowError(`Passed param(s) 'url = ' is not valid`);
    });

    it('GET should throw error when passed url is null', () => {
        expect(() => httpExecutor.getHttp(null))
            .toThrowError(`Passed param(s) 'url = null' is not valid`);
    });

    it('GET should throw error when passed url is undefined', () => {
        expect(() => httpExecutor.getHttp(undefined))
            .toThrowError(`Passed param(s) 'url = undefined' is not valid`);
    });

    it('GET should doing request when cache is disable', () => {
        vi.spyOn(LibConfig, 'getConfig').mockReturnValue(LibConfig.mergeConfigs({
            ...LibConfig.DEFAULT_CONFIG,
            cache: {
                enabled: true
            }
        }));
        httpClientSpy.get.mockReturnValue(of({}));
        httpExecutor.getHttp('any').subscribe(() => {
            expect(vi.mocked(httpClientSpy.get).mock.calls.length).toBe(1);
        });
    });

    it('GET should doing request when useCache is false but cache is enabled', () => {
        vi.spyOn(LibConfig, 'getConfig').mockReturnValue(LibConfig.mergeConfigs({
            ...LibConfig.DEFAULT_CONFIG,
            cache: {
                enabled: true
            }
        }));
        httpClientSpy.get.mockReturnValue(of({}));
        httpExecutor.getHttp('any', null, false).subscribe(() => {
            expect(vi.mocked(httpClientSpy.get).mock.calls.length).toBe(1);
        });
    });

    it('GET should fetch value from cache when cache is enabled', () => {
        vi.spyOn(LibConfig, 'getConfig').mockReturnValue(LibConfig.mergeConfigs({
            ...LibConfig.DEFAULT_CONFIG,
            cache: {
                enabled: true
            }
        }));
        cacheServiceSpy.getResource.mockReturnValue(of({}));

        httpExecutor.getHttp('any').subscribe(() => {
            expect(vi.mocked(cacheServiceSpy.getResource).mock.calls.length).toBe(1);
            expect(vi.mocked(httpClientSpy.get).mock.calls.length).toBe(0);
        });
    });

    it('GET should doing request when cache has not value', () => {
        vi.spyOn(LibConfig, 'getConfig').mockReturnValue(LibConfig.mergeConfigs({
            ...LibConfig.DEFAULT_CONFIG,
            cache: {
                enabled: true
            }
        }));
        httpClientSpy.get.mockReturnValue(of({}));
        cacheServiceSpy.getResource.mockReturnValue(null);

        httpExecutor.getHttp('any').subscribe(() => {
            expect(vi.mocked(cacheServiceSpy.getResource).mock.calls.length).toBe(1);
            expect(vi.mocked(httpClientSpy.get).mock.calls.length).toBe(1);
        });
    });

    it('GET should put request result to the cache when cache is enabled', () => {
        vi.spyOn(LibConfig, 'getConfig').mockReturnValue(LibConfig.mergeConfigs({
            ...LibConfig.DEFAULT_CONFIG,
            cache: {
                enabled: true
            }
        }));
        httpClientSpy.get.mockReturnValue(of(rawResource));

        httpExecutor.getHttp('any').subscribe(() => {
            expect(vi.mocked(httpClientSpy.get).mock.calls.length).toBe(1);
            expect(vi.mocked(cacheServiceSpy.putResource).mock.calls.length).toBe(1);
        });
    });

    it('GET should NOT put request result to the cache when result is not resource', () => {
        vi.spyOn(LibConfig, 'getConfig').mockReturnValue(LibConfig.mergeConfigs({
            ...LibConfig.DEFAULT_CONFIG,
            cache: {
                enabled: true
            }
        }));
        httpClientSpy.get.mockReturnValue(of({}));

        httpExecutor.getHttp('any').subscribe(() => {
            expect(vi.mocked(httpClientSpy.get).mock.calls.length).toBe(1);
            expect(vi.mocked(cacheServiceSpy.putResource).mock.calls.length).toBe(0);
        });
    });

    it('GET should NOT put request result to the cache when cache is disabled', () => {
        vi.spyOn(LibConfig, 'getConfig').mockReturnValue(LibConfig.mergeConfigs({
            ...LibConfig.DEFAULT_CONFIG,
            cache: {
                enabled: false
            }
        }));
        httpClientSpy.get.mockReturnValue(of({}));

        httpExecutor.getHttp('any').subscribe(() => {
            expect(vi.mocked(httpClientSpy.get).mock.calls.length).toBe(1);
            expect(vi.mocked(cacheServiceSpy.putResource).mock.calls.length).toBe(0);
        });
    });

    it('GET should NOT put request result to the cache when pass useCache = false', () => {
        vi.spyOn(LibConfig, 'getConfig').mockReturnValue(LibConfig.mergeConfigs({
            ...LibConfig.DEFAULT_CONFIG,
            cache: {
                enabled: true
            }
        }));
        httpClientSpy.get.mockReturnValue(of({}));

        httpExecutor.getHttp('any', null, false).subscribe(() => {
            expect(vi.mocked(httpClientSpy.get).mock.calls.length).toBe(1);
            expect(vi.mocked(cacheServiceSpy.putResource).mock.calls.length).toBe(0);
        });
    });

    it('POST should throw error when passed url is empty', () => {
        expect(() => httpExecutor.postHttp('', null))
            .toThrowError(`Passed param(s) 'url = ' is not valid`);
    });

    it('POST should throw error when passed url is null', () => {
        expect(() => httpExecutor.postHttp(null, null))
            .toThrowError(`Passed param(s) 'url = null' is not valid`);
    });

    it('POST should throw error when passed url is undefined', () => {
        expect(() => httpExecutor.postHttp(undefined, null))
            .toThrowError(`Passed param(s) 'url = undefined' is not valid`);
    });

    it('POST should evict cache when cache is enabled', () => {
        vi.spyOn(LibConfig, 'getConfig').mockReturnValue(LibConfig.mergeConfigs({
            ...LibConfig.DEFAULT_CONFIG,
            cache: {
                enabled: true
            }
        }));
        httpClientSpy.post.mockReturnValue(of({}));

        httpExecutor.postHttp('any', {}).subscribe(() => {
            expect(vi.mocked(cacheServiceSpy.evictResource).mock.calls.length).toBe(1);
        });
    });

    it('POST should NOT evict cache when cache is disabled', () => {
        vi.spyOn(LibConfig, 'getConfig').mockReturnValue(LibConfig.mergeConfigs({
            ...LibConfig.DEFAULT_CONFIG,
            cache: {
                enabled: false
            }
        }));
        httpClientSpy.post.mockReturnValue(of({}));

        httpExecutor.postHttp('any', {}).subscribe(() => {
            expect(vi.mocked(cacheServiceSpy.evictResource).mock.calls.length).toBe(0);
        });
    });

    it('PATCH should throw error when passed url is empty', () => {
        expect(() => httpExecutor.patchHttp('', null))
            .toThrowError(`Passed param(s) 'url = ' is not valid`);
    });

    it('PATCH should throw error when passed url is null', () => {
        expect(() => httpExecutor.patchHttp(null, null))
            .toThrowError(`Passed param(s) 'url = null' is not valid`);
    });

    it('PATCH should throw error when passed url is undefined', () => {
        expect(() => httpExecutor.patchHttp(undefined, null))
            .toThrowError(`Passed param(s) 'url = undefined' is not valid`);
    });

    it('PATCH should evict cache when cache is enabled', () => {
        vi.spyOn(LibConfig, 'getConfig').mockReturnValue(LibConfig.mergeConfigs({
            ...LibConfig.DEFAULT_CONFIG,
            cache: {
                enabled: true
            }
        }));
        httpClientSpy.patch.mockReturnValue(of({}));

        httpExecutor.patchHttp('any', {}).subscribe(() => {
            expect(vi.mocked(cacheServiceSpy.evictResource).mock.calls.length).toBe(1);
        });
    });

    it('PATCH should NOT evict cache when cache is disabled', () => {
        vi.spyOn(LibConfig, 'getConfig').mockReturnValue(LibConfig.mergeConfigs({
            ...LibConfig.DEFAULT_CONFIG,
            cache: {
                enabled: false
            }
        }));
        httpClientSpy.patch.mockReturnValue(of({}));

        httpExecutor.patchHttp('any', {}).subscribe(() => {
            expect(vi.mocked(cacheServiceSpy.evictResource).mock.calls.length).toBe(0);
        });
    });

    it('PUT should throw error when passed url is empty', () => {
        expect(() => httpExecutor.putHttp('', null))
            .toThrowError(`Passed param(s) 'url = ' is not valid`);
    });

    it('PUT should throw error when passed url is null', () => {
        expect(() => httpExecutor.putHttp(null, null))
            .toThrowError(`Passed param(s) 'url = null' is not valid`);
    });

    it('PUT should throw error when passed url is undefined', () => {
        expect(() => httpExecutor.putHttp(undefined, null))
            .toThrowError(`Passed param(s) 'url = undefined' is not valid`);
    });

    it('PUT should evict cache when cache is enabled', () => {
        vi.spyOn(LibConfig, 'getConfig').mockReturnValue(LibConfig.mergeConfigs({
            ...LibConfig.DEFAULT_CONFIG,
            cache: {
                enabled: true
            }
        }));
        httpClientSpy.put.mockReturnValue(of({}));

        httpExecutor.putHttp('any', {}).subscribe(() => {
            expect(vi.mocked(cacheServiceSpy.evictResource).mock.calls.length).toBe(1);
        });
    });

    it('PUT should NOT evict cache when cache is disabled', () => {
        vi.spyOn(LibConfig, 'getConfig').mockReturnValue(LibConfig.mergeConfigs({
            ...LibConfig.DEFAULT_CONFIG,
            cache: {
                enabled: false
            }
        }));
        httpClientSpy.put.mockReturnValue(of({}));

        httpExecutor.putHttp('any', {}).subscribe(() => {
            expect(vi.mocked(cacheServiceSpy.evictResource).mock.calls.length).toBe(0);
        });
    });

    it('DELETE should throw error when passed url is empty', () => {
        expect(() => httpExecutor.deleteHttp(''))
            .toThrowError(`Passed param(s) 'url = ' is not valid`);
    });

    it('DELETE should throw error when passed url is null', () => {
        expect(() => httpExecutor.deleteHttp(null))
            .toThrowError(`Passed param(s) 'url = null' is not valid`);
    });

    it('DELETE should throw error when passed url is undefined', () => {
        expect(() => httpExecutor.deleteHttp(undefined))
            .toThrowError(`Passed param(s) 'url = undefined' is not valid`);
    });

    it('DELETE should evict cache when cache is enabled', () => {
        vi.spyOn(LibConfig, 'getConfig').mockReturnValue(LibConfig.mergeConfigs({
            ...LibConfig.DEFAULT_CONFIG,
            cache: {
                enabled: true
            }
        }));
        httpClientSpy.delete.mockReturnValue(of({}));

        httpExecutor.deleteHttp('any', {}).subscribe(() => {
            expect(vi.mocked(cacheServiceSpy.evictResource).mock.calls.length).toBe(1);
        });
    });

    it('DELETE should NOT evict cache when cache is disabled', () => {
        vi.spyOn(LibConfig, 'getConfig').mockReturnValue(LibConfig.mergeConfigs({
            ...LibConfig.DEFAULT_CONFIG,
            cache: {
                enabled: false
            }
        }));
        httpClientSpy.delete.mockReturnValue(of({}));

        httpExecutor.deleteHttp('any', {}).subscribe(() => {
            expect(vi.mocked(cacheServiceSpy.evictResource).mock.calls.length).toBe(0);
        });
    });

});
