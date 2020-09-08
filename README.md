# NgxHateoasClient

## Вступление..

## Changelog


## Migration guide

If you use now `@lagoshny/ngx-hal-client` library then you can use migration guide that help you migrate.
You can found more about migration guide here (LINK)

### Getting-started

To start work you need install npm dependency for this lib and pass configuration about your API url.

#### Instalation

To install lib run the next command `npm i @lagoshny/ngx-hateoas-client --save` 

#### Configuration

To configure library you need:

- In your app root module import `NgxHalClientModule`:

````
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
````

- In constructor app root module inject `HalConfigurationService` and pass your configuration:

````
import { ..., HateoasConfigurationService } from '@lagoshny/ngx-hateoas-client';

...

export class AppModule {

  constructor(hateoasConfig: HateoasConfigurationService) {
    hateoasConfig.configure({
      http: {
        rootUrl: 'http://localhost:8080/api/v1'
      }
    });
  }

}
````

Configuration has only one required param is `rootUrl` for your backend API.
Also you can pass `proxyUrl` if you use it in your resource links.
About more configuration params (logging, caching etc) you can found here (LINK) 

#### Usage


##### Define resources
Now when you finished configure library you need extend `Resource` class in you model classes that represents backend entitites.

For example you have some `Product` model that use to fetch data from backend:

```
export class Product {

    public name: string;

    public cost: number;

}
``` 

No you need extend it with `Resource` class:

```
import { Resource } from '@lagoshny/ngx-hateoas-client';

...

export class Product extend Resource {

    public name: string;

    public cost: number;

}
``` 

After that all you `product` instancies will be have `Resource` behaviour with methods to manipulate in their links.
To see more about `Resource` here (LINK)

##### Using HateoasResourceService

Now you are ready to do your first request to fetch you `Resource` from a server.
In you component or service class inject `HateoasResourceService` and pass in generic param you resource type.

```
@Component({
  ...
})
export class YouComponent {

  constructor(private hateoasProductService: HateoasResourceService<Product>) {
  }

  onSomeAction() {
    const product = new Product();
    product.cost = 100;
    product.name = 'Fruit';

    this.hateoasProductService.createResource('product', product)
            .subscribe((createdResource: Product) => {
                // TODO something
            });
  }

```

In `HateoasResourceService` the first param is always resource name that should be equals to resource name in you backend API
because this name uses to built url for resource request.

NOTE!
`HateoasResourceService` is the best choise for simple resources that has not extra logic for requests because you don't need to create own service to do simple resource requests.
But if you have some logic that should be preparing resource before request or another logics or you don't want always pass resource name as first methods param
you can create own service that extends `HateoasResourceOperation` see below about this.

##### Create own service extending HateoasResourceOperation

To make you service to work with resources you need extend service with `HateoasResourceOperation` class:

```
import { HateoasResourceOperation } from '@lagoshny/ngx-hateoas-client';

@Injectable({providedIn: 'root'})
export class ProductService extends HateoasResourceOperation<Supplier> {

  constructor() {
    super('product');
  }

}

```

`HateoasResourceOperation` required single construct param is resource name that will be used to generate resource url when perform requests.

Now you can use you service as `HateoasResourceService` but you don't need pass resource name every time because you pass it in `HateoasResourceOperation` constructor param.

### Lib API

This section describes classes and methods that you can use it you application.

#### Base Resource methods

There are methods can be applied to both the `Resource` and the `EmbeddedResource` classes.

##### Method getRelation

This method allows you get resource relation by relation name.

``
getRelation<T extends BaseResource>(relationName: string, options?: GetOption): Observable<T>;
``

`relationName` - is resource relation name that should be fetched.
`options` - you can pass additional options that will be applied to the request, more about `GetOption` see here (LINK)

As result you will got a `resource object` or `error` when you will try to get relation that return `not` resource object or collection of the resources.
If you need to get collection of the resources or page you can use these methods (2 LINKs)  

##### Method getRelatedCollection

This method allows you get collection of the resources by relation name.

``
getRelatedCollection<T extends ResourceCollection<BaseResource>>(relationName: string, options?: GetOption): Observable<T>;
``

`relationName` - is resource relation name that should be fetched.
`options` - you can pass additional options that will be applied to the request, more about `GetOption` see here (LINK)

As result you will got a `collection resource object` or `error` when you will try to get relation that return `not` resource object or not collection of the resources.
If you need to get standalone resource or page you can use these methods (2 LINKs)  


