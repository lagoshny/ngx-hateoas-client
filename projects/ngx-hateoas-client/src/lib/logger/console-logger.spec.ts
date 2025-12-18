import { describe, expect, it, vi } from "vitest";
/* tslint:disable:no-console */
import { ConsoleLogger } from './console-logger';
import { LibConfig } from '../config/lib-config';

describe('ConsoleLogger', () => {

    describe('INFO', () => {
        it('should print logs when production is FALSE and verboseLogs is TRUE', () => {
            vi.spyOn(LibConfig, 'getConfig').mockReturnValue({
                ...LibConfig.DEFAULT_CONFIG,
                isProduction: false,
                logs: {
                    verboseLogs: true
                }
            });
            console.info = vi.fn();
            const msg = 'Test message';

            ConsoleLogger.info(msg);

            expect(console.info).toHaveBeenCalledTimes(1);

            expect(console.info).toHaveBeenCalledWith(msg);
        });

        it('should print logs when production and verboseLogs are TRUE', () => {
            vi.spyOn(LibConfig, 'getConfig').mockReturnValue({
                ...LibConfig.DEFAULT_CONFIG,
                isProduction: true,
                logs: {
                    verboseLogs: true
                }
            });
            console.info = vi.fn();
            const msg = 'Test message';

            ConsoleLogger.info(msg);

            expect(console.info).toHaveBeenCalledTimes(1);

            expect(console.info).toHaveBeenCalledWith(msg);
        });

        it('should NOT print logs when verboseLogs is FALSE', () => {
            vi.spyOn(LibConfig, 'getConfig').mockReturnValue({
                ...LibConfig.DEFAULT_CONFIG,
                logs: {
                    verboseLogs: false
                }
            });
            console.info = vi.fn();
            const msg = 'Test message';

            ConsoleLogger.info(msg);

            expect(console.info).not.toHaveBeenCalled();
        });

        it('should NOT print logs when verboseLogs is FALSE and production is TRUE', () => {
            vi.spyOn(LibConfig, 'getConfig').mockReturnValue({
                ...LibConfig.DEFAULT_CONFIG,
                isProduction: true,
                logs: {
                    verboseLogs: false,
                }
            });
            console.info = vi.fn();
            const msg = 'Test message';

            ConsoleLogger.info(msg);

            expect(console.info).not.toHaveBeenCalled();
        });

        it('should NOT print logs when production and verboseLogs are FALSE', () => {
            vi.spyOn(LibConfig, 'getConfig').mockReturnValue({
                ...LibConfig.DEFAULT_CONFIG,
                isProduction: false,
                logs: {
                    verboseLogs: false
                }
            });
            console.info = vi.fn();
            const msg = 'Test message';

            ConsoleLogger.info(msg);

            expect(console.info).not.toHaveBeenCalled();
        });
    });

    describe('WARN', () => {
        it('should print logs when production is FALSE and verboseLogs is TRUE', () => {
            vi.spyOn(LibConfig, 'getConfig').mockReturnValue({
                ...LibConfig.DEFAULT_CONFIG,
                isProduction: false,
                logs: {
                    verboseLogs: true
                }
            });
            console.warn = vi.fn();
            const msg = 'Test message';

            ConsoleLogger.warn(msg);

            expect(console.warn).toHaveBeenCalledTimes(1);

            expect(console.warn).toHaveBeenCalledWith(msg);
        });

        it('should print logs when production and verboseLogs are TRUE', () => {
            vi.spyOn(LibConfig, 'getConfig').mockReturnValue({
                ...LibConfig.DEFAULT_CONFIG,
                isProduction: true,
                logs: {
                    verboseLogs: true
                }
            });
            console.warn = vi.fn();
            const msg = 'Test message';

            ConsoleLogger.warn(msg);

            expect(console.warn).toHaveBeenCalledTimes(1);

            expect(console.warn).toHaveBeenCalledWith(msg);
        });

        it('should NOT print logs when verboseLogs is FALSE', () => {
            vi.spyOn(LibConfig, 'getConfig').mockReturnValue({
                ...LibConfig.DEFAULT_CONFIG,
                logs: {
                    verboseLogs: false
                }
            });
            console.warn = vi.fn();
            const msg = 'Test message';

            ConsoleLogger.warn(msg);

            expect(console.warn).not.toHaveBeenCalled();
        });

        it('should NOT print logs when verboseLogs is FALSE and production is TRUE', () => {
            vi.spyOn(LibConfig, 'getConfig').mockReturnValue({
                ...LibConfig.DEFAULT_CONFIG,
                isProduction: true,
                logs: {
                    verboseLogs: false,
                }
            });
            console.warn = vi.fn();
            const msg = 'Test message';

            ConsoleLogger.warn(msg);

            expect(console.warn).not.toHaveBeenCalled();
        });

        it('should NOT print logs when production and verboseLogs are FALSE', () => {
            vi.spyOn(LibConfig, 'getConfig').mockReturnValue({
                ...LibConfig.DEFAULT_CONFIG,
                isProduction: false,
                logs: {
                    verboseLogs: false
                }
            });
            console.warn = vi.fn();
            const msg = 'Test message';

            ConsoleLogger.warn(msg);

            expect(console.warn).not.toHaveBeenCalled();
        });
    });


    describe('ERROR', () => {
        it('should print logs when production is FALSE and verboseLogs is TRUE', () => {
            vi.spyOn(LibConfig, 'getConfig').mockReturnValue({
                ...LibConfig.DEFAULT_CONFIG,
                isProduction: false,
                logs: {
                    verboseLogs: true
                }
            });
            console.error = vi.fn();
            const msg = 'Test message';

            ConsoleLogger.error(msg);

            expect(console.error).toHaveBeenCalledTimes(1);

            expect(console.error).toHaveBeenCalledWith(msg);
        });

        it('should print logs when production and verboseLogs are TRUE', () => {
            vi.spyOn(LibConfig, 'getConfig').mockReturnValue({
                ...LibConfig.DEFAULT_CONFIG,
                isProduction: true,
                logs: {
                    verboseLogs: true
                }
            });
            console.error = vi.fn();
            const msg = 'Test message';

            ConsoleLogger.error(msg);

            expect(console.error).toHaveBeenCalledTimes(1);

            expect(console.error).toHaveBeenCalledWith(msg);
        });

        it('should NOT print logs when verboseLogs is FALSE', () => {
            vi.spyOn(LibConfig, 'getConfig').mockReturnValue({
                ...LibConfig.DEFAULT_CONFIG,
                logs: {
                    verboseLogs: false
                }
            });
            console.error = vi.fn();
            const msg = 'Test message';

            ConsoleLogger.error(msg);

            expect(console.error).not.toHaveBeenCalled();
        });

        it('should NOT print logs when verboseLogs is FALSE and production is TRUE', () => {
            vi.spyOn(LibConfig, 'getConfig').mockReturnValue({
                ...LibConfig.DEFAULT_CONFIG,
                isProduction: true,
                logs: {
                    verboseLogs: false,
                }
            });
            console.error = vi.fn();
            const msg = 'Test message';

            ConsoleLogger.error(msg);

            expect(console.error).not.toHaveBeenCalled();
        });

        it('should NOT print logs when production and verboseLogs are FALSE', () => {
            vi.spyOn(LibConfig, 'getConfig').mockReturnValue({
                ...LibConfig.DEFAULT_CONFIG,
                isProduction: false,
                logs: {
                    verboseLogs: false
                }
            });
            console.error = vi.fn();
            const msg = 'Test message';

            ConsoleLogger.error(msg);

            expect(console.error).not.toHaveBeenCalled();
        });
    });


});
