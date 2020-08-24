import * as _ from 'lodash';
import { ConsoleLogger } from './console-logger';
import { Stage } from './stage.enum';
import { LibConfig } from '../config/lib-config';

/**
 * Simplify logger calls.
 */

/* tslint:disable:no-string-literal */
export class StageLogger {

  public static resourceBeginLog(resource: object | string, method: string, params?: object): void {
    if (!LibConfig.config.logs.verboseLogs) {
      return;
    }
    const paramToLog = this.prepareParams(params);

    let resourceName;
    if (_.isString(resource)) {
      resourceName = resource;
    } else if (!_.isNil(resource)) {
      resourceName = 'resourceName' in resource ? resource['resourceName'] : 'EmbeddedResource';
    } else {
      resourceName = 'NOT_DEFINED_RESOURCE_NAME';
    }
    ConsoleLogger.resourcePrettyInfo(`${ _.capitalize(resourceName) } ${ method }`,
      `STAGE ${ Stage.BEGIN }`, paramToLog);
  }

  public static resourceEndLog(resource: object | string, method: string, params: object): void {
    if (!LibConfig.config.logs.verboseLogs) {
      return;
    }
    const paramToLog = this.prepareParams(params);

    let resourceName;
    if (_.isString(resource)) {
      resourceName = resource;
    } else {
      resourceName = 'resourceName' in resource ? resource['resourceName'] : 'EmbeddedResource';
    }

    ConsoleLogger.resourcePrettyInfo(`${ _.capitalize(resourceName) } ${ method }`,
      `STAGE ${ Stage.END }`, paramToLog);
  }

  public static stageLog(stage: Stage, params: object): void {
    if (!LibConfig.config.logs.verboseLogs) {
      return;
    }
    const paramToLog = this.prepareParams(params);

    ConsoleLogger.prettyInfo(`STAGE ${ stage }`, paramToLog);
  }

  public static stageErrorLog(stage: Stage, params: object): void {
    if (!LibConfig.config.logs.verboseLogs) {
      return;
    }
    const paramToLog = this.prepareParams(params);

    ConsoleLogger.prettyError(`STAGE ${ stage }`, paramToLog);
  }

  private static prepareParams(params: object) {
    const paramToLog = {};
    if (_.isEmpty(params)) {
      return paramToLog;
    }
    for (const [key, value] of Object.entries(params)) {
      if (!params.hasOwnProperty(key)) {
        continue;
      }
      if (_.isObject(value)) {
        paramToLog[key] = JSON.stringify(value, null, 2);
      } else {
        paramToLog[key] = value;
      }
    }
    return paramToLog;
  }
}
