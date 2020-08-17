/* tslint:disable:no-string-literal */

import { PagedResourceCollection } from './paged-resource-collection';
import { SimpleResourceCollection } from './resources.test';
import { async, TestBed } from '@angular/core/testing';
import { PagedResourceCollectionHttpService } from '../service/paged-resource-collection-http.service';
import { DependencyInjector } from '../../util/dependency-injector';
import { of } from 'rxjs';
import { ResourceCollection } from './resource-collection';

describe('PagedResourceCollection', () => {

  const pageDataWithLinks = {
    page: {
      totalElements: 100,
      number: 2,
      size: 10,
      totalPages: 10
    },
    _links: {
      self: {
        href: 'http://localhost:8080/api/v1/tasks{?projection}',
        templated: true
      },
      first: {
        href: 'http://localhost:8080/api/v1/tasks?page=0&size=1'
      },
      next: {
        href: 'http://localhost:8080/api/v1/tasks?page=1&size=1'
      },
      prev: {
        href: 'http://localhost:8080/api/v1/tasks?page=0&size=1'
      },
      last: {
        href: 'http://localhost:8080/api/v1/tasks?page=1&size=1'
      }
    }
  };
  let pagedResourceCollectionHttpServiceSpy: any;

  beforeEach(async(() => {
    pagedResourceCollectionHttpServiceSpy = {
      get: jasmine.createSpy('get')
    };

    TestBed.configureTestingModule({
      providers: [
        {provide: PagedResourceCollectionHttpService, useValue: pagedResourceCollectionHttpServiceSpy}
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    DependencyInjector.injector = TestBed;
  });

  it('should be created from resource collection with default page options', () => {
    const pagedResourceCollection = new PagedResourceCollection(new SimpleResourceCollection());

    expect(pagedResourceCollection.resources.length).toBe(1);
    expect(pagedResourceCollection.pageNumber).toBe(0);
    expect(pagedResourceCollection.pageSize).toBe(20);
    expect(pagedResourceCollection.totalElements).toBe(0);
    expect(pagedResourceCollection.totalPages).toBe(1);
    expect(pagedResourceCollection.hasFirst()).toBeFalse();
    expect(pagedResourceCollection.hasNext()).toBeFalse();
    expect(pagedResourceCollection.hasPrev()).toBeFalse();
    expect(pagedResourceCollection.hasLast()).toBeFalse();
  });

  it('should sets passed PageData', () => {
    const pageData = {
      page: {
        totalElements: 100,
        number: 2,
        size: 10,
        totalPages: 10
      }
    };
    const pagedResourceCollection = new PagedResourceCollection(new SimpleResourceCollection(), pageData);

    expect(pagedResourceCollection.resources.length).toBe(1);
    expect(pagedResourceCollection.pageNumber).toBe(pageData.page.number);
    expect(pagedResourceCollection.pageSize).toBe(pageData.page.size);
    expect(pagedResourceCollection.totalElements).toBe(pageData.page.totalElements);
    expect(pagedResourceCollection.totalPages).toBe(pageData.page.totalPages);
    expect(pagedResourceCollection.hasFirst()).toBeFalse();
    expect(pagedResourceCollection.hasNext()).toBeFalse();
    expect(pagedResourceCollection.hasPrev()).toBeFalse();
    expect(pagedResourceCollection.hasLast()).toBeFalse();
  });

  it('should sets passed PageData with links', () => {
    const pagedResourceCollection = new PagedResourceCollection(new SimpleResourceCollection(), pageDataWithLinks);

    expect(pagedResourceCollection.resources.length).toBe(1);
    expect(pagedResourceCollection.pageNumber).toBe(pageDataWithLinks.page.number);
    expect(pagedResourceCollection.pageSize).toBe(pageDataWithLinks.page.size);
    expect(pagedResourceCollection.totalElements).toBe(pageDataWithLinks.page.totalElements);
    expect(pagedResourceCollection.totalPages).toBe(pageDataWithLinks.page.totalPages);
    expect(pagedResourceCollection.hasFirst()).toBeTrue();
    expect(pagedResourceCollection.hasNext()).toBeTrue();
    expect(pagedResourceCollection.hasPrev()).toBeTrue();
    expect(pagedResourceCollection.hasLast()).toBeTrue();
  });

  it('should apply page params when perform custom page query', () => {
    pagedResourceCollectionHttpServiceSpy.get.and.returnValue(of(new PagedResourceCollection(new ResourceCollection())));

    const pagedResourceCollection = new PagedResourceCollection(new SimpleResourceCollection(), pageDataWithLinks);
    pagedResourceCollection.customPage({page: 2, size: 8, sort: {first: 'ASC', second: 'DESC'}})
      .subscribe(() => {
        const httpParams = pagedResourceCollectionHttpServiceSpy.get.calls.argsFor(0)[1].params;
        expect(httpParams.has('page')).toBeTrue();
        expect(httpParams.get('page')).toBe('2');

        expect(httpParams.has('sort')).toBeTrue();
        expect(httpParams.getAll('sort')[0]).toBe('first,ASC');
        expect(httpParams.getAll('sort')[1]).toBe('second,DESC');

        expect(httpParams.has('size')).toBeTrue();
        expect(httpParams.get('size')).toBe('8');
      });
  });

});

