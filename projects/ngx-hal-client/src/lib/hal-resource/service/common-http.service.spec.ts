/* tslint:disable:no-string-literal */
import { HttpConfigService } from '../../config/http-config.service';
import { async } from '@angular/core/testing';
import { Resource } from '../model/resource';
import { CommonHttpService } from './common-http.service';
import { HttpMethod } from '../model/declarations';
import { of } from 'rxjs';
import { HttpParams } from '@angular/common/http';

describe('CommonHttpService', () => {
  let commonHttpService: CommonHttpService<Resource>;
  let httpClientSpy: any;
  let cacheServiceSpy: any;
  let httpConfigService: HttpConfigService;

  const resource = {
    name: 'Test',
    _links: {
      anotherResource: {
        href: 'http://localhost:8080/api/v1/anotherResource/1'
      }
    }
  };

  beforeEach(async(() => {
    httpClientSpy = {
      get: jasmine.createSpy('get')
    };
    cacheServiceSpy = {
      putResource: jasmine.createSpy('putResource'),
      hasResource: jasmine.createSpy('hasResource'),
      getResource: jasmine.createSpy('getResource')
    };
    httpConfigService = {
      baseApiUrl: 'http://localhost:8080/api/v1'
    };

    commonHttpService =
      new CommonHttpService<Resource>(httpClientSpy, cacheServiceSpy, httpConfigService);
  }));

  it('CUSTOM_QUERY throws error when resourceName is empty', () => {
    commonHttpService.customQuery('', HttpMethod.GET, 'any').subscribe(() => {
    }, (error) => {
      expect(error.message).toBe('resource name should be defined');
    });
  });

  it('CUSTOM_QUERY throws error when resourceName is null', () => {
    commonHttpService.customQuery(null, HttpMethod.GET, 'any').subscribe(() => {
    }, (error) => {
      expect(error.message).toBe('resource name should be defined');
    });
  });

  it('CUSTOM_QUERY throws error when resourceName is undefined', () => {
    commonHttpService.customQuery(undefined, HttpMethod.GET, 'any').subscribe(() => {
    }, (error) => {
      expect(error.message).toBe('resource name should be defined');
    });
  });

  it('CUSTOM_QUERY throws error when query is empty', () => {
    commonHttpService.customQuery('any', HttpMethod.GET, '').subscribe(() => {
    }, (error) => {
      expect(error.message).toBe('query should be defined');
    });
  });

  it('CUSTOM_QUERY throws error when query is null', () => {
    commonHttpService.customQuery('any', HttpMethod.GET, null).subscribe(() => {
    }, (error) => {
      expect(error.message).toBe('query should be defined');
    });
  });

  it('CUSTOM_QUERY throws error when query is undefined', () => {
    commonHttpService.customQuery('any', HttpMethod.GET, undefined).subscribe(() => {
    }, (error) => {
      expect(error.message).toBe('query should be defined');
    });
  });

  it('CUSTOM_QUERY should generate custom query resource url', () => {
    httpClientSpy.get.and.returnValue(of(resource));

    commonHttpService.customQuery('test', HttpMethod.GET, 'someQuery').subscribe(() => {
      const url = httpClientSpy.get.calls.argsFor(0)[0];
      expect(url).toBe(`${ httpConfigService.baseApiUrl }/test/someQuery`);
    });
  });

  it('CUSTOM_QUERY should pass http request params when it passed', () => {
    httpClientSpy.get.and.returnValue(of(resource));

    commonHttpService.customQuery('test', HttpMethod.GET, 'someQuery', null, {
      projection: 'testProjection',
      page: {
        sort: {
          prop1: 'ASC',
          prop2: 'DESC'
        },
        size: 1,
        page: 2
      },
      params: {
        test: 'testParam'
      }
    }).subscribe(() => {
      const httpParams = httpClientSpy.get.calls.argsFor(0)[1].params as HttpParams;
      expect(httpParams.has('projection')).toBeTrue();
      expect(httpParams.get('projection')).toBe('testProjection');

      expect(httpParams.has('sort')).toBeTrue();
      expect(httpParams.getAll('sort').length).toBe(2);
      expect(httpParams.getAll('sort')[0]).toBe('prop1,ASC');
      expect(httpParams.getAll('sort')[1]).toBe('prop2,DESC');
      expect(httpParams.has('size')).toBeTrue();
      expect(httpParams.get('size')).toBe('1');
      expect(httpParams.has('page')).toBeTrue();
      expect(httpParams.get('page')).toBe('2');

      expect(httpParams.has('test')).toBeTrue();
      expect(httpParams.get('test')).toBe('testParam');
    });
  });

  it('CUSTOM_QUERY should throw error when NULL HTTP_METHOD was passed', () => {
    httpClientSpy.get.and.returnValue(of(resource));

    commonHttpService.customQuery('test', null, 'someQuery').subscribe(() => {
    }, error => {
      expect(error.message).toBe('allowed ony GET/POST/PUT/PATCH http methods you pass null');
    });
  });

  it('CUSTOM_QUERY should throw error when UNDEFINED HTTP_METHOD was passed', () => {
    httpClientSpy.get.and.returnValue(of(resource));

    commonHttpService.customQuery('test', undefined, 'someQuery').subscribe(() => {
    }, error => {
      expect(error.message).toBe('allowed ony GET/POST/PUT/PATCH http methods you pass undefined');
    });
  });

});


