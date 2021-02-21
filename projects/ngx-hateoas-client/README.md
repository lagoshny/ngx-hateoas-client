# NgxHateoasClient
<a href="https://www.npmjs.com/package/@lagoshny/ngx-hateoas-client">
  <img src="https://img.shields.io/npm/v/@lagoshny/ngx-hateoas-client" alt="Last released npm version" />
</a>&nbsp;

<a href="https://github.com/lagoshny/ngx-hateoas-client/actions?query=workflow%3ABuild">
  <img src="https://img.shields.io/github/workflow/status/lagoshny/ngx-hateoas-client/Build/master" alt="Pipeline info" />
</a>&nbsp;

<a href="https://github.com/lagoshny/ngx-hateoas-client/issues">
  <img src="https://img.shields.io/github/issues/lagoshny/ngx-hateoas-client" alt="Total open issues" />
</a>&nbsp;

<a href="https://www.npmjs.com/package/@lagoshny/ngx-hateoas-client">
  <img src="https://img.shields.io/npm/dt/@lagoshny/ngx-hateoas-client" alt="Total downloads by npm" />
</a>&nbsp;

<a href="https://mit-license.org/">
  <img src="https://img.shields.io/npm/l/@lagoshny/ngx-hateoas-client" alt="License info" />
</a>&nbsp;

<br />
<br />

**Compatible with Angular 11.**

