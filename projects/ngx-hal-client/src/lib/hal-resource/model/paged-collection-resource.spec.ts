/* tslint:disable:no-string-literal */

import { PagedCollectionResource } from './paged-collection-resource';
import { SimpleCollectionResource } from './resources.test';
import { async, TestBed } from '@angular/core/testing';
import { PagedCollectionResourceHttpService } from '../service/paged-collection-resource-http.service';
import { DependencyInjector } from '../../util/dependency-injector';
import { of } from 'rxjs';
import { CollectionResource } from './collection-resource';

describe('PagedCollectionResource', () => {

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
    DependencyInjector.injector = TestBed;
  });

  it('should be created from collection resource with default page options', () => {
    const pagedCollectionResource = new PagedCollectionResource(new SimpleCollectionResource());

    expect(pagedCollectionResource.resources.length).toBe(1);
    expect(pagedCollectionResource.pageNumber).toBe(0);
    expect(pagedCollectionResource.pageSize).toBe(20);
    expect(pagedCollectionResource.totalElements).toBe(0);
    expect(pagedCollectionResource.totalPages).toBe(1);
    expect(pagedCollectionResource.hasFirst()).toBeFalse();
    expect(pagedCollectionResource.hasNext()).toBeFalse();
    expect(pagedCollectionResource.hasPrev()).toBeFalse();
    expect(pagedCollectionResource.hasLast()).toBeFalse();
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
    const pagedCollectionResource = new PagedCollectionResource(new SimpleCollectionResource(), pageData);

    expect(pagedCollectionResource.resources.length).toBe(1);
    expect(pagedCollectionResource.pageNumber).toBe(pageData.page.number);
    expect(pagedCollectionResource.pageSize).toBe(pageData.page.size);
    expect(pagedCollectionResource.totalElements).toBe(pageData.page.totalElements);
    expect(pagedCollectionResource.totalPages).toBe(pageData.page.totalPages);
    expect(pagedCollectionResource.hasFirst()).toBeFalse();
    expect(pagedCollectionResource.hasNext()).toBeFalse();
    expect(pagedCollectionResource.hasPrev()).toBeFalse();
    expect(pagedCollectionResource.hasLast()).toBeFalse();
  });

  it('should sets passed PageData with links', () => {
    const pagedCollectionResource = new PagedCollectionResource(new SimpleCollectionResource(), pageDataWithLinks);

    expect(pagedCollectionResource.resources.length).toBe(1);
    expect(pagedCollectionResource.pageNumber).toBe(pageDataWithLinks.page.number);
    expect(pagedCollectionResource.pageSize).toBe(pageDataWithLinks.page.size);
    expect(pagedCollectionResource.totalElements).toBe(pageDataWithLinks.page.totalElements);
    expect(pagedCollectionResource.totalPages).toBe(pageDataWithLinks.page.totalPages);
    expect(pagedCollectionResource.hasFirst()).toBeTrue();
    expect(pagedCollectionResource.hasNext()).toBeTrue();
    expect(pagedCollectionResource.hasPrev()).toBeTrue();
    expect(pagedCollectionResource.hasLast()).toBeTrue();
  });

  it('should apply page params when perform custom page query', () => {
    pagedCollectionResourceHttpServiceSpy.get.and.returnValue(of(new PagedCollectionResource(new CollectionResource())));

    const pagedCollectionResource = new PagedCollectionResource(new SimpleCollectionResource(), pageDataWithLinks);
    pagedCollectionResource.customPage({page: 2, size: 8, sort: {first: 'ASC', second: 'DESC'}})
      .subscribe(() => {
        const httpParams = pagedCollectionResourceHttpServiceSpy.get.calls.argsFor(0)[1].params;
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

