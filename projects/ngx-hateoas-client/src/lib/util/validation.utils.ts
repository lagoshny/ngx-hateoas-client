import * as _ from 'lodash';
import { StageLogger } from '../logger/stage-logger';
import { Stage } from '../logger/stage.enum';

export class ValidationUtils {

  /**
   * Checks that passed object with params has all defined params.
   *
   * @param params object with params to check
   * @throws Error if any params is not defined
   */
  public static checkInputParams(params: object): void {
    if (_.isNil(params)) {
      const errMsg = 'Passed params object is not valid';
      StageLogger.stageErrorLog(Stage.CHECK_PARAMS, {error: errMsg});
      throw new Error(errMsg);
    }

    const notValidParams = [];
    for (const [key, value] of Object.entries(params)) {
      if (_.isNil(value)
        || (_.isString(value) && !value)
        || (_.isPlainObject(value) && _.isEmpty(value))
        || (_.isArray(value) && value.length === 0)) {

        let formattedValue = value;
        if (_.isObject(value)) {
          formattedValue = JSON.stringify(value, null, 2);
        }
        notValidParams.push(`'${ key } = ${ formattedValue }'`);
      }
    }
    if (notValidParams.length > 0) {
      const errMsg = `Passed param(s) ${ notValidParams.join(', ') } is not valid`;
      StageLogger.stageErrorLog(Stage.CHECK_PARAMS, {error: errMsg});
      throw new Error(errMsg);
    }
  }

}
