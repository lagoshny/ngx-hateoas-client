import { async } from '@angular/core/testing';
import { HttpExecutor } from '../http-executor';
import { of } from 'rxjs';
import anything = jasmine.anything;

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

    httpExecutor =
      new HttpExecutor(httpClientSpy);
  }));

  it('should throw error when invoke GET method with empty url', () => {
    httpClientSpy.get.and.returnValue(of(anything()));

    httpExecutor.get('').subscribe(() => {
    }, error => {
      expect(error.message).toBe('url should be defined');
    });
  });

  it('should throw error when invoke GET method with null url', () => {
    httpClientSpy.get.and.returnValue(of(anything()));

    httpExecutor.get(null).subscribe(() => {
    }, error => {
      expect(error.message).toBe('url should be defined');
    });
  });

  it('should throw error when invoke GET method with undefined url', () => {
    httpClientSpy.get.and.returnValue(of(anything()));

    httpExecutor.get(undefined).subscribe(() => {
    }, error => {
      expect(error.message).toBe('url should be defined');
    });
  });

  it('should invoke HTTP client GET method', () => {
    httpClientSpy.get.and.returnValue(of(anything()));

    httpExecutor.get('someUrl').subscribe(() => {
      expect(httpClientSpy.get.calls.count()).toBe(1);
    });
  });

  it('should throw error when invoke POST method with empty url', () => {
    httpClientSpy.post.and.returnValue(of(anything()));

    httpExecutor.post('', 'any').subscribe(() => {
    }, error => {
      expect(error.message).toBe('url should be defined');
    });
  });

  it('should throw error when invoke POST method with null url', () => {
    httpClientSpy.post.and.returnValue(of(anything()));

    httpExecutor.post(null, 'any').subscribe(() => {
    }, error => {
      expect(error.message).toBe('url should be defined');
    });
  });

  it('should throw error when invoke POST method with undefined url', () => {
    httpClientSpy.post.and.returnValue(of(anything()));

    httpExecutor.post(undefined, 'any').subscribe(() => {
    }, error => {
      expect(error.message).toBe('url should be defined');
    });
  });

  it('should invoke HTTP client POST method', () => {
    httpClientSpy.post.and.returnValue(of(anything()));

    httpExecutor.post('someUrl', 'any').subscribe(() => {
      expect(httpClientSpy.post.calls.count()).toBe(1);
    });
  });

  it('no errors when invoke HTTP client POST method with empty body', () => {
    httpClientSpy.post.and.returnValue(of(anything()));

    httpExecutor.post('someUrl', '').subscribe(() => {
      expect(httpClientSpy.post.calls.count()).toBe(1);
    });
  });

  it('no errors when invoke HTTP client POST method with null body', () => {
    httpClientSpy.post.and.returnValue(of(anything()));

    httpExecutor.post('someUrl', null).subscribe(() => {
      expect(httpClientSpy.post.calls.count()).toBe(1);
    });
  });

  it('no errors when invoke HTTP client POST method with undefined body', () => {
    httpClientSpy.post.and.returnValue(of(anything()));

    httpExecutor.post('someUrl', undefined).subscribe(() => {
      expect(httpClientSpy.post.calls.count()).toBe(1);
    });
  });

  it('should throw error when invoke PUT method with empty url', () => {
    httpClientSpy.put.and.returnValue(of(anything()));

    httpExecutor.put('', 'any').subscribe(() => {
    }, error => {
      expect(error.message).toBe('url should be defined');
    });
  });

  it('should throw error when invoke PUT method with null url', () => {
    httpClientSpy.put.and.returnValue(of(anything()));

    httpExecutor.put(null, 'any').subscribe(() => {
    }, error => {
      expect(error.message).toBe('url should be defined');
    });
  });

  it('should throw error when invoke PUT method with undefined url', () => {
    httpClientSpy.put.and.returnValue(of(anything()));

    httpExecutor.put(undefined, 'any').subscribe(() => {
    }, error => {
      expect(error.message).toBe('url should be defined');
    });
  });

  it('should invoke HTTP client PUT method', () => {
    httpClientSpy.put.and.returnValue(of(anything()));

    httpExecutor.put('someUrl', 'any').subscribe(() => {
      expect(httpClientSpy.put.calls.count()).toBe(1);
    });
  });

  it('no errors when invoke HTTP client PUT method with empty body', () => {
    httpClientSpy.put.and.returnValue(of(anything()));

    httpExecutor.put('someUrl', '').subscribe(() => {
      expect(httpClientSpy.put.calls.count()).toBe(1);
    });
  });

  it('no errors when invoke HTTP client PUT method with null body', () => {
    httpClientSpy.put.and.returnValue(of(anything()));

    httpExecutor.put('someUrl', null).subscribe(() => {
      expect(httpClientSpy.put.calls.count()).toBe(1);
    });
  });

  it('no errors when invoke HTTP client PUT method with undefined body', () => {
    httpClientSpy.put.and.returnValue(of(anything()));

    httpExecutor.put('someUrl', undefined).subscribe(() => {
      expect(httpClientSpy.put.calls.count()).toBe(1);
    });
  });

  it('should throw error when invoke PATCH method with empty url', () => {
    httpClientSpy.patch.and.returnValue(of(anything()));

    httpExecutor.patch('', 'any').subscribe(() => {
    }, error => {
      expect(error.message).toBe('url should be defined');
    });
  });

  it('should throw error when invoke PATCH method with null url', () => {
    httpClientSpy.patch.and.returnValue(of(anything()));

    httpExecutor.patch(null, 'any').subscribe(() => {
    }, error => {
      expect(error.message).toBe('url should be defined');
    });
  });

  it('should throw error when invoke PATCH method with undefined url', () => {
    httpClientSpy.patch.and.returnValue(of(anything()));

    httpExecutor.patch(undefined, 'any').subscribe(() => {
    }, error => {
      expect(error.message).toBe('url should be defined');
    });
  });

  it('should invoke HTTP client PATCH method', () => {
    httpClientSpy.patch.and.returnValue(of(anything()));

    httpExecutor.patch('someUrl', 'any').subscribe(() => {
      expect(httpClientSpy.patch.calls.count()).toBe(1);
    });
  });

  it('no errors when invoke HTTP client PATCH method with empty body', () => {
    httpClientSpy.patch.and.returnValue(of(anything()));

    httpExecutor.patch('someUrl', '').subscribe(() => {
      expect(httpClientSpy.patch.calls.count()).toBe(1);
    });
  });

  it('no errors when invoke HTTP client PATCH method with null body', () => {
    httpClientSpy.patch.and.returnValue(of(anything()));

    httpExecutor.patch('someUrl', null).subscribe(() => {
      expect(httpClientSpy.patch.calls.count()).toBe(1);
    });
  });

  it('no errors when invoke HTTP client PATCH method with undefined body', () => {
    httpClientSpy.patch.and.returnValue(of(anything()));

    httpExecutor.patch('someUrl', undefined).subscribe(() => {
      expect(httpClientSpy.patch.calls.count()).toBe(1);
    });
  });

  it('should throw error when invoke DELETE method with empty url', () => {
    httpClientSpy.delete.and.returnValue(of(anything()));

    httpExecutor.delete('').subscribe(() => {
    }, error => {
      expect(error.message).toBe('url should be defined');
    });
  });

  it('should throw error when invoke DELETE method with null url', () => {
    httpClientSpy.delete.and.returnValue(of(anything()));

    httpExecutor.delete(null).subscribe(() => {
    }, error => {
      expect(error.message).toBe('url should be defined');
    });
  });

  it('should throw error when invoke DELETE method with undefined url', () => {
    httpClientSpy.delete.and.returnValue(of(anything()));

    httpExecutor.delete(undefined).subscribe(() => {
    }, error => {
      expect(error.message).toBe('url should be defined');
    });
  });

  it('should invoke HTTP client DELETE method', () => {
    httpClientSpy.delete.and.returnValue(of(anything()));

    httpExecutor.delete('someUrl').subscribe(() => {
      expect(httpClientSpy.delete.calls.count()).toBe(1);
    });
  });

});
