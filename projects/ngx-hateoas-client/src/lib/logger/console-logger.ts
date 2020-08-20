import * as _ from 'lodash';

/* tslint:disable:variable-name no-console */
export class ConsoleLogger {

  private static _enabled = false;

  public static info(message?: any, ...optionalParams: any[]): void {
    if (!this.enabled) {
      return;
    }
    console.info(message, ...optionalParams);
  }

  public static error(message?: any, ...optionalParams: any[]): void {
    if (!this.enabled) {
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
    if (!this.enabled) {
      return;
    }

    let msg = `%c${ message }\n`;
    const color = [
      'color: #201AB3;'
    ];

    if (!_.isEmpty(params)) {
      for (const [key, value] of Object.entries(params)) {
        if (key.toLowerCase() === 'result') {
          msg += `%c${ _.capitalize(key) }: %c${ value }\n`;
          color.push('color: #3AA6D0;', 'color: #00BA45;');
        } else {
          msg += `%c${ _.camelCase(key) }: %c${ value }\n`;
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
    if (!this.enabled) {
      return;
    }

    let msg = `%c${ resourceName } %c${ message }\n`;
    const color = [
      'color: #DA005C;',
      'color: #201AB3;'
    ];

    if (!_.isEmpty(params)) {
      for (const [key, value] of Object.entries(params)) {
        if (key.toLowerCase() === 'result') {
          msg += `%c${ _.capitalize(key) }: %c${ value }\n`;
          color.push('color: #3AA6D0;', 'color: #00BA45;');
        } else {
          msg += `%c${ _.camelCase(key) }: %c${ value }\n`;
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
    if (!this.enabled) {
      return;
    }

    let msg = `%c${ message }\n`;
    const color = [
      'color: #df004f;'
    ];

    if (!_.isEmpty(params)) {
      for (const [key, value] of Object.entries(params)) {
        if (key.toLowerCase() === 'error') {
          msg += `%c${ _.capitalize(key) }: %c${ value }\n`;
          color.push('color: #df004f;', 'color: #ff0000;');
        } else {
          msg += `%c${ _.capitalize(key) }: %c${ value }\n`;
          color.push('color: #3AA6D0;', 'color: #000;');
        }
      }
    }

    ConsoleLogger.error(msg, ...color);
  }

  static set enabled(value: boolean) {
    this._enabled = value;
  }

  static get enabled(): boolean {
    return this._enabled;
  }

}
