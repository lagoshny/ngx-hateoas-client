import { ConsoleLogger } from './console-logger';
import { Stage } from './stage.enum';
import { LibConfig } from '../config/lib-config';
import { capitalize, isEmpty, isNil, isObject, isString } from 'lodash-es';
import { RESOURCE_NAME_PROP } from '../model/declarations';

/**
 * Simplify logger calls.
 */

/* tslint:disable:no-string-literal */
export class StageLogger {

  public static resourceBeginLog(resource: object | string, method: string, params?: object): void {
    if (!LibConfig.getConfig().logs.verboseLogs && !LibConfig.getConfig().isProduction) {
      return;
    }

    let paramToLog: object;
    if (params) {
      paramToLog = this.prepareParams(params);
    } else {
      paramToLog = {};
    }

    let resourceName: string;
    if (isString(resource)) {
      resourceName = resource;
    } else if (!isNil(resource)) {
      resourceName = RESOURCE_NAME_PROP in resource ? String(resource[RESOURCE_NAME_PROP]) : 'EmbeddedResource';
    } else {
      resourceName = 'NOT_DEFINED_RESOURCE_NAME';
    }
    ConsoleLogger.resourcePrettyInfo(`${capitalize(resourceName)} ${method}`,
      `STAGE ${Stage.BEGIN}`, paramToLog);
  }

  public static resourceEndLog(resource: object | string, method: string, params: object): void {
    if (!LibConfig.getConfig().logs.verboseLogs && !LibConfig.getConfig().isProduction) {
      return;
    }
    const paramToLog = this.prepareParams(params);

    let resourceName;
    if (isString(resource)) {
      resourceName = resource;
    } else {
      resourceName = RESOURCE_NAME_PROP in resource ? String(resource[RESOURCE_NAME_PROP]) : 'EmbeddedResource';
    }

    ConsoleLogger.resourcePrettyInfo(`${capitalize(resourceName)} ${method}`,
      `STAGE ${Stage.END}`, paramToLog);
  }

  public static stageLog(stage: Stage, params: object): void {
    if (!LibConfig.getConfig().logs.verboseLogs && !LibConfig.getConfig().isProduction) {
      return;
    }
    const paramToLog = this.prepareParams(params);

    ConsoleLogger.prettyInfo(`STAGE ${stage}`, paramToLog);
  }

  public static stageErrorLog(stage: Stage, params: object): void {
    if (LibConfig.getConfig().isProduction) {
      return;
    }
    const paramToLog = this.prepareParams(params);

    ConsoleLogger.prettyError(`STAGE ${stage}`, paramToLog);
  }

  public static stageWarnLog(stage: Stage, params: object): void {
    if (LibConfig.getConfig().isProduction) {
      return;
    }
    const paramToLog = this.prepareParams(params);

    ConsoleLogger.prettyWarn(`STAGE ${stage}`, paramToLog);
  }

  private static prepareParams(params: object) {
    const paramToLog: Record<string, any> = {};
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