##### Method getRelatedPage

This method allows you get paged collection of the resources by relation name.

``
getRelatedPage<T extends PagedResourceCollection<BaseResource>>(relationName: string, options?: PagedGetOption): Observable<T>;
``

`relationName` - is resource relation name that should be fetched.
`options` - you can pass additional page options that will be applied to the request, more about `PagedGetOption` see here (LINK)

As result you will got a `paged collection resource object` (see more here LINK) or `error` when you will try to get relation that return `not` resource object or not paged collection of the resources.
If you need to get standalone resource or collection of the resources you can use these methods (2 LINKs)  

##### Method postRelation

This method allows you perform `POST` request for relation with some request body

``
postRelation(relationName: string, requestBody: RequestBody<any>, options?: RequestOption): Observable<any>;
``

`relationName` - is resource relation name that should be fetched.
`requestBody` - object that contains a body and it's includes value options (more see here LINK)
`options` - you can pass additional options that will be applied to the request, more about `RequestOption` see here (LINK)

As a result you will got any object concrete result type depends on you server implementations


##### Method patchRelation

This method allows you perform `PATCH` request for relation with some request body

``
patchRelation(relationName: string, requestBody: RequestBody<any>, options?: RequestOption): Observable<any>;
``

`relationName` - is resource relation name that should be fetched.
`requestBody` - object that contains a body and it's includes value options (more see here LINK)
`options` - you can pass additional options that will be applied to the request, more about `RequestOption` see here (LINK)

As a result you will got any object concrete result type depends on you server implementations

##### Method putRelation

This method allows you perform `PUT` request for relation with some request body

``
putRelation(relationName: string, requestBody: RequestBody<any>, options?: RequestOption): Observable<any>;
``

`relationName` - is resource relation name that should be fetched.
`requestBody` - object that contains a body and it's includes value options (more see here LINK)
`options` - you can pass additional options that will be applied to the request, more about `RequestOption` see here (LINK)

As a result you will got any object concrete result type depends on you server implementations


#### Resource

The main library class allows you describe you model class as hateoas resource that will contains resource links and methods that allows to work with it.

NOTE:
`Resource` class is differ from `EmbeddedResource` by that `Resource` class always has `self` link what can't say about `EmbeddedResource` class.
`EmbeddedResource` class can't exists standalone it can be only as property for `Resource` class.
To read more about `EmbeddedResource` go here (LINK)


##### Method isResourceOf

This method allows to know what type has the resource. You can use it method if you use sub types.

For example you have the next sub type model:

```
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

Each class that extend `Resource` has private field `resourceName` that calculated by url which resource was get.
Suppose to get `CashPayment` resource will be used the next url: `http://localhost:8080/api/v1/cashPayment/1`.
Then `CashPayment.resourceName` will be equals to `cashPayment` because this part of the url represents resource name.

If you want to know what resource did you get from you sub type model you can use the next method:

```
isResourceOf<T extends Resource>(typeOrName: (new () => T) | string): boolean
```

`typeOrName` param can be as resource class name or the simple string that represent resource name.
When you pass resource class name `someResource.isResourceOf(CartPayment)` then will be used class name to compare with resource name with ignore letter case.
When you pass resource name direcly then wit ill be used to compare with resource name with ignore letter case.

Suppose you have some `Order` class that contains list of the `Payment` classes:

```
export class Order extends Resource {
  public status: string;
  public payments: Array<Payment>;
}
```

And it's hal representation:

```
{
  "status": "NEW",
  "_links": {
    "self": {
      "href": "http://localhost:8080/api/v1/oreder/1"
    },
    "oreder": {
      "href": "http://localhost:8080/api/v1/oreder/1{?projection}",
      "templated": true
    }
    "payments": {
      "href": "http://localhost:8080/api/v1/oreder/1/payments"
    }
  }
}
```

Now when you call `getRelatedCollection` (LINK) for `payments` link then you can check what is resource type each payment has:

For returned hal response:

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

will be fair the next snippet:

```
order.getRelatedCollection('payments')
 .subscribe((result: ResourceCollection<Resource>) => {
   console.log(result.resources[0].isResourceOf(CartPayment));   // print true
   console.log(result.resources[0].isResourceOf('cartPayment')); // print true   

   console.log(result.resources[1].isResourceOf(CashPayment));   // print true
   console.log(result.resources[1].isResourceOf('cashPayment')); // print true
 })
```  

