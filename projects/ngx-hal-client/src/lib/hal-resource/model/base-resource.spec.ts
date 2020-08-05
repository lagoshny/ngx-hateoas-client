import { BaseResource } from './base-resource';
import { async, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ResourceHttpService } from '../service/resource-http.service';
import { DependencyInjector } from '../../util/dependency-injector';
import { PagedCollectionResourceHttpService } from '../service/paged-collection-resource-http.service';
import { PagedCollectionResource } from './paged-collection-resource';
import { CollectionResource } from './collection-resource';
import { HttpParams } from '@angular/common/http';
import { CollectionResourceHttpService } from '../service/collection-resource-http.service';

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
        {provide: ResourceHttpService, useValue: resourceHttpServiceSpy}
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    baseResource = new TestOrderResource();
    DependencyInjector.injector = TestBed;
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

  it('should throw error when pass projection param in params object for TEMPLATED link', () => {
    try {
      baseResource.getRelation('paymentType', {
        params: {
          projection: 'paymentProjection'
        }
      }).subscribe(() => {
      });
    } catch (error) {
      expect(error.message).toBe('Please, pass projection param in projection object key, not with params object!');
    }
  });

  it('should fill projection template param for TEMPLATED link', () => {
    resourceHttpServiceSpy.get.and.returnValue(of(new TestOrderResource()));

    baseResource.getRelation('paymentType', {
      projection: 'paymentProjection'
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

  it('should fill http request params for NOT TEMPLATED link from params object', () => {
    resourceHttpServiceSpy.get.and.returnValue(of(new TestOrderResource()));

    baseResource.getRelation('order', {
      params: {
        orderType: 'online'
      }
    }).subscribe(() => {
      const resultResourceUrl = resourceHttpServiceSpy.get.calls.argsFor(0)[0];
      expect(resultResourceUrl).toBe('http://localhost:8080/api/v1/order/1');

      const httpParams = resourceHttpServiceSpy.get.calls.argsFor(0)[1].params;
      expect(httpParams.has('orderType')).toBeTrue();
      expect(httpParams.get('orderType')).toBe('online');
    });
  });

  it('should adds projection param in http request params for NOT TEMPLATED link', () => {
    resourceHttpServiceSpy.get.and.returnValue(of(new TestOrderResource()));

    baseResource.getRelation('order', {
      projection: 'orderProjection'
    }).subscribe(() => {
      const resultResourceUrl = resourceHttpServiceSpy.get.calls.argsFor(0)[0];
      expect(resultResourceUrl).toBe('http://localhost:8080/api/v1/order/1');

      const httpParams = resourceHttpServiceSpy.get.calls.argsFor(0)[1].params;
      expect(httpParams.has('projection')).toBeTrue();
      expect(httpParams.get('projection')).toBe('orderProjection');
    });
  });

  it('should throw error when pass projection param in params object for NOT TEMPLATED link', () => {
    resourceHttpServiceSpy.get.and.returnValue(of(new TestOrderResource()));

    try {
      baseResource.getRelation('order', {
        params: {
          projection: 'orderProjection'
        }
      }).subscribe(() => {
      });
    } catch (error) {
      expect(error.message).toBe('Please, pass projection param in projection object key, not with params object!');
    }
  });

  it('no errors when passed "null" value options', () => {
    resourceHttpServiceSpy.get.and.returnValue(of(new TestOrderResource()));

    baseResource.getRelation('order', null).subscribe(() => {
      const httpParams = resourceHttpServiceSpy.get.calls.argsFor(0)[1].params;
      expect(httpParams.keys().length).toBe(0);
    });
  });

  it('no errors when passed "undefined" value for options', () => {
    resourceHttpServiceSpy.get.and.returnValue(of(new TestOrderResource()));

    baseResource.getRelation('order', undefined).subscribe(() => {
      const httpParams = resourceHttpServiceSpy.get.calls.argsFor(0)[1].params;
      expect(httpParams.keys().length).toBe(0);
    });
  });

});

describe('BaseResource GET_RELATED_COLLECTION', () => {
  let baseResource: BaseResource;
  let collectionResourceHttpServiceSpy: any;

  beforeEach(async(() => {
    collectionResourceHttpServiceSpy = {
      get: jasmine.createSpy('get')
    };

    TestBed.configureTestingModule({
      providers: [
        {provide: CollectionResourceHttpService, useValue: collectionResourceHttpServiceSpy}
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    baseResource = new TestOrderResource();
    DependencyInjector.injector = TestBed;
  });

  it('should fill template params in TEMPLATED link from passed params object', () => {
    collectionResourceHttpServiceSpy.get.and.returnValue(of(new TestOrderResource()));

    baseResource.getRelatedCollection('paymentType', {
      params: {
        paymentId: 10
      }
    }).subscribe(() => {
      const resultResourceUrl = collectionResourceHttpServiceSpy.get.calls.argsFor(0)[0];
      expect(resultResourceUrl).toBe('http://localhost:8080/api/v1/order/1/payment?paymentId=10');
    });
  });

  it('should throw error when pass projection param in params object for TEMPLATED link', () => {
    try {
      baseResource.getRelatedCollection('paymentType', {
        params: {
          projection: 'paymentProjection'
        }
      }).subscribe(() => {
      });
    } catch (error) {
      expect(error.message).toBe('Please, pass projection param in projection object key, not with params object!');
    }
  });

  it('should fill projection template param for TEMPLATED link', () => {
    collectionResourceHttpServiceSpy.get.and.returnValue(of(new TestOrderResource()));

    baseResource.getRelatedCollection('paymentType', {
      projection: 'paymentProjection'
    }).subscribe(() => {
      const resultResourceUrl = collectionResourceHttpServiceSpy.get.calls.argsFor(0)[0];
      expect(resultResourceUrl).toBe('http://localhost:8080/api/v1/order/1/payment?projection=paymentProjection');
    });
  });

  it('should clear template params for TEMPLATED link when passed params object IS EMPTY', () => {
    collectionResourceHttpServiceSpy.get.and.returnValue(of(new TestOrderResource()));

    baseResource.getRelatedCollection('paymentType', {}).subscribe(() => {
      const resultResourceUrl = collectionResourceHttpServiceSpy.get.calls.argsFor(0)[0];
      expect(resultResourceUrl).toBe('http://localhost:8080/api/v1/order/1/payment');
    });
  });

  it('should fill http request params for NOT TEMPLATED link from params object', () => {
    collectionResourceHttpServiceSpy.get.and.returnValue(of(new TestOrderResource()));

    baseResource.getRelatedCollection('order', {
      params: {
        orderType: 'online'
      }
    }).subscribe(() => {
      const resultResourceUrl = collectionResourceHttpServiceSpy.get.calls.argsFor(0)[0];
      expect(resultResourceUrl).toBe('http://localhost:8080/api/v1/order/1');

      const httpParams = collectionResourceHttpServiceSpy.get.calls.argsFor(0)[1].params;
      expect(httpParams.has('orderType')).toBeTrue();
      expect(httpParams.get('orderType')).toBe('online');
    });
  });

  it('should adds projection param in http request params for NOT TEMPLATED link', () => {
    collectionResourceHttpServiceSpy.get.and.returnValue(of(new TestOrderResource()));

    baseResource.getRelatedCollection('order', {
      projection: 'orderProjection'
    }).subscribe(() => {
      const resultResourceUrl = collectionResourceHttpServiceSpy.get.calls.argsFor(0)[0];
      expect(resultResourceUrl).toBe('http://localhost:8080/api/v1/order/1');

      const httpParams = collectionResourceHttpServiceSpy.get.calls.argsFor(0)[1].params;
      expect(httpParams.has('projection')).toBeTrue();
      expect(httpParams.get('projection')).toBe('orderProjection');
    });
  });

  it('should throw error when pass projection param in params object for NOT TEMPLATED link', () => {
    collectionResourceHttpServiceSpy.get.and.returnValue(of(new TestOrderResource()));

    try {
      baseResource.getRelatedCollection('order', {
        params: {
          projection: 'orderProjection'
        }
      }).subscribe(() => {
      });
    } catch (error) {
      expect(error.message).toBe('Please, pass projection param in projection object key, not with params object!');
    }
  });

  it('no errors when passed "null" value options', () => {
    collectionResourceHttpServiceSpy.get.and.returnValue(of(new TestOrderResource()));

    baseResource.getRelatedCollection('order', null).subscribe(() => {
      const httpParams = collectionResourceHttpServiceSpy.get.calls.argsFor(0)[1].params;
      expect(httpParams.keys().length).toBe(0);
    });
  });

  it('no errors when passed "undefined" value for options', () => {
    collectionResourceHttpServiceSpy.get.and.returnValue(of(new TestOrderResource()));

    baseResource.getRelatedCollection('order', undefined).subscribe(() => {
      const httpParams = collectionResourceHttpServiceSpy.get.calls.argsFor(0)[1].params;
      expect(httpParams.keys().length).toBe(0);
    });
  });

});

describe('BaseResource GET_RELATED_PAGE', () => {
  let baseResource: BaseResource;
  let pagedCollectionResourceHttpServiceSpy: any;

  beforeEach(async(() => {
    pagedCollectionResourceHttpServiceSpy = {
      get: jasmine.createSpy('get')
    };

    TestBed.configureTestingModule({
      providers: [
        {provide: PagedCollectionResourceHttpService, useValue: pagedCollectionResourceHttpServiceSpy}
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    baseResource = new TestOrderResource();
    DependencyInjector.injector = TestBed;
  });

  it('should throw error when page params passed IN PARAMS OBJECT for TEMPLATED link', () => {
    try {
      baseResource.getRelatedPage('product', {
        params: {
          page: 1,
          size: 2,
          sort: {
            abc: 'ASC',
            cde: 'DESC'
          }
        }
      }).subscribe(() => {
      });
    } catch (error) {
      expect(error.message).toBe('Please, pass page params in page object key, not with params object!');
    }
  });

  it('should fill page params in TEMPLATED link when page params passed IN PAGE OBJECT', () => {
    pagedCollectionResourceHttpServiceSpy.get.and.returnValue(of(new PagedCollectionResource(new CollectionResource())));

    baseResource.getRelatedPage('product', {
      page: {
        page: 1,
        size: 2,
        sort: {
          abc: 'ASC',
          cde: 'DESC'
        }
      }
    }).subscribe(() => {
      const resultResourceUrl = pagedCollectionResourceHttpServiceSpy.get.calls.argsFor(0)[0];
      expect(resultResourceUrl).toBe('http://localhost:8080/api/v1/order/1/products?page=1&size=2&sort=abc,ASC&sort=cde,DESC');

      const httpParams = pagedCollectionResourceHttpServiceSpy.get.calls.argsFor(0)[1].params;
      expect(httpParams.keys().length).toBe(0);
    });
  });

  it('should throw error when projection param passed IN PARAMS OBJECT for TEMPLATED link', () => {
    try {
      baseResource.getRelatedPage('product', {
        params: {
          projection: 'productProjection'
        }
      }).subscribe(() => {
      });
    } catch (error) {
      expect(error.message).toBe('Please, pass projection param in projection object key, not with params object!');
    }
  });

  it('should fill projection param in TEMPLATED link when it passed IN projection property', () => {
    pagedCollectionResourceHttpServiceSpy.get.and.returnValue(of(new PagedCollectionResource(new CollectionResource())));

    baseResource.getRelatedPage('product', {
      projection: 'productProjection'
    }).subscribe(() => {
      const resultResourceUrl = pagedCollectionResourceHttpServiceSpy.get.calls.argsFor(0)[0];
      expect(resultResourceUrl).toBe('http://localhost:8080/api/v1/order/1/products?projection=productProjection');

      const httpParams = pagedCollectionResourceHttpServiceSpy.get.calls.argsFor(0)[1].params;
      expect(httpParams.keys().length).toBe(0);
    });
  });

  it('should pass page params as http request params when link is NOT TEMPLATED', () => {
    pagedCollectionResourceHttpServiceSpy.get.and.returnValue(of(new PagedCollectionResource(new CollectionResource())));

    baseResource.getRelatedPage('magazine', {
      page: {
        size: 10,
        page: 1,
        sort: {
          abc: 'ASC',
          cde: 'DESC'
        }
      }
    }).subscribe(() => {
      const resultResourceUrl = pagedCollectionResourceHttpServiceSpy.get.calls.argsFor(0)[0];
      expect(resultResourceUrl).toBe('http://localhost:8080/api/v1/order/1/magazine');

      const httpParams = pagedCollectionResourceHttpServiceSpy.get.calls.argsFor(0)[1].params;
      expect(httpParams.has('size')).toBeTrue();
      expect(httpParams.get('size')).toBe('10');
      expect(httpParams.has('page')).toBeTrue();
      expect(httpParams.get('page')).toBe('1');
      expect(httpParams.has('sort')).toBeTrue();
      expect(httpParams.getAll('sort')[0]).toBe('abc,ASC');
      expect(httpParams.getAll('sort')[1]).toBe('cde,DESC');
    });
  });

  it('should throw error when page params passed IN PARAMS OBJECT for NOT TEMPLATED link', () => {
    try {
      baseResource.getRelatedPage('magazine', {
        params: {
          page: 1,
          size: 2,
          sort: {
            abc: 'ASC',
            cde: 'DESC'
          }
        }
      }).subscribe(() => {
      });
    } catch (error) {
      expect(error.message).toBe('Please, pass page params in page object key, not with params object!');
    }
  });

  it('should throw error when projection param passed IN PARAMS OBJECT for NOT TEMPLATED link', () => {
    try {
      baseResource.getRelatedPage('magazine', {
        params: {
          projection: 'magazineProjection'
        }
      }).subscribe(() => {
      });
    } catch (error) {
      expect(error.message).toBe('Please, pass projection param in projection object key, not with params object!');
    }
  });

  it('should adds projection param to http request params for NOT TEMPLATED link', () => {
    pagedCollectionResourceHttpServiceSpy.get.and.returnValue(of(new PagedCollectionResource(new CollectionResource())));

    baseResource.getRelatedPage('magazine', {
      projection: 'magazineProjection'
    }).subscribe(() => {
      const resultResourceUrl = pagedCollectionResourceHttpServiceSpy.get.calls.argsFor(0)[0];
      expect(resultResourceUrl).toBe('http://localhost:8080/api/v1/order/1/magazine');

      const httpParams = pagedCollectionResourceHttpServiceSpy.get.calls.argsFor(0)[1].params;
      expect(httpParams.has('projection')).toBeTrue();
      expect(httpParams.get('projection')).toBe('magazineProjection');
    });
  });

  it('no errors when passed "null" value options', () => {
    pagedCollectionResourceHttpServiceSpy.get.and.returnValue(of(new PagedCollectionResource(new CollectionResource())));

    baseResource.getRelatedPage('updateStatus', null).subscribe(() => {
      const options = pagedCollectionResourceHttpServiceSpy.get.calls.argsFor(0)[1];
      expect(options).toBeDefined();
      expect((options.params as HttpParams).keys().length).toBe(0);
    });
  });

  it('no errors when passed "undefined" value for options', () => {
    pagedCollectionResourceHttpServiceSpy.get.and.returnValue(of(new PagedCollectionResource(new CollectionResource())));

    baseResource.getRelatedPage('updateStatus', undefined).subscribe(() => {
      const options = pagedCollectionResourceHttpServiceSpy.get.calls.argsFor(0)[1];
      expect(options).toBeDefined();
      expect((options.params as HttpParams).keys().length).toBe(0);
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
        {provide: ResourceHttpService, useValue: resourceHttpServiceSpy}
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    baseResource = new TestOrderResource();
    DependencyInjector.injector = TestBed;
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

  it('no errors when passed "null" values for body and options', () => {
    const orderResource = new TestOrderResource();
    orderResource.product = new TestProductResource();
    resourceHttpServiceSpy.post.and.returnValue(of(orderResource));

    baseResource.postRelation('updateStatus', null, null).subscribe(() => {
      const body = resourceHttpServiceSpy.post.calls.argsFor(0)[1];
      expect(body).toBe(null);

      const options = resourceHttpServiceSpy.post.calls.argsFor(0)[2];
      expect(options).toBeDefined();
      expect((options.params as HttpParams).keys().length).toBe(0);
    });
  });

  it('no errors when passed "undefined" values for body and options', () => {
    const orderResource = new TestOrderResource();
    orderResource.product = new TestProductResource();
    resourceHttpServiceSpy.post.and.returnValue(of(orderResource));

    baseResource.postRelation('updateStatus', undefined, undefined).subscribe(() => {
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
        {provide: ResourceHttpService, useValue: resourceHttpServiceSpy}
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    baseResource = new TestOrderResource();
    DependencyInjector.injector = TestBed;
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

  it('no errors when passed "null" values for body and options', () => {
    const orderResource = new TestOrderResource();
    orderResource.product = new TestProductResource();
    resourceHttpServiceSpy.patch.and.returnValue(of(orderResource));

    baseResource.patchRelation('updateStatus', null, null).subscribe(() => {
      const body = resourceHttpServiceSpy.patch.calls.argsFor(0)[1];
      expect(body).toBe(null);

      const options = resourceHttpServiceSpy.patch.calls.argsFor(0)[2];
      expect(options).toBeDefined();
      expect((options.params as HttpParams).keys().length).toBe(0);
    });
  });

  it('no errors when passed "undefined" values for body and options', () => {
    const orderResource = new TestOrderResource();
    orderResource.product = new TestProductResource();
    resourceHttpServiceSpy.patch.and.returnValue(of(orderResource));

    baseResource.patchRelation('updateStatus', undefined, undefined).subscribe(() => {
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

  it('should pass default observe "body" option', () => {
    resourceHttpServiceSpy.put.and.returnValue(of(new TestOrderResource()));

    baseResource.putRelation('updateStatus', {body: {}}, {
      params: {statusId: 1}
    }).subscribe(() => {
      const observe = resourceHttpServiceSpy.put.calls.argsFor(0)[2].observe;
      expect(observe).toBe('body');
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

  it('no errors when passed "null" values for body and options', () => {
    const orderResource = new TestOrderResource();
    orderResource.product = new TestProductResource();
    resourceHttpServiceSpy.put.and.returnValue(of(orderResource));

    baseResource.putRelation('updateStatus', null, null).subscribe(() => {
      const body = resourceHttpServiceSpy.put.calls.argsFor(0)[1];
      expect(body).toBe(null);

      const options = resourceHttpServiceSpy.put.calls.argsFor(0)[2];
      expect(options).toBeDefined();
      expect((options.params as HttpParams).keys().length).toBe(0);
    });
  });

  it('no errors when passed "undefined" values for body and options', () => {
    const orderResource = new TestOrderResource();
    orderResource.product = new TestProductResource();
    resourceHttpServiceSpy.put.and.returnValue(of(orderResource));

    baseResource.putRelation('updateStatus', undefined, undefined).subscribe(() => {
      const body = resourceHttpServiceSpy.put.calls.argsFor(0)[1];
      expect(body).toBe(null);

      const options = resourceHttpServiceSpy.put.calls.argsFor(0)[2];
      expect(options).toBeDefined();
      expect((options.params as HttpParams).keys().length).toBe(0);
    });
  });

});
