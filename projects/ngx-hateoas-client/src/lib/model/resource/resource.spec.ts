import { async, TestBed } from '@angular/core/testing';
import { ResourceHttpService } from '../../service/internal/resource-http.service';
import { DependencyInjector } from '../../util/dependency-injector';
import { Resource } from './resource';
import { of } from 'rxjs';
import { ResourceUtils } from '../../util/resource.utils';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { LibConfig } from '../../config/lib-config';

// tslint:disable:variable-name
// tslint:disable:no-string-literal
class TestProductResource extends Resource {
  _links = {
    self: {
      href: 'http://localhost:8080/api/v1/product/1'
    },
    product: {
      href: 'http://localhost:8080/api/v1/product/1'
    }
  };
}

class BadTestProductResource extends Resource {
  _links = {
    self: {
      href: 'http://localhost:8080/api/v1/product/'
    },
    product: {
      href: 'http://localhost:8080/api/v1/product/1'
    }
  };
}

class TestOrderResource extends Resource {
  _links = {
    self: {
      href: 'http://localhost:8080/api/v1/order/1'
    },
    order: {
      href: 'http://localhost:8080/api/v1/order/1'
    },
    product: {
      href: 'http://localhost:8080/api/v1/order/1/products{?someParam,anotherParam}',
      templated: true
    },
    magazine: {
      href: 'http://localhost:8080/api/v1/order/1/magazine'
    }
  };
}

describe('Resource', () => {

  it('should has self link href', () => {
    const orderResource = new TestOrderResource();

    expect(orderResource.getSelfLinkHref()).toBe('http://localhost:8080/api/v1/order/1');
  });

  it('should return "true" when resourceName eq to passed resource class name', () => {
    const orderResource = new TestOrderResource();
    orderResource['resourceName'] = 'TestOrderResource';

    expect(orderResource.isResourceOf(TestOrderResource)).toBeTrue();
  });

  it('should return "true" when resourceName eq to passed name', () => {
    const orderResource = new TestOrderResource();
    orderResource['resourceName'] = 'OrderResource';

    expect(orderResource.isResourceOf('OrderResource')).toBeTrue();
  });

});

describe('Resource ADD_RELATION', () => {
  let resource: Resource;
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
    resource = new TestOrderResource();
    DependencyInjector.injector = TestBed;
    ResourceUtils.useResourceType(Resource);
  });

  afterEach(() => {
    DependencyInjector.injector = null;
    ResourceUtils.useResourceType(null);
  });

  it('should throw error when passed relationName is empty', () => {
    expect(() => resource.addCollectionRelation('', [new TestProductResource()]))
      .toThrowError(`Passed param(s) 'relationName = ' is not valid`);
  });

  it('should throw error when passed entities is empty', () => {
    expect(() => resource.addCollectionRelation('any', []))
      .toThrowError(`Passed param(s) 'entities = []' is not valid`);
  });

  it('should throw error when passed relationName,entities are undefined', () => {
    expect(() => resource.addCollectionRelation(undefined, undefined))
      .toThrowError(`Passed param(s) 'relationName = undefined', 'entities = undefined' are not valid`);
  });

  it('should throw error when passed relationName,entities are null', () => {
    expect(() => resource.addCollectionRelation(null, null))
      .toThrowError(`Passed param(s) 'relationName = null', 'entities = null' are not valid`);
  });

  it('should clear template params in TEMPLATED relation link', () => {
    resourceHttpServiceSpy.post.and.returnValue(of(new HttpResponse()));

    resource.addCollectionRelation('product', [new TestProductResource()])
      .subscribe(() => {
        const resultResourceUrl = resourceHttpServiceSpy.post.calls.argsFor(0)[0];
        expect(resultResourceUrl).toBe('http://localhost:8080/api/v1/order/1/products');
      });
  });

  it('should pass relation self link as body', () => {
    resourceHttpServiceSpy.post.and.returnValue(of(new HttpResponse()));

    resource.addCollectionRelation('product', [new TestProductResource()])
      .subscribe(() => {
        const body = resourceHttpServiceSpy.post.calls.argsFor(0)[1];
        expect(body).toBe('http://localhost:8080/api/v1/product/1');
      });
  });

  it('should pass content-type: text/uri-list', () => {
    resourceHttpServiceSpy.post.and.returnValue(of(new HttpResponse()));

    resource.addCollectionRelation('product', [new TestProductResource()])
      .subscribe(() => {
        const headers = resourceHttpServiceSpy.post.calls.argsFor(0)[2].headers as HttpHeaders;
        expect(headers.has('Content-Type')).toBeTrue();
        expect(headers.get('Content-Type')).toBe('text/uri-list');
      });
  });

  it('should pass observe "response" value', () => {
    resourceHttpServiceSpy.post.and.returnValue(of(new HttpResponse()));

    resource.addCollectionRelation('product', [new TestProductResource()])
      .subscribe(() => {
        const observe = resourceHttpServiceSpy.post.calls.argsFor(0)[2].observe;
        expect(observe).toBeDefined();
        expect(observe).toBe('response');
      });
  });

});