This client can be used to develop `Angular 6.0+` applications working with RESTful server API.
By `RESTful API` means when the server application implements all the layers of the [Richardson Maturity Model](https://martinfowler.com/articles/richardsonMaturityModel.html)
and the server provides [HAL/JSON](http://stateless.co/hal_specification.html) response type.

This client compatible with Java server-side applications based on [Spring HATEOAS](https://spring.io/projects/spring-hateoas) or [Spring Data REST](https://docs.spring.io/spring-data/rest/docs/current/reference/html/#reference).

>This client is a continuation of the [@lagoshny/ngx-hal-client](https://github.com/lagoshny/ngx-hal-client).
You can find out about the motivation to create a new client [here](https://github.com/lagoshny/ngx-hateoas-client/blob/master/migration-guide.md#Motivation).
To migrate from `@lagoshny/ngx-hal-client` to this client you can use the [migration guide](https://github.com/lagoshny/ngx-hateoas-client/blob/master/migration-guide.md#Motivation).

You can found examples of usage this client with [task-manager-front](https://github.com/lagoshny/task-manager-front) application that uses server-side [task-manager-back](https://github.com/lagoshny/task-manager-back) application.

## Contents
1. [Changelog](#Changelog)
2. [Getting started](#Getting-started)
  - [Installation](#Installation)
  - [Configuration](#Configuration)
  - [Usage](#Usage)
    - [Define resource classes](#Define-resource-classes)
    - [Built-in HateoasResourceService](#built-in-hateoasresourceservice)
    - [Create custom Resource service](#Create-custom-Resource-service)
3. [Resource types](#Resource-types)
  - [BaseResource](#BaseResource)
    - [GetRelation](#GetRelation)
    - [GetRelatedCollection](#GetRelatedCollection)
    - [GetRelatedPage](#GetRelatedPage)
    - [PostRelation](#PostRelation)
    - [PatchRelation](#PatchRelation)
    - [PutRelation](#PutRelation)
  - [Resource](#Resource)
    - [IsResourceOf](#IsResourceOf)
    - [AddCollectionRelation](#AddCollectionRelation)
    - [BindRelation](#BindRelation)
    - [UnbindRelation](#UnbindRelation)
    - [ClearCollectionRelation](#ClearCollectionRelation)
    - [DeleteRelation](#DeleteRelation)
  - [EmbeddedResource](#EmbeddedResource)
  - [ResourceCollection](#ResourceCollection)
  - [PagedResourceCollection](#PagedResourceCollection)
  - [Subtypes support](#Subtypes-support)
4. [Resource service](#Resource-service)
  - [GetResource](#GetResource)
  - [GetCollection](#GetCollection)
  - [GetPage](#GetPage)
  - [CreateResource](#CreateResource)
  - [UpdateResource](#UpdateResource)
  - [UpdateResourceById](#UpdateResourceById)
  - [PatchResource](#PatchResource)
  - [PatchResourceById](#PatchResourceById)
  - [DeleteResource](#DeleteResource)
  - [DeleteResourceById](#DeleteResourceById)
  - [SearchResource](#SearchResource)
  - [SearchCollection](#SearchCollection)
  - [SearchPage](#SearchPage)
  - [CustomQuery](#CustomQuery)
  - [CustomSearchQuery](#CustomSearchQuery)
5. [Settings](#settings)
  - [Configuration params](#Configuration-params)
  - [Cache support](#cache-support)
  - [Logging](#Logging)
6. [Public classes](#Public-classes)
  - [GetOption](#GetOption)
  - [PagedGetOption](#PagedGetOption)
  - [RequestOption](#RequestOption)
  - [RequestBody](#RequestBody)
  - [Sort](#Sort)
  - [SortedPageParam](#SortedPageParam)

## Changelog
[Learn about the latest improvements](https://github.com/lagoshny/ngx-hateoas-client/blob/master/CHANGELOG.md).

## Getting started

### Installation

To install the latest version use command:

```
npm i @lagoshny/ngx-hateoas-client --save
``` 

### Configuration

Before start, configure `NgxHateoasClientModule` and pass configuration through `NgxHateoasClientConfigurationService`.

1) `NgxHalClientModule` configuration:

```ts
import { NgxHateoasClientModule } from '@lagoshny/ngx-hateoas-client';

...

@NgModule({
  ...
  imports: [
    ...
    NgxHateoasClientModule.forRoot()
    ...
  ]
  ...
})
export class AppModule {
  ...
}
```

2) In constructor app root module inject `HalConfigurationService` and pass a configuration:

```ts
import { ..., NgxHateoasClientConfigurationService } from '@lagoshny/ngx-hateoas-client';

...

export class AppModule {

  constructor(hateoasConfig: NgxHateoasClientConfigurationService) {
    hateoasConfig.configure({
      http: {
        rootUrl: 'http://localhost:8080/api/v1'
      }
    });
  }

}
```

>Configuration has only one required param is `rootUrl` mapped to the server API URL.
Also, you can configure `proxyUrl` when use it in resource links.
See more about other a configuration params [here](#configuration-params).

### Usage

### Define resource classes

To represent model class as a resource model extend model class by `Resource` class.
Suppose you have some `Product` model class:

```ts
export class Product {

    public name: string;

    public cost: number;

}
``` 

When extending it with `Resource` class it will look like:

```ts
import { Resource } from '@lagoshny/ngx-hateoas-client';

export class Product extend Resource {

    public name: string;

    public cost: number;

}
``` 

Thereafter, the `Product` class will have `Resource` methods to work with the product's relations through resource links.

>Also, you can extend model classes with the `EmbeddedResource` class when the model class used as an [embeddable](https://docs.oracle.com/javaee/6/api/javax/persistence/Embeddable.html) entity.
You can read more about `EmbeddedResource` [here](#embeddedresource).


To perform resource requests you can use built-in [HateoasResourceService](#built-in-hateoasresourceservice) or a create [custom resource service](#create-custom-resource-service).

### Built-in HateoasResourceService

The library has built-in `HateoasResourceService`.
It is a simple service with methods to get/create/update/delete resources.

To use it inject `HateoasResourceService` to a component or a service class after that you can perform resource requests by passing the resource name.

```ts
@Component({
  ...
})
export class SomeComponent {

  constructor(private resourceService: HateoasResourceService) {
  }

  onSomeAction() {
    const product = new Product();
    product.cost = 100;
    product.name = 'Fruit';

    this.resourceService.createResource('product', product)
            .subscribe((createdResource: Product) => {
                // TODO something
            });
  };

}
```

Each `HateoasResourceService` method has the first param is the resource name that should be equals to the resource name in backend API.
The resource name uses to build a URL for resource requests.

More about available `HateoasResourceService` methods see [here](#resource-service).

>`HateoasResourceService` is the best choice for simple resources that has not extra logic for requests.
When you have some logic that should be preparing resource before a request, or you do not want always pass the resource name as first method param
you can create a custom resource service extends `HateoasResourceOperation` to see more about this [here](#create-custom-resource-service).

### Create custom Resource service

To create custom resource service create a new service and extends it with `HateoasResourceOperation` and pass `resourceName` to parent constructor.

```ts
import { HateoasResourceOperation } from '@lagoshny/ngx-hateoas-client';

@Injectable({providedIn: 'root'})
export class ProductService extends HateoasResourceOperation<Product> {

  constructor() {
    super('products');
  }

}

```

`HateoasResourceOperation` has the same [methods](#resource-service) as `HateoasResourceService` without `resourceName` as the first param.

## Resource types

There are several types of resources, the main resource type is [Resource](#resource) represents the server-side entity model class.
If the server-side model has Embeddable entity type then use [EmbeddedResource](#embeddedresource) type instead [Resource](#resource) type.

Both [Resource](#resource) and [EmbeddedResource](#embeddedresource) have some the same methods therefore they have common parent [BaseResource](#baseresource) class implements these methods.

To work with resource collections uses [ResourceCollection](#resourcecollection) type its holds an array of the resources.
When you have a paged collection of resources result use an extension of [ResourceCollection](#resourcecollection) is [PagedResourceCollection](#pagedresourcecollection) that allows you to navigate by pages and perform custom page requests.

In some cases, the server-side can have an entity inheritance model how to work with entity subtypes, you can found [here](#subtypes-support).

### Resource presets

Examples of usage resource relation methods rely on presets.


- Server root url = http://localhost:8080/api/v1

- Resource classes are
  ```ts
  import { Resource } from '@lagoshny/ngx-hal-client';
  
  export class Cart extends Resource {
  
      public shop: Shop;
  
      public products: Array<Product>;
  
      public status: string;
  
      public client: PhysicalClient;
  
  }
  
  export class Shop extends Resource {
  
      public name: string;
  
      public rating: number;
  
  }
   
  export class Product extends Resource {
  
      public name: string;
  
      public cost: number;
  
      public description: string;
  
  }
  
  export class Client extends Resource {
  
    public address: string;
  
  }
  
  export class PhysicalClient extends Client {
  
    public fio: string;
  
  }
  
  export class JuridicalClient extends Client {
  
    public inn: string;
  
  }
  
 
  ```

- Suppose we have existed resources:
  ```json
  Cart:
  {
    "status": "New",
    "_links": {
      "self": {
        "href": "http://localhost:8080/api/v1/carts/1"
      },
      "cart": {
        "href": "http://localhost:8080/api/v1/carts/1{?projection}",
        "templated": true
      },
      "shop": {
        "href": "http://localhost:8080/api/v1/carts/1/shop"
      },
      "products": {
        "href": "http://localhost:8080/api/v1/carts/1/products"
      },      
      "productsPage": {
        "href": "http://localhost:8080/api/v1/carts/1/productPage?page={page}&size={size}&sort={sort}&projection={projection}",
        "templated": true
      },
      "client": {
        "href": "http://localhost:8080/api/v1/carts/1/client"
      },
      "postExample": {
        "href": "http://localhost:8080/api/v1/cart/1/postExample"
      },
      "putExample": {
        "href": "http://localhost:8080/api/v1/cart/1/putExample"
      },
      "patchExample": {
        "href": "http://localhost:8080/api/v1/cart/1/patchExample"
      },
    }
  }
  
  Shop:
  {
    "name": "Some Name",
    "ratings": 5
    "_links": {
      "self": {
        "href": "http://localhost:8080/api/v1/shops/1"
      },
      "shop": {
        "href": "http://localhost:8080/api/v1/shops/1"
      }
    }
  }
  
  Product:
  {
    "name": "Milk",
    "cost": 2,
    "description": "Some description"
    "_links": {
      "self": {
        "href": "http://localhost:8080/api/v1/produtcs/1"
      },
      "produtc": {
        "href": "http://localhost:8080/api/v1/produtcs/1"
      }
    }
  }
  
  Client:
  {
    "fio": "Some fio",
    "_links": {
      "self": {
        "href": "http://localhost:8080/api/v1/physicalClients/1"
      },
      "physicalClient": {
        "href": "http://localhost:8080/api/v1/physicalClients/1"
      }
    }
  }
  ```  


## BaseResource

Parent class for [Resource](#resource) and [EmbeddedResource](#embeddedresource) classes.
Contains common resource methods to work with resource relations through resource links (see below).

### GetRelation
Getting resource relation object by relation name.

This method takes [GetOption](#getoption) parameter with it you can pass `projection` param

Method signature:

```
getRelation<T extends BaseResource>(relationName: string, options?: GetOption): Observable<T>;
```

- `relationName` - resource relation name used to get request URL.
- `options` - [GetOption](#getoption) additional options applied to the request.
- `return value` - [Resource](#resource) with type `T`.
- `throws error` - when required params are not valid or link not found by relation name or returned value is not [Resource](#resource).

##### Examples of usage ([given the presets](#resource-presets)):

```ts
// Performing GET request by the URL: http://localhost:8080/api/v1/carts/1/shop
cart.getRelation<Shop>('shop')
  .subscribe((shop: Shop) => {
    // some logic        
  });
```

With options:

```ts
// Performing GET request by the URL: http://localhost:8080/api/v1/carts/1/shop?projection=shopProjection&testParam=test&sort=name,ASC
cart.getRelation<Shop>('shop', {
  params: {
    testParam: 'test',
    projection: 'shopProjection'
  },
  sort: {
    name: 'ASC'
  },
  // useCache: true | false, by default true
})
  .subscribe((shop: Shop) => {
    // some logic        
  });
```

### GetRelatedCollection
Getting related resource collection by relation name.

This method takes [GetOption](#getoption) parameter with it you can pass `projection` param.

Method signature:

```
getRelatedCollection<T extends ResourceCollection<BaseResource>>(relationName: string, options?: GetOption): Observable<T>;
```

- `relationName` - resource relation name used to get request URL.
- `options` - [GetOption](#getoption) additional options applied to the request.
- `return value` - [ResourceCollection](#resourcecollection) collection of resources with type `T`.
- `throws error` - when required params are not valid or link not found by relation name or returned value is not [ResourceCollection](#resourcecollection).

##### Examples of usage ([given the presets](#resource-presets)):

```ts
// Performing GET request by the URL: http://localhost:8080/api/v1/carts/1/products
cart.getRelatedCollection<ResourceCollection<Product>>('products')
  .subscribe((collection: ResourceCollection<Product>) => {
    const products: Array<Product> = collection.resources;
    // some logic        
  });
```

With options:

```ts
// Performing GET request by the URL: http://localhost:8080/api/v1/carts/1/products?projection=productProjection&testParam=test&sort=name,ASC
cart.getRelatedCollection<ResourceCollection<Product>>('products', {
  params: {
    testParam: 'test',
    projection: 'productProjection'
  },
  sort: {
    name: 'ASC'
  },
  // useCache: true | false, by default true
})
  .subscribe((collection: ResourceCollection<Product>) => {
    const products: Array<Product> = collection.resources;
    // some logic        
  });

```

### GetRelatedPage
Getting related resource collection with pagination by relation name.

This method takes [PagedGetOption](#pagedgetoption) parameter with it you can pass `projection` param (see below).

>If do not pass `pageParams` with `PagedGetOption` then will be used [default page options](#default-page-values).

Method signature:

```
getRelatedPage<T extends PagedResourceCollection<BaseResource>>(relationName: string, options?: PagedGetOption): Observable<T>;
```

- `relationName` - resource relation name used to get request URL.
- `options` - [PagedGetOption](#pagedgetoption) additional options applied to the request, if not passed `pageParams` then used [default page params](#default-page-values).
- `return value` - [PagedResourceCollection](#pagedresourcecollection) paged collection of resources with type `T`.
- `throws error` - when required params are not valid or link not found by relation name or returned value is not [PagedResourceCollection](#pagedresourcecollection).

##### Examples of usage ([given the presets](#resource-presets)):

```ts
// Performing GET request by the URL: http://localhost:8080/api/v1/carts/1/productPage?page=0&size=20
cart.getRelatedPage<PagedResourceCollection<Product>>('productsPage')
  .subscribe((page: PagedResourceCollection<Product>) => {
    const products: Array<Product> = page.resources;
    /* can use page methods
       page.first();
       page.last();
       page.next();
       page.prev();
       page.customPage();
    */
  });
```

With options:

```ts
// Performing GET request by the URL: http://localhost:8080/api/v1/carts/1/productPage?page=1&size=40&projection=productProjection&testParam=test&sort=name,ASC
cart.getRelatedPage<PagedResourceCollection<Product>>('productsPage', {
  pageParams: {
    page: 1,
    size: 40
  },
  params: {
    testParam: 'test',
    projection: 'productProjection'
  },
  sort: {
    name: 'ASC'
  },
  // useCache: true | false, by default true
})
  .subscribe((page: PagedResourceCollection<Product>) => {
    const products: Array<Product> = page.resources;
    /* can use page methods
       page.first();
       page.last();
       page.next();
       page.prev();
       page.customPage();
    */
  });
```

### PostRelation
Performing POST request with request body by relation link URL.

Method signature:

```
postRelation(relationName: string, requestBody: RequestBody<any>, options?: RequestOption): Observable<HttpResponse<any> | any>;
```

- `relationName` - resource relation name used to get request URL.
- `requestBody` - [RequestBody](#requestbody) contains request body and additional body options.
- `options` - [RequestOption](#requestoption) additional options applied to the request.
- `return value` - by default `raw response data` or Angular `HttpResponse` when `options` param has a `observe: 'response'` value.

##### Examples of usage ([given the presets](#resource-presets)):

```ts
// Performing POST request by the URL: http://localhost:8080/api/v1/cart/1/postExample
cart.postRelation('postExample', {
  // In this case null values in someBody will be ignored
  body: someBody
})
  .subscribe((rawResult: any) => {
     // some logic        
  });
```

With options:

```ts
// Performing POST request by the URL: http://localhost:8080/api/v1/cart/1/postExample?testParam=test
cart.postRelation('postExample', {
  // In this case null values in someBody will be NOT ignored
  body: someBody,
  valuesOption: {
    include: Include.NULL_VALUES
  }
}, {
  params: {
    testParam: 'test'
  },
  observe: 'response'
})
  .subscribe((response: HttpResponse<any>) => {
     // some logic        
  });
```

### PatchRelation
Performing PATCH request with request body by relation link URL.

Method signature:

```
patchRelation(relationName: string, requestBody: RequestBody<any>, options?: RequestOption): Observable<HttpResponse<any> | any>;
```

- `relationName` - resource relation name used to get request URL.
- `requestBody` - [RequestBody](#requestbody) contains request body and additional body options.
- `options` - [RequestOption](#requestoption) additional options applied to the request.
- `return value` - by default `raw response data` or Angular `HttpResponse` when `options` param has a `observe: 'response'` value.

##### Examples of usage ([given the presets](#resource-presets)):

```ts
// Performing PATCH request by the URL: http://localhost:8080/api/v1/cart/1/patchExample
cart.patchRelation('patchExample', {
  // In this case null values in someBody will be ignored
  body: someBody
})
  .subscribe((rawResult: any) => {
     // some logic        
  });

```

With options:

```ts
// Performing PATCH request by the URL: http://localhost:8080/api/v1/cart/1/patchExample?testParam=test
cart.patchRelation('patchExample', {
  // In this case null values in someBody will be NOT ignored
  body: someBody,
  valuesOption: {
    include: Include.NULL_VALUES
  }
}, {
  params: {
    testParam: 'test'
  },
  observe: 'response'
})
  .subscribe((response: HttpResponse<any>) => {
     // some logic        
  });
```

### PutRelation
Performing PUT request with request body by relation link URL.

Method signature:

```
putRelation(relationName: string, requestBody: RequestBody<any>, options?: RequestOption): Observable<HttpResponse<any> | any>;
```

- `relationName` - resource relation name used to get request URL.
- `requestBody` - [RequestBody](#requestbody) contains request body and additional body options.
- `options` - [RequestOption](#requestoption) additional options applied to the request.
- `return value` - by default `raw response data` or Angular `HttpResponse` when `options` param has a `observe: 'response'` value.

##### Examples of usage ([given the presets](#resource-presets)):

```ts
// Performing PUT request by the URL: http://localhost:8080/api/v1/cart/1/putExample
cart.putRelation('putExample', {
  // In this case null values in someBody will be ignored
  body: someBody
})
  .subscribe((rawResult: any) => {
     // some logic        
  });
```

With options:

```ts
// Performing PUT request by the URL: http://localhost:8080/api/v1/cart/1/putExample?testParam=test
cart.putRelation('putExample', {
  // In this case null values in someBody will be NOT ignored
  body: someBody,
  valuesOption: {
    include: Include.NULL_VALUES
  }
}, {
  params: {
    testParam: 'test'
  },
  observe: 'response'
})
  .subscribe((response: HttpResponse<any>) => {
     // some logic        
  });
```

## Resource

Main resource class. Extend model classes with `Resource` class to have the ability to use resource methods.

The difference between the `Resource` type and [EmbeddedResource](#embeddedresource) is `Resource` class has a self link therefore it has an id property, `EmbeddedResource` has not.
`Resource` classes are `@Entity` server-side classes. [EmbeddedResource](#embeddedresource) classes are `@Embeddable` entities.

`Resource` class extend [BaseResource](#baseresource) with additional resource relations methods that used only with `Resource` type.

### IsResourceOf
Uses when resource has sub-types, and you want to know what subtype current resource has.
Read more about sub-types [here](#subtypes-support).

>Each [Resource](#resource) has a private property is `resourceName` that calculated by the URL which resource was get.
Suppose to get `Cart` resource used the next URL: `http://localhost:8080/api/v1/carts/1`.
Then `Cart.resourceName` will be equals to `carts` because this part of the URL represents the resource name.

Method signature:

```
isResourceOf<T extends Resource>(typeOrName: (new () => T) | string): boolean;
```
- `typeOrName` - resource type, or string that represent resource name.
  If you pass resource type for example `someResource.isResourceOf(CartPayment)` then class name will be used to compare with the resource name (ignoring letter case).
  If you pass resource name as a string then it will be used to compare with resource name with (ignoring letter case).
- `return value` - `true` when resource name equals passed value, `false` otherwise.

##### Examples of usage ([given the presets](#resource-presets)):

```ts
// Suppose was perform GET request to get the Cart resource by the URL: http://localhost:8080/api/v1/carts/1

cart.isResourceOf('carts'); // return TRUE
cart.isResourceOf('cart'); // return FALSE
cart.isResourceOf(Cart); // return FALSE because Cart class constructor name is 'cart'

```

### AddCollectionRelation
Adding passed entities to the resource collection behind the relation name.

Used `POST` method with `'Content-Type': 'text/uri-list'`.

>This method **DOES NOT REPLACED** existing resources in the collection instead it adds new ones.
To replace collection resource with passed entities use [bindRelation](#bindrelation) method.

Method signature:

```
addCollectionRelation<T extends Resource>(relationName: string, entities: Array<T>): Observable<HttpResponse<any>>;
```

- `relationName` - resource relation name used to get request URL mapped to resource collection.
- `entities` - an array of entities that should be added to resource collection.
- `return value` - Angular `HttpResponse` result.


##### Examples of usage ([given the presets](#resource-presets)):

```ts
// Suppose product1 already exists with id = 1
const product1 = ...;
// Suppose product2 already exists with id = 2
const product2 = ...;

cart.addCollectionRelation('products', [product1, product2])
  /* 
    Performing POST request by the URL: http://localhost:8080/api/v1/carts/1/products
    Content-type: 'text/uri-list'
    Body: [http://localhost:8080/api/v1/products/1, http://localhost:8080/api/v1/products/2]
  */
  .subscribe((result: HttpResponse<any>) => {
     // some logic            
  });
```

### BindRelation
Bounding the passed entity or collection of entities to this resource by the relation name.

Used `PUT` method with `'Content-Type': 'text/uri-list'`.


>This method also **REPLACED** existing resources in the collection by passed entities.
To add entities to collection resource use [addCollectionRelation](#addCollectionRelation) method.

Method signature:

```
bindRelation<T extends Resource>(relationName: string, entity: Array<T>): Observable<HttpResponse<any>>;
```

- `relationName` - resource relation name used to get request URL.
- `entities` - an array of entities that should be bound to resource.
- `return value` - Angular `HttpResponse` result.

##### Examples of usage ([given the presets](#resource-presets)):

With single resource relation:
```ts
// Suppose shopToBind already exists with id = 1
const shopToBind = ...;
cart.bindRelation('shop', [shopToBind])
  /* 
    Performing PUT request by the URL: http://localhost:8080/api/v1/carts/1/shop
    Content-type: 'text/uri-list'
    Body: http://localhost:8080/api/v1/shops/1
  */
  .subscribe((result: HttpResponse<any>) => {
     // some logic            
  });

```

With collection resource relation:
```ts
// Suppose product1 already exists with id = 1
const product1 = ...;
// Suppose product2 already exists with id = 2
const product2 = ...;

cart.bindRelation('products', [product1, product2])
  /* 
    Performing PUT request by the URL: http://localhost:8080/api/v1/carts/1/products
    Content-type: 'text/uri-list'
    Body: [http://localhost:8080/api/v1/products/1, http://localhost:8080/api/v1/products/2]
  */
  .subscribe((result: HttpResponse<any>) => {
     // some logic            
  });
```

### UnbindRelation
Unbinding single resource relation behind resource name.

Used `DELETE` method to relation resource link URL.

>This method does not work with collection resource relations.
> To clear collection resource relation use [ClearCollectionRelation](#clearCollectionRelation) method.
> To delete one resource from resource collection use [deleteRelation](#deleterelation) method.

Method signature:

```
unbindRelation<T extends Resource>(relationName: string): Observable<HttpResponse<any>>;
```

- `relationName` - resource relation name to unbind.
- `return value` - Angular `HttpResponse` result.

##### Examples of usage ([given the presets](#resource-presets)):

```ts
// Suppose cart already bound shop resource by relation name 'shop'
cart.unbindRelation('shop')
  /* 
    Performing DELETE request by the URL: http://localhost:8080/api/v1/carts/1/shop
  */
  .subscribe((result: HttpResponse<any>) => {
     // some logic            
  });
```

### ClearCollectionRelation
Unbinding all resources from resource collection behind resource name.

>This method does not work with SINGLE resource relations.
> To delete single resource relations use [unboundRelation](#unboundRelation) or [deleteRelation](#deleterelation) methods.
> To delete one resource from collection use [deleteRelation](#deleterelation) method.

Method signature:

```
clearCollectionRelation<T extends Resource>(relationName: string): Observable<HttpResponse<any>>;
```

- `relationName` - resource relation name used to get request URL.
- `return value` - Angular `HttpResponse` result.

##### Examples of usage ([given the presets](#resource-presets)):

```ts
/* 
 Performing PUT request by the URL: http://localhost:8080/api/v1/carts/1/products
 Content-type: 'text/uri-list'
 Body: ''
*/
cart.clearCollectionRelation('products')
  .subscribe((result: HttpResponse<any>) => {
     // some logic            
  });

```

### DeleteRelation
Deleting resource relation.

For collection, means that only passed entity will be unbound from the collection.
For single resource, deleting relation the same as [undoundRelation](#unbindrelation) method.

>To delete all resource relations from collection use [clearCollectionRelation](#clearcollectionrelation) method.

Method signature:

```
deleteRelation<T extends Resource>(relationName: string, entity: T): Observable<HttpResponse<any>>;
```

- `relationName` - resource relation name used to get request URL.
- `entity` - entity to unbind.
- `return value` - Angular `HttpResponse` result.

##### Examples of usage ([given the presets](#resource-presets)):

```ts
// Performing DELETE request by the URL: http://localhost:8080/api/v1/carts/1/shop/1
// Suppose shopToDelete already exists with id = 1
const shopToDelete = ...;
cart.deleteRelation('shop', shopToDelete)
  .subscribe((result: HttpResponse<any>) => {
     // some logic            
  });

```

## EmbeddedResource
This resource type uses when a server-side entity is [@Embeddable](https://docs.jboss.org/hibernate/orm/5.0/userguide/html_single/chapters/domain/embeddables.html).
It means that this entity has not an id property and can't exist standalone.

Because embedded resources have not an id then it can use only [BaseResource](#baseresource) methods.

## ResourceCollection
This resource type represents collection of resources.
You can get this type as result [GetRelatedCollection](#getrelatedcollection), [GetResourceCollection](#getresourcecollection) or perform [CustomQuery](#customquery)/[CustomSearchQuery](#customsearchquery) with passed return type as `ResourceCollection`.

Resource collection holds resources in the public property with the name `resources`.

## PagedResourceCollection
This resource type represents paged collection of resources.
You can get this type as result [GetRelatedPage](#getrelatedpage), [GetPage](#getpage) or perform [CustomQuery](#customquery)/[CustomSearchQuery](#customsearchquery) with passed return type as PagedResourceCollection.

PagedResourceCollection extends [ResourceCollection](#resourcecollection) type and adds methods to work with a page.

### Default page values
When you do not pass `page` or `size` params in methods with [PagedGetOption](#pagedgetoption) then used default values: `page = 0`, `size = 20`.

### HasFirst

Checks that `PagedResourceCollection` has the link to get the first-page result.

Method signature:

```
hasFirst(): boolean;
```

- `return value` - `true` when the link to get the first page exists, `false` otherwise.

### HasLast

Checks that `PagedResourceCollection` has the link to get the last page result.

Method signature:

```
hasLast(): boolean;
```

- `return value` - `true` when the link to get the last page exists, `false` otherwise.

### HasNext

Checks that `PagedResourceCollection` has the link to get the next page result.

Method signature:

```
hasNext(): boolean;
```

- `return value` - `true` when the link to get the next page exists, `false` otherwise.

### HasPrev

Checks that `PagedResourceCollection` has the link to get the previous page result.

Method signature:

```
hasPrev(): boolean;
```

- `return value` - `true` when the link to get the prev page exists, `false` otherwise.

### First
Performing a request to get the first-page result by the first-page link.

Method signature:

```
first(options?: {useCache: true;}): Observable<PagedResourceCollection<T>>;
```

- `options` - additional options to manipulate the cache when getting a result (by default will be used the cache if it enabled in the [configuration](#cache-params)).
- `return value` - [PagedResourceCollection](#pagedresourcecollection) with resource types `T`.
- `throws error` - when the link to get the first-page result is not exist.

##### Examples of usage:

Suppose products have 3 pages with 20 resources per page, and the previous request was to get products with a page number = 1.

To get the first products page, will perform request to page number = 0 with current or [default page size](#default-page-values) (if before page size not passed).

```ts
// Performing GET request by the URL: http://localhost:8080/api/v1/products?page=0&size=20
const pagedProductCollection = ...;
pagedProductCollection.first()
  .subscribe((firstPageResult: PagedResourceCollection<Product>) => {
     // firstPageResult can be fetched from the cache if before was performing the same request
     // some logic        
  });
```

With options:

```ts
// Performing GET request by the URL: http://localhost:8080/api/v1/products?page=0&size=20
const pagedProductCollection = ...;
pagedProductCollection.first({useCache: false})
  .subscribe((firstPageResult: PagedResourceCollection<Product>) => {
     // firstPageResult always will be fetched from the server because the cache is disabled for this request
     // some logic        
  });
```

### Last
Performing a request to get the last-page result by the last-page link.

Method signature:

```
last(options?: {useCache: true;}): Observable<PagedResourceCollection<T>>;
```

- `options` - additional options to manipulate the cache when getting a result (by default will be used the cache if it enabled in the [configuration](#cache-params)).
- `return value` - [PagedResourceCollection](#pagedresourcecollection) with resource types `T`.
- `throws error` - when the link to get the last-page result is not exist.

##### Examples of usage:

Suppose products have 3 pages with 20 resources per page, and the previous request was to get products with a page number = 1.

To get the last products page, will perform request to page number = 2 with current or [default page size](#default-page-values) (if before page size not passed).

```ts
// Performing GET request by the URL: http://localhost:8080/api/v1/products?page=2&size=20
const pagedProductCollection = ...;
pagedProductCollection.last()
  .subscribe((lastPageResult: PagedResourceCollection<Product>) => {
     // lastPageResult can be fetched from the cache if before was performing the same request
     // some logic        
  });
```

With options:

```ts
// Performing GET request by the URL: http://localhost:8080/api/v1/products?page=2&size=20
const pagedProductCollection = ...;
pagedProductCollection.last({useCache: false})
  .subscribe((lastPageResult: PagedResourceCollection<Product>) => {
     // lastPageResult always will be fetched from the server because the cache is disabled for this request
     // some logic        
  });
```

### Next
Performing a request to get the next-page result by the next-page link.

Method signature:

```
next(options?: {useCache: true;}): Observable<PagedResourceCollection<T>>;
```

- `options` - additional options to manipulate the cache when getting a result (by default will be used the cache if it enabled in the [configuration](#cache-params)).
- `return value` - [PagedResourceCollection](#pagedresourcecollection) with resource types `T`.
- `throws error` - when the link to get the next-page result is not exist.

##### Examples of usage:

Suppose products have 3 pages with 20 resources per page, and the previous request was to get products with a page number = 1.

To get the next products page, will perform request to page number = 2 with current or [default page size](#default-page-values) (if before page size not passed).

```ts
// Performing GET request by the URL: http://localhost:8080/api/v1/products?page=1&size=20
const pagedProductCollection = ...;
pagedProductCollection.next()
  .subscribe((nextPageResult: PagedResourceCollection<Product>) => {
     // nextPageResult can be fetched from the cache if before was performing the same request
     // some logic        
  });
```

With options:

```ts
// Performing GET request by the URL: http://localhost:8080/api/v1/products?page=1&size=20
const pagedProductCollection = ...;
pagedProductCollection.next({useCache: false})
  .subscribe((nextPageResult: PagedResourceCollection<Product>) => {
     // nextPageResult always will be fetched from the server because the cache is disabled for this request
     // some logic        
  });
```

### Prev
Performing a request to get the prev-page result by the prev-page link.

Method signature:

```
prev(options?: {useCache: true;}): Observable<PagedResourceCollection<T>>;
```

- `options` - additional options to manipulate the cache when getting a result (by default will be used the cache if it enabled in the [configuration](#cache-params)).
- `return value` - [PagedResourceCollection](#pagedresourcecollection) with resource types `T`.
- `throws error` - when the link to get the prev-page result is not exist.

##### Examples of usage:

Suppose products have 3 pages with 20 resources per page, and the previous request was to get products with a page number = 1.

To get the prev products page, will perform request to page number = 0 with current or [default page size](#default-page-values) (if before page size not passed).


```ts
// Performing GET request by the URL: http://localhost:8080/api/v1/products?page=0&size=20
const pagedProductCollection = ...;
pagedProductCollection.prev()
  .subscribe((prevPageResult: PagedResourceCollection<Product>) => {
     // prevPageResult can be fetched from the cache if before was performing the same request
     // some logic        
  });
```

With options:

```ts
// Performing GET request by the URL: http://localhost:8080/api/v1/products?page=0&size=20
const pagedProductCollection = ...;
pagedProductCollection.prev({useCache: false})
  .subscribe((prevPageResult: PagedResourceCollection<Product>) => {
     // prevPageResult always will be fetched from the server because the cache is disabled for this request
     // some logic        
  });
```

### Page
Performing a request to get the page with passed page number and current or [default page size](#default-page-values) (if before page size not passed).

>To pass page number, page size, sort params together use [customPage](#custompage) method.

Method signature:

```
page(pageNumber: number, options?: {useCache: true;}): Observable<PagedResourceCollection<T>>;
```

- `pageNumber` - number of the page to get.
- `options` - additional options to manipulate the cache when getting a result (by default will be used the cache if it enabled in the [configuration](#cache-params)).
- `return value` - [PagedResourceCollection](#pagedresourcecollection) with resource types `T`.
- `throws error` - when `pageNumber` greater than total pages.

##### Examples of usage:

Suppose products have 5 pages with 20 resources per page, and the previous request was to get products with a page number = 1.

To get the products page = 3, will perform request to page number = 3 with current or [default page size](#default-page-values) (if before page size not passed).

```ts
// Performing GET request by the URL: http://localhost:8080/api/v1/products?page=3&size=20
const pagedProductCollection = ...;
pagedProductCollection.page(3)
  .subscribe((customPageResult: PagedResourceCollection<Product>) => {
     // customPageResult can be fetched from the cache if before was performing the same request
     // some logic        
  });
```

With options:

```ts
// Performing GET request by the URL: http://localhost:8080/api/v1/products?page=3&size=20
const pagedProductCollection = ...;
pagedProductCollection.page(3, {useCache: false})
  .subscribe((customPageResult: PagedResourceCollection<Product>) => {
     // customPageResult always will be fetched from the server because the cache is disabled for this request
     // some logic        
  });
```

### Size
Performing a request to get the page with passed page size and current or [default page number](#default-page-values) (if before page number not passed).

>To pass page number, page size, sort params together use [customPage](#custompage) method.

Method signature:

```
size(size: number, options?: {useCache: true;}): Observable<PagedResourceCollection<T>>;
```

- `size` - count of resources to page.
- `options` - additional options to manipulate the cache when getting a result (by default will be used the cache if it enabled in the [configuration](#cache-params)).
- `return value` - [PagedResourceCollection](#pagedresourcecollection) with resource types `T`.
- `throws error` - when `size` greater than total count resources.

##### Examples of usage:

Suppose products have 5 pages with 20 resources per page, and the previous request was to get products with a page number = 1, size = 20.

To increase the current page size to 50, will perform a request to the current page number with page size = 50.

```ts
// Performing GET request by the URL: http://localhost:8080/api/v1/products?page=1&size=50
const pagedProductCollection = ...;
pagedProductCollection.size(50)
  .subscribe((customPageResult: PagedResourceCollection<Product>) => {
     // customPageResult can be fetched from the cache if before was performing the same request
     // some logic        
  });
```

With options:

```ts
// Performing GET request by the URL: http://localhost:8080/api/v1/products?page=1&size=50
const pagedProductCollection = ...;
pagedProductCollection.size(50, {useCache: false})
  .subscribe((customPageResult: PagedResourceCollection<Product>) => {
     // customPageResult always will be fetched from the server because the cache is disabled for this request
     // some logic        
  });
```

### SortElements
Sorting the current page result.

>To pass page number, page size, sort params together use [customPage](#custompage) method.

Method signature:

```
sortElements(sortParam: Sort, options?: {useCache: true;}): Observable<PagedResourceCollection<T>>;
```

- `sortParam` - [Sort](#sort) params.
- `options` - additional options to manipulate the cache when getting a result (by default will be used the cache if it enabled in the [configuration](#cache-params)).
- `return value` - [PagedResourceCollection](#pagedresourcecollection) with resource types `T`.

##### Examples of usage:

Suppose products have 5 pages with 20 resources per page, and the previous request was to get products with a page number = 1, size = 20.

To sort the current page result, will perform a request to the current page number with the current page size and passed sort params.

```ts
// Performing GET request by the URL: http://localhost:8080/api/v1/products?page=1&size=20&sort=cost,ASC&sort=name,DESC
const pagedProductCollection = ...;
pagedProductCollection.sortElements({cost: 'ASC', name: 'DESC'})
  .subscribe((customPageResult: PagedResourceCollection<Product>) => {
     // customPageResult can be fetched from the cache if before was performing the same request
     // some logic        
  });
```

With options:

```ts
// Performing GET request by the URL: http://localhost:8080/api/v1/products?page=1&size=20&sort=cost,ASC&sort=name,DESC
const pagedProductCollection = ...;
pagedProductCollection.sortElements({cost: 'ASC', name: 'DESC'}, {useCache: false})
  .subscribe((customPageResult: PagedResourceCollection<Product>) => {
     // customPageResult always will be fetched from the server because the cache is disabled for this request
     // some logic        
  });
```

### CustomPage
Performing a request to get the page with custom page number, page size, and sort params.

Method signature:

```
customPage(params: SortedPageParam, options?: {useCache: true;}): Observable<PagedResourceCollection<T>>;
```

- `params` - [SortedPageParam](#sortedpageparam) page and sort params.
- `options` - additional options to manipulate the cache when getting a result (by default will be used the cache if it enabled in the [configuration](#cache-params)).
- `return value` - [PagedResourceCollection](#pagedresourcecollection) with resource types `T`.
- `throws error` - when the page size, greater than total count resources or page number greater than total pages.

> When pass only part of the `params` then used [default page params](#default-page-values) for not passed ones.

##### Examples of usage:

```ts
// Performing GET request by the URL: http://localhost:8080/api/v1/products?page=2&size=30&sort=name,ASC
const pagedProductCollection = ...;
pagedProductCollection.customPage({
    pageParams: {
      page: 2,
      size: 30
    },
    sort: {
      name: 'ASC'
    }
  })
  .subscribe(value1 => {
     // customPageResult can be fetched from the cache if before was performing the same request
     // some logic      
  });
```

With options:

```ts
// Performing GET request by the URL: http://localhost:8080/api/v1/products?page=2&size=30&sort=name,ASC
const pagedProductCollection = ...;
pagedProductCollection.customPage({
    pageParams: {
      page: 2,
      size: 30
    },
    sort: {
      name: 'ASC'
    }
  },
  {useCache: true})
  .subscribe(value1 => {
     // customPageResult always will be fetched from the server because the cache is disabled for this request
     // some logic  
  });

```

## Subtypes support

The library allows work with entities hierarchy.

Suppose exists the next resource's hierarchy:

```ts
 import { Resource } from '@lagoshny/ngx-hal-client';
  
  export class Cart extends Resource {
  
      public client: Client;
  
  }
  
  export class Client extends Resource {
  
    public address: string;
  
  }
  
  export class PhysicalClient extends Client {
  
    public fio: string;
  
  }
  
  export class JuridicalClient extends Client {
  
    public inn: string;
  
  }
 
```

With `hal-json` representation:

```json
  Cart:
  {
    "status": "New",
    "_links": {
      "self": {
        "href": "http://localhost:8080/api/v1/carts/1"
      },
      "cart": {
        "href": "http://localhost:8080/api/v1/carts/1{?projection}",
        "templated": true
      },
      "client": {
        "href": "http://localhost:8080/api/v1/carts/1/physicalClient"
      }
    }
  }
  
  PhysicalClient:
  {
    "fio": "Some fio",
    "_links": {
      "self": {
        "href": "http://localhost:8080/api/v1/physicalClients/1"
      },
      "physicalClient": {
        "href": "http://localhost:8080/api/v1/physicalClients/1"
      }
    }
  }
```  
From the example, above can note that the `Cart` resource has the `client` property with type `Client`.
In its turn, `client` can have one of the types `PhysicalClient` or `JuridicalClient`.

You can use [Resource.isResourceOf](#isresourceof) method to know what `client` resource type you got.

##### Examples of usage:

```ts
// Suppose exists cart resource and after getting client relation need to know what is the client type
const cart = ...
cart.getRelation('client')
  .subscribe((client: Client) => {
    if (client.isResourceOf('physicalClients')) {
      const physicalClient = client as PhysicalClient;
    // some logic        
    } else if (client.isResourceOf('juridicalClients')) {
      const juridicalClient = client as JuridicalClient;
    // some logic        
    }
  });
```

## Resource service

As described before to work with resources you can use built-in [HateoasResourceService](#built-in-hateoasresourceservice)  or create [custom resource service](#resource-service).

>Difference in methods signature between built-in HateoasResourceService and custom resource service is built-in service always has a resource name as the first method param but can use without creating custom resource service

### Resource service presets

Examples of usage resource service methods rely on this presets.


- Server root url = http://localhost:8080/api/v1
- Resource class is
  ```ts
  import { Resource } from '@lagoshny/ngx-hal-client';
  
  export class Product extends Resource {
  
      public name: string;
  
      public cost: number;
  
      public description: string;
  
  }
  ```

- Resource service as built-in [HateoasResourceService](#built-in-hateoasresourceservice) is
  ```ts
  @Component({ ... })
  export class AppComponent {
      constructor(private productHateoasService: HateoasResourceService) {
      }
  }
  ```  

- Resource service as [custom resource service](#create-custom-resource-service) is
  ```ts
  import { HalResourceOperation } from '@lagoshny/ngx-hal-client';
  import { Product } from '../model/product.model';
  
  @Injectable({providedIn: 'root'})
  export class ProductService extends HalResourceOperation<Product> {
    constructor() {
      super('products');
    }
  }
  
  @Component({ ... })
  export class AppComponent {
      constructor(private productService: ProductService) {
      }
  }
  ```

**No matter which service used both have the same resource methods.**

### GetResource
Getting one resource [Resource](#resource).

This method takes [GetOption](#getoption) parameter with it you can pass `projection` param.

Method signature:

```
getResource(id: number | string, options?: GetOption): Observable<T>;
```

- `id` - resource id to get.
- `options` - [GetOption](#getoption) additional options applied to the request.
- `return value` - [Resource](#resource) with type `T`.
- `throws error` when returned value is not [Resource](#resource).

##### Example of usage ([given the presets](#resource-service-presets)):

```ts
// Performing GET request by the URL: http://localhost:8080/api/v1/products/1
this.productService.getResource(1)
    .subscribe((product: Product) => {
        // some logic
    })

this.productHateoasService.getResource('products', 1)
    .subscribe((product: Product) => {
        // some logic
    })
```

With options:

```ts
// Performing GET request by the URL: http://localhost:8080/api/v1/products/1?testParam=test&projection=productProjection&sort=cost,ASC
this.productService.getResource(1, {
  params: {
    testParam: 'test',
    projection: 'productProjection',
  },
  sort: {
    cost: 'ASC'
  },
  // useCache: true | false, by default true
}).subscribe((product: Product) => {
    // some logic
})

this.productHateoasService.getResource('products', 1, {
  params: {
    testParam: 'test',
    projection: 'productProjection',
  },
  sort: {
    cost: 'ASC'
  },
  // useCache: true | false, by default true
}).subscribe((product: Product) => {
    // some logic
})
```

### GetCollection
Getting collection of resources [ResourceCollection](#resourcecollection).
This method takes [GetOption](#getoption) parameter with it you can pass `projection` param.

Method signature:

```
getCollection(options?: GetOption): Observable<ResourceCollection<T>>;
```

- `options` - [GetOption](#getoption) additional options applied to the request.
- `return value` - [ResourceCollection](#resourcecollection) collection of resources with type `T`.
- `throws error` when returned value is not [ResourceCollection](#resourcecollection).

##### Example of usage ([given the presets](#resource-service-presets)):

```ts
// Performing GET request by the URL: http://localhost:8080/api/v1/products
this.productService.getCollection()
    .subscribe((collection: ResourceCollection<Product>) => {
        const products: Array<Product> = collection.resources;
        // some logic
    })

this.productHateoasService.getCollection('products')
    .subscribe((collection: ResourceCollection<Product>) => {
        const products: Array<Product> = collection.resources;
        // some logic
    })
```

With options:

```ts
// Performing GET request by the URL: http://localhost:8080/api/v1/products?testParam=test&projection=productProjection&sort=cost,ASC
this.productService.getCollection({
  params: {
    testParam: 'test',
    projection: 'productProjection',
  },
  sort: {
    cost: 'ASC'
  },
  // useCache: true | false, by default true
}).subscribe((collection: ResourceCollection<Product>) => {
    const products: Array<Product> = collection.resources;
    // some logic
})

this.productHateoasService.getCollection('products', {
  params: {
    testParam: 'test',
    projection: 'productProjection',
  },
  sort: {
    cost: 'ASC'
  },
  // useCache: true | false, by default true
}).subscribe((collection: ResourceCollection<Product>) => {
    const products: Array<Product> = collection.resources;
    // some logic
})
```

### GetPage
Getting paged collection of resources [PagedResourceCollection](#pagedresourcecollection).

This method takes [PagedGetOption](#pagedgetoption) parameter with it you can pass `projection` param (see below).

>If do not pass `pageParams` with `PagedGetOption` then will be used [default page options](#default-page-values).

Method signature:

```
getPage(options?: PagedGetOption): Observable<PagedResourceCollection<T>>;
```

- `options` - [PagedGetOption](#pagedgetoption) additional options applied to the request, if not passed `pageParams` then used [default page params](#default-page-values).
- `return value` - [PagedResourceCollection](#pagedresourcecollection) paged collection of resources with type `T`.
- `throws error` when returned value is not [PagedResourceCollection](#pagedresourcecollection)

##### Example of usage ([given the presets](#resource-service-presets)):

```ts
// Performing GET request by the URL: http://localhost:8080/api/v1/products?page=0&size=20
this.productService.getPage()
    .subscribe((page: PagedResourceCollection<Product>) => {
        const products: Array<Product> = page.resources;
        /* can use page methods
           page.first();
           page.last();
           page.next();
           page.prev();
           page.customPage();
        */    
    });

this.productHateoasService.getPage('products')
    .subscribe((page: PagedResourceCollection<Product>) => {
        const products: Array<Product> = page.resources;
        /* can use page methods
           page.first();
           page.last();
           page.next();
           page.prev();
           page.customPage();
        */   
    });
```

With options:

```ts
// Performing GET request by the URL: http://localhost:8080/api/v1/products?testParam=test&projection=productProjection&page=1&size=40&sort=cost,ASC
this.productService.getPage({
  pageParams: {
    page: 1,
    size: 40
  },
  params: {
    testParam: 'test',
    projection: 'productProjection',
  },
  sort: {
    cost: 'ASC'
  },
  // useCache: true | false, by default true
}).subscribe((page: PagedResourceCollection<Product>) => {
    const products: Array<Product> = page.resources;
    /* can use page methods
       page.first();
       page.last();
       page.next();
       page.prev();
       page.customPage();
    */  
});

this.productHateoasService.getPage('products', {
  pageParams: {
    page: 1,
    size: 40
  },
  params: {
    testParam: 'test',
    projection: 'productProjection',
  },
  sort: {
    cost: 'ASC'
  },
  // useCache: true | false, by default true
}).subscribe((page: PagedResourceCollection<Product>) => {
    const products: Array<Product> = page.resources;
    /* can use page methods
       page.first();
       page.last();
       page.next();
       page.prev();
       page.customPage();
    */  
});
```

### CreateResource
Creating new resource [Resource](#resource).

Method signature:

```
createResource(requestBody: RequestBody<T>): Observable<T | any>;
```

- `requestBody` - [RequestBody](#requestbody) contains request body (in this case resource object) and additional body options.
- `return value` - [Resource](#resource) with type `T` or `raw response data` when returned value is not resource object.

##### Example of usage ([given the presets](#resource-service-presets)):

```ts
/*
Performing POST request by the URL: http://localhost:8080/api/v1/products
Request body:
{
  "name": "Apple",
  "cost": 100
}
Note: description is not passed because by default null values ignore. If you want pass description = null value then need to pass additional valuesOption params.
*/
const newProduct = new Product();
newProduct.cost = 100;
newProduct.name = 'Apple';
newProduct.description = null;
this.productService.createResource({
  body: newProduct
}).subscribe((createdProduct: Product) => {
    // some logic 
});

this.productHateoasService.createResource('products', {
  body: newProduct
}).subscribe((createdProduct: Product) => {
    // some logic 
});
```

With options:

```ts
/*
Performing POST request by the URL: http://localhost:8080/api/v1/products
Request body:
{
  "name": "Apple",
  "cost": 100,
  "description": null
}
Note: description is passed with null value because valuesOption = Include.NULL_VALUES was passed.
*/ 
const newProduct = new Product();
newProduct.cost = 100;
newProduct.name = 'Apple';
newProduct.description = null;
this.productService.createResource({
  body: newProduct,
  valuesOption: {
    include: Include.NULL_VALUES
  }
}).subscribe((createdProduct: Product) => {
    // some logic 
});

this.productHateoasService.createResource('products', {
  body: newProduct,
  valuesOption: {
    include: Include.NULL_VALUES
  }
}).subscribe((createdProduct: Product) => {
    // some logic 
});
```

### UpdateResource
Updating **all** values of an existing resource at once `by resource self link URL`.

>For not passed values of resource, `null` values will be used.

To update a resource performs `PUT` request by the URL equals to `resource self link` passed in `entity` param.

To update a resource by an `id` directly use [UpdateResourceById](#updateresourcebyid).

>To update part of the values of resource use [PatchResource](#patchresource) method.

Method signature:

```
updateResource(entity: T, requestBody?: RequestBody<any>): Observable<T | any>;
```

- `entity` - resource to update.
- `requestBody` - [RequestBody](#requestbody) contains request body (in this case new values for resource) and additional body options.
- `return value` - [Resource](#resource) with type `T` or `raw response data` when returned value is not resource object.

>When passed only `entity` param then values of `entity` will be used to update values of resource.

##### Example of usage ([given the presets](#resource-service-presets)):

```ts
/*
Suppose exitsProduct has a self link = http://localhost:8080/api/v1/products/1
Performing PUT request by the URL: http://localhost:8080/api/v1/products/1
Request body:
{
  "name" = exitsProduct.name,
  "cost": 500
}
Note: 
1) Description is not passed because by default null values ignore. If you want pass description = null value then need to pass additional valuesOption params.
2) Since update resource updating all resource values at once and for description value is not passing then the server-side can overwrite description to null. 
*/
const exitsProduct = ...;
exitsProduct.cost = 500;
exitsProduct.description = null;
this.productService.updateResource(exitsProduct)
  .subscribe((updatedProduct: Product) => {
    // some logic 
});
// For productHateoasService this snippet is identical
```

With options:

```ts
/*
Suppose exitsProduct has a self link = http://localhost:8080/api/v1/products/1
Performing PUT request by the URL: http://localhost:8080/api/v1/products/1
Request body:
{
  "name": null,
  "cost": 500
}
Note: 
1) Name was passed with null value because valuesOption = Include.NULL_VALUES was passed.
2) Since update resource updating all resource values at once and for description value is not passing then the server-side can overwrite description to null. 
*/
const exitsProduct = ...;
this.productService.updateResource(exitsProduct, {
  body: {
    name: null,
    cost: 500
  },
  valuesOption: {
    include: Include.NULL_VALUES
  }
}).subscribe((updatedProduct: Product) => {
    // some logic 
});
// For productHateoasService this snippet is identical
```

### UpdateResourceById
Updating **all** values of an existing resource at once `by resource id`.

To update a resource by resource `self link URL` use [UpdateResource](#updateresource).

>To update part of the values of resource use [PatchResource](#patchresource) method.


Method signature:

```
updateResourceById(id: number | string, requestBody: RequestBody<any>): Observable<T | any>;
```

- `id` - resource id to update.
- `requestBody` - [RequestBody](#requestbody) contains request body (in this case new values for resource) and additional body options.
- `return value` - [Resource](#resource) with type `T` or `raw response data` when returned value is not resource object.

##### Example of usage ([given the presets](#resource-service-presets)):

```ts
/*
Suppose exitsProduct has an id = 1
Performing PUT request by the URL: http://localhost:8080/api/v1/products/1
Request body:
{
  "name" = exitsProduct.name,
  "cost": 500
}
Note: 
1) Description is not passed because by default null values ignore. If you want pass description = null value then need to pass additional valuesOption params.
2) Since update resource updating all resource values at once and for description value is not passing then the server-side can overwrite description to null. 
*/
const exitsProduct = ...;
exitsProduct.cost = 500;
exitsProduct.description = null;
this.productService.updateResourceById(1, {
  body: {
    ...exitsProduct
  }
})
  .subscribe((updatedProduct: Product) => {
    // some logic 
});

this.productHateoasService.updateResourceById('products', 1, {
  body: {
    ...exitsProduct
  }
})
  .subscribe((updatedProduct: Product) => {
    // some logic 
});
```

With options:

```ts
/*
Suppose exitsProduct has an id = 1
Performing PUT request by the URL: http://localhost:8080/api/v1/products/1
Request body:
{
  "name": null,
  "cost": 500
}
Note: 
1) Name was passed with null value because valuesOption = Include.NULL_VALUES was passed.
2) Since update resource updating all resource values at once and for description value is not passing then the server-side can overwrite description to null.
*/
this.productService.updateResourceById(1, {
  body: {
    name: null,
    cost: 500
  },
  valuesOption: {
    include: Include.NULL_VALUES
  }
})
  .subscribe((updatedProduct: Product) => {
    // some logic 
});

this.productHateoasService.updateResourceById('products', 1, {
  body: {
    name: null,
    cost: 500
  },
  valuesOption: {
    include: Include.NULL_VALUES
  }
})
  .subscribe((updatedProduct: Product) => {
    // some logic 
});

```

### PatchResource
Patching **part** values of an existing resource `by resource self link URL`.

To patch a resource performs `PATCH` request by the URL equals to `resource self link` passed in `entity` param.

To patch a resource by an `id` directly use [PatchResourceById](#patchresourcebyid).

>To update all values of the resource at once use [UpdateResource](#updateresource) method.

Method signature:

```
patchResource(entity: T, requestBody?: RequestBody<any>): Observable<T | any>;
```

- `entity` - resource to patch.
- `requestBody` - [RequestBody](#requestbody) contains request body (in this case new values for resource) and additional body options.
- `return value` - [Resource](#resource) with type `T` or `raw response data` when returned value is not resource object.

>When passed only `entity` param then values of `entity` will be used to patch values of resource.

##### Example of usage ([given the presets](#resource-service-presets)):

```ts
/*
Suppose exitsProduct has a self link = http://localhost:8080/api/v1/products/1
Performing PATCH request by the URL: http://localhost:8080/api/v1/products/1
Request body:
{
  "name" = exitsProduct.name,
  "cost": 500
}
Note: 
1) Description is not passed because by default null values ignore. If you want pass description = null value then need to pass additional valuesOption params.
2) Since patch resource updating only part of resource values at once then all not passed values will have the old values.
*/
const exitsProduct = ...;
exitsProduct.cost = 500;
exitsProduct.description = null;
this.productService.patchResource(exitsProduct)
  .subscribe((patchedProduct: Product) => {
    // some logic 
});
// For productHateoasService this snippet is identical
```

With options:

```ts
/*
Suppose exitsProduct has a self link = http://localhost:8080/api/v1/products/1
Performing PATCH request by the URL: http://localhost:8080/api/v1/products/1
Request body:
{
  "name": null,
  "cost": 500
}
Note: 
1) Name was passed with null value because valuesOption = Include.NULL_VALUES was passed.
2) Since patch resource updating only part of resource values at once then all not passed values will have the old values.
*/
const exitsProduct = ...;
this.productService.patchResource(exitsProduct, {
  body: {
    name: null,
    cost: 500
  },
  valuesOption: {
    include: Include.NULL_VALUES
  }
}).subscribe((patchedProduct: Product) => {
    // some logic 
});
// For productHateoasService this snippet is identical

```

### PatchResourceById
Patching **part** values of an existing resource `by resource id`.

To patch a resource by resource `self link URL` use [UpdateResource](#updateresource).

>To update all values of the resource at once use [UpdateResource](#updateresource) method.


Method signature:

```
patchResourceById(id: number | string, requestBody: RequestBody<any>): Observable<T | any>;
```

- `id` - resource id to patch.
- `requestBody` - [RequestBody](#requestbody) contains request body (in this case new values for resource) and additional body options.
- `return value` - [Resource](#resource) with type `T` or `raw response data` when returned value is not resource object.

##### Example of usage ([given the presets](#resource-service-presets)):

```ts
/*
Suppose exitsProduct has an id = 1
Performing PATCH request by the URL: http://localhost:8080/api/v1/products/1
Request body:
{
  "name" = existProduct.name,
  "cost": 500
}
Note: 
1) Description is not passed because by default null values ignore. If you want pass description = null value then need to pass additional valuesOption params.
2) Since patch resource updating only part of resource values at once then all not passed values will have the old values.
*/
const exitsProduct = ...;
exitsProduct.cost = 500;
exitsProduct.description = null;
this.productService.patchResourceById(1, {
  body: {
    ...exitsProduct
  }
})
  .subscribe((patchedProduct: Product) => {
    // some logic 
});

this.productHateoasService.patchResourceById('products', 1, {
  body: {
    ...exitsProduct
  }
})
  .subscribe((patchedProduct: Product) => {
    // some logic 
});
```

With options:

```ts
/*
Suppose exitsProduct has an id = 1
Performing PUT request by the URL: http://localhost:8080/api/v1/products/1
Request body:
{
  "name": null,
  "cost": 500
}
Note: 
1) Name was passed with null value because valuesOption = Include.NULL_VALUES was passed.
2) Since patch resource updating only part of resource values at once then all not passed values will have the old values.
*/
this.productService.patchResourceById(1, {
  body: {
    name: null,
    cost: 500
  },
  valuesOption: {
    include: Include.NULL_VALUES
  }
})
  .subscribe((patchedProduct: Product) => {
    // some logic 
});

this.productHateoasService.patchResourceById('products', 1, {
  body: {
    name: null,
    cost: 500
  },
  valuesOption: {
    include: Include.NULL_VALUES
  }
})
  .subscribe((patchedProduct: Product) => {
    // some logic 
});
```

### DeleteResource
Deleting resource `by resource self link URL`.

To delete a resource performs `DELETE` request by the URL equals to `resource self link` passed in `entity` param.

>To delete a resource by an `id` directly use [DeleteResourceById](#deleteresourcebyid).

Method signature:

```
deleteResource(entity: T, options?: RequestOption): Observable<HttpResponse<any> | any>;
```

- `entity` - resource to delete.
- `options` - [RequestOption](#requestoption) additional options applied to the request.
- `return value` - by default `raw response data` or Angular `HttpResponse` when `options` param has a `observe: 'response'` value.

##### Example of usage ([given the presets](#resource-service-presets)):

```ts
/*
Suppose exitsProduct has a self link = http://localhost:8080/api/v1/products/1
Will be perform DELETE request to the http://localhost:8080/api/v1/products/1
*/
this.productService.deleteResource(exitsProduct)
  .subscribe((result: any) => {
    // some logic     
  });
// For productHateoasService this snippet is identical
```

With options:

```ts
/*
Suppose exitsProduct has a self link = http://localhost:8080/api/v1/products/1
Will be perform DELETE request to the http://localhost:8080/api/v1/products/1?testParam=test
*/
const exitsProduct = ...;
this.productService.deleteResource(exitsProduct, {
  observe: 'response',
  params: {
    testParam: 'test'
  }
})
  .subscribe((result: HttpResponse<any>) => {
    // some logic     
  });
// For productHateoasService this snippet is identical
```

### DeleteResourceById
Deleting resource `by resource id`.

>To delete a resource by resource `self link URL` use [DeleteResource](#deleteresource).

Method signature:

```
deleteResourceById(id: number | string, options?: RequestOption): Observable<HttpResponse<any> | any>;
```

- `id` - resource id to delete.
- `options` - [RequestOption](#requestoption) additional options applied to the request.
- `return value` - by default `raw response data` or Angular `HttpResponse` when `options` param has a `observe: 'response'` value.

##### Example of usage ([given the presets](#resource-service-presets)):

```ts
/*
Suppose exitsProduct has an id = 1
Will be perform DELETE request to the http://localhost:8080/api/v1/products/1
*/
this.productService.deleteResourceById(1)
  .subscribe((result: any) => {
    // some logic     
  });

this.productHateoasService.deleteResourceById('products', 1)
  .subscribe((result: any) => {
    // some logic     
  });
```

With options:

```ts
/*
Suppose exitsProduct has an id = 1
Will be perform DELETE request to the http://localhost:8080/api/v1/products/1?testParam=test
*/
const exitsProduct = ...;
this.productService.deleteResourceById(1, {
  observe: 'response',
  params: {
    testParam: 'test'
  }
})
  .subscribe((result: HttpResponse<any>) => {
    // some logic     
  });

this.productHateoasService.deleteResourceById('products', 1, {
  observe: 'response',
  params: {
    testParam: 'test'
  }
})
  .subscribe((result: HttpResponse<any>) => {
    // some logic     
  });
```

### SearchResource
Searching for one resource [Resource](#resource).

This method takes [GetOption](#getoption) parameter with it you can pass `projection` param.

Method signature:

```
searchResource(searchQuery: string, options?: GetOption): Observable<T>;
```

- `searchQuery` - additional part of the URL that follow after `/search/` resource URL.
- `options` - [GetOption](#getoption) additional options applied to the request.
- `return value` - [Resource](#resource) with type `T`.
- `throws error` when returned value is not [Resource](#resource)

>When using the method not need to pass `/search/` part of the URL in `searchQuery`.

##### Example of usage ([given the presets](#resource-service-presets)):

```ts
// Performing GET request by the URL: http://localhost:8080/api/v1/products/search/searchQuery 
this.productService.searchResource('searchQuery')
    .subscribe((product: Product) => {
        // some logic
    });

this.productHateoasService.searchResource('products', 'searchQuery')
    .subscribe((product: Product) => {
        // some logic
    });
```

With options:

```ts
// Performing GET request by the URL: http://localhost:8080/api/v1/products/search/byName?name=Fruit&projection=productProjection&sort=name,ASC
this.productService.searchResource('byName', {
  params: {
    projection: 'productProjection',
    name: 'Fruit'
  },
  sort: {
    name: 'ASC'
  },
  // useCache: true | false, by default true
})
  .subscribe((product: Product) => {
    // some logic
  });

this.productHateoasService.searchResource('products', 'byName', {
  params: {
    projection: 'productProjection',
    name: 'Fruit'
  },
  sort: {
    name: 'ASC'
  },
  // useCache: true | false, by default true
})
  .subscribe((product: Product) => {
    // some logic
  });

```

#### SearchCollection
Searching for collection of resources [ResourceCollection](#resourcecollection).

This method takes [GetOption](#getoption) parameter with it you can pass `projection` param.

Method signature:

```
searchCollection(searchQuery: string, options?: GetOption): Observable<ResourceCollection<T>>;
```

- `searchQuery` - additional part of the URL that follow after `/search/` resource URL.
- `options` - [GetOption](#getoption) additional options applied to the request.
- `return value` - [ResourceCollection](#resourcecollection) collection of resources with type `T`.
- `throws error` when returned value is not [ResourceCollection](#resourcecollection)

>When using the method not need to pass `/search/` part of the URL in `searchQuery`.

##### Example of usage ([given the presets](#resource-service-presets)):

```ts
// Performing GET request by the URL: http://localhost:8080/api/v1/products/search/searchQuery 
this.productService.searchCollection('searchQuery')
    .subscribe((collection: ResourceCollection<Product>) => {
        const products: Array<Product> = collection.resources;
        // some logic
    });

this.productHateoasService.searchCollection('products', 'searchQuery')
    .subscribe((collection: ResourceCollection<Product>) => {
        const products: Array<Product> = collection.resources;
        // some logic
    });
```

With options:

```ts
// Performing GET request by the URL: http://localhost:8080/api/v1/products/search/byName?name=Fruit&projection=productProjection&sort=name,ASC
this.productService.searchCollection('byName', {
  params: {
    name: 'Fruit',
    projection: 'productProjection',
  },
  sort: {
    name: 'ASC'
  },
  // useCache: true | false, by default true
}).subscribe((collection: ResourceCollection<Product>) => {
    const products: Array<Product> = collection.resources;
    // some logic
});

this.productHateoasService.searchCollection('products', 'byName', {
  params: {
    name: 'Fruit',
    projection: 'productProjection',
  },
  sort: {
    name: 'ASC'
  },
  // useCache: true | false, by default true
}).subscribe((collection: ResourceCollection<Product>) => {
    const products: Array<Product> = collection.resources;
    // some logic
});

```

#### SearchPage
Searching for collection of resources with pagination[PagedResourceCollection](#pagedresourcecollection).

This method takes [PagedGetOption](#pagedgetoption) parameter with it you can pass `projection` param (see below).

>If do not pass `pageParams` with `PagedGetOption` then will be used [default page options](#default-page-values).

Method signature:

```
searchPage(searchQuery: string, options?: PagedGetOption): Observable<PagedResourceCollection<T>>;
```

- `searchQuery` - additional part of the URL that follow after `/search/` resource URL.
- `options` - [PagedGetOption](#pagedgetoption) additional options applied to the request, if not passed `pageParams` then used [default page params](#default-page-values).
- `return value` - [PagedResourceCollection](#pagedresourcecollection) paged collection of resources with type `T`.
- `throws error` when returned value is not [PagedResourceCollection](#pagedresourcecollection)

>When using the method not need to pass `/search/` part of the URL in `searchQuery`.

##### Example of usage ([given the presets](#resource-service-presets)):

```ts
// Performing GET request by the URL: http://localhost:8080/api/v1/products/search/searchQuery?page=0&size=20
this.productService.searchPage('searchQuery')
    .subscribe((pagedCollection: PagedResourceCollection<Product>) => {
        const products: Array<Product> = pagedCollection.resources;
        // some logic
    });

this.productHateoasService.searchPage('products', 'searchQuery')
    .subscribe((pagedCollection: PagedResourceCollection<Product>) => {
        const products: Array<Product> = pagedCollection.resources;
        // some logic
    });
```

With options:

```ts
// Performing GET request by the URL: http://localhost:8080/api/v1/products/search/byName?name=Fruit&projection=productProjection&page=1&size=30&sort=name,ASC
this.productService.searchPage('byName', {
  pageParams: {
    page: 1,
    size: 30
  },
  params: {
    name: 'Fruit',
    projection: 'productProjection',
  },
  sort: {
    name: 'ASC'
  },
  // useCache: true | false, by default true
}).subscribe((pagedCollection: PagedResourceCollection<Product>) => {
    const products: Array<Product> = pagedCollection.resources;
    // some logic
});

this.productHateoasService.searchPage('products', 'byName', {
  pageParams: {
    page: 1,
    size: 40
  },
  params: {
    testParam: 'test',
    projection: 'productProjection',
  },
  sort: {
    cost: 'ASC'
  },
  // useCache: true | false, by default true
}).subscribe((pagedCollection: PagedResourceCollection<Product>) => {
    const products: Array<Product> = pagedCollection.resources;
    // some logic
});

```

#### CustomQuery
Performing custom HTTP request for resource.

>For example, use this method to perform a count query (see example below).

Method signature:

```
customQuery<R>(method: HttpMethod, query: string, requestBody?: RequestBody<any>, options?: PagedGetOption): Observable<R>;
```

- `method` - HTTP request method (GET/POST/PUT/PATCH).
- `query` - additional part of the URL, added after root resource URL.
- `requestBody` - [RequestBody](#requestbody) uses when `method` is `POST`, `PATCH`, `PUT` to pass request body and additional body options.
- `options` - [PagedGetOption](#pagedgetoption) additional options applied to the request.
- `return value` - `any` object that equals to passed generic type `<R>`

##### Example of usage ([given the presets](#resource-service-presets)):

```ts
// Performing GET request by the URL: http://localhost:8080/api/v1/products/search/countAll
this.productService.customQuery<number>(HttpMethod.GET, '/search/countAllBy')
  .subscribe((count: number) => {
    // some logic        
  });

this.productHateoasService.customQuery<number>('products', HttpMethod.GET, '/search/countAllBy')
  .subscribe((count: number) => {
    // some logic        
  });
```

#### CustomSearchQuery
Performing custom search HTTP request for resource.

>For example, use this method to perform a count query (see example below).

Method signature:

```
customSearchQuery<R>(method: HttpMethod, searchQuery: string, requestBody?: RequestBody<any>, options?: PagedGetOption): Observable<R>;
```

- `method` - HTTP request method (GET/POST/PUT/PATCH).
- `searchQuery` - additional part of the URL that follow after `/search/` resource URL.
- `requestBody` - [RequestBody](#requestbody) uses when `method` is `POST`, `PATCH`, `PUT` to pass request body and additional body options.
- `options` - [PagedGetOption](#pagedgetoption) additional options applied to the request.
- `return value` - `any` object that equals to passed generic type `<R>`


##### Example of usage ([given the presets](#resource-service-presets)):

```ts
// Performing GET request by the URL: http://localhost:8080/api/v1/products/search/countAll
this.productService.customSearchQuery<number>(HttpMethod.GET, '/countAllBy')
  .subscribe((count: number) => {
    // some logic        
  });

this.productHateoasService.customSearchQuery<number>('products', HttpMethod.GET, '/countAllBy')
  .subscribe((count: number) => {
    // some logic        
  });
```

## Settings
This section describes library configuration params.

### Configuration params
The library accepts configuration object:

```ts
  http: {
    rootUrl: string;
    proxyUrl?: string;
  };
  logs?: {
    verboseLogs?: boolean;
  };
  cache?: {
    enabled: boolean;
    lifeTime?: number;
  };
```
#### Http params

- `rootUrl` (required) - defines root server URL that will be used to perform resource requests.
- `proxyUrl` (optional) -  defines proxy URL that uses to change rootUrl to proxyUrl when getting a relation link.

#### Logging params

- `verboseLogs` - to debug lib works enable logging to the console. With enabled logging, all prepared resource stages will be printed.

> See more about logging [here](#logging).

#### Cache params

- `enabled` - `true` to use cache for `GET` requests, `false` otherwise, default value is `true`.
- `lifeTime` - default cache lifetime is 300 000 seconds (=5 minutes) pass new value to change default one.

> See more about caching [here](#cache-support).

### Cache support
The library supports caching `GET` request response values.
By default, the cache `enabled`.

To enable cache pass `cache.enabled = true` to library configuration. Also, you can manage the cache expired time with `cache.lifeTime` param.

> More about the cache configuration see [here](#cache-params).

Also, methods with options types `GetOption` or `PagedGetOption` has additional param `useCache` that allows to manage the cache.
By default `useCache` has `true` value, but when the cache disabled then it param ignored.

#### Under the hood
After each successful GET request to get a resource or resource collection or paginated resource collection, response placed in the `cache map`.
The `cache map` key is `CacheKey` object that holds full request url and all request options.  
The `cache map` value is `raw hal-json` response.

When perform the same `GET` request twice (to get resource or resource collection or paginated resource collection). First request hits the server to get the result, second request does not hit the server and result got from the cache.
When perform `POST`, `PATCH`, `PUT`, `DELETE` requests for some resource than all saved cache values for this resource will be evicted.

> You can know when resource result got from the server or got from the cache enable the library [verboseLogs](#logging-params) param.
> See more about logging [here](#logging).

### Logging
To debug library use library logging.
To enable logging set `logs.verboseLogs` to `true` value see more [here](#logging-params).

There are several logging stages:

- `BEGIN` - first stage, when method invoked
- `CHECK_PARAMS` - logs errors after validation input params
- `PREPARE_URL` - logs parts of generated request URL from `rootUrl`/`proxyUrl`, `resource name` and passed options
- `PREPARE_PARAMS` - logs applied default request params
- `INIT_RESOURCE` - logs when on initializing resource from a response errors occurs
- `RESOLVE_VALUES` - logs stage when resolving resource relations converting related resource object to a link url
- `CACHE_PUT` - logs a value saved to the cache
- `CACHE_GET` - logs a received value from the cache
- `CACHE_EVICT` - logs an evicted value from the cache
- `HTTP_REQUEST` - logs HTTP request params
- `HTTP_RESPONSE` - logs raw HTTP response data
- `END` - last stage, when method invoke was successful

With logging, you can find out was a value fetched from the cache or the server, how resource relationships resolved etc.

## Public classes
This section describes public classes available to use in client apps.

### GetOption
Uses as option type in methods that retrieve resource or resource collection from the server.

`GetOption` is an interface that describes the next options:

```
export interface GetOption {
  params?: {
    [paramName: string]: Resource | string | number | boolean;
    projection?: string;
  };
  sort?: Sort;
  useCache?: boolean;
}
```

- `params` is `key: value` values that will be added to the HTTP request as HTTP params
- `sort` is [Sort](#sort) object with response sort options
- `useCache` is property allows to disable the cache for current request


### PagedGetOption
Uses as option type in methods that retrieve paginated resource collection from the server.

`PagedGetOption` extends `GetOption` and adds the page params.

```
export interface PagedGetOption extends GetOption {
  pageParams?: PageParam;
}

export interface PageParam {
  page?: number;
  size?: number;
}
```
- `page` is page number param
- `size` is page size param

### RequestOption
Uses as option type in methods that create, change or delete resource.

With `RequestOption` you can change response type to `HttpResponse` passing `observe: 'response'`, by default used `observe: body`.
Also, you can pass `params` that will be added to the HTTP request as HTTP params.

```
export interface RequestOption {
  params?:  {
    [paramName: string]: Resource | string | number | boolean;
  },
  observe?: 'body' | 'response';
}
```
- `params` is `key: value` values that will be added to the HTTP request as HTTP params
- `observe` is response type param

### RequestBody
Uses as request body type in methods that create or change resource.

`RequestBody` is an interface that describes the next options:

```
export interface RequestBody<T> {
  body: T;
  valuesOption?: ValuesOption;
}

export interface ValuesOption {
  include: Include;
}

export enum Include {
  NULL_VALUES = 'NULL_VALUES'
}
```

- `body` is a request body object
- `valuesOption` are additional options that allows manipulation body object values

For example, passed body as `{body: {name: 'Name', age: null}}` by default any properties that have `null` values will be ignored and will not pass.
To pass `null` values, need to pass `valuesOption: {include: Include.NULL_VALUES}`.

>When body object has `undefined` property then it will be ignored even you pass  `Include.NULL_VALUES`.

### Sort
Uses as param type in methods that applied `GetOption`, `PagedGetOption` options.

`Sort` params are `key: value` object where `key` is a property name to sort and `value` is sort order.

```
export interface Sort {
  [propertyToSort: string]: SortOrder;
}

export type SortOrder = 'DESC' | 'ASC';
```

#### SortedPageParam
Uses as option type in [PagedResourceCollection](#pagedresourcecollection) in [customPage](#custompage) method.

`SortedPageParam` is an interface with page and sort params.

```
export interface SortedPageParam {
  pageParams?: PageParam;
  sort?: Sort;
}

export interface PageParam {
  page?: number;
  size?: number;
}
```
- `pageParams` is page number and page size params
- `sort` is [Sort](#sort) object with response sort options
