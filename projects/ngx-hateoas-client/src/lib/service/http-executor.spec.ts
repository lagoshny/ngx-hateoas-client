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
    expect(() => httpExecutor.getHttp(''))
      .toThrowError(`Passed param(s) 'url = ' is not valid`);
  });

  it('GET should throw error when passed url is null', () => {
    expect(() => httpExecutor.getHttp(null))
      .toThrowError(`Passed param(s) 'url = null' is not valid`);
  });

  it('GET should throw error when passed url is undefined', () => {
    expect(() => httpExecutor.getHttp(undefined))
      .toThrowError(`Passed param(s) 'url = undefined' is not valid`);
  });

  it('POST should throw error when passed url is empty', () => {
    expect(() => httpExecutor.postHttp('', null))
      .toThrowError(`Passed param(s) 'url = ' is not valid`);
  });

  it('POST should throw error when passed url is null', () => {
    expect(() => httpExecutor.postHttp(null, null))
      .toThrowError(`Passed param(s) 'url = null' is not valid`);
  });

  it('POST should throw error when passed url is undefined', () => {
    expect(() => httpExecutor.postHttp(undefined, null))
      .toThrowError(`Passed param(s) 'url = undefined' is not valid`);
  });

  it('PATCH should throw error when passed url is empty', () => {
    expect(() => httpExecutor.patchHttp('', null))
      .toThrowError(`Passed param(s) 'url = ' is not valid`);
  });

  it('PATCH should throw error when passed url is null', () => {
    expect(() => httpExecutor.patchHttp(null, null))
      .toThrowError(`Passed param(s) 'url = null' is not valid`);
  });

  it('PATCH should throw error when passed url is undefined', () => {
    expect(() => httpExecutor.patchHttp(undefined, null))
      .toThrowError(`Passed param(s) 'url = undefined' is not valid`);
  });

  it('PUT should throw error when passed url is empty', () => {
    expect(() => httpExecutor.putHttp('', null))
      .toThrowError(`Passed param(s) 'url = ' is not valid`);
  });

  it('PUT should throw error when passed url is null', () => {
    expect(() => httpExecutor.putHttp(null, null))
      .toThrowError(`Passed param(s) 'url = null' is not valid`);
  });

  it('PUT should throw error when passed url is undefined', () => {
    expect(() => httpExecutor.putHttp(undefined, null))
      .toThrowError(`Passed param(s) 'url = undefined' is not valid`);
  });

  it('DELETE should throw error when passed url is empty', () => {
    expect(() => httpExecutor.deleteHttp(''))
      .toThrowError(`Passed param(s) 'url = ' is not valid`);
  });

  it('DELETE should throw error when passed url is null', () => {
    expect(() => httpExecutor.deleteHttp(null))
      .toThrowError(`Passed param(s) 'url = null' is not valid`);
  });

  it('DELETE should throw error when passed url is undefined', () => {
    expect(() => httpExecutor.deleteHttp(undefined))
      .toThrowError(`Passed param(s) 'url = undefined' is not valid`);
  });

});
