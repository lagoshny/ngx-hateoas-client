import { async, TestBed } from '@angular/core/testing';
import { ResourceHttpService } from '../../service/internal/resource-http.service';
import { DependencyInjector } from '../../util/dependency-injector';
import { Resource } from './resource';
import { of } from 'rxjs';
import { ResourceUtils } from '../../util/resource.utils';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

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
        {provide: ResourceHttpService, useValue: resourceHttpServiceSpy}
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    ResourceUtils.useResourceType(Resource);
    resource = new TestOrderResource();
    DependencyInjector.injector = TestBed;
  });

  it('should throw error when passed relationName is empty', () => {
    try {
      resource.addRelation('', [new TestProductResource()]).subscribe();
    } catch (e) {
      expect(e.message).toBe(`Passed param(s) 'relationName = ' is not valid`);
    }
  });

  it('should throw error when passed entities is empty', () => {
    try {
      resource.addRelation('any', []).subscribe();
    } catch (e) {
      expect(e.message).toBe(`Passed param(s) 'entities = []' is not valid`);
    }
  });

  it('should throw error when passed relationName and/or entities are undefined', () => {
    try {
      resource.addRelation(undefined, undefined).subscribe();
    } catch (e) {
      expect(e.message).toBe(`Passed param(s) 'relationName = undefined', 'entities = undefined' is not valid`);
    }
  });

  it('should throw error when passed relationName and/or entities are null', () => {
    try {
      resource.addRelation(null, null).subscribe();
    } catch (e) {
      expect(e.message).toBe(`Passed param(s) 'relationName = null', 'entities = null' is not valid`);
    }
  });

  it('should clear template params in TEMPLATED relation link', () => {
    resourceHttpServiceSpy.post.and.returnValue(of(new HttpResponse()));

    resource.addRelation('product', [new TestProductResource()])
      .subscribe(() => {
        const resultResourceUrl = resourceHttpServiceSpy.post.calls.argsFor(0)[0];
        expect(resultResourceUrl).toBe('http://localhost:8080/api/v1/order/1/products');
      });
  });

  it('should pass relation self link as body', () => {
    resourceHttpServiceSpy.post.and.returnValue(of(new HttpResponse()));

    resource.addRelation('product', [new TestProductResource()])
      .subscribe(() => {
        const body = resourceHttpServiceSpy.post.calls.argsFor(0)[1];
        expect(body).toBe('http://localhost:8080/api/v1/product/1');
      });
  });

  it('should pass content-type: text/uri-list', () => {
    resourceHttpServiceSpy.post.and.returnValue(of(new HttpResponse()));

    resource.addRelation('product', [new TestProductResource()])
      .subscribe(() => {
        const headers = resourceHttpServiceSpy.post.calls.argsFor(0)[2].headers as HttpHeaders;
        expect(headers.has('Content-Type')).toBeTrue();
        expect(headers.get('Content-Type')).toBe('text/uri-list');
      });
  });

  it('should pass observe "response" value', () => {
    resourceHttpServiceSpy.post.and.returnValue(of(new HttpResponse()));

    resource.addRelation('product', [new TestProductResource()])
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
        {provide: ResourceHttpService, useValue: resourceHttpServiceSpy}
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    ResourceUtils.useResourceType(Resource);
    resource = new TestOrderResource();
    DependencyInjector.injector = TestBed;
  });

  it('should throw error when passed relationName is empty', () => {
    try {
      resource.bindRelation('', new TestProductResource()).subscribe();
    } catch (e) {
      expect(e.message).toBe(`Passed param(s) 'relationName = ' is not valid`);
    }
  });

  it('should throw error when passed relationName and/or entity are undefined', () => {
    try {
      resource.bindRelation(undefined, undefined).subscribe();
    } catch (e) {
      expect(e.message).toBe(`Passed param(s) 'relationName = undefined', 'entity = undefined' is not valid`);
    }
  });

  it('should throw error when passed relationName and/or entity are null', () => {
    try {
      resource.bindRelation(null, null).subscribe();
    } catch (e) {
      expect(e.message).toBe(`Passed param(s) 'relationName = null', 'entity = null' is not valid`);
    }
  });

  it('should clear template params in TEMPLATED relation link', () => {
    resourceHttpServiceSpy.put.and.returnValue(of(new HttpResponse()));

    resource.bindRelation('product', new TestProductResource())
      .subscribe(() => {
        const resultResourceUrl = resourceHttpServiceSpy.put.calls.argsFor(0)[0];
        expect(resultResourceUrl).toBe('http://localhost:8080/api/v1/order/1/products');
      });
  });

  it('should pass relation self link as body', () => {
    resourceHttpServiceSpy.put.and.returnValue(of(new HttpResponse()));

    resource.bindRelation('product', new TestProductResource())
      .subscribe(() => {
        const body = resourceHttpServiceSpy.put.calls.argsFor(0)[1];
        expect(body).toBe('http://localhost:8080/api/v1/product/1');
      });
  });

  it('should pass content-type: text/uri-list', () => {
    resourceHttpServiceSpy.put.and.returnValue(of(new HttpResponse()));

    resource.bindRelation('product', new TestProductResource())
      .subscribe(() => {
        const headers = resourceHttpServiceSpy.put.calls.argsFor(0)[2].headers as HttpHeaders;
        expect(headers.has('Content-Type')).toBeTrue();
        expect(headers.get('Content-Type')).toBe('text/uri-list');
      });
  });

  it('should pass observe "response" value', () => {
    resourceHttpServiceSpy.put.and.returnValue(of(new HttpResponse()));

    resource.bindRelation('product', new TestProductResource())
      .subscribe(() => {
        const observe = resourceHttpServiceSpy.put.calls.argsFor(0)[2].observe;
        expect(observe).toBeDefined();
        expect(observe).toBe('response');
      });
  });

});

