import { ConsoleLogger } from './console-logger';
import { Stage } from './stage.enum';
import { LibConfig } from '../config/lib-config';
import { capitalize, isEmpty, isNil, isObject, isString } from 'lodash-es';

/**
 * Simplify logger calls.
 */

/* tslint:disable:no-string-literal */
export class StageLogger {

  public static resourceBeginLog(resource: object | string, method: string, params?: object): void {
    if (!LibConfig.config.logs.verboseLogs && !LibConfig.config.isProduction) {
      return;
    }
    const paramToLog = this.prepareParams(params);

    let resourceName;
    if (isString(resource)) {
      resourceName = resource;
    } else if (!isNil(resource)) {
      resourceName = '__resourceName__' in resource ? resource['__resourceName__'] : 'EmbeddedResource';
    } else {
      resourceName = 'NOT_DEFINED_RESOURCE_NAME';
    }
    ConsoleLogger.resourcePrettyInfo(`${ capitalize(resourceName) } ${ method }`,
      `STAGE ${ Stage.BEGIN }`, paramToLog);
  }

  public static resourceEndLog(resource: object | string, method: string, params: object): void {
    if (!LibConfig.config.logs.verboseLogs && !LibConfig.config.isProduction) {
      return;
    }
    const paramToLog = this.prepareParams(params);

    let resourceName;
    if (isString(resource)) {
      resourceName = resource;
    } else {
      resourceName = '__resourceName__' in resource ? resource['__resourceName__'] : 'EmbeddedResource';
    }

    ConsoleLogger.resourcePrettyInfo(`${ capitalize(resourceName) } ${ method }`,
      `STAGE ${ Stage.END }`, paramToLog);
  }

  public static stageLog(stage: Stage, params: object): void {
    if (!LibConfig.config.logs.verboseLogs && !LibConfig.config.isProduction) {
      return;
    }
    const paramToLog = this.prepareParams(params);

    ConsoleLogger.prettyInfo(`STAGE ${ stage }`, paramToLog);
  }

  public static stageErrorLog(stage: Stage, params: object): void {
    if (LibConfig.config.isProduction) {
      return;
    }
    const paramToLog = this.prepareParams(params);

    ConsoleLogger.prettyError(`STAGE ${ stage }`, paramToLog);
  }

  public static stageWarnLog(stage: Stage, params: object): void {
    if (LibConfig.config.isProduction) {
      return;
    }
    const paramToLog = this.prepareParams(params);

    ConsoleLogger.prettyWarn(`STAGE ${ stage }`, paramToLog);
  }

  private static prepareParams(params: object) {
    const paramToLog = {};
    if (isEmpty(params)) {
      return paramToLog;
    }
    for (const [key, value] of Object.entries(params)) {
      if (!params.hasOwnProperty(key)) {
        continue;
      }
      if (isObject(value)) {
        paramToLog[key] = JSON.stringify(value, null, 2);
      } else {
        paramToLog[key] = value;
      }
    }
    return paramToLog;
  }
}
