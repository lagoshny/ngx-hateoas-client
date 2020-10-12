# NgxHateoasClient

**Compatible with Angular 10.**

This client can be used to develop `Angular 4.3+` applications working with RESTful server API. 
By `RESTful API` means when the server application implements all the layers of the [Richardson Maturity Model](https://martinfowler.com/articles/richardsonMaturityModel.html) 
and the server provides [HAL/JSON](http://stateless.co/hal_specification.html) response type.

This client compatible with Java server-side applications based on [Spring HATEOAS](https://spring.io/projects/spring-hateoas) or [Spring Data REST](https://docs.spring.io/spring-data/rest/docs/current/reference/html/#reference).

>This client is a continuation of the [@lagoshny/ngx-hal-client](https://github.com/lagoshny/ngx-hal-client).
You can find out about the motivation to create a new client [here]().
To migrate from `@lagoshny/ngx-hal-client` to this client you can use the [migration guide](https://github.com/lagoshny/ngx-hateoas-client/blob/master/migration.md).

## Getting-started

### Installation

To install the client use the next command `npm i @lagoshny/ngx-hateoas-client --save` 

### Configuration

To configure the client you need doing two actions:

1) In you app root module import `NgxHalClientModule`:

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

2) In constructor app root module inject `HalConfigurationService` and pass you configuration:

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

>Configuration has only one required param is `rootUrl` that mapped to the server API URL.
Also, you can pass `proxyUrl` if you use it in resource links.
You can read more about a configuration params [here](). 

### Usages

#### Define resource classes

Now you need to define resource classes by extending you `model` classes that mapped to the server-side entities with the `Resource` class.

Suppose you have some `Product` model class:

```
export class Product {

    public name: string;

    public cost: number;

}
``` 

When extending it with `Resource` class it will look like:

```
import { Resource } from '@lagoshny/ngx-hateoas-client';

export class Product extend Resource {

    public name: string;

    public cost: number;

}
``` 

Thereafter, the `Product` class will have `Resource` methods to work with the product's relations through resource links.

>Also, you can extend model classes with the `EmbeddedResource` class when the model class used as an [embeddable](https://docs.oracle.com/javaee/6/api/javax/persistence/Embeddable.html) entity. 
You can read more about `EmbeddedResource` [here]().


To perform resource requests you can use built-in [HateoasResourceService]() or create [custom resource service]().

#### Built-in HateoasResourceService

For convenience, library has built-in `HateoasResourceService`.
It's a simple service with methods to fetch/create/update/delete resources.

To work with it inject `HateoasResourceService` to a component or a service class and set resource type in generic param.
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

Each `HateoasResourceService` method has as the first param is the resource name that should be equals to the resource name in backend API because this is a common service that can be used for any resource type passed in generic param.
The resource name uses to build a URL for resource requests.

More about available methods to work with resources [here]().

>`HateoasResourceService` is the best choice for simple resources that has not extra logic for requests.
When you have some logic that should be preparing resource before a request, or you don't want always pass the resource name as first methods param
you can create a custom resource service that extends `HateoasResourceOperation` to see more about this [here]().

#### Create custom Resource service

To create custom resource service you need extends it with `HateoasResourceOperation` and pass resource name to parent constructor.

```
import { HateoasResourceOperation } from '@lagoshny/ngx-hateoas-client';

@Injectable({providedIn: 'root'})
export class ProductService extends HateoasResourceOperation<Product> {

  constructor() {
    super('product');
  }

}

```

After that `ProductService` will have resource methods that you can use in service methods.

More about available methods to work with resources [here]().

## Library features

This section describes the popular library features.

### Resource service 

As described before to work with resources you can use built-in [HateoasResourceService]()  or create [custom resource service]().

>Only difference in methods signature between built-in HateoasResourceService and custom resource service is built-in service always has a resource name as the first method param.

**No matter which a service you choose you will have the same resource methods.**

___
#### Presets for examples

Examples of usage resource service methods rely on this presets.


- Server root url = http://localhost:8080/api/v1
- Resource class is
  ```
  import { Resource } from '@lagoshny/ngx-hal-client';
  
  export class Product extends Resource {
  
      public name: string;
  
      public cost: number;
  
      public description: string;
  
  }
  ```
  
- Resource service as built-in [HateoasResourceService]() is
  ```
  @Component({ ... })
  export class AppComponent {
      constructor(private productHateoasService: HateoasResourceService<Product>) {
      }
  }
  ```  
  
- Resource service as [custom resource service]() is
  ```
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
___

#### Get resource

This method uses for getting a single resource [Resource]().
With `GetOption` you can pass `projection` param (see below).

Method signature:

````
getResource(id: number | string, options?: GetOption): Observable<T>;
````

- `id` - resource id to get
- `options` - you can pass additional options that will be applied to the request, more about `GetOption` see [here]().
- `return value` - [Resource]() with type `T`
- `throws error` when returned value is not [Resource]()

Example of usage ([given the presets]()):

```
// Will be perform GET request to the http://localhost:8080/api/v1/products/1 
productService.getResource(1)
    .subscribe((product: Product) => {
        // some logic
    }
productHateoasService.getResource('products', 1)
    .subscribe((product: Product) => {
        // some logic
    }


// Will be perform GET request to the http://localhost:8080/api/v1/products/1?testParam=test&projection=productProjection&sort=cost,ASC
productService.getResource(1, {
  params: {
    testParam: 'test',
    projection: 'productProjection',
  },
  sort: {
    cost: 'ASC'
  },
  // useCache: true | false, when cache is enable then by default true, false otherwise
}).subscribe((product: Product) => {
    // some logic
});
productHateoasService.getResource('products', 1, {
  params: {
    testParam: 'test',
    projection: 'productProjection',
  },
  sort: {
    cost: 'ASC'
  },
  // useCache: true | false, when cache is enable then by default true, false otherwise
}).subscribe((product: Product) => {
    // some logic
});

```

#### Get resource collection

This method uses for getting a collection of resources [ResourceCollection]().
With `GetOption` you can pass `projection` param (see below).

Method signature:

````
getCollection(options?: GetOption): Observable<ResourceCollection<T>>;
````

- `options` - you can pass additional options that will be applied to the request, more about `GetOption` see [here]().
- `return value` - [ResourceCollection]() collection of resources with type `T` 
- `throws error` when returned value is not [ResourceCollection]() 

Example of usage ([given the presets]()):

```
// Will be perform GET request to the http://localhost:8080/api/v1/products
productService.getCollection()
    .subscribe((collection: ResourceCollection<Product>) => {
        const products: Array<Product> = collection.resources;
        // some logic
    }
productHateoasService.getCollection('products')
    .subscribe((collection: ResourceCollection<Product>) => {
        const products: Array<Product> = collection.resources;
        // some logic
    }

// Will be perform GET request to the http://localhost:8080/api/v1/products?testParam=test&projection=productProjection&sort=cost,ASC
productService.getCollection({
  params: {
    testParam: 'test',
    projection: 'productProjection',
  },
  sort: {
    cost: 'ASC'
  },
  // useCache: true | false, when cache is enable then by default true, false otherwise
}).subscribe((collection: ResourceCollection<Product>) => {
    const products: Array<Product> = collection.resources;
    // some logic
});
productHateoasService.getCollection('products', {
  params: {
    testParam: 'test',
    projection: 'productProjection',
  },
  sort: {
    cost: 'ASC'
  },
  // useCache: true | false, when cache is enable then by default true, false otherwise
}).subscribe((collection: ResourceCollection<Product>) => {
    const products: Array<Product> = collection.resources;
    // some logic
});

```

#### Get resource page

This method uses for getting a paged collection of resources [PagedResourceCollection]().
With `PagedGetOption` you can pass `projection` param (see below).
>If you don't pass `pageParams` with `PagedGetOption` then will be used [default page options](). 

Method signature:

````
getPage(options?: PagedGetOption): Observable<PagedResourceCollection<T>>;
````

- `options` - you can pass additional options that will be applied to the request, if not passed page params will be used [default page params](), more about `PagedGetOption` see [here]().
- `return value` - [PagedResourceCollection]() paged collection of resources with type `T` 
- `throws error` when returned value is not [PagedResourceCollection]() 

Example of usage ([given the presets]()):

```
// Will be perform GET request to the http://localhost:8080/api/v1/products?page=0&size=20
productService.getPage()
    .subscribe((page: PagedResourceCollection<Product>) => {
        const products: Array<Product> = page.resources;
        /* can use page methods
           page.first();
           page.last();
           page.next();
           page.prev();
           page.customPage();
        */    
    }
productHateoasService.getPage('products')
    .subscribe((page: PagedResourceCollection<Product>) => {
        const products: Array<Product> = page.resources;
        /* can use page methods
           page.first();
           page.last();
           page.next();
           page.prev();
           page.customPage();
        */   
    }


// Will be perform GET request to the http://localhost:8080/api/v1/products?testParam=test&projection=productProjection&page=1&size=40&sort=cost,ASC
productService.getPage({
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
  // useCache: true | false, when cache is enable then by default true, false otherwise
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
productHateoasService.getPage('products', {
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
  // useCache: true | false, when cache is enable then by default true, false otherwise
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

#### Create resource

This method uses for create a new resource entity [Resource]().

Method signature:

````
createResource(requestBody: RequestBody<T>): Observable<T | any>;
````

- `requestBody` - object that contains resource as body and additional body options, more about `RequestBody` see [here]().
- `return value` - [Resource]() with type `T` or raw response data when it's not a resource object. 

Example of usage ([given the presets]()):

```
/*
Will be perform POST request to the http://localhost:8080/api/v1/products
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
productService.createResource({
  body: newProduct
}).subscribe((createdProduct: Product) => {
    // some logic 
});
productHateoasService.createResource('products', {
  body: newProduct
}).subscribe((createdProduct: Product) => {
    // some logic 
});

/*
Will be perform POST request to the http://localhost:8080/api/v1/products
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
productService.createResource({
  body: newProduct,
  valuesOption: {
    include: Include.NULL_VALUES
  }
}).subscribe((createdProduct: Product) => {
    // some logic 
});
productHateoasService.createResource('products', {
  body: newProduct,
  valuesOption: {
    include: Include.NULL_VALUES
  }
}).subscribe((createdProduct: Product) => {
    // some logic 
});
```

#### Update resource

This method uses to updating **all** a resource values at once.
If you want update only part of resource values then use [PatchResource]() method.
> It means if you pass only part of resource value in requestBody then all not passed resource values will be overwritten on null values. 

Method signature:

````
updateResource(entity: T, requestBody?: RequestBody<any>): Observable<T | any>;
````

- `entity` - resource entity that should be updated, when passed only this param then passed `entity` values will be used to update a resource values.
- `requestBody` - object that contains a new resource values to update and additional body options, more about `RequestBody` see [here]().
- `return value` - [Resource]() with type `T` or raw response data when it's not a resource object. 

>In this case to update a resource performs a PUT request by URL equals to resource self link passed in `entity` param.
You can update a resource entity by an id directly, see more [here]().

Example of usage ([given the presets]()):

```
/*
Suppose exitsProduct has a self link = http://localhost:8080/api/v1/products/1
Will be perform PUT request to the http://localhost:8080/api/v1/products/1
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
productService.updateResource(exitsProduct)
  .subscribe((updatedProduct: Product) => {
    // some logic 
});
// For productHateoasService this snippet is identical

/*
Suppose exitsProduct has a self link = http://localhost:8080/api/v1/products/1
Will be perform PUT request to the http://localhost:8080/api/v1/products/1
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
productService.updateResource(exitsProduct, {
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

#### Update resource by id

This method uses to updating **all** a resource values at once by resource id.
If you want update only part of resource values then use [PatchResource]() method.
> It means if you pass only part of resource value in requestBody then all not passed resource values will be overwritten on null values. 

Method signature:

````
updateResourceById(id: number | string, requestBody: RequestBody<any>): Observable<T | any>;
````

- `id` - resource id that should be updated
- `requestBody` - object that contains a new resource values to update and additional body options, more about `RequestBody` see [here]().
- `return value` - [Resource]() with type `T` or raw response data when it's not a resource object. 

>You can update a resource entity by a resource self link without passing an id param directly, see more [here]().

Example of usage ([given the presets]()):

```
/*
Suppose exitsProduct has an id = 1
Will be perform PUT request to the http://localhost:8080/api/v1/products/1
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
productService.updateResourceById(1, {
  body: {
    ...exitsProduct
  }
})
  .subscribe((updatedProduct: Product) => {
    // some logic 
});
productHateoasService.updateResourceById('products', 1, {
  body: {
    ...exitsProduct
  }
})
  .subscribe((updatedProduct: Product) => {
    // some logic 
});

/*
Suppose exitsProduct has an id = 1
Will be perform PUT request to the http://localhost:8080/api/v1/products/1
Request body:
{
  "name": null,
  "cost": 500
}
Note: 
1) Name was passed with null value because valuesOption = Include.NULL_VALUES was passed.
2) Since update resource updating all resource values at once and for description value is not passing then the server-side can overwrite description to null.
*/
productService.updateResourceById(1, {
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
productHateoasService.updateResourceById('products', 1, {
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

#### Patch resource

This method uses to patch **part** of resource values.
If you want patching all resource values then use [UpdateResource]() method.
> It means if you pass only part of resource values in requestBody then only passed values will be overwritten. 

Method signature:

````
patchResource(entity: T, requestBody?: RequestBody<any>): Observable<T | any>;
````

- `entity` - resource entity that should be patched, when passed only this param then passed `entity` values will be used to patch a resource values.
- `requestBody` - object that contains a new resource values to patch and additional body options, more about `RequestBody` see [here]().
- `return value` - [Resource]() with type `T` or raw response data when it's not a resource object. 

>In this case to patch a resource performs a PATCH request by URL equals to resource self link passed in `entity` param.
You can patch a resource entity by an id directly, see more [here]().

Example of usage ([given the presets]()):

```
/*
Suppose exitsProduct has a self link = http://localhost:8080/api/v1/products/1
Will be perform PATCH request to the http://localhost:8080/api/v1/products/1
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
productService.patchResource(exitsProduct)
  .subscribe((patchedProduct: Product) => {
    // some logic 
});
// For productHateoasService this snippet is identical

/*
Suppose exitsProduct has a self link = http://localhost:8080/api/v1/products/1
Will be perform PATCH request to the http://localhost:8080/api/v1/products/1
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
productService.patchResource(exitsProduct, {
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

#### Patch resource by id

This method uses to patch **part** of resource values by resource id.
If you want patching all resource values then use [UpdateResourceById]() method.
> It means if you pass only part of resource values in requestBody then only passed values will be overwritten. 

Method signature:

````
patchResourceById(id: number | string, requestBody: RequestBody<any>): Observable<T | any>;
````

- `id` - resource id that should be patched
- `requestBody` - object that contains a new resource values to patch and additional body options, more about `RequestBody` see [here]().
- `return value` - [Resource]() with type `T` or raw response data when it's not a resource object. 

>You can patch a resource entity by a resource self link without passing an id param directly, see more [here]().

Example of usage ([given the presets]()):

```
/*
Suppose exitsProduct has an id = 1
Will be perform PATCH request to the http://localhost:8080/api/v1/products/1
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
productService.patchResourceById(1, {
  body: {
    ...exitsProduct
  }
})
  .subscribe((patchedProduct: Product) => {
    // some logic 
});
productHateoasService.patchResourceById('products', 1, {
  body: {
    ...exitsProduct
  }
})
  .subscribe((patchedProduct: Product) => {
    // some logic 
});

/*
Suppose exitsProduct has an id = 1
Will be perform PUT request to the http://localhost:8080/api/v1/products/1
Request body:
{
  "name": null,
  "cost": 500
}
Note: 
1) Name was passed with null value because valuesOption = Include.NULL_VALUES was passed.
2) Since patch resource updating only part of resource values at once then all not passed values will have the old values.
*/
productService.patchResourceById(1, {
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
productHateoasService.patchResourceById('products', 1, {
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

#### Delete resource
This method uses to delete resource by a resource self link URL.

Method signature:

````
deleteResource(entity: T, options?: RequestOption): Observable<HttpResponse<any> | any>;
````

- `entity` - resource entity that should be deleted
- `options` - you can pass additional options that will be applied to the request, more about `RequestOption` see [here]().
- `return value` - by default raw response data or Angular `HttpResponse` when `options` param has `observe: 'response'` value. 

>In this case to delete a resource performs DELETE request by URL equals to resource self link passed in `entity` param.
You can delete a resource entity by an id directly, see more [here]().

Example of usage ([given the presets]()):

```
/*
Suppose exitsProduct has a self link = http://localhost:8080/api/v1/products/1
Will be perform DELETE request to the http://localhost:8080/api/v1/products/1
*/
productService.deleteResource(exitsProduct)
  .subscribe((result: any) => {
    // some logic     
  });
// For productHateoasService this snippet is identical

/*
Suppose exitsProduct has a self link = http://localhost:8080/api/v1/products/1
Will be perform DELETE request to the http://localhost:8080/api/v1/products/1?testParam=test
*/
const exitsProduct = ...;
productService.deleteResource(exitsProduct, {
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

#### Delete resource by id
This method uses to delete resource by a resource id.

Method signature:

````
deleteResourceById(id: number | string, options?: RequestOption): Observable<HttpResponse<any> | any>;
````

- `id` - resource id that should be deleted
- `options` - you can pass additional options that will be applied to the request, more about `RequestOption` see [here]().
- `return value` - by default raw response data or Angular `HttpResponse` when `options` param has `observe: 'response'` value. 

>You can delete a resource entity by a resource self link without passing an id param directly, see more [here]().

Example of usage ([given the presets]()):

```
/*
Suppose exitsProduct has an id = 1
Will be perform DELETE request to the http://localhost:8080/api/v1/products/1
*/
productService.deleteResourceById(1)
  .subscribe((result: any) => {
    // some logic     
  });
productHateoasService.deleteResourceById('products', 1)
  .subscribe((result: any) => {
    // some logic     
  });

/*
Suppose exitsProduct has an id = 1
Will be perform DELETE request to the http://localhost:8080/api/v1/products/1?testParam=test
*/
const exitsProduct = ...;
productService.deleteResourceById(1, {
  observe: 'response',
  params: {
    testParam: 'test'
  }
})
  .subscribe((result: HttpResponse<any>) => {
    // some logic     
  });
productHateoasService.deleteResourceById('products', 1, {
  observe: 'response',
  params: {
    testParam: 'test'
  }
})
  .subscribe((result: HttpResponse<any>) => {
    // some logic     
  });
```

#### Search resource
This method uses for search a single resource.
You don't need to specify `/search` part of the URL it will be added automatically

With `GetOption` you can pass `projection` param (see below).

Method signature:

````
searchResource(searchQuery: string, options?: GetOption): Observable<T>;
````

- `searchQuery` - additional part of the url that wll be follow after `/search/` resource url.
- `options` - you can pass additional options that will be applied to the request, more about `GetOption` see [here]().
- `return value` - resource with type `T`
- `throws error` when returned value is not [Resource]()

Example of usage ([given the presets]()):

```
// Will be perform GET request to the http://localhost:8080/api/v1/products/search/searchQuery 
productService.searchResource('searchQuery')
    .subscribe((product: Product) => {
        // some logic
    }
productHateoasService.searchResource('products', 'searchQuery')
    .subscribe((product: Product) => {
        // some logic
    }

// Will be perform GET request to the http://localhost:8080/api/v1/products/search/byName?name=Fruit&projection=productProjection&sort=name,ASC
productService.searchResource('byName', {
  params: {
    projection: 'productProjection',
    name: 'Fruit'
  },
  sort: {
    name: 'ASC'
  },
  // useCache: true | false, when cache is enable then by default true, false otherwise
})
  .subscribe((product: Product) => {
    // some logic
  });
productHateoasService.searchResource('products', 'byName', {
  params: {
    projection: 'productProjection',
    name: 'Fruit'
  },
  sort: {
    name: 'ASC'
  },
  // useCache: true | false, when cache is enable then by default true, false otherwise
})
  .subscribe((product: Product) => {
    // some logic
  });

```

#### Search resource collection

This method uses for searching a collection of resources.
You don't need to specify `/search` part of the URL it will be added automatically

With `GetOption` you can pass `projection` param (see below).

Method signature:

````
searchCollection(searchQuery: string, options?: GetOption): Observable<ResourceCollection<T>>;
````

- `searchQuery` - additional part of the url that wll be follow after `/search/` resource url.
- `options` - you can pass additional options that will be applied to the request, more about `GetOption` see [here]().
- `return value` - collection of resources with type `T` 
- `throws error` when returned value is not [ResourceCollection]()

Example of usage ([given the presets]()):

```
// Will be perform GET request to the http://localhost:8080/api/v1/products/search/searchQuery 
productService.searchCollection('searchQuery')
    .subscribe((collection: ResourceCollection<Product>) => {
        const products: Array<Product> = collection.resources;
        // some logic
    }
productHateoasService.searchCollection('products', 'searchQuery')
    .subscribe((collection: ResourceCollection<Product>) => {
        const products: Array<Product> = collection.resources;
        // some logic
    }

// Will be perform GET request to the http://localhost:8080/api/v1/products/search/byName?name=Fruit&projection=productProjection&sort=name,ASC
productService.searchCollection('byName', {
  params: {
    name: 'Fruit'
    projection: 'productProjection',
  },
  sort: {
    name: 'ASC'
  },
  // useCache: true | false, when cache is enable then by default true, false otherwise
}).subscribe((collection: ResourceCollection<Product>) => {
    const products: Array<Product> = collection.resources;
    // some logic
});
productHateoasService.searchCollection('products', 'byName', {
  params: {
    name: 'Fruit'
    projection: 'productProjection',
  },
  sort: {
    name: 'ASC'
  },
  // useCache: true | false, when cache is enable then by default true, false otherwise
}).subscribe((collection: ResourceCollection<Product>) => {
    const products: Array<Product> = collection.resources;
    // some logic
});

```

#### Search resource page
This method uses for searching a paged collection of resources.
You don't need to specify `/search` part of the URL it will be added automatically

With `PagedGetOption` you can pass `projection` param (see below).

Method signature:

````
searchPage(searchQuery: string, options?: PagedGetOption): Observable<PagedResourceCollection<T>>;
````

- `searchQuery` - additional part of the url that wll be follow after `/search/` resource url.
- `options` - you can pass additional options that will be applied to the request, more about `PagedGetOption` see [here]()
- `return value` - [PagedResourceCollection]() paged collection of resources with type `T` 
- `throws error` when returned value is not [PagedResourceCollection]()

Example of usage ([given the presets]()):

```
// Will be perform GET request to the http://localhost:8080/api/v1/products/search/searchQuery?page=0&size=20
productService.searchPage('searchQuery')
    .subscribe((pagedCollection: PagedResourceCollection<Product>) => {
        const products: Array<Product> = pagedCollection.resources;
        // some logic
    }
productHateoasService.searchPage('products', 'searchQuery')
    .subscribe((pagedCollection: PagedResourceCollection<Product>) => {
        const products: Array<Product> = pagedCollection.resources;
        // some logic
    }

// Will be perform GET request to the http://localhost:8080/api/v1/products/search/byName?name=Fruit&projection=productProjection&page=1&size=30&sort=name,ASC
productService.searchPage('byName', {
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
  // useCache: true | false, when cache is enable then by default true, false otherwise
}).subscribe((pagedCollection: PagedResourceCollection<Product>) => {
    const products: Array<Product> = pagedCollection.resources;
    // some logic
});
productHateoasService.searchPage('products', 'byName', {
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
  // useCache: true | false, when cache is enable then by default true, false otherwise
}).subscribe((pagedCollection: PagedResourceCollection<Product>) => {
    const products: Array<Product> = pagedCollection.resources;
    // some logic
});

```

#### Custom query

This method uses to perform a custom HTTP requests for a resource.
For example, you can perform a count query use this method (see example below). 

Method signature:

````
customQuery<R>(method: HttpMethod, query: string, requestBody?: RequestBody<any>, options?: PagedGetOption): Observable<R>;
````

- `method` - HTTP request method (GET/POST/PUT/PATCH), 
- `query` - additional part of the url that wll be follow after root resource url.
- `requestBody` - it uses when `method` is `POST`, `PATCH`, `PUT` to pass request body. See more see about RequestBody [here]().
- `options` - you can pass additional options that will be applied to the request, more about `GetOption` see [here]()
- `return value` - generic type `<R>` define return query type. 

Example of usage ([given the presets]()):

```
// Will be perform GET request to the http://localhost:8080/api/v1/products/search/countAll
productService.customQuery<number>(HttpMethod.GET, '/search/countAllBy')
  .subscribe((count: number) => {
    // some logic        
  });
productHateoasService.customQuery<number>('products', HttpMethod.GET, '/search/countAllBy')
  .subscribe((count: number) => {
    // some logic        
  });
````

#### Custom search query
This method uses to perform a custom HTTP search requests for a resource.
For example, you can perform a count query use this method (see example below). 

Method signature:

````
customSearchQuery<R>(method: HttpMethod, searchQuery: string, requestBody?: RequestBody<any>, options?: PagedGetOption): Observable<R>;
````

- `method` - HTTP request method (GET/POST/PUT/PATCH), 
- `searchQuery` - additional part of the url that wll be follow after `/search/` resource url.
- `requestBody` - it uses when `method` is `POST`, `PATCH`, `PUT` to pass request body. See more see about RequestBody [here]().
- `options` - you can pass additional options that will be applied to the request, more about `GetOption` see [here]()
- `return value` - generic type `<R>` define return query type. 

Example of usage ([given the presets]()):

```
// Will be perform GET request to the http://localhost:8080/api/v1/products/search/countAll
productService.customSearchQuery<number>(HttpMethod.GET, '/countAllBy')
  .subscribe((count: number) => {
    // some logic        
  });
productHateoasService.customSearchQuery<number>('products', HttpMethod.GET, '/countAllBy')
  .subscribe((count: number) => {
    // some logic        
  });
````

### Resource types

There are several types of resources, main resource type is [Resource]() that represents server-side entity model class.
When server-side model has Embeddable entity then you need use [EmbeddedResource]() type instead [Resource]() type. 

Both [Resource]() and [EmbeddedResource]() have some the same methods therefore they have common parent [BaseResource]() class implements these methods. 

To work with resource collections provides [ResourceCollection]() type its holds array of the resources.
When you have paged resource collection result then you need to use extension of [ResourceCollection]() is [PagedResourceCollection]() that allow you to navigate by pages and perform custom page requests.
 
In some cases server-side can have entity inheritance model how work with entity subtypes, you can found [here]().

___
#### Presets for examples

Examples of usage resource relation methods rely on this presets.


- Server root url = http://localhost:8080/api/v1
- Resource classes are
  ```
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
  ```
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

___

#### BaseResource

Parent class for [Resource]() and [EmbeddedResource]() classes.

Contains common resource methods to work with resource relations through resource links (see below).

##### GetRelation
This method uses to get relation resource objects by relation name.
With `GetOption` you can pass `projection` param (see below).

Method signature:

````
getRelation<T extends BaseResource>(relationName: string, options?: GetOption): Observable<T>;
````

- `relationName` - resource relation name that should be used to get request URL.
- `options` - you can pass additional options that will be applied to the request, more about `GetOption` see [here]()
- `return value` - [Resource]() with type `T` 
- `throws error` - when required params are not valid or link not found by relation name or returned value is not [Resource]().

Example of usage ([given the presets]()):

```
// Will be perform GET request to the http://localhost:8080/api/v1/carts/1/shop
cart.getRelation<Shop>('shop')
  .subscribe((shop: Shop) => {
    // some logic        
  });

// Will be perform GET request to the http://localhost:8080/api/v1/carts/1/shop?projection=shopProjection&testParam=test&sort=name,ASC
cart.getRelation<Shop>('shop', {
  params: {
    testParam: 'test',
    projection: 'shopProjection'
  },
  sort: {
    name: 'ASC'
  },
  // useCache: true | false, when cache is enable then by default true, false otherwise
})
  .subscribe((shop: Shop) => {
    // some logic        
  });
````

##### GetRelatedCollection
This method uses to get related resource collection by relation name.
With `GetOption` you can pass `projection` param (see below).

Method signature:

````
getRelatedCollection<T extends ResourceCollection<BaseResource>>(relationName: string, options?: GetOption): Observable<T>;
````

- `relationName` - resource relation name that should be used to get request URL.
- `options` - you can pass additional options that will be applied to the request, more about `GetOption` see [here]()
- `return value` - [ResourceCollection]() collection of resources with type `T` 
- `throws error` - when required params are not valid or link not found by relation name or returned value is not [ResourceCollection]().

Example of usage ([given the presets]()):

```
// Will be perform GET request to the http://localhost:8080/api/v1/carts/1/products
cart.getRelatedCollection<ResourceCollection<Product>>('products')
  .subscribe((collection: ResourceCollection<Product>) => {
    const products: Array<Product> = collection.resources;
    // some logic        
  });

// Will be perform GET request to the http://localhost:8080/api/v1/carts/1/products?projection=productProjection&testParam=test&sort=name,ASC
cart.getRelatedCollection<ResourceCollection<Product>>('products', {
  params: {
    testParam: 'test',
    projection: 'productProjection'
  },
  sort: {
    name: 'ASC'
  },
  // useCache: true | false, when cache is enable then by default true, false otherwise
})
  .subscribe((collection: ResourceCollection<Product>) => {
    const products: Array<Product> = collection.resources;
    // some logic        
  });

````

##### GetRelatedPage
This method uses to get related resource collection by relation name.
With `PagedGetOption` you can pass `projection` param (see below).
>If you don't pass `pageParams` with `PagedGetOption` then will be used [default page options](). 

Method signature:

````
getRelatedPage<T extends PagedResourceCollection<BaseResource>>(relationName: string, options?: PagedGetOption): Observable<T>;
````

- `relationName` - resource relation name that should be used to get request URL.
- `options` - you can pass additional options that will be applied to the request, if not passed page params will be used [default page params](), more about `PagedGetOption` see [here]().
- `return value` - [PagedResourceCollection]() paged collection of resources with type `T` 
- `throws error` - when required params are not valid or link not found by relation name or returned value is not [PagedResourceCollection]().

Example of usage ([given the presets]()):

```
// Will be perform GET request to the http://localhost:8080/api/v1/carts/1/productPage?page=0&size=20
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

// Will be perform GET request to the http://localhost:8080/api/v1/carts/1/productPage?page=1&size=40&projection=productProjection&testParam=test&sort=name,ASC
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
  useCache
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
````

##### PostRelation
This method uses to perform POST request with request body by relation link URL.

Method signature:

````
postRelation(relationName: string, requestBody: RequestBody<any>, options?: RequestOption): Observable<HttpResponse<any> | any>;
````

- `relationName` - resource relation name that should be used to get request URL.
- `requestBody` - object that contains some request body and additional body options, more about `RequestBody` see [here]().
- `options` - you can pass additional options that will be applied to the request, more about `RequestOption` see [here]().
- `return value` - by default raw response data or Angular `HttpResponse` when `options` param has `observe: 'response'` value. 

Example of usage ([given the presets]()):

```
// Will be perform POST request to the http://localhost:8080/api/v1/cart/1/postExample
cart.postRelation('postExample', {
  // In this case null values in someBody will be ignored
  body: someBody
})
  .subscribe((rawResult: any) => {
     // some logic        
  });

// Will be perform POST request to the http://localhost:8080/api/v1/cart/1/postExample?testParam=test
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

##### PatchRelation
This method uses to perform PATCH request with request body by relation link URL.

Method signature:

````
patchRelation(relationName: string, requestBody: RequestBody<any>, options?: RequestOption): Observable<HttpResponse<any> | any>;
````

- `relationName` - resource relation name that should be used to get request URL.
- `requestBody` - object that contains some request body and additional body options, more about `RequestBody` see [here]().
- `options` - you can pass additional options that will be applied to the request, more about `RequestOption` see [here]().
- `return value` - by default raw response data or Angular `HttpResponse` when `options` param has `observe: 'response'` value. 

Example of usage ([given the presets]()):

```
// Will be perform PATCH request to the http://localhost:8080/api/v1/cart/1/patchExample
cart.patchRelation('patchExample', {
  // In this case null values in someBody will be ignored
  body: someBody
})
  .subscribe((rawResult: any) => {
     // some logic        
  });

// Will be perform PATCH request to the http://localhost:8080/api/v1/cart/1/patchExample?testParam=test
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

##### PutRelation
This method uses to perform PUT request with request body by relation link URL.

Method signature:

````
putRelation(relationName: string, requestBody: RequestBody<any>, options?: RequestOption): Observable<HttpResponse<any> | any>;
````

- `relationName` - resource relation name that should be used to get request URL.
- `requestBody` - object that contains some request body and additional body options, more about `RequestBody` see [here]().
- `options` - you can pass additional options that will be applied to the request, more about `RequestOption` see [here]().
- `return value` - by default raw response data or Angular `HttpResponse` when `options` param has `observe: 'response'` value. 

Example of usage ([given the presets]()):

```
// Will be perform PUT request to the http://localhost:8080/api/v1/cart/1/putExample
cart.putRelation('putExample', {
  // In this case null values in someBody will be ignored
  body: someBody
})
  .subscribe((rawResult: any) => {
     // some logic        
  });

// Will be perform PUT request to the http://localhost:8080/api/v1/cart/1/putExample?testParam=test
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

#### Resource

This is the main resource class. You need to extend model classes with this class to have the ability to use resource methods.

The difference between this type and [EmbeddedResource]() is resource class has a self link therefore it has an id property.
Usually, resource class is `@Entity` server-side classes and [EmbeddedResource]() is `@Embeddable` entities that have not an id properties.

Resource class extend [BaseResource]() with additional resource relations methods that can be used only with `resource type`.

##### IsResourceOf

This method uses when resource has sub-types, and you want to know what type current resource has.
You can read more about sub-types [here]().

>Each [Resource]() has private property is `resourceName` that calculated by the URL which resource was get.
Suppose to get `Cart` resource will be used the next URL: `http://localhost:8080/api/v1/carts/1`.
Then `Cart.resourceName` will be equals to `carts` because this part of the URL represents the resource name.

Method signature:

````
isResourceOf<T extends Resource>(typeOrName: (new () => T) | string): boolean
````
- `typeOrName` - can be as a resource type or the simple string that represent resource name.
                 If you pass resource type for example `someResource.isResourceOf(CartPayment)` then class name will be used to compare with the resource name (ignoring letter case).
                 If you pass resource name as a string then it will be used to compare with resource name with (ignoring letter case).
- `return value` - `true` when resource name equals passed value, `false` otherwise. 

Example of usage ([given the presets]()):

```
// Suppose was perform GET request to get the Cart resource by the url http://localhost:8080/api/v1/carts/1

cart.isResourceOf('carts'); // return TRUE
cart.isResourceOf('cart'); // return FALSE
cart.isResourceOf(Cart); // return FALSE because Cart class name = 'cart'

```

##### AddRelation

This method uses to add passed entities (they should exist) to the resource collection behind the relation name.

Method signature:

````
addRelation<T extends Resource>(relationName: string, entities: Array<T>): Observable<HttpResponse<any>>;
````

- `relationName` - resource relation name that should be used to get resource collection for add new entities.
- `entities` - an array of entities that should be added 
- `return value` - Angular `HttpResponse` with operation result.

Request URL is a relation link URL for passed relation name. As a request body, an array of entities' self-link will be used.

Example of usage ([given the presets]()):

```
/* 
 Will be perform POST request to the http://localhost:8080/api/v1/carts/1/products
 Content-type: 'text/uri-list'
 Body: [http://localhost:8080/api/v1/products/1, http://localhost:8080/api/v1/products/2]
*/
// Suppose product1 already exists and it has an id = 1
const product1 = ...;
// Suppose product2 already exists and it has an id = 2
const product2 = ...;

cart.addRelation('products', [product1, product2])
  .subscribe((result: HttpResponse<any>) => {
     // some logic            
  });
```

##### UpdateRelation

This method uses to update exist resource relation value.

Method signature:

````
updateRelation<T extends Resource>(relationName: string, entity: T): Observable<HttpResponse<any>>;
````

- `relationName` - resource relation name that should be used to get resource relation for value update.
- `entity` - new entity 
- `return value` - Angular `HttpResponse` with operation result.

Request URL is a relation link URL for passed relation name. 
As a request body passed entity self-link will be used.

Example of usage ([given the presets]()):

```
/* 
 Will be perform PATCH request to the http://localhost:8080/api/v1/carts/1/shop
 Content-type: 'text/uri-list'
 Body: http://localhost:8080/api/v1/shops/2
*/
// Suppose newShop already exists and it has an id = 2
const newShop = ...;
cart.updateRelation('shop', newShop)
  .subscribe((result: HttpResponse<any>) => {
     // some logic            
  });

```
##### BindRelation

This method uses to bind the passed entity to this resource for passed relation name.

Method signature:

````
bindRelation<T extends Resource>(relationName: string, entity: T): Observable<HttpResponse<any>>;
````

- `relationName` - resource relation name that should be used to get resource relation for bind an entity.
- `entity` - entity to bind
- `return value` - Angular `HttpResponse` with operation result.

Request URL is a relation link URL for passed relation name. 
As a request body passed entity self-link will be used.

Example of usage ([given the presets]()):

```
/* 
 Will be perform PUT request to the http://localhost:8080/api/v1/carts/1/shop
 Content-type: 'text/uri-list'
 Body: http://localhost:8080/api/v1/shops/1
*/
// Suppose shopToBind already exists and it has an id = 1
const shopToBind = ...;
cart.bindRelation('shop', shopToBind)
  .subscribe((result: HttpResponse<any>) => {
     // some logic            
  });

```

##### ClearCollectionRelation
This method uses to unbind all resources from resource collection behind resource name.

Method signature:

````
clearCollectionRelation<T extends Resource>(relationName: string): Observable<HttpResponse<any>>;
````

- `relationName` - resource relation name that should be used to get resource collection for unbind all entities.
- `return value` - Angular `HttpResponse` with operation result.

Request URL is a relation link URL for passed relation name. 

Example of usage ([given the presets]()):

```
/* 
 Will be perform PUT request to the http://localhost:8080/api/v1/carts/1/products
 Content-type: 'text/uri-list'
 Body: ''
*/
cart.clearCollectionRelation('products')
  .subscribe((result: HttpResponse<any>) => {
     // some logic            
  });

```

##### DeleteRelation
This method uses to unbind all resources from resource collection behind resource name.

Method signature:

````
deleteRelation<T extends Resource>(relationName: string, entity: T): Observable<HttpResponse<any>>;
````

- `relationName` - resource relation name that should be used to get resource relation for unbind an entity.
- `entity` - entity to delete
- `return value` - Angular `HttpResponse` with operation result.

Request URL is a relation link URL for passed relation name. 
As a request body passed entity self-link will be used.

Example of usage ([given the presets]()):

```
// Will be perform DELETE request to the http://localhost:8080/api/v1/carts/1/shop/1
// Suppose shopToDelete already exists and it has an id = 1
const shopToDelete = ...;
cart.deleteRelation('shop', shopToDelete)
  .subscribe((result: HttpResponse<any>) => {
     // some logic            
  });

```

#### EmbeddedResource
This resource type uses when a server-side entity is [@Embeddable](https://docs.jboss.org/hibernate/orm/5.0/userguide/html_single/chapters/domain/embeddables.html).
It means that this entity has not an id property and can't exist standalone.
Because embedded resources have not an id then it can use only [BaseResource]() methods.

#### ResourceCollection
This resource type represents collection of resources.
You can get this type as result [GetRelatedCollection](), [GetResourceCollection]() or perform [CustomQuery]()/[CustomSearchQuery]() with passed return type as ResourceCollection.

Resource collection holds resources in the public property with the name `resources`.

#### PagedResourceCollection
This resource type represents paged collection of resources.
You can get this type as result [GetRelatedPage](), [GetResourcePage]() or perform [CustomQuery]()/[CustomSearchQuery]() with passed return type as PagedResourceCollection.

PagedResourceCollection extends [ResourceCollection]() type and adds methods to work with a page.  

##### Default page values

In any page methods when you don't pass `page` or `size` params then will be used the next default values: `page = 0`, `size = 20`.

> When you already used custom value for `page` or `size` param then it will be used for the next page request if you don't pass it. 

##### HasFirst

Method checks that `PagedResourceCollection` has the link to get the first page result.

Method signature:

````
hasFirst(): boolean;
````

return `true` when the link to get the first page is exist, `false` otherwise.

##### HasLast

Method checks that `PagedResourceCollection` has the link to get the last page result.

Method signature:

````
hasLast(): boolean;
````

return `true` when the link to get the last page is exist, `false` otherwise.

##### HasNext

Method checks that `PagedResourceCollection` has the link to get the next page result.

Method signature:

````
hasNext(): boolean;
````

return `true` when the link to get the next page is exist, `false` otherwise.

##### HasPrev

Method checks that `PagedResourceCollection` has the link to get the previous page result.

Method signature:

````
hasPrev(): boolean;
````

return `true` when the link to get the previous page is exist, `false` otherwise.

##### First
This method performs a request to get the first-page result by the first-page link.

Method signature:

````
first(options?: {useCache: true;}): Observable<PagedResourceCollection<T>>;
````

- `options` - you can pass additional options that influence to use of cache when get result or not (by default will be used a cache)
- `return value` - [PagedResourceCollection]() paged collection of resources with type `T` 
- `throws error` - when a link to get the first-page result is not exist

Example of usage:

Suppose we have 3 pages with 20 resources per page. We are now on the page = 2 and want to get the first page of `product` resource.
In this case, the `first method` passes only page param = 0, for size param used previous value or [default value]() it depends on was passed size param before or not. 

```ts
// Will be perform GET request to the http://localhost:8080/api/v1/products?page=0&size=20
const pagedProductCollection = ...;
pagedProductCollection.first()
  .subscribe((firstPageResult: PagedResourceCollection<Product>) => {
     // firstPageResult can be fetched from a cache if before was performing the same request
     // some logic        
  });

// Will be perform GET request to the http://localhost:8080/api/v1/products?page=0&size=20
const pagedProductCollection = ...;
pagedProductCollection.first({useCache: false})
  .subscribe((firstPageResult: PagedResourceCollection<Product>) => {
     // firstPageResult always will be fetched from the server because we disable a cache for this request
     // some logic        
  });
```

##### Last
This method performs a request to get the last-page result by the last-page link.

Method signature:

````
last(options?: {useCache: true;}): Observable<PagedResourceCollection<T>>;
````

- `options` - you can pass additional options that influence to use of cache when get result or not (by default will be used a cache)
- `return value` - [PagedResourceCollection]() paged collection of resources with type `T` 
- `throws error` - when a link to get the last-page result is not exist

Example of usage:

Suppose we have 3 pages with 20 resources per page. We are now on the page = 0 and want to get the last page of `product` resource.
In this case, the `last method` passes only page param = 2, for size param used previous value or [default value]() it depends on was passed size param before or not. 

```ts
// Will be perform GET request to the http://localhost:8080/api/v1/products?page=2&size=20
const pagedProductCollection = ...;
pagedProductCollection.last()
  .subscribe((lastPageResult: PagedResourceCollection<Product>) => {
     // lastPageResult can be fetched from a cache if before was performing the same request
     // some logic        
  });

// Will be perform GET request to the http://localhost:8080/api/v1/products?page=2&size=20
const pagedProductCollection = ...;
pagedProductCollection.last({useCache: false})
  .subscribe((lastPageResult: PagedResourceCollection<Product>) => {
     // lastPageResult always will be fetched from the server because we disable a cache for this request
     // some logic        
  });
```

##### Next
This method performs a request to get the next-page result by the next-page link.

Method signature:

````
next(options?: {useCache: true;}): Observable<PagedResourceCollection<T>>;
````

- `options` - you can pass additional options that influence to use of cache when get result or not (by default will be used a cache)
- `return value` - [PagedResourceCollection]() paged collection of resources with type `T` 
- `throws error` - when a link to get the next-page result is not exist

Example of usage:

Suppose we have 3 pages with 20 resources per page. We are now on the page = 0 and want to get the next page of `product` resource.
In this case, the `next method` passes only page param = 1, for size param used previous value or [default value]() it depends on was passed size param before or not. 

```ts
// Will be perform GET request to the http://localhost:8080/api/v1/products?page=1&size=20
const pagedProductCollection = ...;
pagedProductCollection.next()
  .subscribe((nextPageResult: PagedResourceCollection<Product>) => {
     // nextPageResult can be fetched from a cache if before was performing the same request
     // some logic        
  });

// Will be perform GET request to the http://localhost:8080/api/v1/products?page=1&size=20
const pagedProductCollection = ...;
pagedProductCollection.next({useCache: false})
  .subscribe((nextPageResult: PagedResourceCollection<Product>) => {
     // nextPageResult always will be fetched from the server because we disable a cache for this request
     // some logic        
  });
```

##### Prev
This method performs a request to get the prev-page result by the prev-page link.

Method signature:

````
prev(options?: {useCache: true;}): Observable<PagedResourceCollection<T>>;
````

- `options` - you can pass additional options that influence to use of cache when get result or not (by default will be used a cache)
- `return value` - [PagedResourceCollection]() paged collection of resources with type `T` 
- `throws error` - when a link to get the prev-page result is not exist

Example of usage:

Suppose we have 3 pages with 20 resources per page. We are now on the page = 1 and want to get the prev page of `product` resource.
In this case, the `prev method` passes only page param = 1, for size param used previous value or [default value]() it depends on was passed size param before or not. 

```ts
// Will be perform GET request to the http://localhost:8080/api/v1/products?page=0&size=20
const pagedProductCollection = ...;
pagedProductCollection.prev()
  .subscribe((prevPageResult: PagedResourceCollection<Product>) => {
     // prevPageResult can be fetched from a cache if before was performing the same request
     // some logic        
  });

// Will be perform GET request to the http://localhost:8080/api/v1/products?page=0&size=20
const pagedProductCollection = ...;
pagedProductCollection.prev({useCache: false})
  .subscribe((prevPageResult: PagedResourceCollection<Product>) => {
     // prevPageResult always will be fetched from the server because we disable a cache for this request
     // some logic        
  });
```

##### Page
This method performs a request to get the page with passed page number and current page size.

>If you need with a page param pass custom size or sort params then use [customPage]() method.

Method signature:

````
page(pageNumber: number, options?: {useCache: true;}): Observable<PagedResourceCollection<T>>;
````

- `pageNumber` - number of the page to need to get
- `options` - you can pass additional options that influence to use of cache when get result or not (by default will be used a cache)
- `return value` - [PagedResourceCollection]() paged collection of resources with type `T` 
- `throws error` - when you pass page number great than total pages

Example of usage:

Suppose we have 5 pages with 20 resources per page. We are now on the page = 1 and want to get the page = 3 of `product` resource.
In this case, the `page method` passes only page param = 3, for size param used previous value or [default value]() it depends on was passed size param before or not. 

```ts
// Will be perform GET request to the http://localhost:8080/api/v1/products?page=3&size=20
const pagedProductCollection = ...;
pagedProductCollection.page(3)
  .subscribe((customPageResult: PagedResourceCollection<Product>) => {
     // customPageResult can be fetched from a cache if before was performing the same request
     // some logic        
  });

// Will be perform GET request to the http://localhost:8080/api/v1/products?page=3&size=20
const pagedProductCollection = ...;
pagedProductCollection.page(3, {useCache: false})
  .subscribe((customPageResult: PagedResourceCollection<Product>) => {
     // customPageResult always will be fetched from the server because we disable a cache for this request
     // some logic        
  });
```
##### Size
This method performs a request to get the page with passed page size and current page number.

>If you need with size param pass custom page or sort params then use [customPage]() method.

Method signature:

````
size(size: number, options?: {useCache: true;}): Observable<PagedResourceCollection<T>>;
````

- `size` - number of resources for current page
- `options` - you can pass additional options that influence to use of cache when get result or not (by default will be used a cache)
- `return value` - [PagedResourceCollection]() paged collection of resources with type `T` 
- `throws error` - when you pass page size greater than total count resources

Example of usage:

Suppose we have 5 pages with 20 resources per page. We are now on the page = 1, size = 20  and want to get more `product` resources for the current page for example 50.
In this case, the `size method` passes only size param = 50, for a page param used previous value or [default value]() it depends on was passed a page param before or not. 

```ts
// Will be perform GET request to the http://localhost:8080/api/v1/products?page=1&size=50
const pagedProductCollection = ...;
pagedProductCollection.size(50)
  .subscribe((customPageResult: PagedResourceCollection<Product>) => {
     // customPageResult can be fetched from a cache if before was performing the same request
     // some logic        
  });

// Will be perform GET request to the http://localhost:8080/api/v1/products?page=1&size=50
const pagedProductCollection = ...;
pagedProductCollection.size(50, {useCache: false})
  .subscribe((customPageResult: PagedResourceCollection<Product>) => {
     // customPageResult always will be fetched from the server because we disable a cache for this request
     // some logic        
  });
```

##### SortElements
This method allows sort current page result.

>If you need with sort param pass custom page or size params then use [customPage]() method.

Method signature:

````
sortElements(sortParam: Sort, options?: {useCache: true;}): Observable<PagedResourceCollection<T>>;
````

- `sortParam` - [sort]() params
- `options` - you can pass additional options that influence to use of cache when get result or not (by default will be used a cache)
- `return value` - [PagedResourceCollection]() paged collection of resources with type `T` 

Example of usage:

Suppose we have 5 pages with 20 resources per page. We are now on the page = 1, size = 20  and want to sort `product` resources for the current page.
In this case, the `sortElements method` passes the same size and page values and added sort params.

```ts
// Will be perform GET request to the http://localhost:8080/api/v1/products?page=1&size=20&sort=cost,ASC&sort=name,DESC
const pagedProductCollection = ...;
pagedProductCollection.sortElements({cost: 'ASC', name: 'DESC'})
  .subscribe((customPageResult: PagedResourceCollection<Product>) => {
     // customPageResult can be fetched from a cache if before was performing the same request
     // some logic        
  });

// Will be perform GET request to the http://localhost:8080/api/v1/products?page=1&size=20&sort=cost,ASC&sort=name,DESC
const pagedProductCollection = ...;
pagedProductCollection.sortElements({cost: 'ASC', name: 'DESC'}, {useCache: false})
  .subscribe((customPageResult: PagedResourceCollection<Product>) => {
     // customPageResult always will be fetched from the server because we disable a cache for this request
     // some logic        
  });
```

##### CustomPage
This method allows pass custom values for page, size, sort params.

Method signature:

````
customPage(params: SortedPageParam, options?: {useCache: true;}): Observable<PagedResourceCollection<T>>;
````

- `params` - contains page, sort, size params, more see [here]()
- `options` - you can pass additional options that influence to use of cache when get result or not (by default will be used a cache)
- `return value` - [PagedResourceCollection]() paged collection of resources with type `T` 
- `throws error` - when you pass page size, greater than total count resources or page number greater than total pages.

> When you pass only part of the `params` the [default page params]() will be used for not passed.

Example of usage:

Suppose we have 5 pages with 20 resources per page. We are now on the page = 1, size = 20. We want to get page = 2 with size = 30 and sort result by name.

```ts
// Will be perform GET request to the http://localhost:8080/api/v1/products?page=2&size=30&sort=name,ASC
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
     // customPageResult can be fetched from a cache if before was performing the same request
     // some logic      
  });

// Will be perform GET request to the http://localhost:8080/api/v1/products?page=2&size=30&sort=name,ASC
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
     // customPageResult always will be fetched from the server because we disable a cache for this request
     // some logic  
  });

```

#### Subtypes support

Library allows you work with entities hierarchy.
Suppose you have the next resources:

```
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

And their `hal-json` representation:
  
  ```
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
From example below you can note that the `Cart` resource has the `client` property with type `Client`.
In its turn `client` can have one of types `PhysicalClient` or `JuridicalClient`.
You can use [Resource.isResourceOf]() method to know what `client` resource type you got.

Example of usage ([given the presets]()):

```
// Suppose we have some cart resource and we want to get client relation and know what is the client type
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

### Library settings

This section describes library configuration params, and some library features that you can enable/disable when you need it.

#### Configuration

You can pass the next params to configure the library.

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
````
##### Http params

`rootUrl` (required) - defines root server URL that will be used to perform resource requests.
`proxyUrl` (optional) -  defines proxy URL that uses to change rootUrl to proxyUrl when getting a relation link.

##### Logging params

`verboseLogs` - to debug lib requests you can enable logging to the console. When logging is enabling then all resource request stages will be printed.

> See more about logging [here]().

##### Cache params

`enabled` - when passed `true` then will be use cache for `GET` requests, `false` by default.
`lifeTime` - by default cache lifetime is 300 000 seconds (=5 minutes) after which the cache will be expired.

> See more about caching [here]().

#### Cache
The library supports caching `GET` request response values.
By default, the cache disabled. 
To enable you need to pass `cache.enabled = true` with library configuration. Also, you can manage the cache expired time with `cache.lifeTime` param.

> More about the cache configuration see [here](). 

Methods with options types `GetOption` or `PagedGetOption` has additional param `useCache` that allows to manage the cache.
By default `useCache` has `true` value, but when the cache disabled then it param ignored.

##### How it works?
After performs `GET` request to get the resource or resource collection or paged resource collection response value will be put to the cache map.
The cache map key is `CacheKey` object that holds full request url and all request options.  
The cache map value is `raw hal-json` response.

When you perform the same `GET` request twice (to get resource or resource collection or paged resource collection). The first request hits the server to get the result, but  the second request doesn't hit the server and result got from the cache.
When you perform `POST`, `PATCH`, `PUT`, `DELETE` requests for some resource than all saved cache values for this resource will be evicted.

> You can know when resource result got from the server or got from the cache enable the library [verboseLogs]() param.
> See more about logging [here]().                                                                                                                      

#### Logging

You can use library logging to debug library.
To enable logging set `logs.verboseLogs` to `true` value see more [here]().

There are several logging stages:

- `BEGIN` - the first stage, logs when method invoked
- `CHECK_PARAMS` - on this stage logs input params validation errors
- `PREPARE_URL` - on this stage logs parts of generated request URL from `rootUrl`/`proxyUrl`, `resource name` and passed options
- `PREPARE_PARAMS` - on this stage logs applying default request params
- `INIT_RESOURCE` - logs when on initializing resource from a response errors occurs
- `RESOLVE_VALUES` - logs stage when resolve request body resource relations from resource object to resource link url.
- `CACHE_PUT` - logs a value saved to the cache
- `CACHE_GET` - logs a received value from the cache
- `CACHE_EVICT` - logs an evicted value from the cache
- `HTTP_REQUEST` - logs HTTP request params
- `HTTP_RESPONSE` - logs raw HTTP response data 
- `END` - the last stage, logs when method invoke was successful

With logging, you can find out was a value fetched from the cache or the server, how resource relationships resolved etc.

### Public classes

#### GetOption
#### GetPagedOption
#### RequestOption
#### RequestBody
#### Sort
#### SortedPageParam

### Library API

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