describe('Resource BIND_RELATION', () => {
  let resource: Resource;
  let resourceHttpServiceSpy: any;

  beforeEach(async(() => {
    resourceHttpServiceSpy = {
      put: jasmine.createSpy('put')
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
    DependencyInjector.injector = TestBed;
    ResourceUtils.useResourceType(Resource);
    resource = new TestOrderResource();
  });

  afterEach(() => {
    DependencyInjector.injector = null;
    ResourceUtils.useResourceType(null);
  });

  it('should throw error when passed relationName is empty', () => {
    expect(() => resource.bindRelation('', [new TestProductResource()]))
      .toThrowError(`Passed param(s) 'relationName = ' is not valid`);
  });

  it('should throw error when passed relationName,entity are undefined', () => {
    expect(() => resource.bindRelation(undefined, undefined))
      .toThrowError(`Passed param(s) 'relationName = undefined', 'entities = undefined' are not valid`);
  });

  it('should throw error when passed relationName,entity are null', () => {
    expect(() => resource.bindRelation(null, null))
      .toThrowError(`Passed param(s) 'relationName = null', 'entities = null' are not valid`);
  });

  it('should clear template params in TEMPLATED relation link', () => {
    resourceHttpServiceSpy.put.and.returnValue(of(new HttpResponse()));

    resource.bindRelation('product', [new TestProductResource()])
      .subscribe(() => {
        const resultResourceUrl = resourceHttpServiceSpy.put.calls.argsFor(0)[0];
        expect(resultResourceUrl).toBe('http://localhost:8080/api/v1/order/1/products');
      });
  });

  it('should pass relation self link as body', () => {
    resourceHttpServiceSpy.put.and.returnValue(of(new HttpResponse()));

    resource.bindRelation('product', [new TestProductResource()])
      .subscribe(() => {
        const body = resourceHttpServiceSpy.put.calls.argsFor(0)[1];
        expect(body).toBe('http://localhost:8080/api/v1/product/1');
      });
  });

  it('should pass content-type: text/uri-list', () => {
    resourceHttpServiceSpy.put.and.returnValue(of(new HttpResponse()));

    resource.bindRelation('product', [new TestProductResource()])
      .subscribe(() => {
        const headers = resourceHttpServiceSpy.put.calls.argsFor(0)[2].headers as HttpHeaders;
        expect(headers.has('Content-Type')).toBeTrue();
        expect(headers.get('Content-Type')).toBe('text/uri-list');
      });
  });

  it('should pass observe "response" value', () => {
    resourceHttpServiceSpy.put.and.returnValue(of(new HttpResponse()));

    resource.bindRelation('product', [new TestProductResource()])
      .subscribe(() => {
        const observe = resourceHttpServiceSpy.put.calls.argsFor(0)[2].observe;
        expect(observe).toBeDefined();
        expect(observe).toBe('response');
      });
  });

});

describe('Resource UNBIND_RELATION', () => {
  let resource: Resource;
  let resourceHttpServiceSpy: any;

  beforeEach(async(() => {
    resourceHttpServiceSpy = {
      delete: jasmine.createSpy('delete')
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
    DependencyInjector.injector = TestBed;
    ResourceUtils.useResourceType(Resource);
    resource = new TestOrderResource();
  });

  afterEach(() => {
    DependencyInjector.injector = null;
    ResourceUtils.useResourceType(null);
  });

  it('should throw error when passed relationName is empty', () => {
    expect(() => resource.unbindRelation(''))
      .toThrowError(`Passed param(s) 'relationName = ' is not valid`);
  });

  it('should throw error when passed relationName is undefined', () => {
    expect(() => resource.unbindRelation(undefined))
      .toThrowError(`Passed param(s) 'relationName = undefined' is not valid`);
  });

  it('should throw error when passed relationName is null', () => {
    expect(() => resource.unbindRelation(null))
      .toThrowError(`Passed param(s) 'relationName = null' is not valid`);
  });

  it('should clear template params in TEMPLATED relation link', () => {
    resourceHttpServiceSpy.delete.and.returnValue(of(new HttpResponse()));

    resource.unbindRelation('product')
      .subscribe(() => {
        const resultResourceUrl = resourceHttpServiceSpy.delete.calls.argsFor(0)[0];
        expect(resultResourceUrl).toBe('http://localhost:8080/api/v1/order/1/products');
      });
  });

});

describe('Resource UNBIND_COLLECTION_RELATION', () => {
  let resource: Resource;
  let resourceHttpServiceSpy: any;

  beforeEach(async(() => {
    resourceHttpServiceSpy = {
      put: jasmine.createSpy('put')
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
    DependencyInjector.injector = TestBed;
    ResourceUtils.useResourceType(Resource);
    resource = new TestOrderResource();
  });

  afterEach(() => {
    DependencyInjector.injector = null;
    ResourceUtils.useResourceType(null);
  });

  it('should throw error when passed relationName is empty', () => {
    expect(() => resource.unbindCollectionRelation(''))
      .toThrowError(`Passed param(s) 'relationName = ' is not valid`);
  });

  it('should throw error when passed relationName is undefined', () => {
    expect(() => resource.unbindCollectionRelation(undefined))
      .toThrowError(`Passed param(s) 'relationName = undefined' is not valid`);
  });

  it('should throw error when passed relationName is null', () => {
    expect(() => resource.unbindCollectionRelation(null))
      .toThrowError(`Passed param(s) 'relationName = null' is not valid`);
  });

  it('should clear template params in TEMPLATED relation link', () => {
    resourceHttpServiceSpy.put.and.returnValue(of(new HttpResponse()));

    resource.unbindCollectionRelation('product')
      .subscribe(() => {
        const resultResourceUrl = resourceHttpServiceSpy.put.calls.argsFor(0)[0];
        expect(resultResourceUrl).toBe('http://localhost:8080/api/v1/order/1/products');
      });
  });

  it('should pass empty string as body', () => {
    resourceHttpServiceSpy.put.and.returnValue(of(new HttpResponse()));

    resource.unbindCollectionRelation('product')
      .subscribe(() => {
        const body = resourceHttpServiceSpy.put.calls.argsFor(0)[1];
        expect(body).toBe('');
      });
  });

  it('should pass content-type: text/uri-list', () => {
    resourceHttpServiceSpy.put.and.returnValue(of(new HttpResponse()));

    resource.unbindCollectionRelation('product')
      .subscribe(() => {
        const headers = resourceHttpServiceSpy.put.calls.argsFor(0)[2].headers as HttpHeaders;
        expect(headers.has('Content-Type')).toBeTrue();
        expect(headers.get('Content-Type')).toBe('text/uri-list');
      });
  });

  it('should pass observe "response" value', () => {
    resourceHttpServiceSpy.put.and.returnValue(of(new HttpResponse()));

    resource.unbindCollectionRelation('product')
      .subscribe(() => {
        const observe = resourceHttpServiceSpy.put.calls.argsFor(0)[2].observe;
        expect(observe).toBeDefined();
        expect(observe).toBe('response');
      });
  });

});

describe('Resource DELETE_RELATION', () => {
  let resource: Resource;
  let resourceHttpServiceSpy: any;

  beforeEach(async(() => {
    resourceHttpServiceSpy = {
      delete: jasmine.createSpy('delete')
    };

    TestBed.configureTestingModule({
      providers: [
        {provide: ResourceHttpService, useValue: resourceHttpServiceSpy}
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    DependencyInjector.injector = TestBed;
    ResourceUtils.useResourceType(Resource);
    resource = new TestOrderResource();
  });

  afterEach(() => {
    DependencyInjector.injector = null;
    ResourceUtils.useResourceType(null);
  });

  it('should throw error when passed relationName is empty', () => {
    expect(() => resource.deleteRelation('', new TestProductResource()))
      .toThrowError(`Passed param(s) 'relationName = ' is not valid`);
  });

  it('should throw error when passed relationName,entity are undefined', () => {
    expect(() => resource.deleteRelation(undefined, undefined))
      .toThrowError(`Passed param(s) 'relationName = undefined', 'entity = undefined' are not valid`);
  });

  it('should throw error when passed relationName,entity are null', () => {
    expect(() => resource.deleteRelation(null, null))
      .toThrowError(`Passed param(s) 'relationName = null', 'entity = null' are not valid`);
  });

  it('should generate url from relation link href and passed resource id retrieved by self link href', () => {
    resourceHttpServiceSpy.delete.and.returnValue(of(new HttpResponse()));

    resource.deleteRelation('product', new TestProductResource())
      .subscribe(() => {
        const resultResourceUrl = resourceHttpServiceSpy.delete.calls.argsFor(0)[0];
        expect(resultResourceUrl).toBe('http://localhost:8080/api/v1/order/1/products/1');
      });
  });

  it('should throw error when passed resource self link href has not id', () => {
    expect(() => resource.deleteRelation('product', new BadTestProductResource()))
      .toThrowError('Passed resource self link should has id');
  });

  it('should pass observe "response" value', () => {
    resourceHttpServiceSpy.delete.and.returnValue(of(new HttpResponse()));

    resource.deleteRelation('product', new TestProductResource())
      .subscribe(() => {
        const observe = resourceHttpServiceSpy.delete.calls.argsFor(0)[1].observe;
        expect(observe).toBeDefined();
        expect(observe).toBe('response');
      });
  });

});

