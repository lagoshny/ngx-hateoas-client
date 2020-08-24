import { ValidationUtils } from './validation.utils';
import { Resource } from '../model/resource/resource';

describe('ValidationUtils', () => {

  it('CHECK_INPUT_PARAMS should throw error when passed params is undefined', () => {
    expect(() => ValidationUtils.validateInputParams(undefined)).toThrowError(`Passed params object is not valid`);
  });

  it('CHECK_INPUT_PARAMS should throw error when passed params is null', () => {
    expect(() => ValidationUtils.validateInputParams(null)).toThrowError(`Passed params object is not valid`);
  });

  it('CHECK_INPUT_PARAMS should throw error when passed empty string', () => {
    expect(() => ValidationUtils.validateInputParams({string: ''})).toThrowError(`Passed param(s) 'string = ' is not valid`);
  });

  it('CHECK_INPUT_PARAMS should throw error when passed empty object', () => {
    expect(() => ValidationUtils.validateInputParams({object: {}})).toThrowError(`Passed param(s) 'object = {}' is not valid`);
  });

  it('CHECK_INPUT_PARAMS should throw error when passed empty array', () => {
    expect(() => ValidationUtils.validateInputParams({array: []})).toThrowError(`Passed param(s) 'array = []' is not valid`);
  });

  it('CHECK_INPUT_PARAMS should throw error with message contains several invalid params', () => {
    expect(() => ValidationUtils.validateInputParams({array: [], obj: {}})).toThrowError(`Passed param(s) 'array = []', 'obj = {}' are not valid`);
  });

  it('CHECK_INPUT_PARAMS should be pass when params is boolean = false', () => {
    expect(() => ValidationUtils.validateInputParams({bool: false})).not.toThrow();
  });

  it('CHECK_INPUT_PARAMS should be pass when params is number <,>,= 0', () => {
    expect(() => ValidationUtils.validateInputParams({numb: -10})).not.toThrow();
    expect(() => ValidationUtils.validateInputParams({numb: 0})).not.toThrow();
    expect(() => ValidationUtils.validateInputParams({numb: 10})).not.toThrow();
  });

  it('CHECK_INPUT_PARAMS should be pass when params is not empty object', () => {
    expect(() => ValidationUtils.validateInputParams({obj: {val: 'test'}})).not.toThrow();
  });

  it('CHECK_INPUT_PARAMS should be pass when params is class type', () => {
    expect(() => ValidationUtils.validateInputParams({type: Resource})).not.toThrow();
  });

  it('CHECK_INPUT_PARAMS should be pass when params is not empty array', () => {
    expect(() => ValidationUtils.validateInputParams({arr: [10]})).not.toThrow();
  });

});
