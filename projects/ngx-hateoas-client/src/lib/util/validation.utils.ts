import { StageLogger } from '../logger/stage-logger';
import { Stage } from '../logger/stage.enum';
import { isArray, isEmpty, isNil, isObject, isPlainObject, isString } from 'lodash-es';

export class ValidationUtils {

  /**
   * Checks that passed object with params has all valid params.
   * Params should not has null, undefined, empty object, empty string values.
   *
   * @param params object with params to check
   * @throws error if any params are not defined
   */
  public static validateInputParams(params: object): void {
    if (isNil(params)) {
      const errMsg = 'Passed params object is not valid';
      StageLogger.stageErrorLog(Stage.CHECK_PARAMS, {error: errMsg});
      throw new Error(errMsg);
    }

    const notValidParams = [];
    for (const [key, value] of Object.entries(params)) {
      if (isNil(value)
        || (isString(value) && !value)
        || (isPlainObject(value) && isEmpty(value))
        || (isArray(value) && value.length === 0)) {

        let formattedValue = value;
        if (isObject(value)) {
          formattedValue = JSON.stringify(value, null, 2);
        }
        notValidParams.push(`'${ key } = ${ formattedValue }'`);
      }
    }
    if (notValidParams.length > 0) {
      const errMsg = `Passed param(s) ${ notValidParams.join(', ') } ${ notValidParams.length > 1 ? 'are' : 'is' } not valid`;
      StageLogger.stageErrorLog(Stage.CHECK_PARAMS, {error: errMsg});
      throw new Error(errMsg);
    }
  }

}
