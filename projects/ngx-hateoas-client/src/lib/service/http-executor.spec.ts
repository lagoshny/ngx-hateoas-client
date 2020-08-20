import { HttpExecutor } from './http-executor';
import { async } from '@angular/core/testing';

describe('HttpExecutor', () => {
  let httpExecutor: HttpExecutor;
  let httpClientSpy: any;

  beforeEach(async(() => {
    httpClientSpy = {
      get: jasmine.createSpy('get'),
      post: jasmine.createSpy('post'),
      patch: jasmine.createSpy('patch'),
      put: jasmine.createSpy('put'),
      delete: jasmine.createSpy('delete')
    };

    httpExecutor = new HttpExecutor(httpClientSpy);
  }));

  it('GET should throw error when passed url is empty', () => {
    expect(() => httpExecutor.get(''))
      .toThrowError(`Passed param(s) 'url = ' is not valid`);
  });

  it('GET should throw error when passed url is null', () => {
    expect(() => httpExecutor.get(null))
      .toThrowError(`Passed param(s) 'url = null' is not valid`);
  });

  it('GET should throw error when passed url is undefined', () => {
    expect(() => httpExecutor.get(undefined))
      .toThrowError(`Passed param(s) 'url = undefined' is not valid`);
  });

  it('POST should throw error when passed url is empty', () => {
    expect(() => httpExecutor.post('', null))
      .toThrowError(`Passed param(s) 'url = ' is not valid`);
  });

  it('POST should throw error when passed url is null', () => {
    expect(() => httpExecutor.post(null, null))
      .toThrowError(`Passed param(s) 'url = null' is not valid`);
  });

  it('POST should throw error when passed url is undefined', () => {
    expect(() => httpExecutor.post(undefined, null))
      .toThrowError(`Passed param(s) 'url = undefined' is not valid`);
  });

  it('PATCH should throw error when passed url is empty', () => {
    expect(() => httpExecutor.patch('', null))
      .toThrowError(`Passed param(s) 'url = ' is not valid`);
  });

  it('PATCH should throw error when passed url is null', () => {
    expect(() => httpExecutor.patch(null, null))
      .toThrowError(`Passed param(s) 'url = null' is not valid`);
  });

  it('PATCH should throw error when passed url is undefined', () => {
    expect(() => httpExecutor.patch(undefined, null))
      .toThrowError(`Passed param(s) 'url = undefined' is not valid`);
  });

  it('PUT should throw error when passed url is empty', () => {
    expect(() => httpExecutor.put('', null))
      .toThrowError(`Passed param(s) 'url = ' is not valid`);
  });

  it('PUT should throw error when passed url is null', () => {
    expect(() => httpExecutor.put(null, null))
      .toThrowError(`Passed param(s) 'url = null' is not valid`);
  });

  it('PUT should throw error when passed url is undefined', () => {
    expect(() => httpExecutor.put(undefined, null))
      .toThrowError(`Passed param(s) 'url = undefined' is not valid`);
  });

  it('DELETE should throw error when passed url is empty', () => {
    expect(() => httpExecutor.delete(''))
      .toThrowError(`Passed param(s) 'url = ' is not valid`);
  });

  it('DELETE should throw error when passed url is null', () => {
    expect(() => httpExecutor.delete(null))
      .toThrowError(`Passed param(s) 'url = null' is not valid`);
  });

  it('DELETE should throw error when passed url is undefined', () => {
    expect(() => httpExecutor.delete(undefined))
      .toThrowError(`Passed param(s) 'url = undefined' is not valid`);
  });

});
