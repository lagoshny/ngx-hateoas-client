import { Injector, Type } from '@angular/core';

/**
 * Holds dependency injector to allow use ше in internal the lib classes.
 */
/* tslint:disable:variable-name */
export class DependencyInjector {

  private static _injector: Injector = null;

  static get<T>(type: Type<T>): T {
    if (this._injector) {
      return this._injector.get(type);
    }
    throw new Error('You need initialize Injector');
  }

  static set injector(value: Injector) {
    this._injector = value;
  }

}
