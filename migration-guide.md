# Migration guide
This guide allows you to know how to migrate from `@lagoshny/ngx-hal-client` to `@lagoshny/ngx-hateoas-client`.
Why you may need does it see in the [motivation](#motivation) section.


## Contents
1. [Motivation](#Motivation)
2. [Migration steps](#Migration-steps)
3. [Library changes](#Library-changes)
   - [Configuration](#Configuration)
   - [RestService](#RestService)
      - [Common changes](#Common-changes)
      - [Get](#get-changes)
      - [GetAll](#getall-changes)
      - [GetAllPage](#getallpage-changes)
      - [Search](#search-changes)
      - [SearchPage](#searchpage-changes)
      - [SearchSingle](#searchsingle-changes)
      - [CustomQuery](#customquery-changes)
      - [Create](#create-changes)
      - [Update](#update-changes)
      - [Patch](#patch-changes)
      - [Delete](#delete-changes)
      - [HandleError](#handleerror-changes)   
   - [Resource](#Resource)
      - [GetRelation](#GetRelation-changes)
      - [GetProjection](#GetProjection-changes)
      - [GetRelationArray](#GetRelationArray-changes)
      - [GetProjectionArray](#GetProjectionArray-changes)
      - [AddRelation](#AddRelation-changes)
      - [SubstituteRelation](#SubstituteRelation-changes)
      - [DeleteRelation](#DeleteRelation-changes)
      - [PostRelation](#PostRelation-changes)
      - [PatchRelation](#PatchRelation-changes)
   - [ResourcePage](#ResourcePage-changes)
      - [SortElements](#SortElements-changes)     
   - [Other classes](#Other-classes)
      - [CacheHelper](#CacheHelper-changes)
      - [HalParam](#HalParam-changes)
      - [HalOptions](#HalOptions-changes)
      - [LinkOptions](#LinkOptions-changes)
      - [Sort](#Sort-changes)
      - [SubTypeBuilder](#SubTypeBuilder-changes)
      - [ExpireMs and IsCacheActive](#ExpireMs-and-IsCacheActive-changes)

## Motivation
The main reason to create a new hateoas library is `@lagoshny/ngx-hal-client` was a fork from `angular4-hal` library and now `angular4-hal` is not supported.
To adds new features or refactoring fork version `@lagoshny/ngx-hal-client` is not the right way because it inherits all code from parent `angular4-hal` and the main problem is `angular4-hal` has not a good documentation and has some not documented features.

Lack of tests and documentation does not allow refactoring, implementing new functions and developing the old project.
New library rewritten taking only the best principles from `@lagoshny/ngx-hal-client` fork.

Some new features:
- A simplified configuration: now you inject configuration service and pass configuration as JS object 
  instead of create a standalone configuration class with configuration interface implementation. See more in [configuration](https://github.com/lagoshny/ngx-hateoas-client#Configuration).
- Added ability to debug library with [logging feature](https://github.com/lagoshny/ngx-hateoas-client#Logging).
- Changed [support for subtypes](https://github.com/lagoshny/ngx-hateoas-client#Subtypes-support) now is not need pass subtypes object to method param because each [Resource](https://github.com/lagoshny/ngx-hateoas-client#resource) class has a `resourceName` property and [isResourceOf](https://github.com/lagoshny/ngx-hateoas-client#isresourceof) method to check resource type.
- Added [HateoasResourceService](https://github.com/lagoshny/ngx-hateoas-client#built-in-hateoasresourceservice) is standalone generic resource service, only need to set generic param to resource type and use it without create a resource service class. 
- Added more than 400 tests.
- Added [documentation](https://github.com/lagoshny/ngx-hateoas-client#contents) describing all library features.
- And much more.

**It is strongly recommend migrate from `@lagoshny/ngx-hal-client` to `@lagoshny/ngx-hateoas-client` to be able to use new features.**

>Old `@lagoshny/ngx-hal-client` will not develop, will only bug fixes. 

## Migration steps
- The first migration step is delete `@lagoshny/ngx-hal-client` from `package.json` file and install `@lagoshny/ngx-hateoas-client` by the command 

  ```
  npm i @lagoshny/ngx-hateoas-client --save
  ``` 

- After that delete old `@lagoshny/ngx-hal-client` configuration and add a new `@lagoshny/ngx-hateoas-client` [configuration](https://github.com/lagoshny/ngx-hateoas-client#Configuration) using the same configuration params.

- Now need change class imports from `@lagoshny/ngx-hal-client` to `@lagoshny/ngx-hateoas-client`. 

  Use `replaceAll` command with a code editor.

- Do all `RestService` changes described [below](#RestService).

  >Find info about methods param changes in this [section](#Other-classes).  
  
- Do all `Resource` changes described [below](#Resource).

  >Find info about methods param changes in this [section](#Other-classes).

- Do all `ResourcePage` changes described [below](#ResourcePage-changes)

  >Find info about methods param changes in this [section](#Other-classes).

Congratulations! It is all that you need to do to migrate to `@lagoshny/ngx-hateoas-client`.

>You can found an example of the migration process by this [commit]() from one of my applications.

**If you have some questions or found a bug you can create new issue [here](https://github.com/lagoshny/ngx-hateoas-client/issues).**

## Library changes
This section describes the main library changes compare with `@lagoshny/ngx-hal-client` library.

## Configuration
The next changes were in the lib configuration:

The old configuration `ExternalConfigService` class was delete. 
Added new `NgxHateoasClientConfigurationService` class has the method `configure` to pass app configuration. 
How configure library with `NgxHateoasClientConfigurationService` see [here](https://github.com/lagoshny/ngx-hateoas-client#Configuration). 

## RestService
Class `RestService` renamed to `HateoasResourceOperation`.

### Common changes
The next common changes was in `RestService` (now is `HateoasResourceOperation` class):

- Deleted constructor params: `injector` and `type`, now only `resourceName` param.
- Deleted page methods:  `totalElement`, `totalPages`, `hasFirst`, `hasNext`, `hasPrev`, `hasLast`, `next`, `prev`, `first`, `last`, `page`. See [PagedResourceCollection](https://github.com/lagoshny/ngx-hateoas-client#PagedResourceCollection) to use these methods. 
- Deleted `getByRelation` and `getByRelationArray` use [getRelation](https://github.com/lagoshny/ngx-hateoas-client#GetRelation) and [getRelatedCollection](https://github.com/lagoshny/ngx-hateoas-client#GetRelatedCollection) from [Resource](https://github.com/lagoshny/ngx-hateoas-client#Resource) class instead.
- Deleted `customQueryPost` use [customQuery](https://github.com/lagoshny/ngx-hateoas-client#CustomQuery) instead.
- Deleted `count` use [customQuery](https://github.com/lagoshny/ngx-hateoas-client#CustomQuery) instead.
- Deleted `getBySelfLink` use [getResource](https://github.com/lagoshny/ngx-hateoas-client#GetResource) instead

### Get changes
Renamed `get` to `getResource` and changed method signature:

Was: 
```
get(id: any, params?: HalParam[]): Observable<T>;
```
Now: 
```
getResource(id: number | string, options?: GetOption): Observable<T>;
```

- Changed `id` param type from `any` to `number|string`
- Renamed `params` to `options` and changed type from `HalParam[]` to [GetOption](https://github.com/lagoshny/ngx-hateoas-client#GetOption).

> See more about `GetResource` method [here](https://github.com/lagoshny/ngx-hateoas-client#GetResource). 

### GetAll changes
Renamed `getAll` to `getCollection` and changed method signature:

Was: 
```
getAll(options?: HalOptions, subType?: SubTypeBuilder): Observable<T[]>;
```
Now: 
```
getCollection(options?: GetOption): Observable<ResourceCollection<T>>;
```

- Changed `options` type from `HalOptions` to [GetOption](https://github.com/lagoshny/ngx-hateoas-client#GetOption), see [here](#haloptions-changes) how to change `HalOptions` to `GetOption`.
- Deleted `subType` param, subtypes support, see [here](https://github.com/lagoshny/ngx-hateoas-client#Subtypes-support). 

> See more about `GetCollection` method [here](https://github.com/lagoshny/ngx-hateoas-client#GetCollection). 

### GetAllPage changes
Renamed `getAllPage` to `getPage` and changed method signature:

Was: 
```
getAllPage(options?: HalOptions, subType?: SubTypeBuilder): Observable<ResourcePage<T>>;
```
Now: 
```
getPage(options?: PagedGetOption): Observable<PagedResourceCollection<T>>;
```

- Changed `options` type from `HalOptions` to [PagedGetOption](https://github.com/lagoshny/ngx-hateoas-client#PagedGetOption), see [here](#haloptions-changes) how to change `HalOptions` to `PagedGetOption`.
- Deleted `subType` param, subtypes support, see [here](https://github.com/lagoshny/ngx-hateoas-client#Subtypes-support).
- Changed return value from `ResourcePage` to [PagedCollectionResource](https://github.com/lagoshny/ngx-hateoas-client#PagedResourceCollection) see [classes changes](#classes).

> See more about `GetPage` method [here](https://github.com/lagoshny/ngx-hateoas-client#GetPage). 

### Search changes
Renamed `search` to `searchCollection` and changed method signature:

Was: 
```
search(query: string, options?: HalOptions, subType?: SubTypeBuilder): Observable<T[]>;
```
Now: 
```
searchCollection(query: string, options?: GetOption): Observable<ResourceCollection<T>>;
```

- Changed `options` type from `HalOptions` to [GetOption](https://github.com/lagoshny/ngx-hateoas-client#GetOption), see [here](#haloptions-changes) how to change `HalOptions` to `GetOption`.
- Deleted `subType` param, subtypes support, see [here](https://github.com/lagoshny/ngx-hateoas-client#Subtypes-support).
- Changed return type  from `Array<Resource>` to [ResourceCollection](https://github.com/lagoshny/ngx-hateoas-client#ResourceCollection).

> See more about `SearchCollection` method [here](https://github.com/lagoshny/ngx-hateoas-client#SearchCollection). 

### SearchPage changes
`searchPage` changed method signature:

Was: 
```
searchPage(query: string, options?: HalOptions, subType?: SubTypeBuilder): Observable<ResourcePage<T>>;
```
Now: 
```
searchPage(query: string, options?: PagedGetOption): Observable<PagedResourceCollection<T>>;
```

- Changed `options` type from `HalOptions` to [PagedGetOption](https://github.com/lagoshny/ngx-hateoas-client#PagedGetOption), see [here](#haloptions-changes) how to change `HalOptions` to `PagedGetOption`.
- Deleted `subType` param, subtypes support, see [here](https://github.com/lagoshny/ngx-hateoas-client#Subtypes-support).
- Changed return type  from `ResourcePage` to [PagedCollectionResource](https://github.com/lagoshny/ngx-hateoas-client#PagedResourceCollection).

> See more about `SearchPage` method [here](https://github.com/lagoshny/ngx-hateoas-client#SearchPage). 

### SearchSingle changes
Renamed `searchSingle` to `searchResource` and changed method signature:

Was: 
```
searchSingle(query: string, options?: HalOptions): Observable<T>;
```
Now: 
```
searchResource(query: string, options?: GetOption): Observable<T>;
```

- Changed `options` type from `HalOptions` to [GetOption](https://github.com/lagoshny/ngx-hateoas-client#GetOption), see [here](#haloptions-changes) how to change `HalOptions` to `GetOption`.

> See more about `SearchResource` method [here](https://github.com/lagoshny/ngx-hateoas-client#SearchResource). 
 
### CustomQuery changes
`customQuery` changed method signature:

Was: 
```
customQuery(query: string, options?: HalOptions, subType?: SubTypeBuilder): Observable<T[]>;
```
Now: 
```
customQuery<R>(method: HttpMethod, query: string, requestBody?: RequestBody<any>, options?: PagedGetOption): Observable<R>;
```

- Added generic param `<R>` that define return type instead of old `Array<Resource>`.
- Added `method` param that defined the HTTP query method.
- Added [requestBody](https://github.com/lagoshny/ngx-hateoas-client#RequestBody) param allows pass request body (used with PATCH, PUT, POST methods).
- Changed `options` type from `HalOptions` to [PagedGetOption](https://github.com/lagoshny/ngx-hateoas-client#PagedGetOption), see [here](#haloptions-changes) how to change `HalOptions` to `PagedGetOption`.
- Deleted `subType` param, subtypes support, see [here](https://github.com/lagoshny/ngx-hateoas-client#Subtypes-support).

> See more about `CustomQuery` method [here](https://github.com/lagoshny/ngx-hateoas-client#CustomQuery). 

### Create changes
Renamed `create` to `createResource` and changed method signature:

Was: 
```
create(entity: T);
```
Now: 
```
createResource(requestBody: RequestBody<T>): Observable<T>;
```

- Renamed `entity` param to `requestBody` and changed type from `T` to [RequestBody<T>](https://github.com/lagoshny/ngx-hateoas-client#RequestBody).

> See more about `CreateResource` method [here](https://github.com/lagoshny/ngx-hateoas-client#CreateResource). 

### Update changes
Renamed `update` to `updateResource` and changed method signature:

Was: 
```
update(entity: T);
```
Now: 
```
updateResource(entity: T, requestBody?: RequestBody<any>): Observable<T | any>;
```

- Added [RequestBody](https://github.com/lagoshny/ngx-hateoas-client#RequestBody) param to pass part of `entity` values to change.

> See more about `UpdateResource` method [here](https://github.com/lagoshny/ngx-hateoas-client#UpdateResource). 

### Patch changes
Renamed `patch` to `patchResource` and changed method signature:

Was: 
```
patch(entity: T, options?: Array<ResourceOptions> | Include);
```
Now: 
```
patchResource(entity: T, requestBody?: RequestBody<any>): Observable<T | any>;
```

- Changed `options` type to [requestBody](https://github.com/lagoshny/ngx-hateoas-client#RequestBody).

> See more about `PatchResource` method [here](https://github.com/lagoshny/ngx-hateoas-client#PatchResource). 

### Delete changes  
Renamed `delete` to `deleteResource` and changed method signature:

Was: 
```
delete(entity: T): Observable<object>;
```
Now: 
```
deleteResource(entity: T, options?: RequestOption): Observable<HttpResponse<any> | any>;
```

- Added `options` param with type [RequestOption](https://github.com/lagoshny/ngx-hateoas-client#RequestOption) that allowed to define request return type `observe` or `response` and pass request params.

> See more about `DeleteResource` method [here](https://github.com/lagoshny/ngx-hateoas-client#DeleteResource). 

### HandleError changes
Deleted `handleError` method, if you need, define the same method in your project:

`handleError` is simple wrapper:
```
    protected handleError(error: any): Observable<never> {
      return observableThrowError(error);
    }
```


## Resource
This section contains `Resource` class changes.

### GetRelation changes
`getRelation` method signature changes:

Was: 
```
getRelation<T extends BaseResource>(type: {new (): T;}, relation: string, builder?: SubTypeBuilder, expireMs?: number, isCacheActive?: boolean): Observable<T>;
```
Now: 
```
getRelation<T extends BaseResource>(relationName: string, options?: GetOption): Observable<T>;
```

- Renamed `relation` param to `relationName`.
- Deleted `type`, `builder` (more about subtypes [here](https://github.com/lagoshny/ngx-hateoas-client#Subtypes-support)), `expireMs`, `isCacheActive` (more about cache support [here](https://github.com/lagoshny/ngx-hateoas-client##cache-support)).
- Added `options` [GetOption](https://github.com/lagoshny/ngx-hateoas-client#GetOption) param.

> See more about `GetRelation` method [here](https://github.com/lagoshny/ngx-hateoas-client#GetRelation). 

### GetProjection changes
Removed `getProjection` method, use [getRelation](https://github.com/lagoshny/ngx-hateoas-client#GetRelation) with options: `{params: {projection: 'projectionName'}}`.

> See more about `GetRelation` method [here](https://github.com/lagoshny/ngx-hateoas-client#GetRelation). 

### GetRelationArray changes
Renamed `getRelationArray` to `getRelatedCollection` and changed method signature:

Was: 
```
getRelationArray<T extends BaseResource>(type: { new(): T }, relation: string, options?: HalOptions, embedded?: string, builder?: SubTypeBuilder, expireMs: number = 0, isCacheActive: boolean = true): Observable<T[]>;
```
Now: 
```
getRelatedCollection<T extends ResourceCollection<BaseResource>>(relationName: string, options?: GetOption): Observable<T>;
```

- Renamed `relation` param to `relationName`.
- Deleted `type`, `embedded` (is not supported anymore), `builder` (more about subtypes [here](https://github.com/lagoshny/ngx-hateoas-client#Subtypes-support)), `expireMs`, `isCacheActive`  (more about cache support [here](https://github.com/lagoshny/ngx-hateoas-client##cache-support)).
- Changed `options` type from `HalOptions` to [GetOption](https://github.com/lagoshny/ngx-hateoas-client#GetOption), see [here](#haloptions-changes) how to change `HalOptions` to `GetOption`.
- Changed return type from `Array<Resource>` to [ResourceCollection<Resource>](https://github.com/lagoshny/ngx-hateoas-client#ResourceCollection).

> See more about `GetRelatedCollection` method [here](https://github.com/lagoshny/ngx-hateoas-client#GetRelatedCollection). 

### GetProjectionArray changes
Removed `getProjectionArray` method, use [getRelatedCollection](https://github.com/lagoshny/ngx-hateoas-client#GetRelatedCollection) with options: `{params: {projection: 'projectionName'}}`. 

> See more about `GetRelatedCollection` method [here](https://github.com/lagoshny/ngx-hateoas-client#GetRelatedCollection). 

### AddRelation changes
`addRelation` changed method signature:

Was: 
```
addRelation<T extends BaseResource>(relation: string, resource: T): Observable<any>;
```
Now: 
```
addRelation<T extends Resource>(relationName: string, entities: Array<T>): Observable<HttpResponse<any>>;
```

- Renamed `relation` param to `relationName`.
- Renamed `resource` param to `entities` and changed param type to an array.

> See more about `AddRelation` method [here](https://github.com/lagoshny/ngx-hateoas-client#AddRelation). 

### SubstituteRelation changes
Renamed `substituteRelation` to `bindRelation` and some method changes:

- Renamed `relation` param to `relationName`.
- Renamed `resource` param to `entitiy`.

> See more about `BindRelation` method [here](https://github.com/lagoshny/ngx-hateoas-client#BindRelation). 

### DeleteRelation changes
`deleteRelation` method changes:

- Renamed param `relation` to `relationName`
- Renamed param `resource` to `entitiy`

> See more about `DeleteRelation` method [here](https://github.com/lagoshny/ngx-hateoas-client#DeleteRelation). 

### PostRelation changes
`postRelation` changed method signature:

Was: 
```
postRelation(relation: string, body: any, options?: LinkOptions): Observable<any>;
```
Now: 
```
postRelation(relationName: string, requestBody: RequestBody<any>, options?: RequestOption): Observable<any>;
```

- Renamed `relation` to `relationName`.
- Renamed `body` param to `requestBody` and change type from `any` to [RequestBody](https://github.com/lagoshny/ngx-hateoas-client#RequestBody).
- Change `options` param type from `LinkOptions` to [RequestOption](https://github.com/lagoshny/ngx-hateoas-client#RequestOption).

> See more about `PostRelation` method [here](https://github.com/lagoshny/ngx-hateoas-client#PostRelation). 

### PatchRelation changes

`patchRelation` changed method signature:

Was: 
```
patchRelation(relation: string, body: any, options?: LinkOptions): Observable<any>;
```
Now: 
```
patchRelation(relationName: string, requestBody: RequestBody<any>, options?: RequestOption): Observable<any>;
```

- Renamed `relation` to `relationName`.
- Renamed `body` param to `requestBody` and change type from `any` to [RequestBody](https://github.com/lagoshny/ngx-hateoas-client#RequestBody).
- Change `options` param type from `LinkOptions` to [RequestOption](https://github.com/lagoshny/ngx-hateoas-client#RequestOption).

> See more about `PatchRelation` method [here](https://github.com/lagoshny/ngx-hateoas-client#PatchRelation). 


## ResourcePage changes

`ResourcePage` class renamed to [PagedCollectionResource](https://github.com/lagoshny/ngx-hateoas-client#PagedResourceCollection) and has the next changes:

### SortElements changes

`sortElements` changed method signature:

Was: 
```
sortElements(...sort: Sort[]): Observable<ResourcePage<T>>;
```
Now: 
```
sortElements(sortParam: Sort, options?: { useCache: true }): Observable<PagedResourceCollection<T>>;
``` 

- Changed `sort` param type, new type is object, more see [here](https://github.com/lagoshny/ngx-hateoas-client#Sort).

> See more about `SortElements` method [here](https://github.com/lagoshny/ngx-hateoas-client#SortElements). 


## Other classes

### CacheHelper changes
`CacheHelper` class does not exist anymore, use `NgxHateoasClientConfigurationService` to configure [cache settings](https://github.com/lagoshny/ngx-hateoas-client#cache-params).

### HalParam changes
`HalParam` class replaced to [GetOption](https://github.com/lagoshny/ngx-hateoas-client#GetOption) or [PagedGetOption](https://github.com/lagoshny/ngx-hateoas-client#PagedGetOption) classes.

Everywhere was used `HalParam` now need to use `GetOption` or `GetPagedOption` depends on return value when return value is `PagedResourceCollection` then will be `PagedGetOption`, `GetOption` otherwise.

Example of migration from `HalParam` to `GetOption` or `PagedGetOption`:

`HalParam` representation:

```js
params: [
  {
    key: 'projection',
    value: 'testProjection'
  },
  {
    key: 'param1',
    value: 'value1'
  },
  {
    key: 'param2',
    value: 'value2'
  }
]
```

After converting to `GetOption` or `PagedGetOption`:

```js
params: { 
   projection: 'testProjection',
   param1: 'value1',
   param2: 'value2'
}
```

### HalOptions changes
`HalOptions` class replaced to [GetOption](https://github.com/lagoshny/ngx-hateoas-client#GetOption) or [PagedGetOption](https://github.com/lagoshny/ngx-hateoas-client#PagedGetOption) classes.

Everywhere was used `HalOptions` now need to use `GetOption` or `GetPagedOption` depends on return value when return value is `PagedResourceCollection` then will be `PagedGetOption`, `GetOption` otherwise.

Example of migration from `HalOptions` to `GetOption` or `PagedGetOption`:

`HalOptions` representation:

```js
{
  size: 20,
  params: [
    {
      key: 'projection',
      value: 'testProjection'
    },
    {
      key: 'param1',
      value: 'value1'
    },
    {
      key: 'param2',
      value: 'value2'
    }
  ],
  sort: [
    {path: 'test', order: 'DESC'}
  ],
  notPaged: false
}
```

After converting to `GetOption`:

```js
{
 params: { 
    projection: 'testProjection',
    param1: 'value1',
    param2: 'value2
 },
 sort: {
    test: 'DESC'
 }
}
```

> Note! `GetOption` does not contain a `size` param because it is a page param.

After converting to `PagedGetOption`:

```js
{
 params: { 
    projection: 'testProjection',
    param1: 'value1',
    param2: 'value2
 },
 sort: {
    test: 'DESC'
 },
 pageParams: {
    size: 20
 }
}
```

### LinkOptions changes
`LinkOptions` replaced to `RequestOption` params. 

Example of migration from `LinkOptions` to `RequestOption`:

`LinkOptions` representation:

```js
{
  strictParams?: boolean,
  params: {
      param1: 'value1',
      param2: 'value2
  }
}
```

After converting to `PagedGetOption`:

```js
{
  params: {
      param1: 'value1',
      param2: 'value2
  }
  observe?: 'body' | 'response';
}
```

> `strictParams` was delete and `observe` was add that allows change response type from `raw body` to `Angular HttpResponse`.

### Sort changes
Sort param was changed from array to object notation.

Was:

```js
sort: [
  {path: 'test', order: 'DESC'}
]
```

Now:

```js
sort: {
   test: 'DESC'
}
```

### SubTypeBuilder changes
`SubTypeBuilder` param is not exist anymore, use [Resource.isResourceOf](https://github.com/lagoshny/ngx-hateoas-client#IsResourceOf) method to know which resource type you got.

See more about support subtypes [here](https://github.com/lagoshny/ngx-hateoas-client#Subtypes-support).
 
 
### ExpireMs and IsCacheActive changes
`expireMs`, `isCacheActive` params are not exist anymore.
How to manage the cache see [here](https://github.com/lagoshny/ngx-hateoas-client#cache-support).