// describe('CommonHttpService RESOURCE', () => {
//   let commonHttpService: CommonHttpService<Resource>;
//   let httpClientSpy: any;
//   let cacheServiceSpy: any;
//   let httpConfigService: HttpConfigService;
//
//   const resourceCollection = {
//     _embedded: {
//       tests: [
//         {
//           text: 'hello world',
//           _links: {
//             self: {
//               href: 'http://localhost:8080/api/v1/test'
//             }
//           }
//         }
//       ]
//     },
//     _links: {
//       self: {
//         href: 'http://localhost:8080/api/v1/collection'
//       }
//     }
//   };
//
//   beforeEach(async(() => {
//     httpClientSpy = {
//       get: jasmine.createSpy('get')
//     };
//     cacheServiceSpy = {
//       putResource: jasmine.createSpy('putResource'),
//       hasResource: jasmine.createSpy('hasResource'),
//       getResource: jasmine.createSpy('getResource')
//     };
//     httpConfigService = {
//       baseApiUrl: 'http://localhost:8080/api/v1'
//     };
//
//     commonHttpService =
//       new CommonHttpService<Resource>(httpClientSpy, cacheServiceSpy, httpConfigService);
//
//     ResourceUtils.useResourceType(Resource);
//   }));
//
//   it('CUSTOM_QUERY throws error when resourceName is empty', () => {
//     commonHttpService.customQuery('', HttpMethod.GET, 'any').subscribe(() => {
//     }, (error) => {
//       expect(error.message).toBe('resource name should be defined');
//     });
//   });
//
//   it('CUSTOM_QUERY throws error when resourceName is null', () => {
//     commonHttpService.customQuery(null, HttpMethod.GET, 'any').subscribe(() => {
//     }, (error) => {
//       expect(error.message).toBe('resource name should be defined');
//     });
//   });
//
//   it('CUSTOM_QUERY throws error when resourceName is undefined', () => {
//     commonHttpService.customQuery(undefined, HttpMethod.GET, 'any').subscribe(() => {
//     }, (error) => {
//       expect(error.message).toBe('resource name should be defined');
//     });
//   });
//
//   it('CUSTOM_QUERY throws error when query is empty', () => {
//     commonHttpService.customQuery('any', HttpMethod.GET, '').subscribe(() => {
//     }, (error) => {
//       expect(error.message).toBe('query should be defined');
//     });
//   });
//
//   it('CUSTOM_QUERY throws error when query is null', () => {
//     commonHttpService.customQuery('any', HttpMethod.GET, null).subscribe(() => {
//     }, (error) => {
//       expect(error.message).toBe('query should be defined');
//     });
//   });
//
//   it('CUSTOM_QUERY throws error when query is undefined', () => {
//     commonHttpService.customQuery('any', HttpMethod.GET, undefined).subscribe(() => {
//     }, (error) => {
//       expect(error.message).toBe('query should be defined');
//     });
//   });
//
// });
