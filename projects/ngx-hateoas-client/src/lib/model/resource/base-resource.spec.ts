import { BaseResource } from './base-resource';
import { async, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ResourceHttpService } from '../../service/internal/resource-http.service';
import { DependencyInjector } from '../../util/dependency-injector';
import { PagedResourceCollectionHttpService } from '../../service/internal/paged-resource-collection-http.service';
import { PagedResourceCollection } from './paged-resource-collection';
import { ResourceCollection } from './resource-collection';
import { HttpParams } from '@angular/common/http';
import { ResourceCollectionHttpService } from '../../service/internal/resource-collection-http.service';
import { LibConfig } from '../../config/lib-config';

class TestProductResource extends BaseResource {
  // tslint:disable-next-line:variable-name
  _links = {
    self: {
      href: 'http://localhost:8080/api/v1/product/1'
    },
    product: {
      href: 'http://localhost:8080/api/v1/product/1'
    }
  };
}

class TestOrderResource extends BaseResource {

  public product: TestProductResource;

  // tslint:disable-next-line:variable-name
  _links = {
    self: {
      href: 'http://localhost:8080/api/v1/order/1'
    },
    order: {
      href: 'http://localhost:8080/api/v1/order/1'
    },
    paymentType: {
      href: 'http://localhost:8080/api/v1/order/1/payment{?paymentId,projection}',
      templated: true
    },
    updateStatus: {
      href: 'http://localhost:8080/api/v1/order/1/updateStatus'
    },
    updateStatusTemplated: {
      href: 'http://localhost:8080/api/v1/order/1/updateStatus/{statusId}',
      templated: true
    },
    product: {
      href: 'http://localhost:8080/api/v1/order/1/products{?page,size,sort,projection}',
      templated: true
    },
    magazine: {
      href: 'http://localhost:8080/api/v1/order/1/magazine'
    }
  };

}

