import { LibConfig } from '../config/lib-config';
import { camelCase, capitalize, isEmpty } from 'lodash-es';

/* tslint:disable:variable-name no-console */
export class ConsoleLogger {

  public static info(message?: any, ...optionalParams: any[]): void {
    if (!LibConfig.config.logs.verboseLogs && !LibConfig.config.isProduction) {
      return;
    }
    console.info(message, ...optionalParams);
  }

  public static warn(message?: any, ...optionalParams: any[]): void {
    if (LibConfig.config.isProduction) {
      return;
    }
    console.warn(message, ...optionalParams);
  }

  public static error(message?: any, ...optionalParams: any[]): void {
    if (LibConfig.config.isProduction) {
      return;
    }
    console.error(message, ...optionalParams);
  }

  /**
   * Log info messages in pretty format.
   *
   * @param message log message
   * @param params additional params for verbose log
   */
  public static prettyInfo(message: string, params?: object): void {
    if (!LibConfig.config.logs.verboseLogs && !LibConfig.config.isProduction) {
      return;
    }

    let msg = `%c${ message }\n`;
    const color = [
      'color: #201AB3;'
    ];

    if (!isEmpty(params)) {
      for (const [key, value] of Object.entries(params)) {
        if (key.toLowerCase() === 'result') {
          msg += `%c${ capitalize(key) }: %c${ value }\n`;
          color.push('color: #3AA6D0;', 'color: #00BA45;');
        } else {
          msg += `%c${ camelCase(key) }: %c${ value }\n`;
          color.push('color: #3AA6D0;', 'color: default;');
        }
      }
    }

    ConsoleLogger.info(msg, ...color);
  }

  /**
   * Log resource info messages in pretty format.
   *
   * @param message log message
   * @param resourceName resource name
   * @param params additional params for verbose log
   */
  public static resourcePrettyInfo(resourceName: string, message: string, params?: object): void {
    if (!LibConfig.config.logs.verboseLogs && !LibConfig.config.isProduction) {
      return;
    }

    let msg = `%c${ resourceName } %c${ message }\n`;
    const color = [
      'color: #DA005C;',
      'color: #201AB3;'
    ];

    if (!isEmpty(params)) {
      for (const [key, value] of Object.entries(params)) {
        if (key.toLowerCase() === 'result') {
          msg += `%c${ capitalize(key) }: %c${ value }\n`;
          color.push('color: #3AA6D0;', 'color: #00BA45;');
        } else {
          msg += `%c${ camelCase(key) }: %c${ value }\n`;
          color.push('color: #3AA6D0;', 'color: default;');
        }
      }
    }

    ConsoleLogger.info(msg, ...color);
  }

  /**
   * Log error messages in pretty format.
   *
   * @param message log message
   * @param params additional params for verbose log
   */
  public static prettyError(message: string, params?: object): void {
    if (LibConfig.config.isProduction) {
      return;
    }

    let msg = `%c${ message }\n`;
    const color = [
      'color: #df004f;'
    ];

    if (!isEmpty(params)) {
      for (const [key, value] of Object.entries(params)) {
        if (key.toLowerCase() === 'error') {
          msg += `%c${ capitalize(key) }: %c${ value }\n`;
          color.push('color: #df004f;', 'color: #ff0000;');
        } else {
          msg += `%c${ capitalize(key) }: %c${ value }\n`;
          color.push('color: #3AA6D0;', 'color: #000;');
        }
      }
    }

    ConsoleLogger.error(msg, ...color);
  }

  /**
   * Log warn messages in pretty format.
   *
   * @param message log message
   * @param params additional params for verbose log
   */
  public static prettyWarn(message: string, params?: object): void {
    if (LibConfig.config.isProduction) {
      return;
    }

    let msg = `%c${ message }\n`;
    const color = [
      'color: #ffbe00;'
    ];

    if (!isEmpty(params)) {
      for (const [key, value] of Object.entries(params)) {
        msg += `%c${ capitalize(key) }: %c${ value }\n`;
        color.push('color: #3AA6D0;', 'color: #000;');
      }
    }

    ConsoleLogger.warn(msg, ...color);
  }

}