##### Method addRelation

This method can be used to add a new relation(s) to exist resource relation that represent collections.

``
addRelation<T extends Resource>(relationName: string, entities: Array<T>): Observable<HttpResponse<any>>;
``

`relationName` - is resource relation name that has resource and it is represents collections of the resources
`entities` - arrays of resources that should be added to the resource relation collection.
As a result you will got `HttpResponse` with results.

##### Method updateRelation

This method can be used to update an exists relation resource with passed a new one.

``
updateRelation<T extends Resource>(relationName: string, entity: T): Observable<HttpResponse<any>>;
``

`relationName` - is resource relation name that should be uopdated
`entitiy` - resource object that will be update a previous one.
As a result you will got `HttpResponse` with results.

##### Method bindRelation

This method can be used to bind a resource to resource relation.

``
bindRelation<T extends Resource>(relationName: string, entity: T): Observable<HttpResponse<any>>;
``

`relationName` - is resource relation name that should be binded
`entitiy` - resource object that will be bind.
As a result you will got `HttpResponse` with results.

Differences between `addRelation` and `bindRelation` that `addRelation` uses to add a new entity(es) to related resurce collection,
where `bindRelation` uses to bind one entity to resource relation.

##### Method clearCollectionRelation

This method can be used to unbind all resources from collection by the relation name.

``
clearCollectionRelation<T extends Resource>(relationName: string): Observable<HttpResponse<any>>;
``

`relationName` - is resource relation name that should be used to undind all resources

##### Method deleteRelation

This method can be used to unbind the resource by the relation name.

When relation name is link to collection of the resources then it means that
only passed entity will be unbind from collection of the resource.

``
deleteRelation<T extends Resource>(relationName: string, entity: T): Observable<HttpResponse<any>>;
``

`relationName` - is resource relation name that should be unbinded
`entitiy` - resource object that will be unbind.

#### EmbeddedResource

This is special resource class that represents `Emdedded` JPA entites.
This is class has not an id property because their can be exists only within another class.
It is not adds a new methods to work with reltions, all ethods from base resource applied to this (LINK)

#### PagedResourceCollection

Special class that used to work with paged collection resource result.

##### Method hasFirst

Checks that page has the link to get the first page result.

``
hasFirst(): boolean;
``

return `true` if the first link is exist, `false` otherwise


##### Method hasLast

Checks that page has the link to get the last page result.

``
hasLast(): boolean;
``

return `true` if the last link is exist, `false` otherwise

##### Method hasNext

Checks that page has the link to get the next page result.

``
hasNext(): boolean;
``

return `true` if the next link is exist, `false` otherwise

##### Method hasPrev

Checks that page has the link to get the prev page result.

``
hasPrev(): boolean;
``

return `true` if the prev link is exist, `false` otherwise

##### Method first

Get the first page result by the first page link.

``
first(options?: {useCache: true;}): Observable<PagedResourceCollection<T>>;
``

`options` - you can pass additional options that influences to use cache when get result or not (by default is uses cache)
More about cache read here (LINK)

Return `PagedResourceCollection` object with first page result.

##### Method last

Get the last page result by the last page link.

``
last(options?: {useCache: true;}): Observable<PagedResourceCollection<T>>;
``

`options` - you can pass additional options that influences to use cache when get result or not (by default is uses cache)
More about cache read here (LINK)

Return `PagedResourceCollection` object with last page result.

##### Method next

Get the next page result by the next page link.

``
next(options?: {useCache: true;}): Observable<PagedResourceCollection<T>>;
``

`options` - you can pass additional options that influences to use cache when get result or not (by default is uses cache)
More about cache read here (LINK)

Return `PagedResourceCollection` object with next page result.

##### Method prev

Get the prev page result by the prev page link.

``
prev(options?: {useCache: true;}): Observable<PagedResourceCollection<T>>;
``

`options` - you can pass additional options that influences to use cache when get result or not (by default is uses cache)
More about cache read here (LINK)

Return `PagedResourceCollection` object with prev page result.

##### Method page

Perform request to passed page number. Page size for this request will be equals to current page size.
If you need custom page number and page size you need to use  `customPage` method (LINK)

``
page(pageNumber: number, options?: {useCache: true;}): Observable<PagedResourceCollection<T>>;
``