describe('BaseResource GET_RELATION', () => {
  let baseResource: BaseResource;
  let resourceHttpServiceSpy: any;

  beforeEach(async(() => {
    resourceHttpServiceSpy = {
      get: jasmine.createSpy('get')
    };

    TestBed.configureTestingModule({
      providers: [
        {
          provide: LibConfig, useValue: {
            enableCache: false,
            baseApiUrl: 'http://localhost:8080/api/v1',
          }
        },
        {provide: ResourceHttpService, useValue: resourceHttpServiceSpy}
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    baseResource = new TestOrderResource();
    DependencyInjector.injector = TestBed;
  });

  afterEach(() => {
    DependencyInjector.injector = null;
  });

  it('should throw error when passed relationName is empty', () => {
    expect(() => baseResource.getRelation(''))
      .toThrowError(`Passed param(s) 'relationName = ' is not valid`);
  });

  it('should throw error when passed relationName is undefined', () => {
    expect(() => baseResource.getRelation(undefined))
      .toThrowError(`Passed param(s) 'relationName = undefined' is not valid`);
  });

  it('should throw error when passed relationName is null', () => {
    expect(() => baseResource.getRelation(null))
      .toThrowError(`Passed param(s) 'relationName = null' is not valid`);
  });

  it('should fill template params in TEMPLATED link from passed params object', () => {
    resourceHttpServiceSpy.get.and.returnValue(of(new TestOrderResource()));

    baseResource.getRelation('paymentType', {
      params: {
        paymentId: 10
      }
    }).subscribe(() => {
      const resultResourceUrl = resourceHttpServiceSpy.get.calls.argsFor(0)[0];
      expect(resultResourceUrl).toBe('http://localhost:8080/api/v1/order/1/payment?paymentId=10');
    });
  });

  it('no errors when passed "null" value options', () => {
    resourceHttpServiceSpy.get.and.returnValue(of(new TestOrderResource()));

    expect(() => baseResource.getRelation('order', null).subscribe()).not.toThrow();
  });

  it('no errors when passed "undefined" value for options', () => {
    resourceHttpServiceSpy.get.and.returnValue(of(new TestOrderResource()));

    expect(() => baseResource.getRelation('order', undefined).subscribe()).not.toThrow();
  });

  it('should fill projection template param for TEMPLATED link', () => {
    resourceHttpServiceSpy.get.and.returnValue(of(new TestOrderResource()));

    baseResource.getRelation('paymentType', {
      params: {
        projection: 'paymentProjection'
      }
    }).subscribe(() => {
      const resultResourceUrl = resourceHttpServiceSpy.get.calls.argsFor(0)[0];
      expect(resultResourceUrl).toBe('http://localhost:8080/api/v1/order/1/payment?projection=paymentProjection');
    });
  });

  it('should clear template params for TEMPLATED link when passed params object IS EMPTY', () => {
    resourceHttpServiceSpy.get.and.returnValue(of(new TestOrderResource()));

    baseResource.getRelation('paymentType', {}).subscribe(() => {
      const resultResourceUrl = resourceHttpServiceSpy.get.calls.argsFor(0)[0];
      expect(resultResourceUrl).toBe('http://localhost:8080/api/v1/order/1/payment');
    });
  });

});

describe('BaseResource GET_RELATED_COLLECTION', () => {
  let baseResource: BaseResource;
  let resourceCollectionHttpServiceSpy: any;

  beforeEach(async(() => {
    resourceCollectionHttpServiceSpy = {
      get: jasmine.createSpy('get')
    };

    TestBed.configureTestingModule({
      providers: [
        {
          provide: LibConfig, useValue: {
            enableCache: false,
            baseApiUrl: 'http://localhost:8080/api/v1',
          }
        },
        {provide: ResourceCollectionHttpService, useValue: resourceCollectionHttpServiceSpy}
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    baseResource = new TestOrderResource();
    DependencyInjector.injector = TestBed;
  });

  it('should throw error when passed relationName is empty', () => {
    expect(() => baseResource.getRelatedCollection(''))
      .toThrowError(`Passed param(s) 'relationName = ' is not valid`);
  });

  it('should throw error when passed relationName is undefined', () => {
    expect(() => baseResource.getRelatedCollection(undefined))
      .toThrowError(`Passed param(s) 'relationName = undefined' is not valid`);
  });

  it('should throw error when passed relationName is null', () => {
    expect(() => baseResource.getRelatedCollection(null))
      .toThrowError(`Passed param(s) 'relationName = null' is not valid`);
  });

  it('no errors when passed "null" value options', () => {
    resourceCollectionHttpServiceSpy.get.and.returnValue(of(new TestOrderResource()));

    expect(() => baseResource.getRelatedCollection('order', null).subscribe()).not.toThrow();
  });

  it('no errors when passed "undefined" value for options', () => {
    resourceCollectionHttpServiceSpy.get.and.returnValue(of(new TestOrderResource()));

    expect(() => baseResource.getRelatedCollection('order', undefined).subscribe()).not.toThrow();
  });

  it('should fill template params in TEMPLATED link from passed params object', () => {
    resourceCollectionHttpServiceSpy.get.and.returnValue(of(new TestOrderResource()));

    baseResource.getRelatedCollection('paymentType', {
      params: {
        paymentId: 10
      }
    }).subscribe(() => {
      const resultResourceUrl = resourceCollectionHttpServiceSpy.get.calls.argsFor(0)[0];
      expect(resultResourceUrl).toBe('http://localhost:8080/api/v1/order/1/payment?paymentId=10');
    });
  });

  it('should fill projection template param for TEMPLATED link', () => {
    resourceCollectionHttpServiceSpy.get.and.returnValue(of(new TestOrderResource()));

    baseResource.getRelatedCollection('paymentType', {
      params: {
        projection: 'paymentProjection'
      }
    }).subscribe(() => {
      const resultResourceUrl = resourceCollectionHttpServiceSpy.get.calls.argsFor(0)[0];
      expect(resultResourceUrl).toBe('http://localhost:8080/api/v1/order/1/payment?projection=paymentProjection');
    });
  });

  it('should clear template params for TEMPLATED link when passed params object IS EMPTY', () => {
    resourceCollectionHttpServiceSpy.get.and.returnValue(of(new TestOrderResource()));

    baseResource.getRelatedCollection('paymentType', {}).subscribe(() => {
      const resultResourceUrl = resourceCollectionHttpServiceSpy.get.calls.argsFor(0)[0];
      expect(resultResourceUrl).toBe('http://localhost:8080/api/v1/order/1/payment');
    });
  });

});

describe('BaseResource GET_RELATED_PAGE', () => {
  let baseResource: BaseResource;
  let pagedResourceCollectionHttpServiceSpy: any;

  beforeEach(async(() => {
    pagedResourceCollectionHttpServiceSpy = {
      get: jasmine.createSpy('get')
    };

    TestBed.configureTestingModule({
      providers: [
        {
          provide: LibConfig, useValue: {
            enableCache: false,
            baseApiUrl: 'http://localhost:8080/api/v1',
          }
        },
        {provide: PagedResourceCollectionHttpService, useValue: pagedResourceCollectionHttpServiceSpy}
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    baseResource = new TestOrderResource();
    DependencyInjector.injector = TestBed;
  });

  it('should throw error when passed relationName is empty', () => {
    expect(() => baseResource.getRelatedPage(''))
      .toThrowError(`Passed param(s) 'relationName = ' is not valid`);
  });

  it('should throw error when passed relationName is undefined', () => {
    expect(() => baseResource.getRelatedPage(undefined))
      .toThrowError(`Passed param(s) 'relationName = undefined' is not valid`);
  });

  it('should throw error when passed relationName is null', () => {
    expect(() => baseResource.getRelatedPage(null))
      .toThrowError(`Passed param(s) 'relationName = null' is not valid`);
  });

  it('should throw error when page params passed IN PARAMS OBJECT for TEMPLATED link', () => {
    expect(() => {
      baseResource.getRelatedPage('product', {
        params: {
          page: 1,
          size: 2
        }
      }).subscribe();
    }).toThrowError('Please, pass page params in page object key, not with params object!');
  });

  it('no errors when passed "null" value options', () => {
    pagedResourceCollectionHttpServiceSpy.get.and.returnValue(of(new PagedResourceCollection(new ResourceCollection())));

    expect(() => baseResource.getRelatedPage('updateStatus', null).subscribe()).not.toThrow();
  });

  it('no errors when passed "undefined" value for options', () => {
    pagedResourceCollectionHttpServiceSpy.get.and.returnValue(of(new PagedResourceCollection(new ResourceCollection())));

    expect(() => baseResource.getRelatedPage('updateStatus', undefined)).not.toThrow();
  });

  it('should fill projection param in TEMPLATED link when it passed IN projection property', () => {
    pagedResourceCollectionHttpServiceSpy.get.and.returnValue(of(new PagedResourceCollection(new ResourceCollection())));

    baseResource.getRelatedPage('product', {
      params: {
        projection: 'productProjection'
      }
    }).subscribe(() => {
      const resultResourceUrl = pagedResourceCollectionHttpServiceSpy.get.calls.argsFor(0)[0];
      expect(resultResourceUrl).toBe('http://localhost:8080/api/v1/order/1/products?projection=productProjection');
    });
  });

  it('should fill page params in TEMPLATED link when page params passed IN PAGE OBJECT', () => {
    pagedResourceCollectionHttpServiceSpy.get.and.returnValue(of(new PagedResourceCollection(new ResourceCollection())));

    baseResource.getRelatedPage('product', {
      pageParams: {
        page: 1,
        size: 2
      },
      sort: {
        abc: 'ASC',
        cde: 'DESC'
      }
    }).subscribe(() => {
      const resultResourceUrl = pagedResourceCollectionHttpServiceSpy.get.calls.argsFor(0)[0];
      expect(resultResourceUrl).toBe('http://localhost:8080/api/v1/order/1/products?page=1&size=2&sort=abc,ASC&sort=cde,DESC');
    });
  });

  it('should pass only useCache options for TEMPLATED link', () => {
    pagedResourceCollectionHttpServiceSpy.get.and.returnValue(of(new PagedResourceCollection(new ResourceCollection())));

    baseResource.getRelatedPage('product', {
      pageParams: {
        page: 1,
        size: 2
      },
      sort: {
        abc: 'ASC',
        cde: 'DESC'
      }
    }).subscribe(() => {
      const options = pagedResourceCollectionHttpServiceSpy.get.calls.argsFor(0)[1];
      expect(options).toEqual({useCache: undefined});
    });
  });

});

describe('BaseResource POST_RELATION', () => {
  let baseResource: BaseResource;
  let resourceHttpServiceSpy: any;

  beforeEach(async(() => {
    resourceHttpServiceSpy = {
      post: jasmine.createSpy('post')
    };

    TestBed.configureTestingModule({
      providers: [
        {
          provide: LibConfig, useValue: {
            enableCache: false,
            baseApiUrl: 'http://localhost:8080/api/v1',
          }
        },
        {provide: ResourceHttpService, useValue: resourceHttpServiceSpy}
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    baseResource = new TestOrderResource();
    DependencyInjector.injector = TestBed;
  });

  it('should throw error when passed relationName is empty', () => {
    expect(() => baseResource.postRelation('', {body: {test: 'value'}}))
      .toThrowError(`Passed param(s) 'relationName = ' is not valid`);
  });

  it('should throw error when passed relationName,requestBody are undefined', () => {
    expect(() => baseResource.postRelation(undefined, undefined))
      .toThrowError(`Passed param(s) 'relationName = undefined', 'requestBody = undefined' are not valid`);
  });

  it('should throw error when passed relationName,requestBody are null', () => {
    expect(() => baseResource.postRelation(null, null))
      .toThrowError(`Passed param(s) 'relationName = null', 'requestBody = null' are not valid`);
  });

  it('should fill url template params when url IS templated', () => {
    resourceHttpServiceSpy.post.and.returnValue(of(new TestOrderResource()));

    baseResource.postRelation('updateStatusTemplated', {body: {}}, {
      params: {statusId: 1}
    }).subscribe(() => {
      const resultResourceUrl = resourceHttpServiceSpy.post.calls.argsFor(0)[0];
      expect(resultResourceUrl).toBe('http://localhost:8080/api/v1/order/1/updateStatus/1');
    });
  });

  it('should pass http request params when url IS NOT templated', () => {
    resourceHttpServiceSpy.post.and.returnValue(of(new TestOrderResource()));

    baseResource.postRelation('updateStatus', {body: {}}, {
      params: {statusId: 1}
    }).subscribe(() => {
      const httpParams = resourceHttpServiceSpy.post.calls.argsFor(0)[2].params;
      expect(httpParams.has('statusId')).toBeTrue();
    });
  });

  it('should pass default observe "body" option', () => {
    resourceHttpServiceSpy.post.and.returnValue(of(new TestOrderResource()));

    baseResource.postRelation('updateStatus', {body: {}}, {
      params: {statusId: 1}
    }).subscribe(() => {
      const observe = resourceHttpServiceSpy.post.calls.argsFor(0)[2].observe;
      expect(observe).toBe('body');
    });
  });

  it('should pass custom observe option', () => {
    resourceHttpServiceSpy.post.and.returnValue(of(new TestOrderResource()));

    baseResource.postRelation('updateStatus', {body: {}}, {
      params: {statusId: 1},
      observe: 'response'
    }).subscribe(() => {
      const observe = resourceHttpServiceSpy.post.calls.argsFor(0)[2].observe;
      expect(observe).toBe('response');
    });
  });

  it('should resolve body object relations by replace inner resource object to resource self link', () => {
    const orderResource = new TestOrderResource();
    orderResource.product = new TestProductResource();
    resourceHttpServiceSpy.post.and.returnValue(of(orderResource));

    baseResource.postRelation('updateStatus', {body: orderResource}).subscribe(() => {
      const body = resourceHttpServiceSpy.post.calls.argsFor(0)[1];
      expect(body.product).toBe('http://localhost:8080/api/v1/product/1');
    });
  });

  it('no errors when passed "null" value for options', () => {
    const orderResource = new TestOrderResource();
    orderResource.product = new TestProductResource();
    resourceHttpServiceSpy.post.and.returnValue(of(orderResource));

    baseResource.postRelation('updateStatus', {body: {}}, null).subscribe(() => {
      const body = resourceHttpServiceSpy.post.calls.argsFor(0)[1];
      expect(body).toBe(null);

      const options = resourceHttpServiceSpy.post.calls.argsFor(0)[2];
      expect(options).toBeDefined();
      expect((options.params as HttpParams).keys().length).toBe(0);
    });
  });

  it('no errors when passed "undefined" value for options', () => {
    const orderResource = new TestOrderResource();
    orderResource.product = new TestProductResource();
    resourceHttpServiceSpy.post.and.returnValue(of(orderResource));

    baseResource.postRelation('updateStatus', {body: {}}, undefined).subscribe(() => {
      const body = resourceHttpServiceSpy.post.calls.argsFor(0)[1];
      expect(body).toBe(null);

      const options = resourceHttpServiceSpy.post.calls.argsFor(0)[2];
      expect(options).toBeDefined();
      expect((options.params as HttpParams).keys().length).toBe(0);
    });
  });

});

describe('BaseResource PATCH_RELATION', () => {
  let baseResource: BaseResource;
  let resourceHttpServiceSpy: any;

  beforeEach(async(() => {
    resourceHttpServiceSpy = {
      patch: jasmine.createSpy('patch')
    };

    TestBed.configureTestingModule({
      providers: [
        {
          provide: LibConfig, useValue: {
            enableCache: false,
            baseApiUrl: 'http://localhost:8080/api/v1',
          }
        },
        {provide: ResourceHttpService, useValue: resourceHttpServiceSpy}
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    baseResource = new TestOrderResource();
    DependencyInjector.injector = TestBed;
  });

  it('should throw error when passed relationName is empty', () => {
    expect(() => baseResource.patchRelation('', {body: {test: 'value'}}))
      .toThrowError(`Passed param(s) 'relationName = ' is not valid`);
  });

  it('should throw error when passed relationName,requestBody are undefined', () => {
    expect(() => baseResource.patchRelation(undefined, undefined))
      .toThrowError(`Passed param(s) 'relationName = undefined', 'requestBody = undefined' are not valid`);
  });

  it('should throw error when passed relationName,requestBody are null', () => {
    expect(() => baseResource.patchRelation(null, null))
      .toThrowError(`Passed param(s) 'relationName = null', 'requestBody = null' are not valid`);
  });

  it('should fill url template params when url IS templated', () => {
    resourceHttpServiceSpy.patch.and.returnValue(of(new TestOrderResource()));

    baseResource.patchRelation('updateStatusTemplated', {body: {}}, {
      params: {statusId: 1}
    }).subscribe(() => {
      const resultResourceUrl = resourceHttpServiceSpy.patch.calls.argsFor(0)[0];
      expect(resultResourceUrl).toBe('http://localhost:8080/api/v1/order/1/updateStatus/1');
    });
  });

  it('should pass http request params when url IS NOT templated', () => {
    resourceHttpServiceSpy.patch.and.returnValue(of(new TestOrderResource()));

    baseResource.patchRelation('updateStatus', {body: {}}, {
      params: {statusId: 1}
    }).subscribe(() => {
      const httpParams = resourceHttpServiceSpy.patch.calls.argsFor(0)[2].params;
      expect(httpParams.has('statusId')).toBeTrue();
    });
  });

  it('should pass default observe "body" option', () => {
    resourceHttpServiceSpy.patch.and.returnValue(of(new TestOrderResource()));

    baseResource.patchRelation('updateStatus', {body: {}}, {
      params: {statusId: 1}
    }).subscribe(() => {
      const observe = resourceHttpServiceSpy.patch.calls.argsFor(0)[2].observe;
      expect(observe).toBe('body');
    });
  });

  it('should pass custom observe option', () => {
    resourceHttpServiceSpy.patch.and.returnValue(of(new TestOrderResource()));

    baseResource.patchRelation('updateStatus', {body: {}}, {
      params: {statusId: 1},
      observe: 'response'
    }).subscribe(() => {
      const observe = resourceHttpServiceSpy.patch.calls.argsFor(0)[2].observe;
      expect(observe).toBe('response');
    });
  });

  it('should resolve body object relations by replace inner resource object to resource self link', () => {
    const orderResource = new TestOrderResource();
    orderResource.product = new TestProductResource();
    resourceHttpServiceSpy.patch.and.returnValue(of(orderResource));

    baseResource.patchRelation('updateStatus', {body: orderResource}).subscribe(() => {
      const body = resourceHttpServiceSpy.patch.calls.argsFor(0)[1];
      expect(body.product).toBe('http://localhost:8080/api/v1/product/1');
    });
  });

  it('no errors when passed "null" value for options', () => {
    const orderResource = new TestOrderResource();
    orderResource.product = new TestProductResource();
    resourceHttpServiceSpy.patch.and.returnValue(of(orderResource));

    baseResource.patchRelation('updateStatus', {body: {}}, null).subscribe(() => {
      const body = resourceHttpServiceSpy.patch.calls.argsFor(0)[1];
      expect(body).toBe(null);

      const options = resourceHttpServiceSpy.patch.calls.argsFor(0)[2];
      expect(options).toBeDefined();
      expect((options.params as HttpParams).keys().length).toBe(0);
    });
  });

  it('no errors when passed "undefined" value for options', () => {
    const orderResource = new TestOrderResource();
    orderResource.product = new TestProductResource();
    resourceHttpServiceSpy.patch.and.returnValue(of(orderResource));

    baseResource.patchRelation('updateStatus', {body: {}}, undefined).subscribe(() => {
      const body = resourceHttpServiceSpy.patch.calls.argsFor(0)[1];
      expect(body).toBe(null);

      const options = resourceHttpServiceSpy.patch.calls.argsFor(0)[2];
      expect(options).toBeDefined();
      expect((options.params as HttpParams).keys().length).toBe(0);
    });
  });

});

describe('BaseResource PUT_RELATION', () => {
  let baseResource: BaseResource;
  let resourceHttpServiceSpy: any;

  beforeEach(async(() => {
    resourceHttpServiceSpy = {
      put: jasmine.createSpy('put')
    };

    TestBed.configureTestingModule({
      providers: [
        {provide: ResourceHttpService, useValue: resourceHttpServiceSpy}
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    baseResource = new TestOrderResource();
    DependencyInjector.injector = TestBed;
  });

  it('should throw error when passed relationName is empty', () => {
    expect(() => baseResource.putRelation('', {body: {test: 'value'}}))
      .toThrowError(`Passed param(s) 'relationName = ' is not valid`);
  });

  it('should throw error when passed relationName,requestBody are undefined', () => {
    expect(() => baseResource.putRelation(undefined, undefined))
      .toThrowError(`Passed param(s) 'relationName = undefined', 'requestBody = undefined' are not valid`);
  });

  it('should throw error when passed relationName,requestBody are null', () => {
    expect(() => baseResource.putRelation(null, null))
      .toThrowError(`Passed param(s) 'relationName = null', 'requestBody = null' are not valid`);
  });

  it('should fill url template params when url IS templated', () => {
    resourceHttpServiceSpy.put.and.returnValue(of(new TestOrderResource()));

    baseResource.putRelation('updateStatusTemplated', {body: {}}, {
      params: {statusId: 1}
    }).subscribe(() => {
      const resultResourceUrl = resourceHttpServiceSpy.put.calls.argsFor(0)[0];
      expect(resultResourceUrl).toBe('http://localhost:8080/api/v1/order/1/updateStatus/1');
    });
  });

  it('should pass http request params when url IS NOT templated', () => {
    resourceHttpServiceSpy.put.and.returnValue(of(new TestOrderResource()));

    baseResource.putRelation('updateStatus', {body: {}}, {
      params: {statusId: 1}
    }).subscribe(() => {
      const httpParams = resourceHttpServiceSpy.put.calls.argsFor(0)[2].params;
      expect(httpParams.has('statusId')).toBeTrue();
    });
  });

  it('should pass custom observe option', () => {
    resourceHttpServiceSpy.put.and.returnValue(of(new TestOrderResource()));

    baseResource.putRelation('updateStatus', {body: {}}, {
      params: {statusId: 1},
      observe: 'response'
    }).subscribe(() => {
      const observe = resourceHttpServiceSpy.put.calls.argsFor(0)[2].observe;
      expect(observe).toBe('response');
    });
  });

  it('should resolve body object relations by replace inner resource object to resource self link', () => {
    const orderResource = new TestOrderResource();
    orderResource.product = new TestProductResource();
    resourceHttpServiceSpy.put.and.returnValue(of(orderResource));

    baseResource.putRelation('updateStatus', {body: orderResource}).subscribe(() => {
      const body = resourceHttpServiceSpy.put.calls.argsFor(0)[1];
      expect(body.product).toBe('http://localhost:8080/api/v1/product/1');
    });
  });

  it('no errors when passed "null" value for options', () => {
    const orderResource = new TestOrderResource();
    orderResource.product = new TestProductResource();
    resourceHttpServiceSpy.put.and.returnValue(of(orderResource));

    baseResource.putRelation('updateStatus', {body: {}}, null).subscribe(() => {
      const body = resourceHttpServiceSpy.put.calls.argsFor(0)[1];
      expect(body).toBe(null);

      const options = resourceHttpServiceSpy.put.calls.argsFor(0)[2];
      expect(options).toBeDefined();
      expect((options.params as HttpParams).keys().length).toBe(0);
    });
  });

  it('no errors when passed "undefined" value for options', () => {
    const orderResource = new TestOrderResource();
    orderResource.product = new TestProductResource();
    resourceHttpServiceSpy.put.and.returnValue(of(orderResource));

    baseResource.putRelation('updateStatus', {body: {}}, undefined).subscribe(() => {
      const body = resourceHttpServiceSpy.put.calls.argsFor(0)[1];
      expect(body).toBe(null);

      const options = resourceHttpServiceSpy.put.calls.argsFor(0)[2];
      expect(options).toBeDefined();
      expect((options.params as HttpParams).keys().length).toBe(0);
    });
  });

});
