## 2.3.10 (2022-03-21)
#### Changes
Fixed typo in [issue-44](https://github.com/lagoshny/ngx-hateoas-client/issues/44).

## 2.3.9 (2022-03-20)
#### Changes
Fixed [issue](https://github.com/lagoshny/ngx-hateoas-client/issues/43).
Fixed [issue](https://github.com/lagoshny/ngx-hateoas-client/issues/44).

## 2.3.8 (2022-03-08)
#### Changes
Fixed reopened [issue](https://github.com/lagoshny/ngx-hateoas-client/issues/40).
Deleted unnecessary `customPage` validations.

## 2.3.7 (2022-03-04)
#### Changes
Fixed [issue](https://github.com/lagoshny/ngx-hateoas-client/issues/40).

## 2.3.6 (2022-02-18)
#### Changes
Fixed [issue](https://github.com/lagoshny/ngx-hateoas-client/issues/37).

## 2.3.5 (2022-02-01)
#### Changes
Fixed [issue](https://github.com/lagoshny/ngx-hateoas-client/issues/28).
Added initialization `NgxHateoasClientConfigurationService` to root module constructor that allows using `NgxHateoasClientModule.forRoot()` in test classes.

Added [testing documentation](https://github.com/lagoshny/ngx-hateoas-client#Testing).

## 2.3.4 (2022-01-25)
#### Changes
Fixed [issue](https://github.com/lagoshny/ngx-hateoas-client/issues/26).

## 2.3.3 (2021-12-23)
#### Updated angular
Updated Angular to 12 version.

This is the last Angular version for `View Engine` compilation.
Due this the library will have two versions:

- That support `View Engine` compilation: `[2.0.0 - 2.x.x]`
- That support `Ivy` compilation: `[3.0.0 - х.x.x]`

If you have `Ivy compilation` or `Angular 13` use the [latest](https://github.com/lagoshny/ngx-hateoas-client) lib version.

## 2.2.1 (2021-12-05)
#### Changes
Resolved [issue](https://github.com/lagoshny/ngx-hateoas-client/issues/21).

- `RequestOption` changes:

   Added new params to [RequestOption](https://github.com/lagoshny/ngx-hateoas-client#requestoption):
   ````
   headers?: HttpHeaders | {[header: string]: string | string[];};
   reportProgress?: boolean;
   withCredentials?: boolean;
   ````

   >Now `RequestOption` is base options for all resource requests. It is contains all usefully params from Angular `HttpClient`.


- `GetOption` changes:

   Now `GetOption` extends `RequestOption` that means you can pass `RequestOption` params within `GetOption`.


- `HateoasResourceService` changes:

   To `createResource` added optional param: `options?: RequestOption` 
   
   To `updateResource` added optional param: `options?: RequestOption` 
   
   To `updateResourceById` added optional param: `options?: RequestOption` 
   
   To `patchResource` added optional param: `options?: RequestOption` 
   
   To `patchResourceById` added optional param: `options?: RequestOption`


## 2.1.1 (2021-11-29)
#### Changes
Added `hasRelation()` function to `Resource` class to check has or not resource some link.

For more information [see pull request](https://github.com/lagoshny/ngx-hateoas-client/pull/20).

## 2.1.0 (2021-11-21)
#### Changes
Changed determination resource type algorithm.

Now:

`ResourceCollection` can contain only two props `_embedded` and `_links`.

`PagedResourceCollection` can contain  three props `_embedded`, `_links`, and `page`.

`Resource` can contain additional `_embedded` property.

## 2.0.0 (2021-09-29)
#### Changes
Release 2.0.0 version

## 2.0.3-beta (2021-05-19)
#### Changes
Updated peer dependencies

## 2.0.0-beta (2021-03-09)
#### Changes

- Changed system that creates resource class from the server-side response. Before was used the standard `Resource` or `EmbeddedResource` classes respectively, now used concrete resource type class.
- Changed subtype support see new subtype system more [here](https://github.com/lagoshny/ngx-hateoas-client#Subtypes-support).
- Added [@HateoasResource](https://github.com/lagoshny/ngx-hateoas-client#hateoasresource), [@HateoasEmbeddedResource](https://github.com/lagoshny/ngx-hateoas-client#hateoasembeddedresource), [@HateoasProjection](https://github.com/lagoshny/ngx-hateoas-client#hateoasprojection), [@ProjectionRel](https://github.com/lagoshny/ngx-hateoas-client#projectionrel) decorators.
- Added new resource projection support. See more about it [here](https://github.com/lagoshny/ngx-hateoas-client#resource-projection-support).
- Deleted `Resource.isResourceOf` method, now you can use standard `instanceof` statement.
- `HateoasResourceService` changed the first param from `resourceName` to `resourceType`.
- `HateoasResourceOperation` constructor param changed from `resourceName` to `resourceType`.
- Added `warn` logging level.
- Documentation and migration-guide changed.

## 1.1.1 (2021-02-21)
#### Refactoring

- `bindRelation` now accepts entity and an array of entities
- `clearCollectionRelation` renamed to `unbindCollectionRelation`
  
README.md was updated.

## 1.1.0 (2021-02-21)
#### Updated Resource methods 

Deleted `Resource` methods:
- `updateResource`

Changed `Resource` methods:
- `addRelation` was renamed to `addCollectionRelation`
- `bindRelation` changed signature method now it accepts an array of entities instead single entity.

Added `Resource` methods:
- `unbindResource` a new method that used with single resource relations to delete bound relations.

README.md was updated.

## 1.0.1 (2021-02-09)
#### Updated angular
Updated Angular to 11 version.
