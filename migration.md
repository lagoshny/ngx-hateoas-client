# Migration guide

This guide allows you to know how to migrate to this library from other similary libraries.

### Librrary changes

#### Configuration
1) Changed lib configuration.
Deleted `ExternalConfigService` now using  `HateoasConfigurationService` to configuration see configuration chapter (LINK)

#### Classes

Class `RestService` renamed to `HateoasResourceOperation` 
About method changes see here. (LINK_TO_METHOD_CHANGES)

Class `ResourcePage` renamed to `PagedCollectionResource`.
In `PagedCollectionResource` for method `sortElements` changed `sort` param declare (LINK_TO_SORT_PARAM_CHANGE)

Added class `CollectionResource` that will be return from method where before was `Array<Resource>`

Deleted `CacheHelper` class use `HateoasConfigurationService` to configure cache settings.

#### Methods

Compare `HateoasResourceOperation` with old `RestService` methods:

In new `HateoasResourceOperation` you can find the next changes:

- deleted construct params: `injector` and `type`.
- deleted page methods:  `totalElement`, `totalPages`, `hasFirst`, `hasNext`, `hasPrev`, `hasLast`, `next`, `prev`, `first`, `last`, `page`.
- deleted `getByRelation` and `getByRelationArray` use `getRelation` and `getRelatedCollection` from `Resource` class instead
- deleted `customQueryPost` use `customQuery` with HttpMethod.POST instead
- deleted `count` use `customQuery` with HttpMethod.GET instead
- deleted `getBySelfLink` use `getResource` instead

- Renamed `get` to `getResource` and change signature:
  From: `get(id: any, params?: HalParam[]): Observable<T>`
  To: `getResource(id: number | string, options?: GetOption): Observable<T>`
  
  Changed `id` param type from `any` to `number|string`
  Renamed `params` to `options` and changed type from `HalParam[]` to `GetOption` more see here LINK

- Renamed `getAll` to `getCollection` and change signature:
  From: `getAll(options?: HalOptions, subType?: SubTypeBuilder): Observable<T[]>`
  To: `getCollection(options?: GetOption): Observable<ResourceCollection<T>>`
  
  Changes `options` type from `HalOptions` to `GetOption` more see here LINK
  Deleted `subType` more see here LINK

- Renamed `getAllPage` renamed to `getPage` and change signature:
  From: `getAllPage(options?: HalOptions, subType?: SubTypeBuilder): Observable<ResourcePage<T>>`
  To: `getPage(options?: PagedGetOption): Observable<PagedResourceCollection<T>>`

  Changes `options` type from `HalOptions` to `PagedGetOption` more see here LINK
  Deleted `subType` more see here LINK
  Change return value from `ResourcePage` to `PagedResourceCollection` more see here LINK

- Renamed `search` renamed to `searchCollection` and change signature:
  From: `search(query: string, options?: HalOptions, subType?: SubTypeBuilder): Observable<T[]>`
  To: `searchCollection(query: string, options?: GetOption): Observable<ResourceCollection<T>>`
  
  Changes `options` type from `HalOptions` to `GetOption` more see here LINK
  Deleted `subType` more see here LINK
  Change return value from `Array<Resource>` to `ResourceCollection` more see here LINK

- `searchPage` change signature:
  From: `searchPage(query: string, options?: HalOptions, subType?: SubTypeBuilder): Observable<ResourcePage<T>>`
  To: `searchPage(query: string, options?: PagedGetOption): Observable<PagedResourceCollection<T>>`
  
  Changes `options` type from `HalOptions` to `GetOption` more see here LINK
  Deleted `subType` more see here LINK
  Change return value from `ResourcePage` to `PagedResourceCollection` more see here LINK

- Renamed `searchSingle` to `searchResource` and change signature:
  From: `searchSingle(query: string, options?: HalOptions): Observable<T>`
  To: `searchResource(query: string, options?: GetOption): Observable<T>`
  
  Changes `options` type from `HalOptions` to `GetOption` more see here LINK
  
- `customQuery` change signature:
  From: `customQuery(query: string, options?: HalOptions, subType?: SubTypeBuilder): Observable<T[]>`
  To: `customQuery<R>(method: HttpMethod, query: string, requestBody?: RequestBody<any>, options?: PagedGetOption): Observable<R>`
  
  Added generic `<R>` param that define return value type instead old `Array<Resource>`
  Added param `method` is define Http method query
  Added param `requestBody` to pass some body (used with PATCH, PUT, POST methods)
  Changes `options` type from `HalOptions` to `PagedGetOption` more see here LINK
  Deleted `subType` more see here LINK
  

- Renamed `create` to `createResource` and change signature:
  From: `create(entity: T)`
  To: `createResource(requestBody: RequestBody<T>): Observable<T>`
  
  Renamed `entity` to `requestBody` and change type from `Resource` to `RequestBody` object more see here LINK
  

- Renamed `update` to `updateResource` and change signature:
  From: `update(entity: T)`
  To: `updateResource(entity: T, requestBody?: RequestBody<any>): Observable<T | any>`
  
  Added options `requestBody` param to pass part of `entity` to change if it is not passed then all `entity` will be updated
  