`options` - you can pass additional options that influences to use cache when get result or not (by default is uses cache)
More about cache read here (LINK)

Return `PagedResourceCollection` object with page result for passed page number.

##### Method size

Perform request with passed page size. Page number for this request will be equals to current page number.
If you need custom page number and page size you need to use  `customPage` method (LINK)

``
size(size: number, options?: {useCache: true;}): Observable<PagedResourceCollection<T>>;
``

`options` - you can pass additional options that influences to use cache when get result or not (by default is uses cache)
More about cache read here (LINK)

Return `PagedResourceCollection` object with page result with passed page size.

##### Method sortElements

Perform request to sort current page result. 
Page number and page size for this request will be equals to current values.
If you need custom page number and page size with custom sort you need to use  `customPage` method (LINK)

``
sortElements(sortParam: Sort, options?: {useCache: true;}): Observable<PagedResourceCollection<T>>;
``

`sortParam` - define sort order result (read about `Sort` param here  LINK)
`options` - you can pass additional options that influences to use cache when get result or not (by default is uses cache)
More about cache read here (LINK)

Return `PagedResourceCollection` object with sorted page result.

##### Method customPage

Perform page request with a custom page params.

``
customPage(params: SortedPageParam, options?: {useCache: true;}): Observable<PagedResourceCollection<T>>;
``

`params` - allowed to pass page size, page number or sort order params, when some of the params will not passed the current values will be used (read about `SortedPageParam` param here  LINK)
`options` - you can pass additional options that influences to use cache when get result or not (by default is uses cache)
More about cache read here (LINK)

Return `PagedResourceCollection` object with page result.

#### HateoasResourceService

Thi service can be used as standalone to work with resource.
Which resource type will be used define with server generic param.
You can ue this service if you have simple resources that has not additional logics before perform reource opertions.
When you need do some additional logics then you need to create you own service that extend `HateoasResourceOperation` class (to see more here LINK) 

For example, you have some `component` and want to use `HateoasResourceService` for `Product` resource:

````
@Component({...})
export class AppComponent implements OnInit {
  ...
  constructor(private hateoasProductService: HateoasResourceOperation<Product>) {
  }
  ...
}
````

This will be inject instance of `HateoasResourceOperation` for `Product` resource.

##### Method getResource

Get resource object by an id.

``
getResource(resourceName: string, id: number | string, options?: GetOption): Observable<T>;
``

`resourceName` - name of the resource that should be get
`id` - resource id to get
`options` - you can pass additional options that will be applied to the request, more about `GetOption` see here (LINK)

return value is `resource object` or `error` when returned value is not resource.
To get collection or page of the resource use these methods (LINK)

##### Method getCollection

Get resource collection by resource name.

``
getCollection(resourceName: string, options?: GetOption): Observable<ResourceCollection<T>>;
``

`resourceName` - name of the resource that should be get
`options` - you can pass additional options that will be applied to the request, more about `GetOption` see here (LINK)

return value is `resource collection object` or `error` when returned value is not collection of the resources.

##### Method getPage

Get paged resource collection by resource name.

``
getPage(resourceName: string, options?: PagedGetOption): Observable<PagedResourceCollection<T>>;
``

`resourceName` - name of the resource that should be get
`options` - you can pass additional options that will be applied to the request, more about `PagedGetOption` see here (LINK)

return value is `paged resource collection object` see here (LINK) or `error` when returned value is not paged collection of the resources.

##### Method createResource

Create a new resource.

``
createResource(resourceName: string, requestBody: RequestBody<T>): Observable<T>;
``

`resourceName` - name of the resource that should be created
`requestBody` - object that contains resource as body and additional body options (to see more here LINK)

return created resource object.

##### Method updateResource

Update resource values.

``
updateResource(entity: T, requestBody?: RequestBody<any>): Observable<T | any>;
``

`entity` - resource that should be updated
`requestBody` - object that contains new values as body and additional body options (to see more here LINK)

return updated resource object or any value when you server has custom response.

##### Method updateResourceById

Update resource values by resource id

``
updateResourceById(resourceName: string, id: number | string, requestBody: RequestBody<any>): Observable<T | any>;
``

`resourceName` - name of the resource that should be updated
`id` - resource id that should be updated
`requestBody` - object that contains new values as body and additional body options (to see more here LINK)

return updated resource object or any value when you server has custom response.

##### Method patchResource

