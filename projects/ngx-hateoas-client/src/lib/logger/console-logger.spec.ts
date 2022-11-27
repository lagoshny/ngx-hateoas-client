/* tslint:disable:no-console */
import { ConsoleLogger } from './console-logger';
import { LibConfig } from '../config/lib-config';

describe('ConsoleLogger', () => {

  describe('INFO', () => {
    it('should print logs when production is FALSE and verboseLogs is TRUE', () => {
      spyOn(LibConfig, 'getConfig').and.returnValue({
        ...LibConfig.DEFAULT_CONFIG,
        isProduction: false,
        logs: {
          verboseLogs: true
        }
      });
      console.info = jasmine.createSpy('info');
      const msg = 'Test message';

      ConsoleLogger.info(msg);

      expect(console.info).toHaveBeenCalledOnceWith(msg);
    });

    it('should print logs when production and verboseLogs are TRUE', () => {
      spyOn(LibConfig, 'getConfig').and.returnValue({
        ...LibConfig.DEFAULT_CONFIG,
        isProduction: true,
        logs: {
          verboseLogs: true
        }
      });
      console.info = jasmine.createSpy('info');
      const msg = 'Test message';

      ConsoleLogger.info(msg);

      expect(console.info).toHaveBeenCalledOnceWith(msg);
    });

    it('should NOT print logs when verboseLogs is FALSE', () => {
      spyOn(LibConfig, 'getConfig').and.returnValue({
        ...LibConfig.DEFAULT_CONFIG,
        logs: {
          verboseLogs: false
        }
      });
      console.info = jasmine.createSpy('info');
      const msg = 'Test message';

      ConsoleLogger.info(msg);

      expect(console.info).not.toHaveBeenCalled();
    });

    it('should NOT print logs when verboseLogs is FALSE and production is TRUE', () => {
      spyOn(LibConfig, 'getConfig').and.returnValue({
        ...LibConfig.DEFAULT_CONFIG,
        isProduction: true,
        logs: {
          verboseLogs: false,
        }
      });
      console.info = jasmine.createSpy('info');
      const msg = 'Test message';

      ConsoleLogger.info(msg);

      expect(console.info).not.toHaveBeenCalled();
    });

    it('should NOT print logs when production and verboseLogs are FALSE', () => {
      spyOn(LibConfig, 'getConfig').and.returnValue({
        ...LibConfig.DEFAULT_CONFIG,
        isProduction: false,
        logs: {
          verboseLogs: false
        }
      });
      console.info = jasmine.createSpy('info');
      const msg = 'Test message';

      ConsoleLogger.info(msg);

      expect(console.info).not.toHaveBeenCalled();
    });
  });

  describe('WARN', () => {
    it('should print logs when production is FALSE and verboseLogs is TRUE', () => {
      spyOn(LibConfig, 'getConfig').and.returnValue({
        ...LibConfig.DEFAULT_CONFIG,
        isProduction: false,
        logs: {
          verboseLogs: true
        }
      });
      console.warn = jasmine.createSpy('warn');
      const msg = 'Test message';

      ConsoleLogger.warn(msg);

      expect(console.warn).toHaveBeenCalledOnceWith(msg);
    });

    it('should print logs when production and verboseLogs are TRUE', () => {
      spyOn(LibConfig, 'getConfig').and.returnValue({
        ...LibConfig.DEFAULT_CONFIG,
        isProduction: true,
        logs: {
          verboseLogs: true
        }
      });
      console.warn = jasmine.createSpy('warn');
      const msg = 'Test message';

      ConsoleLogger.warn(msg);

      expect(console.warn).toHaveBeenCalledOnceWith(msg);
    });

    it('should NOT print logs when verboseLogs is FALSE', () => {
      spyOn(LibConfig, 'getConfig').and.returnValue({
        ...LibConfig.DEFAULT_CONFIG,
        logs: {
          verboseLogs: false
        }
      });
      console.warn = jasmine.createSpy('warn');
      const msg = 'Test message';

      ConsoleLogger.warn(msg);

      expect(console.warn).not.toHaveBeenCalled();
    });

    it('should NOT print logs when verboseLogs is FALSE and production is TRUE', () => {
      spyOn(LibConfig, 'getConfig').and.returnValue({
        ...LibConfig.DEFAULT_CONFIG,
        isProduction: true,
        logs: {
          verboseLogs: false,
        }
      });
      console.warn = jasmine.createSpy('warn');
      const msg = 'Test message';

      ConsoleLogger.warn(msg);

      expect(console.warn).not.toHaveBeenCalled();
    });

    it('should NOT print logs when production and verboseLogs are FALSE', () => {
      spyOn(LibConfig, 'getConfig').and.returnValue({
        ...LibConfig.DEFAULT_CONFIG,
        isProduction: false,
        logs: {
          verboseLogs: false
        }
      });
      console.warn = jasmine.createSpy('warn');
      const msg = 'Test message';

      ConsoleLogger.warn(msg);

      expect(console.warn).not.toHaveBeenCalled();
    });
  });


  describe('ERROR', () => {
    it('should print logs when production is FALSE and verboseLogs is TRUE', () => {
      spyOn(LibConfig, 'getConfig').and.returnValue({
        ...LibConfig.DEFAULT_CONFIG,
        isProduction: false,
        logs: {
          verboseLogs: true
        }
      });
      console.error = jasmine.createSpy('error');
      const msg = 'Test message';

      ConsoleLogger.error(msg);

      expect(console.error).toHaveBeenCalledOnceWith(msg);
    });

    it('should print logs when production and verboseLogs are TRUE', () => {
      spyOn(LibConfig, 'getConfig').and.returnValue({
        ...LibConfig.DEFAULT_CONFIG,
        isProduction: true,
        logs: {
          verboseLogs: true
        }
      });
      console.error = jasmine.createSpy('error');
      const msg = 'Test message';

      ConsoleLogger.error(msg);

      expect(console.error).toHaveBeenCalledOnceWith(msg);
    });

    it('should NOT print logs when verboseLogs is FALSE', () => {
      spyOn(LibConfig, 'getConfig').and.returnValue({
        ...LibConfig.DEFAULT_CONFIG,
        logs: {
          verboseLogs: false
        }
      });
      console.error = jasmine.createSpy('error');
      const msg = 'Test message';

      ConsoleLogger.error(msg);

      expect(console.error).not.toHaveBeenCalled();
    });

    it('should NOT print logs when verboseLogs is FALSE and production is TRUE', () => {
      spyOn(LibConfig, 'getConfig').and.returnValue({
        ...LibConfig.DEFAULT_CONFIG,
        isProduction: true,
        logs: {
          verboseLogs: false,
        }
      });
      console.error = jasmine.createSpy('error');
      const msg = 'Test message';

      ConsoleLogger.error(msg);

      expect(console.error).not.toHaveBeenCalled();
    });

    it('should NOT print logs when production and verboseLogs are FALSE', () => {
      spyOn(LibConfig, 'getConfig').and.returnValue({
        ...LibConfig.DEFAULT_CONFIG,
        isProduction: false,
        logs: {
          verboseLogs: false
        }
      });
      console.error = jasmine.createSpy('error');
      const msg = 'Test message';

      ConsoleLogger.error(msg);

      expect(console.error).not.toHaveBeenCalled();
    });
  });


});
