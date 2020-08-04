import { async, TestBed } from '@angular/core/testing';
import { ResourceHttpService } from '../service/resource-http.service';
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

  it('should throw error when try to add relation that does not exist', () => {
    try {
      resource.addRelation('unknown', new TestProductResource()).subscribe(() => {
      });
    } catch (error) {
      expect(error.message).toBe('No resource relation found');
    }
  });

  it('should throw error when pass relationName as null', () => {
    try {
      resource.addRelation(null, new TestProductResource()).subscribe(() => {
      });
    } catch (error) {
      expect(error.message).toBe('No resource relation found');
    }
  });

  it('should throw error when pass relationName as undefined', () => {
    try {
      resource.addRelation(undefined, new TestProductResource()).subscribe(() => {
      });
    } catch (error) {
      expect(error.message).toBe('No resource relation found');
    }
  });

  it('should clear template params in TEMPLATED relation link', () => {
    resourceHttpServiceSpy.post.and.returnValue(of(new HttpResponse()));

    resource.addRelation('product', new TestProductResource())
      .subscribe(() => {
        const resultResourceUrl = resourceHttpServiceSpy.post.calls.argsFor(0)[0];
        expect(resultResourceUrl).toBe('http://localhost:8080/api/v1/order/1/products');
      });
  });

  it('should pass relation self link as body', () => {
    resourceHttpServiceSpy.post.and.returnValue(of(new HttpResponse()));

    resource.addRelation('product', new TestProductResource())
      .subscribe(() => {
        const body = resourceHttpServiceSpy.post.calls.argsFor(0)[1];
        expect(body).toBe('http://localhost:8080/api/v1/product/1');
      });
  });

  it('should pass content-type: text/uri-list', () => {
    resourceHttpServiceSpy.post.and.returnValue(of(new HttpResponse()));

    resource.addRelation('product', new TestProductResource())
      .subscribe(() => {
        const headers = resourceHttpServiceSpy.post.calls.argsFor(0)[2].headers as HttpHeaders;
        expect(headers.has('Content-Type')).toBeTrue();
        expect(headers.get('Content-Type')).toBe('text/uri-list');
      });
  });

  it('should pass observe "response" value', () => {
    resourceHttpServiceSpy.post.and.returnValue(of(new HttpResponse()));

    resource.addRelation('product', new TestProductResource())
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

  it('should throw error when try to add relation that does not exist', () => {
    try {
      resource.bindRelation('unknown', new TestProductResource()).subscribe(() => {
      });
    } catch (error) {
      expect(error.message).toBe('No resource relation found');
    }
  });

  it('should throw error when pass relationName as null', () => {
    try {
      resource.bindRelation(null, new TestProductResource()).subscribe(() => {
      });
    } catch (error) {
      expect(error.message).toBe('No resource relation found');
    }
  });

  it('should throw error when pass relationName as undefined', () => {
    try {
      resource.bindRelation(undefined, new TestProductResource()).subscribe(() => {
      });
    } catch (error) {
      expect(error.message).toBe('No resource relation found');
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

  it('should throw error when try to add relation that does not exist', () => {
    try {
      resource.clearRelation('unknown').subscribe(() => {
      });
    } catch (error) {
      expect(error.message).toBe('No resource relation found');
    }
  });

  it('should throw error when pass relationName as null', () => {
    try {
      resource.clearRelation(null).subscribe(() => {
      });
    } catch (error) {
      expect(error.message).toBe('No resource relation found');
    }
  });

  it('should throw error when pass relationName as undefined', () => {
    try {
      resource.clearRelation(undefined).subscribe(() => {
      });
    } catch (error) {
      expect(error.message).toBe('No resource relation found');
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

  it('should throw error when try to add relation that does not exist', () => {
    try {
      resource.deleteRelation('unknown', new TestProductResource()).subscribe(() => {
      });
    } catch (error) {
      expect(error.message).toBe('No resource relation found');
    }
  });

  it('should throw error when pass relationName as null', () => {
    try {
      resource.deleteRelation(null, new TestProductResource()).subscribe(() => {
      });
    } catch (error) {
      expect(error.message).toBe('No resource relation found');
    }
  });

  it('should throw error when pass relationName as undefined', () => {
    try {
      resource.deleteRelation(undefined, new TestProductResource()).subscribe(() => {
      });
    } catch (error) {
      expect(error.message).toBe('No resource relation found');
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
      expect(e.message).toBe('passed resource self link should has id');
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