Patch resource values.

``
patchResource(entity: T, requestBody?: RequestBody<any>): Observable<T | any>;
``

`entity` - resource that should be patched
`requestBody` - object that contains new values as body and additional body options (to see more here LINK)

return patched resource object or any value when you server has custom response.

##### Method patchResourceById

Patch resource values by resource id.

``
patchResourceById(resourceName: string, id: number | string, requestBody: RequestBody<any>): Observable<T | any>;
``

`resourceName` - name of the resource that should be patched
`id` - resource id that should be patched
`requestBody` - object that contains new values as body and additional body options (to see more here LINK)

return patched resource object or any value when you server has custom response.

##### Method deleteResource

Delete resource.

``
deleteResource(entity: T, options?: RequestOption): Observable<HttpResponse<any> | any>;
``

`entity` - resource that should be deleted
`options` - you can pass additional options that will be applied to the request, more about `RequestOption` see here (LINK)

return `HttpResponse` with result or any value when you server has custom response.

##### Method deleteResourceById


Delete resource by resource id.

``
deleteResourceById(resourceName: string, id: number | string, options?: RequestOption): Observable<HttpResponse<any> | any>;
``

`resourceName` - name of the resource that should be deleted
`id` - resource id that should be deleted
`options` - you can pass additional options that will be applied to the request, more about `RequestOption` see here (LINK)

return `HttpResponse` with result or any value when you server has custom response.

##### Method searchCollection

Perform search query to get collection resource result.
You should not pass `/search` part of the url in `searchQuery` param it will be added automatically

``
searchCollection(resourceName: string, searchQuery: string, options?: GetOption): Observable<ResourceCollection<T>>;
``

`resourceName` - name of the resource that should be searched
`searchQuery` - additional part of the url that wll be follow after `/search/` resource url.
`options` - you can pass additional options that will be applied to the request, more about `GetOption` see here (LINK)

return `collection of the resources` or `erorr` when return type is `not collection of the resources`.

##### Method searchPage

Perform search query to get paged collection resource result.
You should not pass `/search` part of the url in `searchQuery` param it will be added automatically

``
searchPage(resourceName: string, searchQuery: string, options?: PagedGetOption): Observable<PagedResourceCollection<T>>;
``

`resourceName` - name of the resource that should be searched
`searchQuery` - additional part of the url that wll be follow after `/search/` resource url.
`options` - you can pass additional options that will be applied to the request, more about `PagedGetOption` see here (LINK)

return `paged collection of the resources` (LINK) or `erorr` when return type is `not paged collection of the resources`.

##### Method searchSingle

Perform search query to get single resource result.
You should not pass `/search` part of the url in `searchQuery` param it will be added automatically

``
searchSingle(resourceName: string, searchQuery: string, options?: GetOption): Observable<T>;
``

`resourceName` - name of the resource that should be searched
`searchQuery` - additional part of the url that wll be follow after `/search/` resource url.
`options` - you can pass additional options that will be applied to the request, more about `GetOption` see here (LINK)

return `resource object` or `erorr` when return type is `not resource object`.

##### Method customQuery

Perform custom resource query.

``
customQuery<R>(resourceName: string, method: HttpMethod, query: string, requestBody?: RequestBody<any>, options?: PagedGetOption): Observable<R>;
``

`resourceName` - name of the resource that should be queried
`method` - HTTP query method
`query` - additional part of the url that wll be follow after root resource url.
`requestBody` - when `method` param is `POST`, `PATCH`, `PUT` then it can be used to pass request body to see about this object here (LINK)
`options` - you can pass additional options that will be applied to the request, more about `GetOption` see here (LINK)

Generic `<R>` define return query type.

##### Method customSearchQuery

Perform custom search query.
If you need to perform search `GET` methods then you can use `searchCollection`, `searchPage`, `searchSingle` methods.
But when you want to perform non `GET` HTTP request you need to use this method.

``
customSearchQuery<R>(resourceName: string, method: HttpMethod, searchQuery: string, requestBody?: RequestBody<any>, options?: PagedGetOption): Observable<R>;
``

`resourceName` - name of the resource that should be queried
`method` - HTTP query method
`searchQuery` - additional part of the url that wll be follow after `/search/` resource url.
`requestBody` - when `method` param is `POST`, `PATCH`, `PUT` then it can be used to pass request body to see about this object here (LINK)
`options` - you can pass additional options that will be applied to the request, more about `GetOption` see here (LINK)