- Renamed `patch` to `patchResource` and change signature:
  From: `patch(entity: T, options?: Array<ResourceOptions> | Include)`
  To: `patchResource(entity: T, requestBody?: RequestBody<any>): Observable<T | any>`
  
  Changed `options` type to `requestBody` more see here LINK
  
  
- Renamed `delete` to `deleteResource` and change signature:
  From: `delete(entity: T): Observable<object>`
  To: `deleteResource(entity: T, options?: RequestOption): Observable<HttpResponse<any> | any>`
  
  Added `options` param that wil lbe added as request params and define request return type observe or response

- Deleted `handleError`, you can define the same in your project and use it.

  `handleError` is simple обёртка:
````
    protected handleError(error: any): Observable<never> {
      return observableThrowError(error);
    }
````


`Resource` class methods changes:

- `getRelation` signature changes:
  From: `getRelation<T extends BaseResource>(type: {new (): T;}, relation: string, builder?: SubTypeBuilder, expireMs?: number, isCacheActive?: boolean): Observable<T>;`
  To: `getRelation<T extends BaseResource>(relationName: string, options?: GetOption): Observable<T>`
  
  Renamed param `relation` to `relationName`
  Deleted `type`, `builder` (about this LINK_TO_BUILDER), `expireMs`, `isCacheActive` (about this LINK_TO_CACHE) params
  Added `options` params (about this LINK_TO_GET_OPTION)

- Removed `getProjection` method use `getRelation` instead with passed options: `{params: {projection: 'projectionName'}}`

- Renamed `getRelationArray` to `getResourceCollection` and change signature:

  From: `getRelationArray<T extends BaseResource>(type: { new(): T }, relation: string, options?: HalOptions, embedded?: string, builder?: SubTypeBuilder, expireMs: number = 0, isCacheActive: boolean = true): Observable<T[]>`
  To: `  getRelatedCollection<T extends ResourceCollection<BaseResource>>(relationName: string, options?: GetOption): Observable<T>`
  
  Renamed param `relation` to `relationName`
  Deleted `type`, `embedded` (is not support any more), `builder` (about this LINK_TO_BUILDER), `expireMs`, `isCacheActive` (about this LINK_TO_CACHE) params
  Changed `options` type from `HalOptions` to `GetOption` differences see here (LINK)
  Changed return value from `Array<Resource>` to `ResourceCollection<Resource>` (see about `ResourceCollection` here).

- Removed `getProjectionArray` method use `getRelatedCollection` instead with passed options: `{params: {projection: 'projectionName'}}`

- `addRelation` signature changes:
  From: `addRelation<T extends BaseResource>(relation: string, resource: T): Observable<any>`
  To:   `addRelation<T extends Resource>(relationName: string, entities: Array<T>): Observable<HttpResponse<any>>`
  
  Renamed param `relation` to `relationName`
  Renamed param `resource` to `entities` and make it array, because when add relation you can pass array of the entities and all will be bind to the resource (see in docummentation)
  
- Renamed `substituteRelation` to `bindRelation`
  Renamed param `relation` to `relationName`
  Renamed param `resource` to `entitiy`

- `deleteRelation`
   Renamed param `relation` to `relationName`
   Renamed param `resource` to `entitiy`

- `postRelation` change signature:
   From: `postRelation(relation: string, body: any, options?: LinkOptions): Observable<any>`
   To: `postRelation(relationName: string, requestBody: RequestBody<any>, options?: RequestOption): Observable<any>`
   
   Renamed param `relation` to `relationName`
   Renamed param `body` to `requestBody` and change type from `any` to `RequestBody` object (see more here (LINK))
   Change type `options` from `LinkOptions` to `RequestOption` see more here LINK

- `patchRelation` change signature:
   From: `patchRelation(relation: string, body: any, options?: LinkOptions): Observable<any>`
   To: `patchRelation(relationName: string, requestBody: RequestBody<any>, options?: RequestOption): Observable<any>`
   
   Renamed param `relation` to `relationName`
   Renamed param `body` to `requestBody` and change type from `any` to `RequestBody` object (see more here (LINK))
   Change type `options` from `LinkOptions` to `RequestOption` see more here LINK


Compare `PagedResourceCollection` with old `ResourcePage` methods:

In new `PagedResourceCollection` you can find the next changes:

- Change `sortElements` signature:
  From: `sortElements(...sort: Sort[]): Observable<ResourcePage<T>>`
  To: `sortElements(sortParam: Sort, options?: { useCache: true }): Observable<PagedResourceCollection<T>>` 
  
  Change `sort` param type, now is object not array, more see here (LINK)

#### Method params
2) Changed `HalParam` to `GetOption`/`PagedGetOption`

Before `HalParam`:

```
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

`HalParam` convert to `GetOption` or `PagedGetOption`:

```
params: { 
   projection: 'testProjection',
   param1: 'value1',
   param2: 'value2
}
```

3) Changed `HalOptions` to `GetOption`/`PagedGetOption`

When was used `HalOptions` now need to use `GetOption` or `GetPagedOption` depends on return value when return value is `PagedResourceCollection` then will be `PagedGetOption`, `GetOption` otherwise.

Before `HalOptions`:

```
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