describe('Resource CLEAR_RELATION', () => {
  let resource: Resource;
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
    ResourceUtils.useResourceType(Resource);
    resource = new TestOrderResource();
    DependencyInjector.injector = TestBed;
  });

  it('should throw error when passed relationName is empty', () => {
    try {
      resource.clearRelation('').subscribe();
    } catch (e) {
      expect(e.message).toBe(`Passed param(s) 'relationName = ' is not valid`);
    }
  });

  it('should throw error when passed relationName is undefined', () => {
    try {
      resource.clearRelation(undefined).subscribe();
    } catch (e) {
      expect(e.message).toBe(`Passed param(s) 'relationName = undefined' is not valid`);
    }
  });

  it('should throw error when passed relationName is null', () => {
    try {
      resource.clearRelation(null).subscribe();
    } catch (e) {
      expect(e.message).toBe(`Passed param(s) 'relationName = null' is not valid`);
    }
  });

  it('should clear template params in TEMPLATED relation link', () => {
    resourceHttpServiceSpy.put.and.returnValue(of(new HttpResponse()));

    resource.clearRelation('product')
      .subscribe(() => {
        const resultResourceUrl = resourceHttpServiceSpy.put.calls.argsFor(0)[0];
        expect(resultResourceUrl).toBe('http://localhost:8080/api/v1/order/1/products');
      });
  });

  it('should pass empty string as body', () => {
    resourceHttpServiceSpy.put.and.returnValue(of(new HttpResponse()));

    resource.clearRelation('product')
      .subscribe(() => {
        const body = resourceHttpServiceSpy.put.calls.argsFor(0)[1];
        expect(body).toBe('');
      });
  });

  it('should pass content-type: text/uri-list', () => {
    resourceHttpServiceSpy.put.and.returnValue(of(new HttpResponse()));

    resource.clearRelation('product')
      .subscribe(() => {
        const headers = resourceHttpServiceSpy.put.calls.argsFor(0)[2].headers as HttpHeaders;
        expect(headers.has('Content-Type')).toBeTrue();
        expect(headers.get('Content-Type')).toBe('text/uri-list');
      });
  });

  it('should pass observe "response" value', () => {
    resourceHttpServiceSpy.put.and.returnValue(of(new HttpResponse()));

    resource.clearRelation('product')
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
    ResourceUtils.useResourceType(Resource);
    resource = new TestOrderResource();
    DependencyInjector.injector = TestBed;
  });

  it('should throw error when passed relationName is empty', () => {
    try {
      resource.deleteRelation('', new TestProductResource()).subscribe();
    } catch (e) {
      expect(e.message).toBe(`Passed param(s) 'relationName = ' is not valid`);
    }
  });

  it('should throw error when passed relationName and/or entity are undefined', () => {
    try {
      resource.deleteRelation(undefined, undefined).subscribe();
    } catch (e) {
      expect(e.message).toBe(`Passed param(s) 'relationName = undefined', 'entity = undefined' is not valid`);
    }
  });

  it('should throw error when passed relationName and/or entity are null', () => {
    try {
      resource.deleteRelation(null, null).subscribe();
    } catch (e) {
      expect(e.message).toBe(`Passed param(s) 'relationName = null', 'entity = null' is not valid`);
    }
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
    try {
      resource.deleteRelation('product', new BadTestProductResource())
        .subscribe(() => {
        });
    } catch (e) {
      expect(e.message).toBe('Passed resource self link should has id');
    }
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