Generic `<R>` define return query type.

#### HateoasResourceOperation

When you need put some logics before doing resource request create you own service that extends `HateoasResourceOperation` class and 
create methods with custom logics that finally will be used `HateoasResourceOperation` methods to do resource requests.
For simple resources without additional logics you can use `HateoasResourceService` to reduce you application services. More about `HateoasResourceService` see here (LINK) 

To use `HateoasResourceOperation` create a new service class that extends `HateoasResourceOperation`:

```
import { HateoasResourceOperation } from '@lagoshny/ngx-hateoas-client';

@Injectable({providedIn: 'root'})
export class ProductService extends HateoasResourceOperation<Product> {

  constructor() {
    super('product');
  }

}
```

Also you need pass resource name to parent `HateoasResourceOperation` constructor.
This name will be used to create root resource url to perform resource requests and because you pass it with constructor you should not pass it with any `HateoasResourceOperation` mrthods as it is was with `HateoasResourceService`.

##### Method getResource

This methods preform the same request as `HateoasResourceService.getResource` exclude that you don't need pass the resource name param.
To more see here (LINK) 

##### Method getCollection

This methods preform the same request as `HateoasResourceService.getCollection` exclude that you don't need pass the resource name param.
To more see here (LINK) 

##### Method getPage

This methods preform the same request as `HateoasResourceService.getPage` exclude that you don't need pass the resource name param.
To more see here (LINK) 

##### Method createResource

This methods preform the same request as `HateoasResourceService.createResource` exclude that you don't need pass the resource name param.
To more see here (LINK) 

##### Method updateResource

This methods preform the same request as `HateoasResourceService.updateResource`.
To more see here (LINK) 


##### Method updateResourceById

This methods preform the same request as `HateoasResourceService.updateResourceById` exclude that you don't need pass the resource name param.
To more see here (LINK) 

##### Method patchResource

This methods preform the same request as `HateoasResourceService.patchResource`.
To more see here (LINK) 


##### Method patchResourceById

This methods preform the same request as `HateoasResourceService.patchResourceById` exclude that you don't need pass the resource name param.
To more see here (LINK) 

##### Method deleteResource

This methods preform the same request as `HateoasResourceService.deleteResource`.
To more see here (LINK) 

##### Method deleteResourceById

This methods preform the same request as `HateoasResourceService.deleteResourceById` exclude that you don't need pass the resource name param.
To more see here (LINK) 

##### Method searchCollection

This methods preform the same request as `HateoasResourceService.searchCollection` exclude that you don't need pass the resource name param.
To more see here (LINK) 

##### Method searchPage

This methods preform the same request as `HateoasResourceService.searchPage` exclude that you don't need pass the resource name param.
To more see here (LINK) 

##### Method searchSingle

This methods preform the same request as `HateoasResourceService.searchSingle` exclude that you don't need pass the resource name param.
To more see here (LINK) 

##### Method customQuery

This methods preform the same request as `HateoasResourceService.customQuery` exclude that you don't need pass the resource name param.
To more see here (LINK) 

##### Method customSearchQuery

This methods preform the same request as `HateoasResourceService.customSearchQuery` exclude that you don't need pass the resource name param.
To more see here (LINK) 


#### Subtype support

To work with resources with subtypes hirerarhly you don't need do extra actions.
Each class that extends `Resource` class (LINK) ha private `resourceName` property that hold resource name which calculated by resource self link url.

For exmaple you have `Order` resource:

```
{
  "status": "NEW",
  "_links": {
    "self": {
      "href": "http://localhost:8080/api/v1/order/1"
    },
    "cart": {
      "href": "http://localhost:8080/api/v1/order/1{?projection}",
      "templated": true
    },
    ...
  }
}
```   

Then `resourceName` will be fetched from `_links.self.href` and will be equals to `order`.

Now you can use `resourceName` to recognize which resource type you have.
To do it you need use `isResourceOf(...)` method that as `resourceName` any `Resource` class has it.
`isResourceOf(...)` method accept one param that can be class type or resource name as string:

````
class Order extend Resource {...}

1) youResource.isResourceOf(Order);
2) youResource.isResourceOf('order');
````

In first case `youResource.resourceName` will be compare with `Order` constructor name ignore letter case.
For second case `youResource.resourceName` will be compare with passed resource name ignore letter case.

