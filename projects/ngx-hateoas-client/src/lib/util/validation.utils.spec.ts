import { ValidationUtils } from './validation.utils';
import { Resource } from '../model/resource/resource';

describe('ValidationUtils', () => {

  it('CHECK_INPUT_PARAMS should throw error when passed params is undefined', () => {
    expect(() => ValidationUtils.checkInputParams(undefined)).toThrowError(`Passed params object is not valid`);
  });

  it('CHECK_INPUT_PARAMS should throw error when passed params is null', () => {
    expect(() => ValidationUtils.checkInputParams(null)).toThrowError(`Passed params object is not valid`);
  });

  it('CHECK_INPUT_PARAMS should throw error when passed empty string', () => {
    expect(() => ValidationUtils.checkInputParams({string: ''})).toThrowError(`Passed param(s) 'string = ' is not valid`);
  });

  it('CHECK_INPUT_PARAMS should throw error when passed empty object', () => {
    expect(() => ValidationUtils.checkInputParams({object: {}})).toThrowError(`Passed param(s) 'object = {}' is not valid`);
  });

  it('CHECK_INPUT_PARAMS should throw error when passed empty array', () => {
    expect(() => ValidationUtils.checkInputParams({array: []})).toThrowError(`Passed param(s) 'array = []' is not valid`);
  });

  it('CHECK_INPUT_PARAMS should be pass when params is boolean = false', () => {
    expect(() => ValidationUtils.checkInputParams({bool: false})).not.toThrow();
  });

  it('CHECK_INPUT_PARAMS should be pass when params is number <,>,= 0', () => {
    expect(() => ValidationUtils.checkInputParams({numb: -10})).not.toThrow();
    expect(() => ValidationUtils.checkInputParams({numb: 0})).not.toThrow();
    expect(() => ValidationUtils.checkInputParams({numb: 10})).not.toThrow();
  });

  it('CHECK_INPUT_PARAMS should be pass when params is not empty object', () => {
    expect(() => ValidationUtils.checkInputParams({obj: {val: 'test'}})).not.toThrow();
  });

  it('CHECK_INPUT_PARAMS should be pass when params is class type', () => {
    expect(() => ValidationUtils.checkInputParams({type: Resource})).not.toThrow();
  });

  it('CHECK_INPUT_PARAMS should be pass when params is not empty array', () => {
    expect(() => ValidationUtils.checkInputParams({arr: [10]})).not.toThrow();
  });

});
