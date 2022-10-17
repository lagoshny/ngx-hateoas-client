import { UrlUtils } from './url.utils';
import { SimpleResource } from '../model/resource/resources.test';
import { LibConfig } from '../config/lib-config';
import { DEFAULT_ROUTE_NAME } from '../config/hateoas-configuration.interface';

/* tslint:disable:no-string-literal */
describe('UrlUtils', () => {

  const baseUrl = 'http://localhost:8080/api/v1';
  const notTemplatedUrl = 'http://localhost:8080/api/v1/resource/1';
  const templatedUrl = 'http://localhost:8080/api/v1/pagedResourceCollection{?page,size,sort,projection,any}';

  it('CONVERT_TO_HTTP_PARAMS should return empty http request params when passed options is null', () => {
    expect(UrlUtils.convertToHttpParams(null).keys().length).toBe(0);
  });

  it('CONVERT_TO_HTTP_PARAMS should return empty http request params when passed options is undefined', () => {
    expect(UrlUtils.convertToHttpParams(undefined).keys().length).toBe(0);
  });

  it('CONVERT_TO_HTTP_PARAMS should return empty http request params when passed options is empty', () => {
    expect(UrlUtils.convertToHttpParams({}).keys().length).toBe(0);
  });

  it('CONVERT_TO_HTTP_PARAMS should throw error when option.params has page param', () => {
    expect(() => UrlUtils.convertToHttpParams({params: {page: 'test'}}))
      .toThrowError('Please, pass page params in page object key, not with params object!');
  });

  it('CONVERT_TO_HTTP_PARAMS should throw error when option.params has size param', () => {
    expect(() => UrlUtils.convertToHttpParams({params: {size: 'test'}}))
      .toThrowError('Please, pass page params in page object key, not with params object!');
  });

  it('CONVERT_TO_HTTP_PARAMS should adds resource param as self href link', () => {
    const simpleResource = new SimpleResource();
    const result = UrlUtils.convertToHttpParams({params: {res: simpleResource}});

    expect(result.has('res')).toBeTrue();
    expect(result.get('res')).toBe(simpleResource._links.self.href);
  });

  it('CONVERT_TO_HTTP_PARAMS should adds primitives param as is', () => {
    const result = UrlUtils.convertToHttpParams({params: {str: 'test', num: 1, bol: true}});

    expect(result.has('str')).toBeTrue();
    expect(result.get('str')).toBe('test');

    expect(result.has('num')).toBeTrue();
    expect(result.get('num')).toBe('1');

    expect(result.has('bol')).toBeTrue();
    expect(result.get('bol')).toBe('true');
  });

  it('CONVERT_TO_HTTP_PARAMS should adds page params', () => {
    const result = UrlUtils.convertToHttpParams({
      pageParams: {
        page: 1,
        size: 20
      },
      sort: {
        abs: 'ASC',
        dce: 'DESC'
      }
    });

    expect(result.has('page')).toBeTrue();
    expect(result.get('page')).toBe('1');

    expect(result.has('size')).toBeTrue();
    expect(result.get('size')).toBe('20');

    expect(result.has('sort')).toBeTrue();
    expect(result.getAll('sort')[0]).toBe('abs,ASC');
    expect(result.getAll('sort')[1]).toBe('dce,DESC');
  });

  it('CONVERT_TO_HTTP_PARAMS should adds projection param', () => {
    const result = UrlUtils.convertToHttpParams({
      params: {
        projection: 'testProjection'
      }
    });

    expect(result.has('projection')).toBeTrue();
    expect(result.get('projection')).toBe('testProjection');
  });

  it('CONVERT_TO_HTTP_OPTIONS should return an empty object when options is null', () => {
    const result = UrlUtils.convertToHttpOptions(null);

    expect(result).toEqual({});
  });

  it('CONVERT_TO_HTTP_OPTIONS should return an empty object when options is undefined', () => {
    const result = UrlUtils.convertToHttpOptions(null);

    expect(result).toEqual({});
  });

  it('CONVERT_TO_HTTP_OPTIONS should return an empty object when options is empty object', () => {
    const result = UrlUtils.convertToHttpOptions(null);

    expect(result).toEqual({});
  });


  it('CONVERT_TO_HTTP_OPTIONS should convert options to HttpOptions with ALL params', () => {
    const result = UrlUtils.convertToHttpOptions({
      params: {
        testParam: 'test'
      },
      sort: {
        prop: 'ASC'
      },
      pageParams: {
        page: 1,
        size: 0
      },
      observe: 'response',
      withCredentials: true,
      headers: {
        testHeader: 'HEADER'
      },
      reportProgress: true,
      useCache: true
    });

    expect(result.params.get('testParam')).toBe('test');
    expect(result.params.get('sort')).toBe('prop,ASC');
    expect(result.params.get('page')).toBe('1');
    expect(result.params.get('size')).toBe('0');
    expect(result.observe).toBe('response');
    expect(result.withCredentials).toBeTrue();
    expect(result.headers['testHeader']).toBe('HEADER');
    expect(result.reportProgress).toBeTrue();
  });

  it('CONVERT_TO_HTTP_OPTIONS should convert options to HttpOptions with SOME params', () => {
    const result = UrlUtils.convertToHttpOptions({
      params: {
        testParam: 'test'
      },
      sort: {
        prop: 'ASC'
      },
      pageParams: {
        page: 1,
        size: 0
      },
      useCache: true
    });

    expect(result.params.get('testParam')).toBe('test');
    expect(result.params.get('sort')).toBe('prop,ASC');
    expect(result.params.get('page')).toBe('1');
    expect(result.params.get('size')).toBe('0');
    expect(result.observe).toBeUndefined();
    expect(result.withCredentials).toBeUndefined();
    expect(result.headers).toBeUndefined();
    expect(result.reportProgress).toBeUndefined();
  });


  it('GENERATE_RESOURCE_URL should throw error when baseUrl is empty', () => {
    expect(() => UrlUtils.generateResourceUrl('', 'any'))
      .toThrowError(`Passed param(s) 'baseUrl = ' is not valid`);
  });

  it('GENERATE_RESOURCE_URL should throw error when resourceName is empty', () => {
    expect(() => UrlUtils.generateResourceUrl('any', ''))
      .toThrowError(`Passed param(s) 'resourceName = ' is not valid`);
  });

  it('GENERATE_RESOURCE_URL should throw error when baseUrl,resourceName is null', () => {
    expect(() => UrlUtils.generateResourceUrl(null, null))
      .toThrowError(`Passed param(s) 'baseUrl = null', 'resourceName = null' are not valid`);
  });
  it('GENERATE_RESOURCE_URL should throw error when baseUrl,resourceName is undefined', () => {
    expect(() => UrlUtils.generateResourceUrl(undefined, undefined))
      .toThrowError(`Passed param(s) 'baseUrl = undefined', 'resourceName = undefined' are not valid`);
  });

  it('GENERATE_RESOURCE_URL should return url with base url and resourceName', () => {
    expect(UrlUtils.generateResourceUrl(baseUrl, 'test')).toBe(`${ baseUrl }/test`);
  });

  it('GENERATE_RESOURCE_URL should return url with base url and resourceName and query', () => {
    expect(UrlUtils.generateResourceUrl(baseUrl, 'test', 'testQuery')).toBe(`${ baseUrl }/test/testQuery`);
  });

  it('GENERATE_RESOURCE_URL should return url with base url and resourceName and query without add double slash', () => {
    expect(UrlUtils.generateResourceUrl(baseUrl, 'test', '/testQuery')).toBe(`${ baseUrl }/test/testQuery`);
  });

  it('REMOVE_TEMPLATE_PARAMS should throw error when url is empty', () => {
    expect(() => UrlUtils.removeTemplateParams(''))
      .toThrowError(`Passed param(s) 'url = ' is not valid`);
  });

  it('REMOVE_TEMPLATE_PARAMS should throw error when url is null', () => {
    expect(() => UrlUtils.removeTemplateParams(null))
      .toThrowError(`Passed param(s) 'url = null' is not valid`);
  });

  it('REMOVE_TEMPLATE_PARAMS should throw error when url is undefined', () => {
    expect(() => UrlUtils.removeTemplateParams(undefined))
      .toThrowError(`Passed param(s) 'url = undefined' is not valid`);
  });

  it('REMOVE_TEMPLATE_PARAMS should do nothing when url is not templated', () => {
    expect(UrlUtils.removeTemplateParams(notTemplatedUrl)).toBe(notTemplatedUrl);
  });

  it('REMOVE_TEMPLATE_PARAMS should remove template param from url', () => {
    expect(UrlUtils.removeTemplateParams(templatedUrl)).toBe('http://localhost:8080/api/v1/pagedResourceCollection');
  });

  it('FILL_TEMPLATE_PARAMS should throw error when url is empty', () => {
    expect(() => UrlUtils.fillTemplateParams('', {params: {test: ''}}))
      .toThrowError(`Passed param(s) 'url = ' is not valid`);
  });

  it('FILL_TEMPLATE_PARAMS should throw error when url is null', () => {
    expect(() => UrlUtils.fillTemplateParams(null, {params: {test: ''}}))
      .toThrowError(`Passed param(s) 'url = null' is not valid`);
  });

  it('FILL_TEMPLATE_PARAMS should throw error when url is undefined', () => {
    expect(() => UrlUtils.fillTemplateParams(undefined, {params: {test: ''}}))
      .toThrowError(`Passed param(s) 'url = undefined' is not valid`);
  });

  it('FILL_TEMPLATE_PARAMS should clear template params when options is null', () => {
    expect(UrlUtils.fillTemplateParams(templatedUrl, null)).toBe('http://localhost:8080/api/v1/pagedResourceCollection');
  });

  it('FILL_TEMPLATE_PARAMS should clear template params when options is undefined', () => {
    expect(UrlUtils.fillTemplateParams(templatedUrl, undefined)).toBe('http://localhost:8080/api/v1/pagedResourceCollection');
  });

  it('FILL_TEMPLATE_PARAMS should fill ALL template params', () => {
    expect(UrlUtils.fillTemplateParams(templatedUrl, {
      params: {
        any: 123,
        projection: 'testProjection',
      },
      pageParams: {
        page: 2,
        size: 30
      },
      sort: {
        first: 'ASC',
        second: 'DESC'
      }
    }))
      .toBe('http://localhost:8080/api/v1/pagedResourceCollection?page=2&size=30&projection=testProjection&any=123&sort=first,ASC&sort=second,DESC');
  });

  it('FILL_TEMPLATE_PARAMS should fill passed template params other clear', () => {
    expect(UrlUtils.fillTemplateParams(templatedUrl, {
      params: {
        any: 123
      },
      pageParams: {
        page: 2,
        size: 30,
      }
    }))
      .toBe('http://localhost:8080/api/v1/pagedResourceCollection?page=2&size=30&any=123');
  });

  it('GENERATE_LINK_URL should throw error when relationLink is null', () => {
    expect(() => UrlUtils.generateLinkUrl(null))
      .toThrowError(`Passed param(s) 'relationLink = null', 'linkUrl = undefined' are not valid`);
  });

  it('GENERATE_LINK_URL should throw error when relationLink is undefined', () => {
    expect(() => UrlUtils.generateLinkUrl(undefined))
      .toThrowError(`Passed param(s) 'relationLink = undefined', 'linkUrl = undefined' are not valid`);
  });

  it('GENERATE_LINK_URL should throw error when relationLink.href is empty', () => {
    expect(() => UrlUtils.generateLinkUrl({href: ''}))
      .toThrowError(`Passed param(s) 'linkUrl = ' is not valid`);
  });

  it('GENERATE_LINK_URL should throw error when relationLink.href is null', () => {
    expect(() => UrlUtils.generateLinkUrl({href: null}))
      .toThrowError(`Passed param(s) 'linkUrl = null' is not valid`);
  });

  it('GENERATE_LINK_URL should throw error when relationLink.href is undefined', () => {
    expect(() => UrlUtils.generateLinkUrl({href: undefined}))
      .toThrowError(`Passed param(s) 'linkUrl = undefined' is not valid`);
  });

  it('GENERATE_LINK_URL should fill ALL template params when link is templated', () => {
    const result = UrlUtils.generateLinkUrl(
      {href: `${ UrlUtils.getApiUrl(DEFAULT_ROUTE_NAME) }/test{?param1,param2}`, templated: true},
      {
        params: {
          param1: '1',
          param2: '2'
        }
      });

    expect(result).toBe(`${ UrlUtils.getApiUrl(DEFAULT_ROUTE_NAME) }/test?param1=1&param2=2`);
  });

  it('GENERATE_LINK_URL should fill PART OF template params when link is templated and passed not all params', () => {
    const result = UrlUtils.generateLinkUrl(
      {href: `${ UrlUtils.getApiUrl(DEFAULT_ROUTE_NAME) }/test{?param1,param2,sort,page,size}`, templated: true},
      {
        params: {
          param1: '1'
        },
        sort: {
          abc: 'ASC'
        },
        pageParams: {
          size: 10,
          page: 0
        }
      });

    expect(result).toBe(`${ UrlUtils.getApiUrl(DEFAULT_ROUTE_NAME) }/test?param1=1&page=0&size=10&sort=abc,ASC`);
  });

  it('GENERATE_LINK_URL should REMOVE template params when link is templated and passed params are empty', () => {
    const result = UrlUtils.generateLinkUrl(
      {href: `${ UrlUtils.getApiUrl(DEFAULT_ROUTE_NAME) }/test{?param1,param2}`, templated: true});

    expect(result).toBe(`${ UrlUtils.getApiUrl(DEFAULT_ROUTE_NAME) }/test`);
  });

  it('GENERATE_LINK_URL should NOT FILL template params when link is not templated', () => {
    const result = UrlUtils.generateLinkUrl(
      {href: `${ UrlUtils.getApiUrl(DEFAULT_ROUTE_NAME) }/test{?param1,param2}`, templated: false});

    expect(result).toBe(`${ UrlUtils.getApiUrl(DEFAULT_ROUTE_NAME) }/test{?param1,param2}`);
  });

  it('GENERATE_LINK_URL should replace root link url to proxyUrl', () => {
    spyOn(LibConfig, 'getConfig').and.returnValue({
      ...LibConfig.DEFAULT_CONFIG,
      http: {
        [DEFAULT_ROUTE_NAME]: {
          rootUrl: LibConfig.DEFAULT_CONFIG.http[DEFAULT_ROUTE_NAME].rootUrl,
          proxyUrl: 'http://myproxy.ru/api/v1'
        }
      }
    });
    const result = UrlUtils.generateLinkUrl({href: `${ UrlUtils.getApiUrl(DEFAULT_ROUTE_NAME) }/test`});

    expect(result).toBe('http://myproxy.ru/api/v1/test');
  });

  it('GENERATE_LINK_URL should NOT replace root link url to proxyUrl when it is empty', () => {
    spyOn(LibConfig, 'getConfig').and.returnValue({
      ...LibConfig.DEFAULT_CONFIG,
      http: {
        [DEFAULT_ROUTE_NAME]: {
          rootUrl: LibConfig.DEFAULT_CONFIG.http[DEFAULT_ROUTE_NAME].rootUrl,
          proxyUrl: ''
        }
      }
    });
    const result = UrlUtils.generateLinkUrl({href: `${ UrlUtils.getApiUrl(DEFAULT_ROUTE_NAME) }/test`});

    expect(result).toBe(`${ UrlUtils.getApiUrl(DEFAULT_ROUTE_NAME) }/test`);
  });

  it('GET_API_URL should return root link when proxy is empty', () => {
    spyOn(LibConfig, 'getConfig').and.returnValue({
      ...LibConfig.DEFAULT_CONFIG,
      http: {
        [DEFAULT_ROUTE_NAME]: {
          rootUrl: LibConfig.DEFAULT_CONFIG.http[DEFAULT_ROUTE_NAME].rootUrl,
          proxyUrl: ''
        }
      }
    });
    const result = UrlUtils.getApiUrl(DEFAULT_ROUTE_NAME);

    expect(result).toBe(LibConfig.getConfig().http[DEFAULT_ROUTE_NAME].rootUrl);
  });

  it('GET_API_URL should return proxy link when proxy is NOT empty', () => {
    spyOn(LibConfig, 'getConfig').and.returnValue({
      ...LibConfig.DEFAULT_CONFIG,
      http: {
        [DEFAULT_ROUTE_NAME]: {
          rootUrl: LibConfig.DEFAULT_CONFIG.http[DEFAULT_ROUTE_NAME].rootUrl,
          proxyUrl: 'http://myproxy.ru/api/v1'
        }
      }
    });
    const result = UrlUtils.getApiUrl(DEFAULT_ROUTE_NAME);

    expect(result).toBe(LibConfig.getConfig().http[DEFAULT_ROUTE_NAME].proxyUrl);
  });

  it('GET_RESOURCE_NAME_FROM_URL should throw error when url is empty', () => {
    expect(() => UrlUtils.getResourceNameFromUrl(''))
      .toThrowError(`Passed param(s) 'url = ' is not valid`);
  });

  it('GET_RESOURCE_NAME_FROM_URL should throw error when url is null', () => {
    expect(() => UrlUtils.getResourceNameFromUrl(null))
      .toThrowError(`Passed param(s) 'url = null' is not valid`);
  });

  it('GET_RESOURCE_NAME_FROM_URL should throw error when url is undefined', () => {
    expect(() => UrlUtils.getResourceNameFromUrl(undefined))
      .toThrowError(`Passed param(s) 'url = undefined' is not valid`);
  });

  it('GET_RESOURCE_NAME_FROM_URL should return resource name without root proxy', () => {
    const resourceNameFromUrl = UrlUtils.getResourceNameFromUrl('http://localhost:8080/api/v1/resources/1');
    expect(resourceNameFromUrl).toEqual('resources');
  });

  it('GET_RESOURCE_NAME_FROM_URL should return resource name when rootUrl ends with slash', () => {
    spyOn(LibConfig, 'getConfig').and.returnValue({
      ...LibConfig.DEFAULT_CONFIG,
      http: {
        [DEFAULT_ROUTE_NAME]: {
          rootUrl: 'https://localhost:8080/api/v1/'
        }
      }
    });
    const resourceNameFromUrl = UrlUtils.getResourceNameFromUrl('https://localhost:8080/api/v1/resources/1');
    expect(resourceNameFromUrl).toEqual('resources');
  });

  it('GET_RESOURCE_NAME_FROM_URL should return resource name when proxyUrl ends with slash', () => {
    spyOn(LibConfig, 'getConfig').and.returnValue({
      ...LibConfig.DEFAULT_CONFIG,
      http: {
        [DEFAULT_ROUTE_NAME]: {
          rootUrl: 'http://localhost:5050/api/v1/',
          proxyUrl: 'https://localhost:8080/api/v1/'
        }
      }
    });
    const resourceNameFromUrl = UrlUtils.getResourceNameFromUrl('https://localhost:8080/api/v1/resources/1');
    expect(resourceNameFromUrl).toEqual('resources');
  });

  it('GET_RESOURCE_NAME_FROM_URL should return resource name with root proxy', () => {
    spyOn(LibConfig, 'getConfig').and.returnValue({
      ...LibConfig.DEFAULT_CONFIG,
      http: {
        [DEFAULT_ROUTE_NAME]: {
          rootUrl: LibConfig.DEFAULT_CONFIG.http[DEFAULT_ROUTE_NAME].rootUrl,
          proxyUrl: 'http://proxy-localhost:8080/api/v1'
        }
      }
    });
    const resourceNameFromUrl = UrlUtils.getResourceNameFromUrl('http://proxy-localhost:8080/api/v1/resources/1');
    expect(resourceNameFromUrl).toEqual('resources');
  });

  it('FILL_DEFAULT_PAGE_DATA_IF_NO_PRESENT fill all default values when passed options are \'null\'', () => {
    const pagedOptions = UrlUtils.fillDefaultPageDataIfNoPresent(null);

    expect(pagedOptions).toBeDefined();
    expect(pagedOptions.pageParams).toBeDefined();
    expect(pagedOptions.pageParams.page).toBe(LibConfig.getConfig().pagination.defaultPage.page);
    expect(pagedOptions.pageParams.size).toBe(LibConfig.getConfig().pagination.defaultPage.size);
  });

  it('FILL_DEFAULT_PAGE_DATA_IF_NO_PRESENT fill all default values when passed options are \'undefined\'', () => {
    const pagedOptions = UrlUtils.fillDefaultPageDataIfNoPresent(undefined);

    expect(pagedOptions).toBeDefined();
    expect(pagedOptions.pageParams).toBeDefined();
    expect(pagedOptions.pageParams.page).toBe(LibConfig.getConfig().pagination.defaultPage.page);
    expect(pagedOptions.pageParams.size).toBe(LibConfig.getConfig().pagination.defaultPage.size);
  });

  it('FILL_DEFAULT_PAGE_DATA_IF_NO_PRESENT fill all default values when passed options are \'empty object\'', () => {
    const pagedOptions = UrlUtils.fillDefaultPageDataIfNoPresent({});

    expect(pagedOptions).toBeDefined();
    expect(pagedOptions.pageParams).toBeDefined();
    expect(pagedOptions.pageParams.page).toBe(LibConfig.getConfig().pagination.defaultPage.page);
    expect(pagedOptions.pageParams.size).toBe(LibConfig.getConfig().pagination.defaultPage.size);
  });

  it('FILL_DEFAULT_PAGE_DATA_IF_NO_PRESENT fill page default value when passed options have not it', () => {
    const pagedOptions = UrlUtils.fillDefaultPageDataIfNoPresent({pageParams: {size: 40}});

    expect(pagedOptions).toBeDefined();
    expect(pagedOptions.pageParams).toBeDefined();
    expect(pagedOptions.pageParams.page).toBe(LibConfig.getConfig().pagination.defaultPage.page);
    expect(pagedOptions.pageParams.size).toBe(40);
  });

  it('FILL_DEFAULT_PAGE_DATA_IF_NO_PRESENT fill size default value when passed options have not it', () => {
    const pagedOptions = UrlUtils.fillDefaultPageDataIfNoPresent({pageParams: {page: 4}});

    expect(pagedOptions).toBeDefined();
    expect(pagedOptions.pageParams).toBeDefined();
    expect(pagedOptions.pageParams.page).toBe(4);
    expect(pagedOptions.pageParams.size).toBe(LibConfig.getConfig().pagination.defaultPage.size);
  });

  it('CLEAR_URL_PARAMS should throw error when url is empty', () => {
    expect(() => UrlUtils.clearUrlParams(''))
      .toThrowError(`Passed param(s) 'url = ' is not valid`);
  });

  it('CLEAR_URL_PARAMS should throw error when url is null', () => {
    expect(() => UrlUtils.clearUrlParams(null))
      .toThrowError(`Passed param(s) 'url = null' is not valid`);
  });

  it('CLEAR_URL_PARAMS should throw error when url is undefined', () => {
    expect(() => UrlUtils.clearUrlParams(undefined))
      .toThrowError(`Passed param(s) 'url = undefined' is not valid`);
  });

  it('CLEAR_URL_PARAMS clear all url param', () => {
    const clearedUrl = UrlUtils.clearUrlParams('http://localhost:8080/api/v1/products?page=0&size=3');

    expect(clearedUrl).toBeDefined();
    expect(clearedUrl).toEqual('http://localhost:8080/api/v1/products');
  });

  it('GUESS_RESOURCE_ROUTE_URL return proxy url if it equals to it', () => {
    spyOn(LibConfig, 'getConfig').and.returnValue({
      ...LibConfig.DEFAULT_CONFIG,
      http: {
        [DEFAULT_ROUTE_NAME]: {
          rootUrl: LibConfig.DEFAULT_CONFIG.http[DEFAULT_ROUTE_NAME].rootUrl,
          proxyUrl: 'http://myproxy.ru/api/v1'
        }
      }
    });

    const routeUrl = UrlUtils.guessResourceRoute('http://myproxy.ru/api/v1/test-resource/1').proxyUrl;

    expect(routeUrl).toBe(LibConfig.getConfig().http[DEFAULT_ROUTE_NAME].proxyUrl);
  });

  it('GUESS_RESOURCE_ROUTE_URL return base url if it equals to it', () => {
    spyOn(LibConfig, 'getConfig').and.returnValue({
      ...LibConfig.DEFAULT_CONFIG,
      http: {
        [DEFAULT_ROUTE_NAME]: {
          rootUrl: 'http://myroot.ru/api/v1'
        }
      }
    });

    const routeUrl = UrlUtils.guessResourceRoute('http://myroot.ru/api/v1/test-resource/1').rootUrl;

    expect(routeUrl).toBe(LibConfig.getConfig().http[DEFAULT_ROUTE_NAME].rootUrl);
  });

  it('GUESS_RESOURCE_ROUTE_URL throws exception when no route found', () => {
    spyOn(LibConfig, 'getConfig').and.returnValue({
      ...LibConfig.DEFAULT_CONFIG,
      http: {
        [DEFAULT_ROUTE_NAME]: {
          rootUrl: 'http://myroot.ru/api/v1'
        }
      }
    });
    const resourceUrl = 'http://myroot.another.ru/api/v1/test-resource/1';

    expect(() => {
      UrlUtils.guessResourceRoute(resourceUrl);
    }).toThrowError(`Failed to determine resource route by url: ${ resourceUrl }`);
  });

});