When `youResource.isResourceOf(Order)` return true then you can cast `youResource` to `Order` resource type.



#### Configuration params

`NgxHateoasClient` allows you pass the next configuration params:

````
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
  comparable?: {
    ngxHalClient?: boolean;
  };

````

This section allows you pass the main http settings. 
`http` section:
`rootUrl` - define root server url that will be used to perform resource requests.
Only this param is required.

`proxyUrl` -  when defined then it uses to change rootUrl to proxyUrl when get relation link.

This section allows you pass library logs settings. 
`logs` section:
To debug how lib works you can use `logs` params and you will see in console verboses logs 
what is happens when you try to get some `Resource` and will be it got from the cache or doing request to the server etc.

This section allows you pass cache settings. 
`cache` section:
`enabled` - when passed `true` then will be use cache, `false` by default.
`lifeTime` - by default (300 000 seconds = 5 minutes) cache life time in seconds after which cache will be expired.

This section is used for enable comparable mode with other simillary libs.
`comparable` section:
`ngxHalClient` - when passed `true` then enable comparable mode with ngx-hal-client library

#### Cache support

`NgxHateoasClient` has cache support.
By default cache is disabled, to enable you need pass it in configuration:

```
{
...
  cache: {
    enabled: true;
    lifeTime: 5 * 60 * 1000;
  }
...
}
```

Here we pass that we want enable cache support and cache life time eq 300 000 milliseconds = 5 minutes.

To read about lib config see here (LINK)

Some `Resource` methods has `GetOption` param that contains `useCache` property (LINK) and it is allows you
disable cache support for current request if you need it.

Cache is working by the next princepes:
It is used only for `GET` resource requests, if you perform `GET` resource/collection/page first time then it will be doing server request and after this put result with request params and options to the cache.
And when you will do the same request with same params and options again then it will be fetched from the cache instead do server request.
But when you will perform `POST`, `PUT`, `PATCH` request for resource then all resource cache are clear.

#### Other classes

##### GetOption

`GetOption` is interface that describes the next options:

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

`params` property is `key: value` params that will be added to the HTTP request as HTTP params.
`sort` property influence to sort response body
`useCache` property allows you disable cache for concreate request (if global chace support is enable) (LINK)

##### GetPagedOption

`PagedGetOption` extends `GetOption` and adds page params.

```
export interface PagedGetOption extends GetOption {
  pageParams?: PageParam;
}

export interface PageParam {
  page?: number;
  size?: number;
}
```

With `PageParam` you can pass page number and page size, when it is not passed then default values will be used.

```
DEFAULT_PAGE: PageParam = {
  page: 0,
  size: 20,
};
```

##### Sort

`Sort` params are `key: value` object where `key` is property  to sort and `value` is sort order.

```
export interface Sort {
  [propertyToSort: string]: SortOrder;
}

export type SortOrder = 'DESC' | 'ASC';
```

##### RequestOption

`RequestOption` uses where you can change response type to `HttpResponse` passed `observe: 'response'` by default used `observe: body`. 
Also you can pass `params` that will be added to the HTTP request as HTTP params.

```
export interface RequestOption {
  params?:  {
    [paramName: string]: Resource | string | number | boolean;
  },
  observe?: 'body' | 'response';
}
```

##### SortedPageParam

`SortedPageParam` allows to pass page option with sort params without additional HTTP params.

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

##### RequestBody

`RequestBody` is param that resposponse of passed request body in `POST`, `PUT`, `PATCH` HTTP requests.

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
`RequestBody` has two properies: 

`body` is ay request body that will be passed as HTTP request body with type equals generic `RequestBody` type.
`include` is special property that allows to manipulate which special values should be included from `body` property.

For example you pass `{body: {name: 'Name', age: null}}` then by default any properties that has `null` values will be ignored and will not passed with HTTP reqeust body.
It means that by default result HTTP request body will be `{name: 'Name'}`, but when you want pass `null` values too then you need use `RequestBody.valuesOption` property:

```
{
  body: {name: 'Name', age: null},
  valuesOption: {include: Include.NULL_VALUES}
}
```
After that result HTTP request body will be `{name: 'Name', age: null}`.

Note! When body has `undefined` property then it will be ignored also with `Include.NULL_VALUES`.
If you want pass `undefined` as is in result HTTP request body or you have another special body values case, then you can create as issue (LINK) and we will add you behaviour. 
