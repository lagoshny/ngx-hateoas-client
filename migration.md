# Migration guide
This guide allows you to know how to migrate from `@lagoshny/ngx-hal-client` to `@lagoshny/ngx-hateoas-client`.
Why you may need to do it see in the [motivation](#motivation) section.

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


## Library changes
This section describes the main library changes compare with `@lagoshny/ngx-hal-client` library.

## Configuration
The next changes were in the lib configuration:

The old configuration `ExternalConfigService` class was delete. 
Added new `HateoasConfigurationService` class has the method `configure` to pass app configuration. 
How configure library with `HateoasConfigurationService` see [here](https://github.com/lagoshny/ngx-hateoas-client#Configuration). 

## Classes
The next changes were in the classes:

- Class `RestService` renamed to `HateoasResourceOperation`.
- Class `ResourcePage` renamed to [PagedCollectionResource](https://github.com/lagoshny/ngx-hateoas-client#PagedResourceCollection).
- Added [ResourceCollection](https://github.com/lagoshny/ngx-hateoas-client#ResourceCollection) class now it returns from methods where before was `Array<Resource>`.
- Deleted `CacheHelper` class, use `HateoasConfigurationService` to configure [cache settings](https://github.com/lagoshny/ngx-hateoas-client#cache-params).

## Methods
The next changes were in the methods:

### RestService methods changes
The next changes was in `RestService` (now is `HateoasResourceOperation` class):

- Deleted constructor params: `injector` and `type`, now only `resourceName` param.
- Deleted page methods:  `totalElement`, `totalPages`, `hasFirst`, `hasNext`, `hasPrev`, `hasLast`, `next`, `prev`, `first`, `last`, `page`. See [PagedResourceCollection](https://github.com/lagoshny/ngx-hateoas-client#PagedResourceCollection) to use these methods. 
- Deleted `getByRelation` and `getByRelationArray` use [getRelation](https://github.com/lagoshny/ngx-hateoas-client#GetRelation) and [getRelatedCollection](https://github.com/lagoshny/ngx-hateoas-client#GetRelatedCollection) from [Resource](https://github.com/lagoshny/ngx-hateoas-client#Resource) class instead.
- Deleted `customQueryPost` use [customQuery](https://github.com/lagoshny/ngx-hateoas-client#CustomQuery) instead.
- Deleted `count` use [customQuery](https://github.com/lagoshny/ngx-hateoas-client#CustomQuery) instead.
- Deleted `getBySelfLink` use [getResource](https://github.com/lagoshny/ngx-hateoas-client#GetResource) instead

- Renamed `get` to `getResource` and changed method signature:
  
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

- Renamed `getAll` to `getCollection` and changed method signature:

  Was: 
  ```
  getAll(options?: HalOptions, subType?: SubTypeBuilder): Observable<T[]>;
  ```
  Now: 
  ```
  getCollection(options?: GetOption): Observable<ResourceCollection<T>>;
  ```
  
  - Changed `options` type from `HalOptions` to [GetOption](https://github.com/lagoshny/ngx-hateoas-client#GetOption).
  - Deleted `subType` param, subtypes support, see [here](https://github.com/lagoshny/ngx-hateoas-client#Subtypes-support). 

- Renamed `getAllPage` to `getPage` and changed method signature:

  Was: 
  ```
  getAllPage(options?: HalOptions, subType?: SubTypeBuilder): Observable<ResourcePage<T>>;
  ```
  Now: 
  ```
  getPage(options?: PagedGetOption): Observable<PagedResourceCollection<T>>;
  ```

  - Changed `options` type from `HalOptions` to [PagedGetOption](https://github.com/lagoshny/ngx-hateoas-client#PagedGetOption).
  - Deleted `subType` param, subtypes support, see [here](https://github.com/lagoshny/ngx-hateoas-client#Subtypes-support).
  - Changed return value from `ResourcePage` to [PagedCollectionResource](https://github.com/lagoshny/ngx-hateoas-client#PagedResourceCollection) see [classes changes](#classes).

- Renamed `search` to `searchCollection` and changed method signature:

  Was: 
  ```
  search(query: string, options?: HalOptions, subType?: SubTypeBuilder): Observable<T[]>;
  ```
  Now: 
  ```
  searchCollection(query: string, options?: GetOption): Observable<ResourceCollection<T>>;
  ```
  
  - Changed `options` type from `HalOptions` to [GetOption](https://github.com/lagoshny/ngx-hateoas-client#GetOption).
  - Deleted `subType` param, subtypes support, see [here](https://github.com/lagoshny/ngx-hateoas-client#Subtypes-support).
  - Changed return type  from `Array<Resource>` to [ResourceCollection](https://github.com/lagoshny/ngx-hateoas-client#ResourceCollection).

- `searchPage` changed method signature:

  Was: 
  ```
  searchPage(query: string, options?: HalOptions, subType?: SubTypeBuilder): Observable<ResourcePage<T>>;
  ```
  Now: 
  ```
  searchPage(query: string, options?: PagedGetOption): Observable<PagedResourceCollection<T>>;
  ```
  
  - Changed `options` type from `HalOptions` to [GetOption](https://github.com/lagoshny/ngx-hateoas-client#GetOption).
  - Deleted `subType` param, subtypes support, see [here](https://github.com/lagoshny/ngx-hateoas-client#Subtypes-support).
  - Changed return type  from `ResourcePage` to [PagedCollectionResource](https://github.com/lagoshny/ngx-hateoas-client#PagedResourceCollection).

- Renamed `searchSingle` to `searchResource` and changed method signature:

  Was: 
  ```
  searchSingle(query: string, options?: HalOptions): Observable<T>;
  ```
  Now: 
  ```
  searchResource(query: string, options?: GetOption): Observable<T>;
  ```
  
  - Changed `options` type from `HalOptions` to [GetOption](https://github.com/lagoshny/ngx-hateoas-client#GetOption).
  
- `customQuery` changed method signature:

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
  - Changed `options` type from `HalOptions` to [PagedGetOption](https://github.com/lagoshny/ngx-hateoas-client#PagedGetOption).
  - Deleted `subType` param, subtypes support, see [here](https://github.com/lagoshny/ngx-hateoas-client#Subtypes-support).

- Renamed `create` to `createResource` and changed method signature:

  Was: 
  ```
  create(entity: T);
  ```
  Now: 
  ```
  createResource(requestBody: RequestBody<T>): Observable<T>;
  ```
  
  - Changed `entity` param to [requestBody](https://github.com/lagoshny/ngx-hateoas-client#RequestBody).

- Renamed `update` to `updateResource` and changed method signature:

  Was: 
  ```
  update(entity: T);
  ```
  Now: 
  ```
  updateResource(entity: T, requestBody?: RequestBody<any>): Observable<T | any>;
  ```
  
  - Added [requestBody](https://github.com/lagoshny/ngx-hateoas-client#RequestBody) param to pass part of `entity` values to change.

- Renamed `patch` to `patchResource` and changed method signature:

  Was: 
  ```
  patch(entity: T, options?: Array<ResourceOptions> | Include);
  ```
  Now: 
  ```
  patchResource(entity: T, requestBody?: RequestBody<any>): Observable<T | any>;
  ```
  
  - Changed `options` type to [requestBody](https://github.com/lagoshny/ngx-hateoas-client#RequestBody).
  
- Renamed `delete` to `deleteResource` and changed method signature:

  Was: 
  ```
  delete(entity: T): Observable<object>;
  ```
  Now: 
  ```
  deleteResource(entity: T, options?: RequestOption): Observable<HttpResponse<any> | any>;
  ```
  
  - Added `options` param is allowed to define request return type `observe` or `response` and pass request params.

- Deleted `handleError` method, if you need, define the same method in your project:

  `handleError` is simple wrapper:
  ```
      protected handleError(error: any): Observable<never> {
        return observableThrowError(error);
      }
  ```


### Resource methods changes

- `getRelation` method signature changes:

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

- Removed a `getProjection` method, use [getRelation](https://github.com/lagoshny/ngx-hateoas-client#GetRelation) with options: `{params: {projection: 'projectionName'}}`.

- Renamed `getRelationArray` to `getResourceCollection` and changed method signature:

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
  - Changed `options` type from `HalOptions` to [GetOption](https://github.com/lagoshny/ngx-hateoas-client#GetOption).
  - Changed return type from `Array<Resource>` to [ResourceCollection<Resource>](https://github.com/lagoshny/ngx-hateoas-client#ResourceCollection).

- Removed `getProjectionArray` method, use [getRelatedCollection](https://github.com/lagoshny/ngx-hateoas-client#GetRelatedCollection) with options: `{params: {projection: 'projectionName'}}`. 

- `addRelation` changed method signature:

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
 
- Renamed `substituteRelation` to `bindRelation` and some method changes:

  - Renamed `relation` param to `relationName`.
  - Renamed `resource` param to `entitiy`.

- `deleteRelation` method changes:

  - Renamed param `relation` to `relationName`
  - Renamed param `resource` to `entitiy`

- `postRelation` changed method signature:

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

- `patchRelation` changed method signature:

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


### ResourcePage methods changes

`ResourcePage` class renamed to `PagedResourceCollection` and has the next changes:

- `sortElements` changed method signature:

  Was: 
  ```
  sortElements(...sort: Sort[]): Observable<ResourcePage<T>>;
  ```
  Now: 
  ```
  sortElements(sortParam: Sort, options?: { useCache: true }): Observable<PagedResourceCollection<T>>;
  ``` 
  
  - Changed `sort` param type, new type is object, more see [here](https://github.com/lagoshny/ngx-hateoas-client#Sort).


## Param classes changes

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

### Added new RequestBody param
[RequestBody](https://github.com/lagoshny/ngx-hateoas-client#RequestBody) is new param type that used with methods where need to pass some request body (for example `createResource`, `patchResource` and so on).

For example:

Was `RestService.create(...)`:

```
this.extendedRestService.create(resource).subscrube(...);
```

Now `HateoasResourceOperation.createResource(...)`

```
this.extendHateoasResourceOperationService.createResource({body: resource}).subscrube(...);
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

### Sort param changes
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

### SubTypeBuilder param changes
`SubTypeBuilder` param is not exist anymore, use [Resource.isResourceOf](https://github.com/lagoshny/ngx-hateoas-client#IsResourceOf) method to know which resource type you got.

See more about support subtypes [here](https://github.com/lagoshny/ngx-hateoas-client#Subtypes-support).
 
 
### ExpireMs and IsCacheActive params changes
`expireMs`, `isCacheActive` params are not exist anymore.
How to manage the cache see [here](https://github.com/lagoshny/ngx-hateoas-client#cache-support).

...

### Migration from @lagoshny/ngx-hal-client

There are two options to migrate:

- The first option is use migration script (LINK) and some part migrate manually.
Pluses:
- Fast migration without change Services and Components code you need only change lib configuration.  
- You can migrate use this option and after by step use mannual migration guide migrate all depreceated parts to new one.   

Coins:
- You will use old comparable library api and will not support some new library features.
- You will have depreceated warning messages.
- Some features in `@lagoshny/ngx-hal-client` was implemented with errors (all errors will be safed for comparable version).
  For example `addRelation` change last relation but dhould add new one.

 
The second option is use the guide do it manually. 

Pluses:
- You will use new API that reduce code to invoke methods.
- You will got all new lib changes
- You will got fixed `@lagoshny/ngx-hal-client` errors.

Coins:
- To migrate use this option you will need some time than you first option

#### First migration option

The first step is to run migration script (LINK). To do that you need put migration script in `src` project folder and run it through bash terminal.
It will be rename/delete some imports and classes.

The second step is delete the old `@lagoshny/ngx-hal-client` library configuration.
To do this delete class that implemented `ExternalConfigurationHandlerInterface` interface and provider for configuration service from module where you used `@lagoshny/ngx-hal-client` library 
`{provide: 'ExternalConfigurationService', useClass: ExternalConfigurationService}`


After that change `NgxHalClientModule.forRoot()` to `NgxHateoasClientModule.forRoot()` imported from `@lagoshny/ngx-hateoas-client`.
And last step you need pass configuration to `@lagoshny/ngx-hateoas-client` library using `HateoasConfigurationService`:

In your application module (for example root `AppModule`) you need define constructor and inject there `HateoasConfigurationService`.

```  
constructor(hateoasConf: HateoasConfigurationService) {
  hateoasConf.configure({
    http: {
      rootUrl: 'http://localhost:8080/api/v1',
      proxyUrl: '..' // if it was used
    },
    comparable: {
      ngxHalClient: true
    }
  });
}
```

You need pass the rootUrl, proxyUrl (optional if it was used before), and comparable option with `ngxHalClient: true` (it will be enable comparable mode library to clone all `ngxHalClient` behaviour).
 

The first migration part is completed and you can continue work with your application, but you will see warning messages that you used depreceated methods, because you used old API 
that was changed in new library where some methods has changed signature and was renamed.
You can see that was changed in Manually migration guide (LINK).

The next step is change old API to the new API you can do it by step more information see in Manually migration guide (LINK)

#### Migration script

You can find migration script in folder `scripts/migration.sh` to run it you need to open bash terminal
and put command `./migration.sh` and wait until script finished a work.

##### What did migration script do?
Migration script did the next steps:

- Change all import from `@lagoshny/ngx-hal-client` to `@lagoshny/ngx-hateoas-client`.
- Remove `Injector` param from all classes extended `RestService` class.
- Rename `RestService` to `OldRestService`
- Rename `Resource` to `OldResource`
- Rename `EmbeddedResource` to `OldEmbeddedResource`
- Rename `BaseResource` to `OldBaseResource`
- Rename `Sort` to `OldSort`
- Rename `SortOrder` to `OldSortOrder`
- Rename `ResourcePage` to `OldResourcePage`
- Rename `SubTypeBuilder` to `OldSubTypeBuilder`
- Remove `CacheHelper` imports.
- Remove all `CacheHelper` invokes.


#### Manually migration option

1) Delete lib `@lagoshny/ngx-hal-client` from the `package.json` file.
Note! Do this step in case when you did full migration at the time.
1) Add lib `@lagoshny/ngx-hateoas-client` to the `package.json` file.

2) Delete old `ngx-hal-client` configuration and add new `ngx-hateoas-client`
To do this delete class that implemented `ExternalConfigurationHandlerInterface` interface and provider for configuration service from module where you used `@lagoshny/ngx-hal-client` library 
`{provide: 'ExternalConfigurationService', useClass: ExternalConfigurationService}`

After that change `NgxHalClientModule.forRoot()` to `NgxHateoasClientModule.forRoot()` imported from `@lagoshny/ngx-hateoas-client`.
And last step you need pass configuration to `@lagoshny/ngx-hateoas-client` library using `HateoasConfigurationService`:

In your application module (for example root `AppModule`) you need define constructor and inject there `HateoasConfigurationService`.

```  
constructor(hateoasConf: HateoasConfigurationService) {
  hateoasConf.configure({
    http: {
      rootUrl: 'http://localhost:8080/api/v1',
      proxyUrl: '..' // if it was used
    }
  });
}
```

You need pass the rootUrl, proxyUrl (optional if it was used before).
 
3) In all classes that extended `Resource` class need to change import `Resource` statement from 
`import { Resource } from '@lagoshny/ngx-hal-client'` to `import { Resource } from '@lagoshny/ngx-hateoas-client'`.
Note! If you did migration by parts then you need to migrate `Resource` class and for this `Resource` used `ResourceService` at the time

4) All `Services` that extended `RestService` change `RestService` to `HateoasResourceOperation`.

Change `super` call in constructor with delete injector and type param.

Before:
````
constructor(injector: Injector) {
 super(Cart, 'cart', injector);
}
````

After:
````
constructor() {
 super('cart');
}
````

5) You need change all old `RestService` / `Resource` method call согласно this change description LINK. 

May be add git app example

If you found some bugs please make an issue here.
