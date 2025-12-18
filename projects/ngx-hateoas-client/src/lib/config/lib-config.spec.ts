import { describe, expect, it } from "vitest";
import { LibConfig } from './lib-config';

describe('LibConfig', () => {


    it('Should set up passed values for halFormat', () => {
        const mergedConfig = LibConfig.mergeConfigs({
            http: {
                rootUrl: 'http://localhost'
            },
            halFormat: {
                json: {
                    convertEmptyObjectToNull: false
                },
                collections: {
                    embeddedOptional: false
                }
            }
        });

        expect(mergedConfig.halFormat.json.convertEmptyObjectToNull).toEqual(false);
        expect(mergedConfig.halFormat.collections.embeddedOptional).toEqual(false);
    });

    it('Should set up default value for halFormat.collections when passed only halFormat.json', () => {
        const mergedConfig = LibConfig.mergeConfigs({
            http: {
                rootUrl: 'http://localhost'
            },
            halFormat: {
                json: {
                    convertEmptyObjectToNull: false
                }
            }
        });

        expect(mergedConfig.halFormat.json.convertEmptyObjectToNull).toEqual(false);
        expect(mergedConfig.halFormat.collections.embeddedOptional)
            .toEqual(LibConfig.DEFAULT_CONFIG.halFormat.collections.embeddedOptional);
    });

    it('Should set up default value for halFormat.json when passed only halFormat.collections', () => {
        const mergedConfig = LibConfig.mergeConfigs({
            http: {
                rootUrl: 'http://localhost'
            },
            halFormat: {
                collections: {
                    embeddedOptional: true
                }
            }
        });

        expect(mergedConfig.halFormat.collections.embeddedOptional).toEqual(true);
        expect(mergedConfig.halFormat.json.convertEmptyObjectToNull)
            .toEqual(LibConfig.DEFAULT_CONFIG.halFormat.json.convertEmptyObjectToNull);
    });

    it('Should set up default value for halFormat when passed empty object', () => {
        const mergedConfig = LibConfig.mergeConfigs({
            http: {
                rootUrl: 'http://localhost'
            },
            halFormat: {}
        });

        expect(mergedConfig.halFormat.collections.embeddedOptional)
            .toEqual(LibConfig.DEFAULT_CONFIG.halFormat.collections.embeddedOptional);
        expect(mergedConfig.halFormat.json.convertEmptyObjectToNull)
            .toEqual(LibConfig.DEFAULT_CONFIG.halFormat.json.convertEmptyObjectToNull);
    });

    it('Should set up default value for halFormat when it is not passed', () => {
        const mergedConfig = LibConfig.mergeConfigs({
            http: {
                rootUrl: 'http://localhost'
            }
        });

        expect(mergedConfig.halFormat.collections.embeddedOptional)
            .toEqual(LibConfig.DEFAULT_CONFIG.halFormat.collections.embeddedOptional);
        expect(mergedConfig.halFormat.json.convertEmptyObjectToNull)
            .toEqual(LibConfig.DEFAULT_CONFIG.halFormat.json.convertEmptyObjectToNull);
    });

    it('Should set up default value for pagination.page when passed only pagination.size', () => {
        const mergedConfig = LibConfig.mergeConfigs({
            http: {
                rootUrl: 'http://localhost'
            },
            pagination: {
                defaultPage: {
                    size: 10
                }
            }
        });

        expect(mergedConfig.pagination.defaultPage.size)
            .toEqual(10);
        expect(mergedConfig.pagination.defaultPage.page)
            .toEqual(LibConfig.DEFAULT_CONFIG.pagination.defaultPage.page);
    });

    it('Should set up passed values for pagination', () => {
        const mergedConfig = LibConfig.mergeConfigs({
            http: {
                rootUrl: 'http://localhost'
            },
            pagination: {
                defaultPage: {
                    size: 40,
                    page: 10
                }
            }
        });

        expect(mergedConfig.pagination.defaultPage.size)
            .toEqual(40);
        expect(mergedConfig.pagination.defaultPage.page)
            .toEqual(10);
    });

    it('Should set up default value for pagination when it is not passed', () => {
        const mergedConfig = LibConfig.mergeConfigs({
            http: {
                rootUrl: 'http://localhost'
            }
        });

        expect(mergedConfig.pagination.defaultPage)
            .toEqual(LibConfig.DEFAULT_CONFIG.pagination.defaultPage);
    });

});