`HalOptions` convert to `GetOption`:

```
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

Note! `GetOption` doesn't contains `size` params, because this params applied to the page return value use `GetPageParam` to pass this param with properly methods.

`HalOptions` convert to `PagedGetOption`:

```
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

Note! `GetOption` and `PagedGetOption` didn't contains `notPaged` param any more, because now need to use properly merhods when need return paged or not collection.


4) Added `RequestOption` param and used where need to pass some request body (for example `createResource`, `patchResource` and так далее).

Before `RestService.create(...)`:

```
this.extendedRestService.create(resource).subscrube(...);
```

Now `HateoasResourceOperation.createResource(...)`

```
this.extendHateoasResourceOperationService.createResource({body: resource}).subscrube(...);
```

Also `RequestOption` has optional param `valuesOption` that is `ValuesOption` object and allow to configure need to include null values from body as is or it shoul be ignored (by default).

5) Change `LinkOptions` to `RequestOption` params in `Resource` methods: `postRelation`, `patchRelation`, `putRelation` that allows to pass additional request params and manipulate return object.

Before:

```
{
  strictParams?: boolean,
  params: {
      param1: 'value1',
      param2: 'value2
  }
}
```

Now:
```
{
  params: {
      param1: 'value1',
      param2: 'value2
  }
  observe?: 'body' | 'response';
}
```

As you can see was deleted `strictParams` and added `observe`.
Now if you pass nor all params nut your resource link is templated then only passed params will be replaced and other template params will be cleared.


6) Changed `Sort` param.

Before:

```
sort: [
  {path: 'test', order: 'DESC'}
]
```

Now:

```
sort: {
   test: 'DESC'
}
```

7) Param `SubTypeBuilder` is not using any more.
The approach work with subtypes was changed. All methods that before accept `SubTypeBuilder` are not doing it any more
insteat of it `Resource` class has a new property `resourceName` and public method `isResourceOf(...)`.
Property `resourceName` holds information about resource type name.
For example you have some inheritance:

```
// Root object
export class Cart extends Resource {
  public status: string;
  public payment: Payment;
}

// Inheritance
export class Payment extends Resource {
  public sum: number;
}

export class CashPayment extends Payment {
  public nominal: number;
}

export class CartPayment extends Payment {
  public cartNumber: string;
}

```

And hateoas representation:

Cart:
```
{
  "status": "NEW",
  "_links": {
    "self": {
      "href": "http://localhost:8080/api/v1/cart/1"
    },
    "cart": {
      "href": "http://localhost:8080/api/v1/cart/1{?projection}",
      "templated": true
    }
    "payments": {
      "href": "http://localhost:8080/api/v1/cart/1/payments"
    }
  }
}
```

Payments by link http://localhost:8080/api/v1/cart/1/payments will return the next representation:
```
{
  "_embedded" : {
    "cartPayments" : [ 
        {
          "id" : 2,
          "sum" : 500,
          "cartNumber" : "1233-1231-1332",
          "_links" : {
            "self" : {
              "href" : "http://localhost:8080/api/v1/cartPayments/2"
            },
            "cartPayment" : {
              "href" : "http://localhost:8080/api/v1/cartPayments/2"
            }
          }
        },
        {
          "id" : 3,
          "sum" : 100,
          "nominal" : 100,
          "_links" : {
            "self" : {
              "href" : "http://localhost:8080/api/v1/cashPayments/3"
            },
            "cartPayment" : {
              "href" : "http://localhost:8080/api/v1/cashPayments/3"
            }
          }
        } 
    ]
  },
  "_links" : {
    "self" : {
      "href" : "http://localhost:8080/api/v1/cart/1/payments"
    }
  }
}
``` 

Then when you will get payments relation from cart object in old style you was call: 
```
cart.getRelationArray(Payment, 'payments', null, null, {subtypes: new Map<string, any>().set('cartPayment', CartPayment).set('cashPayment', CashPayment)})
 .subscribe((result: Array<Resource>) => {
   console.log(result[0] instanceof CartPayment); // print true
   console.log(result[1] instanceof CashPayment); // print true
 })
``` 

In new style  without `SubTypeBuilder` the same code will be:

```
cart.getRelatedCollection('payments')
 .subscribe((result: ResourceCollection<Resource>) => {
   console.log(result.resources[0].isResourceOf(CartPayment));   // print true
   console.log(result.resources[0].isResourceOf('cartPayment')); // print true   

   console.log(result.resources[1].isResourceOf(CashPayment));   // print true
   console.log(result.resources[1].isResourceOf('cashPayment')); // print true
 })
``` 
 
8) Params `expireMs`, `isCacheActive` are not using any more.
Now you can set cahce expire time to all cache see (CACHE_SETTINGS_LINK) and pass additional param `{useCache: false}` that was added to all get methods to do request without cache hit.

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
