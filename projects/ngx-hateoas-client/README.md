# NgxHateoasClient
<a href="https://www.npmjs.com/package/@lagoshny/ngx-hateoas-client/v/latest">
  <img src="https://img.shields.io/npm/v/@lagoshny/ngx-hateoas-client/latest?label=npm" alt="Last released npm version" />
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

## ⭐Compatible with Angular 12.x.x - 13.x.x versions that uses `Ivy compilation`.


### ⚠ If you use old `View Engine` compilation or Angular 6.x.x - 11.x.x you need to use [2.x.x](https://github.com/lagoshny/ngx-hateoas-client/tree/ng-ve) lib version.
>
>See more about it [here](https://github.com/lagoshny/ngx-hateoas-client/blob/master/CHANGELOG.md#303-2021-12-23).

### 💡 New versioning policy.

- Versions that work with old `View Engine` compilation [`2.0.0`-`2.x.x`].

- Versions that work with new `Ivy` compilation [`3.0.0`-`x.x.x`].

This client can be used to develop `Angular 12+` applications working with RESTfull server API.
By `RESTfull API` means when the server application implements all the layers of the [Richardson Maturity Model](https://martinfowler.com/articles/richardsonMaturityModel.html)
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
  - [Common Resource URL](#using-common-url-for-retrieve-resources)
  - [Multiple Resource URLs](#using-multiple-urls-to-retrieve-resources)
- [Usage](#Usage)
  - [Define resource classes](#Define-resource-classes)
  - [Built-in HateoasResourceService](#built-in-hateoasresourceservice)
  - [Create custom Resource service](#Create-custom-Resource-service)
3. [Testing](#Testing)
4. [Resource types](#Resource-types)
- [Decorators](#decorators)
  - [@HateoasResource](#hateoasresource)
    - [resourceName](#resourcename)
    - [options](#options)
  - [@HateoasEmbeddedResource](#hateoasembeddedresource)
  - [@HateoasProjection](#hateoasprojection)
    - [@ProjectionRel](#projectionrel)
- [BaseResource](#BaseResource)
  - [HasRelation](#HasRelation)
  - [GetRelation](#GetRelation)
  - [GetRelatedCollection](#GetRelatedCollection)
  - [GetRelatedPage](#GetRelatedPage)
  - [PostRelation](#PostRelation)
  - [PatchRelation](#PatchRelation)
  - [PutRelation](#PutRelation)
- [Resource](#Resource)
  - [AddCollectionRelation](#AddCollectionRelation)
  - [BindRelation](#BindRelation)
  - [UnbindRelation](#UnbindRelation)
  - [UnbindCollectionRelation](#UnbindCollectionRelation)
  - [DeleteRelation](#DeleteRelation)
- [EmbeddedResource](#EmbeddedResource)
- [ResourceCollection](#ResourceCollection)
- [PagedResourceCollection](#PagedResourceCollection)
- [Subtypes support](#Subtypes-support)
- [Resource projection support](#resource-projection-support)
  - [ProjectionRelType](#projectionreltype)
5. [Resource service](#Resource-service)
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
6. [Settings](#settings)
- [Configuration params](#Configuration-params)
  - [Http params](#http-params)
- [UseTypes](#usetypes-params)
- [TypesFormat](#typesformat)
- [HALFormat](#halformat)
- [Cache support](#cache-support)
  - [Evict all cache](#evict-all-cache-data)
- [Logging](#Logging)
7. [Public classes](#Public-classes)
- [RequestOption](#RequestOption)
- [GetOption](#GetOption)
- [PagedGetOption](#PagedGetOption)
- [RequestBody](#RequestBody)
- [Sort](#Sort)
- [SortedPageParam](#SortedPageParam)

## Changelog
[Learn about the latest improvements](https://github.com/lagoshny/ngx-hateoas-client/blob/master/CHANGELOG.md).

## Getting started

### Installation

To install the latest version use command:

```
npm i @lagoshny/ngx-hateoas-client@latest --save
``` 

### Configuration
> Important! Starts from 3.1.0 version you need manually import HttpClientModule to provide HttpClient service that required fot this lib.
> Why it was change you can see this [Angular issue](https://github.com/angular/angular/issues/20575).

Before start, need to configure `NgxHateoasClientModule` and pass configuration through `NgxHateoasClientConfigurationService`.

1) `NgxHateoasClientModule` configuration:

```ts
import { NgxHateoasClientModule } from '@lagoshny/ngx-hateoas-client';

...

@NgModule({
  ...
  imports: [
    HttpClientModule,
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

2) In constructor app root module inject `NgxHateoasClientConfigurationService` and pass a configuration:

Minimal configuration look like this:

#### Using common URL to retrieve `Resources`
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

#### Using multiple URLs to retrieve `Resources`

```ts
import { ..., NgxHateoasClientConfigurationService } from '@lagoshny/ngx-hateoas-client';

...

export class AppModule {

  constructor(hateoasConfig: NgxHateoasClientConfigurationService) {
    hateoasConfig.configure({
      http: {
        // Use this router name for default Resources route
        defaultRoute: {
            rootUrl: 'http://localhost:8080/api/v1'
        },
        anotherRoute: {
          rootUrl: 'http://localhost:9090/api/v1'
        }
      }
    });
  }

}
```

`defaultRoute` - it is special `router name` that all `Resources` used by default.

`anotherRoute` - additional `Resource` route that can be used in `Resource` [@HateoasResource#options](#options) to specify it.
<br>
<br>
>See more about other configuration params [here](#configuration-params).

### Usage

### Define resource classes

To represent model class as a resource model extend model class by `Resource` class.
Besides you need to decorate the class with [@HateoasResource](#hateoasresource) decorator that will register your resource class with passed `resourceName` in `hateoas-client`.
Suppose you have some `Product` model class:

```ts
export class Product {

    public name: string;

    public cost: number;

}
``` 

After making it as a `Resource` it will look like this:

```ts
import { Resource, HateoasResource } from '@lagoshny/ngx-hateoas-client';

/* 
  Resource name 'products' should be map to server-side resource name that used to build resource self URL.
  For example in this case it can be: http://localhost:8080/api/v1/products
 */
@HateoasResource('products')
export class Product extend Resource {

    public name: string;

    public cost: number;

}
``` 

Thereafter, the `Product` class will have `Resource` methods to work with the product's relations through resource links.

>You can create a resource projection class that will map to a server-side projection model. How to do it read in [this section](#resource-projection-support).

>Also, you can extend model classes with the `EmbeddedResource` class and decorate with [@HateasEmbeddedResource](#hateoasembeddedresource) decorator when the model class used as an [embeddable](https://docs.oracle.com/javaee/6/api/javax/persistence/Embeddable.html) entity.
You can read more about `EmbeddedResource` [here](#embeddedresource).

It is recommended also to declare the `Product` resource class (others `Resources` and `EmbeddedResources` too) in the `hateoas-client` configuration:

```ts
...
  hateoasConfig.configure({
    ...
    useTypes: {
        resources: [Product]
    }
  }
...
```
>See more about `useTypes` in the configuration section [here](#usetypes-params).

Now you have created a resource class and ready to perform requests for this resource.
For this you can use universal on resource built-in [HateoasResourceService](#built-in-hateoasresourceservice) or a create [custom resource service](#create-custom-resource-service) for concrete resource class.

### Built-in HateoasResourceService

The library has built-in universal on resource `HateoasResourceService`.
It is a simple service with methods to `get`/`create`/`update`/`delete`/`search` resources.

To use it inject `HateoasResourceService` to a component or a service class after that you can perform resource requests by passing the resource type.

```ts
import { Resource, HateoasResource, HateoasResourceService } from '@lagoshny/ngx-hateoas-client';

@HateoasResource('products')
export class Product extends Resource {
 ...
}

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

    this.resourceService.createResource(Product, product)
            .subscribe((createdResource: Product) => {
                // TODO something
            });
  };

}
```

Each `HateoasResourceService` method has the first param is the resource type that extends [Resource](#resource) class and decorated with [@HateoasResource](#hateoasresource).
The resource type uses to build a URL for resource requests and create resources with a concrete class when parsing the server's answer.

More about `HateoasResourceService` methods see [here](#resource-service).

>`HateoasResourceService` is a universal service that can work with several `Resources` at a time, you need only pass a desired resource type as the first param.
>If you have not extra logic to work with your resources then you can inject once `HateoasResourceService` and use it to work with your resources.

When you have some logic that should be preparing resource before a request you need to create a custom resource service extends `HateoasResourceOperation` to see more about this [here](#create-custom-resource-service).

### Create custom Resource service

To create a custom resource service create a new service and extends it with `HateoasResourceOperation` and pass `resourceType` to the parent constructor.

```ts
import { Resource, HateoasResource, HateoasResourceOperation } from '@lagoshny/ngx-hateoas-client';

@HateoasResource('products')
export class Product extends Resource {
...
}

@Injectable({providedIn: 'root'})
export class ProductService extends HateoasResourceOperation<Product> {

  constructor() {
    super(Product);
  }

}

```

`HateoasResourceOperation` has the same [methods](#resource-service) as `HateoasResourceService` without `resourceType` as the first param (because you pass `resourceType` with service constructor).

## Testing
To test your services, that are using `HateoasResourceOperation` or `HateoasResourceService` you need import `NgxHateoasClientModule.forRoot()` in the test module.

After that you can inject or mock the next services (if you need it):

- `NgxHateoasClientConfigurationService`
- `HateoasResourceService`

Below you can find simple lib test examples:

Suppose you have the `User` and some `UserService` like that:

```ts
import {
  HateoasResourceOperation,
  HateoasResourceService,
} from '@lagoshny/ngx-hateoas-client';

export class User {
    name: string;
    age: number;
}

@Injectable()
export class UserService extends HateoasResourceOperation<User> {
    
  constructor(public resourceService: HateoasResourceService) {
    super(User);
  }

  public create(user: User): Observable<Observable<never> | User> {
    return super.createResource({body: user});
  }

  public getAllUsersByAge(age: number): Observable<PagedResourceCollection<User>> {
    return this.resourceService.searchPage(User, 'allByAge', {
        params: {
          age
        }
      }
    );
  }
}

```

Note, `UserService` extends `HateoasResourceOperation` and uses `HateoasResourceService` to perform requests.

### Using TestBed

If you prefer to use standard `TestBed` for testing, you can do that in the following way:

````ts
import {
  HateoasResourceService,
  NgxHateoasClientModule,
  PagedResourceCollection,
  ResourceCollection
} from '@lagoshny/ngx-hateoas-client';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { of } from 'rxjs';

describe('UserServiceTest', () => {
  
  let hateoasResourceServiceSpy;
  beforeEach(() => {
    hateoasResourceServiceSpy = {
      createResource: jasmine.createSpy('createResource'),
      searchPage: jasmine.createSpy('searchPage')
    };

    TestBed.configureTestingModule({
      imports: [
        NgxHateoasClientModule.forRoot()
      ],
      providers: [
        UserService,
        {provide: HateoasResourceService, useValue: hateoasResourceServiceSpy}
      ]
    });
  });

  it('should init service', () => {
    const userService = TestBed.inject(UserService);

    expect(userService).toBeTruthy();
  });

  it('should create new user', waitForAsync(() => {
    const userService = TestBed.inject(UserService);

    const newUser = new User();
    newUser.id = '1';
    hateoasResourceServiceSpy.createResource.and.returnValue(of(newUser));

    const user = new User();
    user.name = 'Test user';
    userService.create(user).subscribe((createdUser: User) => {
      expect(createdUser).toBeTruthy();
      expect(createdUser.id).toEqual('1');
    });
  }));

  it('should return paged user list', waitForAsync(() => {
    const userService = TestBed.inject(UserService);

    const returnedUser = new User();
    returnedUser.id = '1';
    const resourceCollection = new ResourceCollection<User>();
    resourceCollection.resources = [returnedUser];
    hateoasResourceServiceSpy.searchPage.and.returnValue(of(new PagedResourceCollection(resourceCollection)));

    userService.getAllUsersByAge(35).subscribe((users: PagedResourceCollection<User>) => {
      expect(users).toBeTruthy();
      expect(users.resources).toBeTruthy();
      expect(users.resources[0]).toBeTruthy();
      expect(users.resources[0].id).toEqual('1');
    });
  }));


});

````

### Using Spectator

If you prefer to use [@ngneat/spectator](https://www.npmjs.com/package/@ngneat/spectator) for testing, you can do that in the following way:

```ts
import {
  HateoasResourceService,
  NgxHateoasClientModule,
  PagedResourceCollection,
  ResourceCollection
} from '@lagoshny/ngx-hateoas-client';
import { waitForAsync } from '@angular/core/testing';
import { of } from 'rxjs';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator';

describe('UserServiceTest', () => {

  let spectator: SpectatorService<UserService>;

  const createService = createServiceFactory({
    imports: [NgxHateoasClientModule.forRoot()],
    service: UserService,
    mocks: [HateoasResourceService]
  });

  beforeEach(() => {
    spectator = createService();
  });


  it('should init service', () => {
    const userService = spectator.inject(UserService);

    expect(userService).toBeTruthy();
  });

  it('should create new user', waitForAsync(() => {
    const userService = spectator.inject(UserService);

    const newUser = new User();
    newUser.id = '1';
    const hateoasResourceServiceMock = spectator.inject(HateoasResourceService);
    hateoasResourceServiceMock.createResource.and.returnValue(of(newUser));

    const user = new User();
    user.name = 'Test user';
    userService.create(user).subscribe((createdUser: User) => {
      expect(createdUser).toBeTruthy();
      expect(createdUser.id).toEqual('1');
    });
  }));

  it('should return paged user list', waitForAsync(() => {
    const userService = spectator.inject(UserService);

    const returnedUser = new User();
    returnedUser.id = '1';
    const resourceCollection = new ResourceCollection<User>();
    resourceCollection.resources = [returnedUser];
    const hateoasResourceServiceMock = spectator.inject(HateoasResourceService);
    hateoasResourceServiceMock.searchPage.and.returnValue(of(new PagedResourceCollection(resourceCollection)));

    userService.getAllUsersByAge(35).subscribe((users: PagedResourceCollection<User>) => {
      expect(users).toBeTruthy();
      expect(users.resources).toBeTruthy();
      expect(users.resources[0]).toBeTruthy();
      expect(users.resources[0].id).toEqual('1');
    });
  }));


});

```

## Resource types

There are several types of resources: the main resource type is [Resource](#resource) represents the server-side entity model class.
If the server-side model has Embeddable entity type then use [EmbeddedResource](#embeddedresource) type instead [Resource](#resource) type.

Both [Resource](#resource) and [EmbeddedResource](#embeddedresource) have some the same methods therefore they have common parent [BaseResource](#baseresource) class implements these methods.

Also, you can create `Resource` class to represent resource projection, see more about resource projection [here](#resource-projection-support).

>Each `Resource`/`EmbeddedResource` has decorators [@HateoasResource](#hateoasresource)/[@HateoasEmbeddedResource](#hateoasembeddedresource) respectively. They're used to register info about your resources in `hateoas-client`. For example, `resourceName` that used to build resource requests.

To work with resource collections uses [ResourceCollection](#resourcecollection) type its holds an array of the resources.
When you have a paged collection of resources result use an extension of [ResourceCollection](#resourcecollection) is [PagedResourceCollection](#pagedresourcecollection) that allows you to navigate by pages and perform custom page requests.

In some cases, the server-side can have an entity inheritance model how to work with entity subtypes, you can found [here](#subtypes-support).

## Decorators

### @HateoasResource
`@HateoasResource` decorator use to register your `Resource` classes in `hateoas-client` with passed `resourceName` as decorator's param.

- `resourceName`: `string` should be equals to the server-side resource name that uses to represent self resource link.
- `options`: `ResourceOption` additional resource options. Find more about these options [here](#options).

#### resourceName
Using to specify resource name.

For example, you need to work with `Shop`resource:

```ts
import { Resource, HateoasResource } from '@lagoshny/ngx-hateoas-client';

@HateoasResource('shops')
export class Shop extends Resource {
 ...
}

```

It means that server-side use `shops` as resource name for `Shop` entity and it is resource self-link seem like: `http://localhost:8080/api/v1/shops` (with the assumption that server's root URL is `http://localhost:8080/api/v1`)

>It is required to mark your `Resource` classes with this decorator otherwise you will get an error when performing resource request

#### options

`ResourceOption` contains properties:

```ts
{
  routeName: string; // name of Resource route
}
```

If you want to use special `URL` to get `Resource` use `options#routeName` param:

```ts
import { Resource, HateoasResource } from '@lagoshny/ngx-hateoas-client';

@HateoasResource('shops', { routeName: 'yourRoute' })
export class Shop extends Resource {
 ...
}
```
Make sure that you configure route with name `yourRoute` in lib configuration, see [http](#using-multiple-urls-to-retrieve-resources) section.

> If you not specify `routerName` it will be used default router name as `defaultRouter`.

### @HateoasEmbeddedResource
`@HateoasEmbeddedResource` decorator use to register your `EmbeddedResource` classes in `hateoas-client` with passed `relationNames` as decorator's param.

- `relationNames` is an array of the names where each is the name of relation with which `EmbeddedResource` using in `Resource` class.

For example, you have `Client` resource that using `Address` embedded resource:

```ts
import { EmbeddedResource, Resource, HateoasEmbeddedResource, HateoasResource } from '@lagoshny/ngx-hateoas-client';

@HateoasEmbeddedResource(['clientAddress'])
export class Address extends EmbeddedResource {
 ...
}

@HateoasResource('clients')
export class Client extends Resource {
 ...
 public clientAddress: Address;
 ...
}

```

In this case, `@HateoasEmbeddedResource.relationNames` has one element (`clientAddress`) that equals to property `Address` name in `Client` resource.

If embedded resource `Address` will use in several resources then `@HateoasEmbeddedResource.relationNames` should have all different property `Address` names that used in these resources.

>It is required to mark your `EmbeddedResource` classes with this decorator if wou want get concrete embedded resource class (in this example `Address` class). Otherwise you will get a warning about creating an embedded resource when parsing server's answer with the default `EmbeddedResource` class when performing resource request that using an embedded resource.

### @HateoasProjection
`@HateoasProjection` decorator use to register your projection resource classes in `hateoas-client` with passed `resourceType` and `projectionName` as decorator's params.

- `resourceType` equals to resource type that use this resource projection.
- `projectionName` should be equals to the server-side resource projection name.

For example, you have `Shop` resource projection with the name `shopProjection`:

```ts
import { Resource, HateoasResource, HateoasProjection } from '@lagoshny/ngx-hateoas-client';

@HateoasResource('shops')
export class Shop extends Resource {
...
}

@HateoasProjection(Shop, 'shopProjection')
export class ShopProjection extends Resource {
 ...
}

```

Using `@HateoasProjection` you can create separate resource projection classes with desired resource properties and relations.
For resource projection relations to another resource, you need to wrap these relations with [ProjectionRelType](#projectionreltype) type and mark these relations with [@ProjectionRel](#projectionrel) decorator with a relation resource type.

- [ProjectionRelType](#projectionreltype) will hide `Resource`/`EmbeddedResource` methods for projection relation that will lead clear projection relation interface.
- [@ProjectionRel](#projectionrel) decorator will be used to create relation with concrete resource type when parsing server-side answer.

See more about resource projection support [here](#resource-projection-support).

#### @ProjectionRel
`@ProjectionRel` decorator use to register projection relation resource type in `hateoas-client` with passed `relationType` as decorator's param.

- `relationType` equals to resource type that used as a relation property in resource projection.

For example, you have `Shop` resource projection with the name `shopProjection` and this projection has relation to `Cart` resource:

```ts
import { Resource, HateoasResource, HateoasProjection, ProjectionRel, ProjectionRelType } from '@lagoshny/ngx-hateoas-client';
import { ProjectionRelType } from './declarations';

@HateoasResource('carts')
export class Cart extends Resource {
  ...
}

@HateoasProjection(Shop, 'shopProjection')
export class ShopProjection extends Resource {
  ...
  @ProjectionRel(Cart)
  public cart: ProjectionRelType<Cart>;
  ...
}

```

Using `@ProjectionRel` decorator allows knowing`hateoas-client` which relation resource type needs to use when creating a resource from the serv-side answer.

> Here used `ProjectionRelType` type as a wrapper for `Cart` resource class, to hide `Resource`/`EmbeddedResource` methods in projection relation.
> See more [here](#projectionreltype) about this type.

### Resource presets

Examples of usage resource relation methods rely on presets.


- Resource classes are
   ```ts
  import { Resource, HateoasResource } from '@lagoshny/ngx-hateoas-client';
  
  @HateoasResource('carts')
  export class Cart extends Resource {
  
      public shop: Shop;
  
      public products: Array<Product>;
  
      public status: string;
  
      public client: PhysicalClient;
  
  }
  
  @HateoasResource('shops')
  export class Shop extends Resource {
  
      public name: string;
  
      public rating: number;
  
  }
   
  @HateoasResource('products')
  export class Product extends Resource {
  
      public name: string;
  
      public cost: number;
  
      public description: string;
  
  }
  
  @HateoasResource('clients')
  export class Client extends Resource {
  
    public address: string;
  
  }
  
  @HateoasResource('physicalClients')
  export class PhysicalClient extends Client {
  
    public fio: string;
  
  }
  
  @HateoasResource('juridicalClients')
  export class JuridicalClient extends Client {
  
    public inn: string;
  
  }
  
 
  ```

- HateoasClientConfiguration:
  ```ts
    hateoasConfig.configure({
        http: {
            rootUrl: 'http://localhost:8080/api/v1'    
        },
        useTypes: {
            resources: [Cart, Shop, Product, Client, PhysicalClient, JuridicalClient]
        }
    })
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

### HasRelation
Checks that passed relation name contains in relation `_link` array of the `BaseResource`.

Method signature:

```
hasRelation(relationName: string): boolean;
```

- `relationName` - resource relation name used to check.
- `return value` - `true` if resource has that relation, `false` otherwise.


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
>Also, you can set up own default page params through [configuration](#pagination-params).

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

>Each `Resource` class should be declared with [@HateoasResource](#hateoasresource) decorator.

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
bindRelation<T extends Resource>(relationName: string, entities: T | Array<T>): Observable<HttpResponse<any>>;
```

- `relationName` - resource relation name used to get request URL.
- `entities` - an array of entities that should be bound to resource.
- `return value` - Angular `HttpResponse` result.

##### Examples of usage ([given the presets](#resource-presets)):

With single resource relation:
```ts
// Suppose shopToBind already exists with id = 1
const shopToBind = ...;
cart.bindRelation('shop', shopToBind)
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
> To unbind collection resource relation use [UnbindCollectionRelation](#unbindCollectionRelation) method.
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

### UnbindCollectionRelation
Unbinding all resources from resource collection behind resource name.

Used `PUT` method with `'Content-Type': 'text/uri-list'` and `EMPTY` body to clear relations.

>This method does not work with SINGLE resource relations.
> To delete single resource relations use [unbindRelation](#unbindrelation) or [deleteRelation](#deleterelation) methods.
> To delete one resource from collection use [deleteRelation](#deleterelation) method.

Method signature:

```
unbindCollectionRelation<T extends Resource>(relationName: string): Observable<HttpResponse<any>>;
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
cart.unbindCollectionRelation('products')
  .subscribe((result: HttpResponse<any>) => {
     // some logic            
  });

```

### DeleteRelation
Deleting resource relation.

For collection, means that only passed entity will be unbind from the collection.
For single resource, deleting relation the same as [unbindRelation](#unbindrelation) method.

>To delete all resource relations from collection use [unbindCollectionRelation](#unbindcollectionrelation) method.

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

>Each `EmbeddedResource` class should be declared with [@HateoasEmbeddedResource](#hateoasembeddedresource) decorator.

## ResourceCollection
This resource type represents collection of resources.
You can get this type as result [GetRelatedCollection](#getrelatedcollection), [GetResourceCollection](#getresourcecollection) or perform [CustomQuery](#customquery)/[CustomSearchQuery](#customsearchquery) with passed return type as `ResourceCollection`.

Resource collection holds resources in the public property with the name `resources`.

## PagedResourceCollection
This resource type represents paged collection of resources.
You can get this type as result [GetRelatedPage](#getrelatedpage), [GetPage](#getpage) or perform [CustomQuery](#customquery)/[CustomSearchQuery](#customsearchquery) with passed return type as PagedResourceCollection.

PagedResourceCollection extends [ResourceCollection](#resourcecollection) type and adds methods to work with a page.

### Default page values
When you do not pass `page` or `size` params in methods with [PagedGetOption](#pagedgetoption) then used [default page values](#default-page-values).

>Also, you can set up own default page params through [configuration](#pagination-params).

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
Performing a request to get the page with passed page size and page number reset to `0` value.

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

To increase the current page size to 50, will perform a request to the page number = 0 and page size = 50.

```ts
// Performing GET request by the URL: http://localhost:8080/api/v1/products?page=0&size=50
const pagedProductCollection = ...;
pagedProductCollection.size(50)
  .subscribe((customPageResult: PagedResourceCollection<Product>) => {
     // customPageResult can be fetched from the cache if before was performing the same request
     // some logic        
  });
```

With options:

```ts
// Performing GET request by the URL: http://localhost:8080/api/v1/products?page=0&size=50
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
 import { Resource, HateoasResource } from '@lagoshny/ngx-hateoas-client';
  
  @HateoasResource('carts')
  export class Cart extends Resource {
  
      public client: Client;
  
  }

  @HateoasResource('clients') 
  export class Client extends Resource {
  
    public address: string;
  
  }

  @HateoasResource('physicalClients')
  export class PhysicalClient extends Client {
  
    public fio: string;
  
  }
  
  @HateoasResource('juridicalClients') 
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

Of course, resource types are set in the configuration [useTypes](#configuration) section:

```ts
...
  hateoasConfig.configure({
    useTypes: {
        resources: [Cart, Client, PhysicalClient, JuridicalClient]
    }
  }
...
```

From the example, above can note that the `Cart` resource has the `client` property with type `Client`.
In its turn, `client` can have one of the types `PhysicalClient` or `JuridicalClient`.

You can use `instanceof` statement to know what `client` resource type you got.

##### Examples of usage:

```ts
// Suppose exists cart resource and after getting client relation need to know what is the client type
const cart = ...
cart.getRelation('client')
  .subscribe((client: Client) => {
    if (client instanceof PhysicalClient) {
      const physicalClient = client as PhysicalClient;
    // some logic        
    } else if (client instanceof JuridicalClient) {
      const juridicalClient = client as JuridicalClient;
    // some logic        
    }
  });
```

## Resource projection support
Spring Data Rest allows creating resource projections. Projection can show resource relations with a resource object as inner objects (not only as links in resource relation links array).
`Hateoas-client` has support for these resource projections.

See more about Spring Data Rest projections [here](https://docs.spring.io/spring-data/rest/docs/current/reference/html/#projections-excerpts).

To create resource projection you need to create a projection class extend it with [Resource](#resource) and mark it with [@HateaosProjection](#hateoasprojection) decorator passing projection `resourceType` and `projectionName` params.

- `resourceType` should be equals to resource type that use this projection.
- `projectionName` should be equals to the server-side resource projection name.

> Use [HateoasResourceService](#built-in-hateoasresourceservice) to perform projection request with first param as projection type for all the methods.
> You can also create [custom resource service](#create-custom-resource-service) to concreate projection type.

If your projection has property relations to resource classes then you should decorate these properties with [@ProjectionRel](#projectionrel) decorator passing `resourceType` param.
Besides need to wrap property resource type with  [ProjectionRelType](#projectionreltype) type to hide `Resource`/`EmbeddedResource` methods (see example below).

> As mentioned earlier that projection relations that resources are plain JSON objects. This means that these objects have not resources relations links array and other signs of the resource.
> But in your code when you will use existing resources classes as a relation type in projection class you will have all `Resource`/`EmbeddedResource` methods that can be applied only to resource type.
> To prevent this behavior you need all projection resource relation types to wrap with [ProjectionRelType](#projectionreltype) type.

Resource projection example:

Suppose, you have a projection with the name `cartProjection` for `Cart` resource:

```ts
import { Resource, HateoasResource, HateoasProjection, ProjectionRel, ProjectionRelType } from '@lagoshny/ngx-hateoas-client';

@HateoasResource('carts')
export class Cart extends Resource {
  ...
  public shop: Shop;
  ...
}

@HateoasResource('shops')
export class Shop extends Resource {
  ...
  public shopName: string;
  
  public printShopName() {
      console.log(this.shopName)
  }
  ...
}

@HateoasProjection(Cart, 'cartProjection')
export class CartProjection extends Resource {
  ...
  @ProjectionRel(Shop)
  public shop: ProjectionRelType<Shop>;
  ...
}
```

Usages:

```ts
import { HateoasResourceService } from '@lagoshny/ngx-hateoas-client';

...

export class CartComponent {
  constructor(private reosurceService: HateoasResourceService) {
  }
  
  public getCartProjection(): CartProjection {
      this.reosurceService.getResource(CartProjection, 1)
        .subscribe((cartProjection: CartProjection) => {
            // Will print `true` because cartProjection.shop is Shop type as was declared with @ProjectionRel decorator
            console.log(cartProjection.shop instanceof Shop);
            // Will print the shop name to the console
            cartProjection.shop.printShopName();
            // Will not compile because ProjectionRelType<Shop> has not Resource/EmbeddedResource methods
            cartProjection.shop.getRelation(...);
        })
  }
}
...

```

In this case, `CartProjection.shop` is a simple object with the type `Shop` that has only `Shop` class properties and methods without `Resource`/`EmbeddedResource` methods.

>Resource projection classes can be used with `HateoasResourceService` methods, you need to pass resource projection type as the first methods param instead of a simple resource type.

### ProjectionRelType
This is a special type that allows wrapping your resource relations properties in [resource projection](#resource-projection-support) to hide all `Reosurce`/`EmbeddedResource` methods.

Usages:

```ts
import { Resource, HateoasResource, HateoasProjection, ProjectionRel, ProjectionRelType } from '@lagoshny/ngx-hateoas-client';

@HateoasResource('carts')
export class Cart extends Resource {
  ...
  public shop: Shop;
  ...
}

@HateoasResource('shops')
export class Shop extends Resource {
}

@HateoasProjection(Cart, 'cartProjection')
export class CartProjection extends Resource {
  ...
  @ProjectionRel(Shop)
  public shop: ProjectionRelType<Shop>;
  ...
}
```

Here `CartProjection.shop` will show only `Shop` type properties and methods. Methods from `Resource` will be hidden.

## Resource service

As described before to work with resources you can use built-in [HateoasResourceService](#built-in-hateoasresourceservice) or create [custom resource service](#resource-service).

>Difference in methods signature between built-in HateoasResourceService and custom resource service is built-in service always has a resource type as the first method param.

### Resource service presets

Examples of usage resource service methods rely on this presets.


- Resource class is
  ```ts
  import { Resource, HateoasResource } from '@lagoshny/ngx-hateoas-client';
  
  @HateoasResource('products')
  export class Product extends Resource {
  
      public name: string;
  
      public cost: number;
  
      public description: string;
  
      public type: ProductType;
  
  }
  
  @HateoasResource('productTypes')
  export class ProductType extends Resource {
      public name: string;
  }
  ```

- Resource projection class is
  ```ts
  import { Resource, HateoasProjection, ProjectionRel, ProjectionRelType } from '@lagoshny/ngx-hateoas-client';

  @HateoasProjection(Product, 'productProjection')
  export class ProuctProjection extends Resource {
      public name: string;
  
      public cost: number;
  
      public description: string;
  
      @ProjectionRel(ProductType)
      public type: ProjectionRelType<ProductType>;
  }
  ```

- HateoasClientConfiguration:
  ```ts
    hateoasConfig.configure({
        http: {
            rootUrl: 'http://localhost:8080/api/v1'    
        },
        useTypes: {
            resources: [Product, ProductType, ProuctProjection]
        }
    })
  ```

- Resource service as built-in [HateoasResourceService](#built-in-hateoasresourceservice) is
  ```ts
  @Component({ ... })
  export class AppComponent {
      constructor(private resourceHateoasService: HateoasResourceService) {
      }
  }
  ```  

- Resource service as [custom resource service](#create-custom-resource-service) is
  ```ts
  import { HateoasResourceOperation, HateoasResourceService, PagedResourceCollection, ResourceCollection} from '@lagoshny/ngx-hateoas-client';
  
  @Injectable({providedIn: 'root'})
  export class ProductService extends HateoasResourceOperation<Product> {
    constructor(private resourceHateoasService: HateoasResourceService) {
      super(Product);
    }
    
    public getProductProjection(id: number): Observable<ProductProjection> {
      return this.resourceHateoasService.getResource(ProductProjection, id);
    }
      
    public getProductProjections(): Observable<ResourceCollection<ProductProjection>> {
      return this.resourceHateoasService.getCollection(ProductProjection);
    }    
  
    public getPagedProductProjections(): Observable<PagedResourceCollection<ProductProjection>> {
      return this.resourceHateoasService.getPage(ProductProjection);
    }    
     
    public searchProductProjection(searchQuery: string): Observable<ProductProjection> {
      return this.resourceHateoasService.searchResource(ProductProjection, searchQuery);
    }
      
    public searchProductProjections(searchQuery: string): Observable<ResourceCollection<ProductProjection>> {
      return this.resourceHateoasService.searchCollection(ProductProjection, searchQuery);
    }    
  
    public searchPagedProductProjections(searchQuery: string): Observable<PagedResourceCollection<ProductProjection>> {
      return this.resourceHateoasService.searchPage(ProductProjection, searchQuery);
    }

  }
  
  @Component({ ... })
  export class AppComponent {
      constructor(private productService: ProductService) {
      }
  }
  ```

**No matter which service used (custom or built-in) both have the same resource methods.**

### GetResource
Getting one resource [Resource](#resource).
This method takes [GetOption](#getoption) parameter type.

>To get resource projection instead of a resource type pass resource projection type in first method param when used `resourceHateoasService`. See more about projection support [here](#resource-projection-support).

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

this.resourceHateoasService.getResource(Product, 1)
    .subscribe((product: Product) => {
        // some logic
    })
```

With options:

```ts
// Performing GET request by the URL: http://localhost:8080/api/v1/products/1?testParam=test&sort=cost,ASC
this.productService.getResource(1, {
  params: {
    testParam: 'test'
  },
  sort: {
    cost: 'ASC'
  },
  // useCache: true | false, by default true
}).subscribe((product: Product) => {
    // some logic
})

this.resourceHateoasService.getResource(Product, 1, {
  params: {
    testParam: 'test'
  },
  sort: {
    cost: 'ASC'
  },
  // useCache: true | false, by default true
}).subscribe((product: Product) => {
    // some logic
})
```

Get projection example:
```ts
// Performing GET request by the URL: http://localhost:8080/api/v1/products/1?projection=productProjection
this.productService.getProductProjection(1)
  .subscribe((productProjection: ProductProjection) => {
    // some logic
  })

this.resourceHateoasService.getResource(ProductProjection, 1)
  .subscribe((productProjection: ProductProjection) => {
    // some logic
})
```

### GetCollection
Getting collection of resources [ResourceCollection](#resourcecollection).
This method takes [GetOption](#getoption) parameter type.

>To get resource projection instead of a resource type pass resource projection type in first method param when used `resourceHateoasService`. See more about projection support [here](#resource-projection-support).

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

this.resourceHateoasService.getCollection(Product)
    .subscribe((collection: ResourceCollection<Product>) => {
        const products: Array<Product> = collection.resources;
        // some logic
    })
```

With options:

```ts
// Performing GET request by the URL: http://localhost:8080/api/v1/products?testParam=test&sort=cost,ASC
this.productService.getCollection({
  params: {
    testParam: 'test'
  },
  sort: {
    cost: 'ASC'
  },
  // useCache: true | false, by default true
}).subscribe((collection: ResourceCollection<Product>) => {
    const products: Array<Product> = collection.resources;
    // some logic
})

this.resourceHateoasService.getCollection(Producr, {
  params: {
    testParam: 'test'
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

Get projection example:
```ts
// Performing GET request by the URL: http://localhost:8080/api/v1/products?projection=productProjection
this.productService.getProductProjections()
  .subscribe((productProjections: ResourceCollection<ProductProjection>) => {
    // some logic
  })

this.resourceHateoasService.getCollection(ProductProjection)
  .subscribe((productProjections: ResourceCollection<ProductProjection>) => {
    // some logic
})
```

### GetPage
Getting paged collection of resources [PagedResourceCollection](#pagedresourcecollection).
This method takes [PagedGetOption](#pagedgetoption) parameter type.

>To get resource projection instead of a resource type pass resource projection type in first method param when used `resourceHateoasService`. See more about projection support [here](#resource-projection-support).

>If do not pass `pageParams` with `PagedGetOption` then will be used [default page options](#default-page-values).
>Also, you can set up own default page params through [configuration](#pagination-params).

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
           page.size(...);
           page.page(...);
           page.sortElements(...);
           page.customPage(...);
        */    
    });

this.resourceHateoasService.getPage(Product)
    .subscribe((page: PagedResourceCollection<Product>) => {
        const products: Array<Product> = page.resources;
        /* can use page methods
           page.first();
           page.last();
           page.next();
           page.prev();
           page.size(...);
           page.page(...);
           page.sortElements(...);
           page.customPage(...);
        */   
    });
```

With options:

```ts
// Performing GET request by the URL: http://localhost:8080/api/v1/products?testParam=test&page=1&size=40&sort=cost,ASC
this.productService.getPage({
  pageParams: {
    page: 1,
    size: 40
  },
  params: {
    testParam: 'test'
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
       page.size(...);
       page.page(...);
       page.sortElements(...);
       page.customPage(...);
    */  
});

this.resourceHateoasService.getPage(Product, {
  pageParams: {
    page: 1,
    size: 40
  },
  params: {
    testParam: 'test'
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
       page.size(...);
       page.page(...);
       page.sortElements(...);
       page.customPage(...);
    */  
});
```

Get projection example:
```ts
// Performing GET request by the URL: http://localhost:8080/api/v1/products?projection=productProjection
this.productService.getPagedProductProjections()
  .subscribe((page: PagedResourceCollection<ProductProjection>) => {
    const products: Array<ProductProjection> = page.resources;
    /* can use page methods
       page.first();
       page.last();
       page.next();
       page.prev();
       page.size(...);
       page.page(...);
       page.sortElements(...);
       page.customPage(...);
    */
  })

this.resourceHateoasService.getPage(ProductProjection)
  .subscribe((page: PagedResourceCollection<ProductProjection>) => {
    const products: Array<ProductProjection> = page.resources;
    /* can use page methods
       page.first();
       page.last();
       page.next();
       page.prev();
       page.size(...);
       page.page(...);
       page.sortElements(...);
       page.customPage(...);
    */
  })
```

### CreateResource
Creating new resource [Resource](#resource).

Method signature:

```
createResource(requestBody: RequestBody<T>, options?: RequestOption): Observable<T | any>;
```

- `requestBody` - [RequestBody](#requestbody) contains request body (in this case resource object) and additional body options.
- `options` - (optional) [RequestOption](#requestoption) that should be applied to the request
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

this.resourceHateoasService.createResource(Product, {
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

this.resourceHateoasService.createResource(Product, {
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
updateResource(entity: T, requestBody?: RequestBody<any>, options?: RequestOption): Observable<T | any>;
```

- `entity` - resource to update.
- `requestBody` - [RequestBody](#requestbody) contains request body (in this case new values for resource) and additional body options.
- `options` - (optional) [RequestOption](#requestoption) that should be applied to the request
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
// For resourceHateoasService this snippet is identical
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
// For resourceHateoasService this snippet is identical
```

### UpdateResourceById
Updating **all** values of an existing resource at once `by resource id`.

To update a resource by resource `self link URL` use [UpdateResource](#updateresource).

>To update part of the values of resource use [PatchResource](#patchresource) method.


Method signature:

```
updateResourceById(id: number | string, requestBody: RequestBody<any>, options?: RequestOption): Observable<T | any>;
```

- `id` - resource id to update.
- `requestBody` - [RequestBody](#requestbody) contains request body (in this case new values for resource) and additional body options.
- `options` - (optional) [RequestOption](#requestoption) that should be applied to the request
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

this.resourceHateoasService.updateResourceById(Product, 1, {
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

this.resourceHateoasService.updateResourceById(Product, 1, {
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
patchResource(entity: T, requestBody?: RequestBody<any>, options?: RequestOption): Observable<T | any>;
```

- `entity` - resource to patch.
- `requestBody` - [RequestBody](#requestbody) contains request body (in this case new values for resource) and additional body options.
- `options` - (optional) [RequestOption](#requestoption) that should be applied to the request
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
// For resourceHateoasService this snippet is identical
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
// For resourceHateoasService this snippet is identical

```

### PatchResourceById
Patching **part** values of an existing resource `by resource id`.

To patch a resource by resource `self link URL` use [UpdateResource](#updateresource).

>To update all values of the resource at once use [UpdateResource](#updateresource) method.


Method signature:

```
patchResourceById(id: number | string, requestBody: RequestBody<any>, options?: RequestOption): Observable<T | any>;
```

- `id` - resource id to patch.
- `requestBody` - [RequestBody](#requestbody) contains request body (in this case new values for resource) and additional body options.
- `options` - (optional) [RequestOption](#requestoption) that should be applied to the request
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

this.resourceHateoasService.patchResourceById(Product, 1, {
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

this.resourceHateoasService.patchResourceById(Product, 1, {
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
// For resourceHateoasService this snippet is identical
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
// For resourceHateoasService this snippet is identical
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

this.resourceHateoasService.deleteResourceById(Product, 1)
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

this.resourceHateoasService.deleteResourceById(Product, 1, {
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

This method takes [GetOption](#getoption) parameter type.

>To search resource projection instead of a resource type pass resource projection type in first method param when used `resourceHateoasService`. See more about projection support [here](#resource-projection-support).

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

this.resourceHateoasService.searchResource(Product, 'searchQuery')
    .subscribe((product: Product) => {
        // some logic
    });
```

With options:

```ts
// Performing GET request by the URL: http://localhost:8080/api/v1/products/search/byName?name=Fruit&sort=name,ASC
this.productService.searchResource('byName', {
  params: {
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

this.resourceHateoasService.searchResource(Product, 'byName', {
  params: {
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

Get projection example:
```ts
// Performing GET request by the URL: http://localhost:8080/api/v1/products/search/searchQuery?projection=productProjection
this.productService.searchProductProjection()
  .subscribe((productProjections: ProductProjection) => {
    // some logic
  })

this.resourceHateoasService.searchResource(ProductProjection, 'searchQuery')
  .subscribe((productProjections: ProductProjection) => {
    // some logic
})
```

#### SearchCollection
Searching for collection of resources [ResourceCollection](#resourcecollection).

This method takes [GetOption](#getoption) parameter type.

>To search resource projection instead of a resource type pass resource projection type in first method param when used `resourceHateoasService`. See more about projection support [here](#resource-projection-support).

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

this.resourceHateoasService.searchCollection(Product, 'searchQuery')
    .subscribe((collection: ResourceCollection<Product>) => {
        const products: Array<Product> = collection.resources;
        // some logic
    });
```

With options:

```ts
// Performing GET request by the URL: http://localhost:8080/api/v1/products/search/byName?name=Fruit&sort=name,ASC
this.productService.searchCollection('byName', {
  params: {
    name: 'Fruit'
  },
  sort: {
    name: 'ASC'
  },
  // useCache: true | false, by default true
}).subscribe((collection: ResourceCollection<Product>) => {
    const products: Array<Product> = collection.resources;
    // some logic
});

this.resourceHateoasService.searchCollection(Product, 'byName', {
  params: {
    name: 'Fruit'
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

Get projection example:
```ts
// Performing GET request by the URL: http://localhost:8080/api/v1/products/search/searchQuery?projection=productProjection
this.productService.searchProductProjections()
  .subscribe((productProjections: ResourceCollection<ProductProjection>) => {
    // some logic
  })

this.resourceHateoasService.searchCollection(Product, 'searchQuery')
  .subscribe((productProjections: ResourceCollection<ProductProjection>) => {
    // some logic
})
```

#### SearchPage
Searching for collection of resources with pagination[PagedResourceCollection](#pagedresourcecollection).
This method takes [PagedGetOption](#pagedgetoption) parameter type.

>To search resource projection instead of a resource type pass resource projection type in first method param when used `resourceHateoasService`. See more about projection support [here](#resource-projection-support).

>If do not pass `pageParams` with `PagedGetOption` then will be used [default page options](#default-page-values).
>Also, you can set up own default page params through [configuration](#pagination-params).

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
        /* can use page methods
           page.first();
           page.last();
           page.next();
           page.prev();
           page.size(...);
           page.page(...);
           page.sortElements(...);
           page.customPage(...);
        */    
    });

this.resourceHateoasService.searchPage(Product, 'searchQuery')
    .subscribe((pagedCollection: PagedResourceCollection<Product>) => {
        const products: Array<Product> = pagedCollection.resources;
        /* can use page methods
           page.first();
           page.last();
           page.next();
           page.prev();
           page.size(...);
           page.page(...);
           page.sortElements(...);
           page.customPage(...);
        */
    });
```

With options:

```ts
// Performing GET request by the URL: http://localhost:8080/api/v1/products/search/byName?name=Fruit&page=1&size=30&sort=name,ASC
this.productService.searchPage('byName', {
  pageParams: {
    page: 1,
    size: 30
  },
  params: {
    name: 'Fruit'
  },
  sort: {
    name: 'ASC'
  },
  // useCache: true | false, by default true
}).subscribe((pagedCollection: PagedResourceCollection<Product>) => {
    const products: Array<Product> = pagedCollection.resources;
    /* can use page methods
       page.first();
       page.last();
       page.next();
       page.prev();
       page.size(...);
       page.page(...);
       page.sortElements(...);
       page.customPage(...);
    */
});

this.resourceHateoasService.searchPage(Product, 'byName', {
  pageParams: {
    page: 1,
    size: 40
  },
  params: {
    testParam: 'test'
  },
  sort: {
    cost: 'ASC'
  },
  // useCache: true | false, by default true
}).subscribe((pagedCollection: PagedResourceCollection<Product>) => {
    const products: Array<Product> = pagedCollection.resources;
    /* can use page methods
       page.first();
       page.last();
       page.next();
       page.prev();
       page.size(...);
       page.page(...);
       page.sortElements(...);
       page.customPage(...);
    */
});

```

Get projection example:
```ts
// Performing GET request by the URL: http://localhost:8080/api/v1/products/search/searchQuery?page=0&size=20&projection=productProjection
this.productService.searchPagedProductProjections()
  .subscribe((page: PagedResourceCollection<ProductProjection>) => {
    const products: Array<ProductProjection> = page.resources;
    /* can use page methods
       page.first();
       page.last();
       page.next();
       page.prev();
       page.size(...);
       page.page(...);
       page.sortElements(...);
       page.customPage(...);
    */
  })

this.resourceHateoasService.searchPage(ProductProjection)
  .subscribe((page: PagedResourceCollection<ProductProjection>) => {
    const products: Array<ProductProjection> = page.resources;
    /* can use page methods
       page.first();
       page.last();
       page.next();
       page.prev();
       page.size(...);
       page.page(...);
       page.sortElements(...);
       page.customPage(...);
    */
  })
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

this.resourceHateoasService.customQuery<number>(Product, HttpMethod.GET, '/search/countAllBy')
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

this.resourceHateoasService.customSearchQuery<number>(Product, HttpMethod.GET, '/countAllBy')
  .subscribe((count: number) => {
    // some logic        
  });
```

## Settings
This section describes library configuration params.

### Configuration params
The library accepts configuration object:

```ts
  http: ResourceRoute | MultipleResourceRoutes;
  logs?: {
    verboseLogs?: boolean;
  };
  cache?: {
    enabled: boolean;
    lifeTime?: number;
  };
  useTypes?: {
    resources: Array<new (...args: any[]) => Resource>;
    embeddedResources?: Array<new (...args: any[]) => EmbeddedResource>;
  };
  pagination?: {
    defaultPage: {
      size: number;
      page?: number;
    }
  };
  typesFormat?: {
    date?: {
      patterns: Array<string>;
    }
  };
  isProduction?: boolean;
```

### Http params

#### Common Resource Route
If you want to use common `URL` to retrieve all `Resources`, use `ResourceRoute` http config:

```ts
http: {
   rootUrl: string; // (required) - defines root server URL that will be used to perform resource requests.
   proxyUrl? : string; // (optional) -  defines proxy URL that uses to change rootUrl to proxyUrl when getting a relation link.
}
```

> This creates default `Resource route` with name `defaultRoute` that used by default for all `Resources`. 

#### Multiple Resource Routes

To configure several `URLs` use `MultipleResourceRoutes`:

```ts
http: {
   // Use route name 'defaultRoute' to specify default route for all Resources
   [routeName1: string]: {
       rootUrl: string; // (required) - defines root server URL that will be used to perform resource requests.
       proxyUrl? : string; // (optional) -  defines proxy URL that uses to change rootUrl to proxyUrl when getting a relation link. 
   },
  
   ....
  
   [routeName2: string]: {
      rootUrl: string; // (required) - defines root server URL that will be used to perform resource requests.
      proxyUrl? : string; // (optional) -  defines proxy URL that uses to change rootUrl to proxyUrl when getting a relation link. 
   };
}
```
After that, use `routerName` on `Resource` decorator [@HateoasResource#options](#options) param.

>To specify default `Resource route` use route name `defaultRoute`. This route used if no route name specified in [@HateoasResource#options](#options) param.

#### Logging params

- `verboseLogs` - to debug lib works enable logging to the console. With enabled logging, all prepared resource stages will be printed.

> See more about logging [here](#logging).

#### Cache params

- `enabled` - `true` to use cache for `GET` requests, `false` otherwise, default value is `true`.
- `mode` - allows to adjust cache more granular using `CacheMode` modes.
- `lifeTime` - default cache lifetime is 300 000 seconds (=5 minutes) pass new value to change default one.

`CacheMode` has two options:

- `ALWAYS` is default option in this mode, all HTTP GET methods will use cache except methods where explicitly passed `useCache = false`.
- `ON_DEMAND` is opposite mode, `ALWAYS` mode. Means that all HTTP GET methods will NOT use cache by default except methods where explicitly passed `useCache = true`.

> See more about caching [here](#cache-support).

#### UseTypes params
This configuration section uses to declare resource/embedded resource types that will be used to create resources with concrete resource classes when parsed server's answer.

For example, you use subtypes and you need to know which subtype is received from the server (see more about suptypes in this [section](#subtypes-support)).
If you do not declare this subtype type in `useTypes.resources` section you get the common `Resource` class type without your subtype class methods.

Because [@HateoasResource](#hateoasresource)/[@HateoasEmbeddedResource](#hateoasembeddedresource) decorators are used to registering heirs of `Resource`/`EmbeddedResource` classes in `hateoas-client`, then if you did not use your `Resource` class in your code
(i.e. there was no import of this resource in your code, it will be means that the decorator did not run), then you will receive a generic `Resource` type instead of a concrete resource type when parsed the server's answer.
When will it happen you will get `warnings` in the browser console.

To prevent it you need to declare this resource type in `useTypes.resources` section. This will run [@HaeoasResource](#hateoasresource) resource decorator and register your `Resource` type in `hateoas-client`.
The same logic applied to [EmbeddedResource](#embeddedresource)'s. Use `useTypes.embeddedResources` to register your `EmbeddedResource`'s type in `hateoas-client`.

>It is recommend if all types of your resources (i.e. your classes that extended [Resource](#resource)/[EmbeddedResource](#embeddedresource) classes) will be declared in sections `useTypes.resources` and `useTypes.embeddedResources` respectively.

- `resources` - an array of the [Resource](#resource) types used to create concrete resource types when parsed server's answer instead of common `Resource` type.
- `embeddedResources` - an array of the [EmbeddedResource](#embeddedresource) types used to create concrete embedded resource types when parsed server's answer instead of common `EmbeddedResource` type.

#### TypesFormat
You can set the format for some types.

This format will be used when parse raw `Resource JSON` to determine which `Resource` property type should be used in the result `Resource` instance.

- Define patterns for the `Date` type.
  These patterns used when parsed `Resource JSON` and if some `Resource` property match to `Date` pattern then it will have type as `Date` not as raw `string` type.
  You can define array of `Date` patterns then if `Resource` property match to one of them then it will be as `Date` type.

>[date-fns](https://date-fns.org) lib is used as `Date` parser. See date pattern format [here](https://date-fns.org/v2.28.0/docs/parse).


Example:
````ts
  typesFormat: {
    date: {
      patterns: ['dd/MM/yyyy', 'MM/dd/yyyy'];
    }
  };
````

For the `Resource JSON` like this:

```json
{
  "someDate": '23/06/2022',
  "_links": {
    ...
  }
}
```

`Resource` instance will have property `someDate` as type `Date`.

#### HALFormat
Configuring HAL format that used to parse `JSON` as `Resource`.

Example:
````ts
halFormat: {
    collections: {
        embeddedOptional: false
    }
}
````

Property `collections` contains all format settings for collections. Available the next settings for `collections`:

- `embeddedOptional` - by default `false`, means that server side should add `_embedded` property when returns empty resource collection like that:

```json
{
  "_embedded" : {
    "orders" : [
    ]
  }
}
```
when value is set to `true` then it is not required to add `_embedded` property when returns empty resource collection.

#### isProduction param
Some `hateoas-client` features can change their behaviours depends on this param. For example, [Logging](#logging) disable all `warning` messages when `isProduction` is true.

- `isProduction` - need set to `true` when running in production environment, `false` by default.

#### Pagination params
Let to change [default page params](#default-page-values) that use when a page request not pass page params.

- `size` - change default page size, current value you can see [here](#default-page-values).
- `page` - change default page number, current value you can see [here](#default-page-values).

### Cache support
The library supports caching `GET` request response values.
By default, the cache `enabled`.

To enable cache pass `cache.enabled = true` to library configuration. Also, you can manage the cache expired time with `cache.lifeTime` param.


Also, you can specify cache mode that allows to enable cache always except case when explicitly passed `useCache = false` or vice versa use only when passed `useCache = true`.

> More about the cache configuration see [here](#cache-params).

Also, methods with options types `GetOption` or `PagedGetOption` has additional param `useCache` that allows to manage the cache.
By default `useCache` has `true` value, but when the cache disabled then it param ignored.

#### Evict all cache data

If you need to evict all cache data you can use `HateoasResourceService#evictResourcesCache` method for that:

```ts
...
    constructor(private resourceService: HateoasResourceService) {}

    public someMethod(): void {
        this.resourceService.evictResourcesCache();
    }
...

```

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

#### Warnings
Logs can appear in the browser's console with a warning level. These messages can help you to understand what is problem and how you need to fix it.

It, not good practice to show these messages in production therefore warning level logs to disable when `hateoas-client` used in `production` mode.

>See more [configuration section](#isproduction-param) how to set production mode.

## Public classes
This section describes public classes available to use in client apps.

### RequestOption
Contains common options for all requests, it is allowing to add Angular `HttpClient` options to resource request.
Uses directly as option type in methods that create, change or delete resource.


With `RequestOption` you can change response type to `HttpResponse` passing `observe: 'response'`, by default used `observe: body`.
Also, you can pass `params` that will be added to the HTTP request as HTTP params and other Angular `HttpClient` options.

```
export interface RequestOption {
  params?: [paramName: string]: Resource | string | number | boolean;
  headers?: HttpHeaders | {
    [header: string]: string | string[];
  };
  observe?: 'body' | 'response';
  reportProgress?: boolean;
  withCredentials?: boolean;
}
```
- `params` is `key: value` values that will be added to the HTTP request as HTTP params
- `observe` is response type param
- `headers` is http headers

### GetOption
Uses as option type in methods that retrieve resource or resource collection from the server.

`GetOption` extends `RequestOption` and adds additional params to GET request.

```
export interface GetOption extends RequestOption {
  sort?: Sort;
  useCache?: boolean;
}
```

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
