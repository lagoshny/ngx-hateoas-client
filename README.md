# NgxHateoasClient

## Changelog

## Вступление..

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



### Lib API

#### Resource

#### EmbeddedResource

#### PagedResourceCollection

#### HateoasResourceOperation

#### HateoasResourceService

#### Subtype support
