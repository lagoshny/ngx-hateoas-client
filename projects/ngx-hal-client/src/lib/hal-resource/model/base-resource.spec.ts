import { BaseResource } from './base-resource';
import { async, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ResourceHttpService } from '../service/resource-http.service';
import { DependencyInjector } from '../../util/dependency-injector';

class TestOrderResource extends BaseResource {
  _links = {
    self: {
      href: 'http://localhost:8080/api/v1/order/1'
    },
    order: {
      href: 'http://localhost:8080/api/v1/order/1'
    },
    updateStatus: {
      href: 'http://localhost:8080/api/v1/order/1/updateStatus'
    },
    updateStatusTemplated: {
      href: 'http://localhost:8080/api/v1/order/1/updateStatus/{statusId}',
      templated: true
    },
    product: {
      href: 'http://localhost:8080/api/v1/order/1/products{?page,size,sort}',
      templated: true
    }
  };

}

// describe('BaseResource', () => {
//   let baseResource: BaseResource;
//   beforeEach(() => {
//     baseResource = new TestOrderResource();
//   });
//
//   it('should get relation', () => {
//     baseResource.getRelation(TestOrderResource, 'cart')
//       .subscribe(value => {
//         console.log(value);
//       });
//     // baseResource.postRelation('');
//   });
//
// });

describe('BaseResource', () => {
  let baseResource: BaseResource;
  let resourceHttpServiceSpy: any;

  beforeEach(async(() => {
    resourceHttpServiceSpy = {
      getResource: jasmine.createSpy('getResource'),
      postResource: jasmine.createSpy('postResource')
    };

    TestBed.configureTestingModule({
      providers: [
        // {provide: ResourceHttpService, useClass: ResourceHttpServiceStub}
        {provide: ResourceHttpService, useValue: resourceHttpServiceSpy}
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    baseResource = new TestOrderResource();
    DependencyInjector.injector = TestBed;
  });

  it('GET_RELATION: should throw error when try to get relation that doesn\'t exist', () => {
    baseResource.getRelation(TestOrderResource, 'unknown').subscribe(() => {
    }, error => {
      expect(error).toBe('no relation found');
    });
  });

  it('GET_RELATION: should clear template from url', () => {
    resourceHttpServiceSpy.getResource.and.returnValue(of(new TestOrderResource()));

    baseResource.getRelation(TestOrderResource, 'product').subscribe(() => {
      const resultResourceUrl = resourceHttpServiceSpy.getResource.calls.argsFor(0)[1];
      expect(resultResourceUrl).toBe('http://localhost:8080/api/v1/order/1/products');
    });
  });

  it('POST_RELATION: should throw error when try to post relation that doesn\'t exist', () => {
    baseResource.postRelation('unknown', {}).subscribe(() => {
    }, error => {
      expect(error).toBe('no relation found');
    });
  });

  it('POST_RELATION: should fill url template from params', () => {
    resourceHttpServiceSpy.postResource.and.returnValue(of(new TestOrderResource()));

    baseResource.postRelation('updateStatusTemplated', {}, {
      statusId: 1
    }).subscribe(() => {
      const resultResourceUrl = resourceHttpServiceSpy.postResource.calls.argsFor(0)[1];
      expect(resultResourceUrl).toBe('http://localhost:8080/api/v1/order/1/updateStatus/1');
    });
  });

  it('POST_RELATION: should fill url params when it passed', () => {
    resourceHttpServiceSpy.postResource.and.returnValue(of(new TestOrderResource()));

    baseResource.postRelation('updateStatus', {}, {
      statusId: 1
    }).subscribe(() => {
      const httpParams = resourceHttpServiceSpy.postResource.calls.argsFor(0)[3].params;
      expect(httpParams.has('statusId')).toBeTrue();
    });
  });

});
