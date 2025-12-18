import { beforeEach, describe, expect, it, vi } from 'vitest';
/* tslint:disable:no-string-literal */
import { PagedResourceCollection } from './paged-resource-collection';
import { SimpleResourceCollection } from './resources.test-utils';
import { TestBed } from '@angular/core/testing';
import { PagedResourceCollectionHttpService } from '../../service/internal/paged-resource-collection-http.service';
import { DependencyInjector } from '../../util/dependency-injector';
import { of } from 'rxjs';
import { ResourceCollection } from './resource-collection';
import { PagedGetOption, Sort } from '../declarations';
import { Injector } from '@angular/core';

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
        href: 'http://localhost:8080/api/v1/tasks?page=0&size=1{?projection}',
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

  beforeEach(async () => {
    pagedResourceCollectionHttpServiceSpy = {
      get: vi.fn()
    };

    await TestBed.configureTestingModule({
      providers: [
        { provide: PagedResourceCollectionHttpService, useValue: pagedResourceCollectionHttpServiceSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    DependencyInjector.injector = TestBed.inject(Injector);
  });

  it('should be created from resource collection with default page options', () => {
    const pagedResourceCollection = new PagedResourceCollection(new SimpleResourceCollection());

    expect(pagedResourceCollection.resources.length).toBe(1);
    expect(pagedResourceCollection.pageNumber).toBe(0);
    expect(pagedResourceCollection.pageSize).toBe(20);
    expect(pagedResourceCollection.totalElements).toBe(0);
    expect(pagedResourceCollection.totalPages).toBe(1);
    expect(pagedResourceCollection.hasFirst()).toBe(false);
    expect(pagedResourceCollection.hasNext()).toBe(false);
    expect(pagedResourceCollection.hasPrev()).toBe(false);
    expect(pagedResourceCollection.hasLast()).toBe(false);
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
    expect(pagedResourceCollection.hasFirst()).toBe(false);
    expect(pagedResourceCollection.hasNext()).toBe(false);
    expect(pagedResourceCollection.hasPrev()).toBe(false);
    expect(pagedResourceCollection.hasLast()).toBe(false);
  });

  it('should sets passed PageData with links', () => {
    const pagedResourceCollection = new PagedResourceCollection(new SimpleResourceCollection(), pageDataWithLinks);

    expect(pagedResourceCollection.resources.length).toBe(1);
    expect(pagedResourceCollection.pageNumber).toBe(pageDataWithLinks.page.number);
    expect(pagedResourceCollection.pageSize).toBe(pageDataWithLinks.page.size);
    expect(pagedResourceCollection.totalElements).toBe(pageDataWithLinks.page.totalElements);
    expect(pagedResourceCollection.totalPages).toBe(pageDataWithLinks.page.totalPages);
    expect(pagedResourceCollection.hasFirst()).toBe(true);
    expect(pagedResourceCollection.hasNext()).toBe(true);
    expect(pagedResourceCollection.hasPrev()).toBe(true);
    expect(pagedResourceCollection.hasLast()).toBe(true);
  });

  it('CUSTOM_PAGE should apply page params when perform custom page query', () => {
    pagedResourceCollectionHttpServiceSpy.get.mockReturnValue(of(new PagedResourceCollection(new ResourceCollection())));

    const pagedResourceCollection = new PagedResourceCollection(new SimpleResourceCollection(), pageDataWithLinks);
    pagedResourceCollection.customPage({ pageParams: { page: 2, size: 8 }, sort: { first: 'ASC', second: 'DESC' } })
      .subscribe(() => {
        const options: PagedGetOption = vi.mocked(pagedResourceCollectionHttpServiceSpy.get).mock.calls[0][1];
        expect(options).toBeDefined();
        expect(options.pageParams).toBeDefined();
        expect(options?.pageParams?.page).toBeDefined();
        expect(options?.pageParams?.page).toEqual(2);

        expect(options?.pageParams?.size).toBeDefined();
        expect(options?.pageParams?.size).toEqual(8);

        expect(options?.sort).toBeDefined();
        expect(options?.sort?.['first']).toBeDefined();
        expect(options?.sort?.['first']).toEqual('ASC');
        expect(options?.sort?.['second']).toBeDefined();
        expect(options?.sort?.['second']).toEqual('DESC');
      });
  });

  it('CUSTOM_PAGE should clear previous page params', () => {
    pagedResourceCollectionHttpServiceSpy.get.mockReturnValue(of(new PagedResourceCollection(new ResourceCollection())));

    const pagedResourceCollection = new PagedResourceCollection(new SimpleResourceCollection(), pageDataWithLinks);
    pagedResourceCollection.customPage({ pageParams: { page: 2, size: 8 }, sort: { first: 'ASC', second: 'DESC' } })
      .subscribe(() => {
        const urlString: string = vi.mocked(pagedResourceCollectionHttpServiceSpy.get).mock.calls[0][0];
        const url = new URL(urlString);

        expect(url.searchParams.has('page')).toBe(false);
        expect(url.searchParams.has('size')).toBe(false);
        expect(url.searchParams.has('sort')).toBe(false);
      });
  });

  it('CUSTOM_PAGE should use sort params passed as params', () => {
    pagedResourceCollectionHttpServiceSpy.get.mockReturnValue(of(new PagedResourceCollection(new ResourceCollection())));

    const pagedResourceCollection = new PagedResourceCollection(new SimpleResourceCollection(), {
      ...pageDataWithLinks,
      _links: {
        ...pageDataWithLinks._links,
        self: {
          href: 'http://localhost:8080/api/v1/tasks?page=0&size=1&sort=first,ASC'
        }
      }
    });
    const sortParams: Sort = { first: 'ASC', second: 'DESC' };
    pagedResourceCollection.customPage({ pageParams: { page: 2, size: 8 }, sort: sortParams })
      .subscribe((customPageCollection) => {
        const urlString: string = vi.mocked(pagedResourceCollectionHttpServiceSpy.get).mock.calls[0][0];
        const url = new URL(urlString);
        expect(url.searchParams.has('page')).toBe(false);
        expect(url.searchParams.has('size')).toBe(false);
        expect(url.searchParams.has('sort')).toBe(false);

        const actualSortParams = vi.mocked(pagedResourceCollectionHttpServiceSpy.get).mock.calls[0][1].sort;
        expect(sortParams).toBe(actualSortParams);
      });
  });

  it('CUSTOM_PAGE should use previous sort params when sort params is not passed', () => {
    pagedResourceCollectionHttpServiceSpy.get.mockReturnValue(of(new PagedResourceCollection(new ResourceCollection())));

    const pagedResourceCollection = new PagedResourceCollection(new SimpleResourceCollection(), {
      ...pageDataWithLinks,
      _links: {
        ...pageDataWithLinks._links,
        self: {
          href: 'http://localhost:8080/api/v1/tasks?page=0&size=1&sort=first,ASC&sort=second,DESC'
        }
      }
    });
    pagedResourceCollection.customPage({ pageParams: { page: 2, size: 8 } })
      .subscribe((customPageCollection) => {
        const urlString: string = vi.mocked(pagedResourceCollectionHttpServiceSpy.get).mock.calls[0][0];
        const url = new URL(urlString);
        expect(url.searchParams.has('page')).toBe(false);
        expect(url.searchParams.has('size')).toBe(false);
        expect(url.searchParams.has('sort')).toBe(true);
      });
  });

  it('PAGE should not change pageSize when request new page', () => {
    pagedResourceCollectionHttpServiceSpy.get.mockReturnValue(of(
      new PagedResourceCollection(new ResourceCollection(), pageDataWithLinks)));

    const pagedResourceCollection = new PagedResourceCollection(new SimpleResourceCollection(), pageDataWithLinks);
    pagedResourceCollection.page(2).subscribe(pagedCollection => {
      expect(pagedCollection.pageSize).toBe(10);
    });
  });

});
