## 3.2.0 (2022-06-24)
#### Changes
- Realized feature from [issue-57](https://github.com/lagoshny/ngx-hateoas-client/issues/57).
  >Now you can use different URLs to retrieve resources by configuring several routes. Read more about it in [documentation](https://github.com/lagoshny/ngx-hateoas-client#using-multiple-urls-to-retrieve-resources).

## 3.1.2 (2022-06-23)
#### Changes
- Fixed [issue-58](https://github.com/lagoshny/ngx-hateoas-client/issues/58).
- Added new lib dependency on [date-fns](https://date-fns.org) lib. It allows parsing Dates with formats.
- Added new config option that allow to specify Date format.
  This date format will be used to parse `Resource JSON` property with `Date` value as `Date` type object instead of simple string.
  >Read more about this option in [documentation](https://github.com/lagoshny/ngx-hateoas-client#typesformat)

## 3.1.1 (2022-06-21)
#### Changes
- Fixed [issue-55](https://github.com/lagoshny/ngx-hateoas-client/issues/55).
Now resource's fields with `Date` type will be as `Date` objects (before was as `string`).

## 3.1.0 (2022-04-10)
#### Changes
- Fixed [issue-49](https://github.com/lagoshny/ngx-hateoas-client/issues/49).
- Changed the lib services registration to provide service as singletons with Angular tree-shaking.
- Updated README.md [Configuration section](https://github.com/lagoshny/ngx-hateoas-client#Configuration).

## 3.0.11 (2022-03-31)
#### Changes
Fixed [issue-45](https://github.com/lagoshny/ngx-hateoas-client/issues/45).

## 3.0.10 (2022-03-21)
#### Changes
Fixed typo in [issue-44](https://github.com/lagoshny/ngx-hateoas-client/issues/44).

## 3.0.9 (2022-03-20)
#### Changes
Fixed [issue](https://github.com/lagoshny/ngx-hateoas-client/issues/43).
Fixed [issue](https://github.com/lagoshny/ngx-hateoas-client/issues/44).

## 3.0.8 (2022-03-08)
#### Changes
Fixed reopened [issue](https://github.com/lagoshny/ngx-hateoas-client/issues/40).
Deleted unnecessary `customPage` validations.

## 3.0.7 (2022-03-04)
#### Changes
Fixed [issue](https://github.com/lagoshny/ngx-hateoas-client/issues/40).

## 3.0.6 (2022-02-18)
#### Changes
Fixed [issue](https://github.com/lagoshny/ngx-hateoas-client/issues/37).

## 3.0.5 (2022-02-01)
#### Changes
Fixed [issue](https://github.com/lagoshny/ngx-hateoas-client/issues/28). 
Added initialization `NgxHateoasClientConfigurationService` to root module constructor that allows using `NgxHateoasClientModule.forRoot()` in test classes.

Added [testing documentation](https://github.com/lagoshny/ngx-hateoas-client#Testing).

## 3.0.4 (2022-01-25)
#### Changes
Fixed [issue](https://github.com/lagoshny/ngx-hateoas-client/issues/26).

## 3.0.3 (2021-12-23)
#### Updated angular
Updated to Angular 13.

### ⚠ Breaking changes
>This version supports only from Angular 12 and above that uses `Ivy compilation`.
>
>Angular 13 package tools are [no longer support](https://github.com/ng-packagr/ng-packagr/blob/master/CHANGELOG.md#1300-2021-11-03) old `View Engine` compilation.
Now it uses only `Ivy` compilation. 

Now the `lib` have 2 versions for `Angular 6-11` [2.x.x](https://github.com/lagoshny/ngx-hateoas-client/tree/ng-ve) and `Angular 12-13+` [3.x.x](https://github.com/lagoshny/ngx-hateoas-client) that difference between that one is support old `View Engine` compilation, another uses only new `Ivy` compilation.

### Versions that support old `View Engine` compilation will place on [ng-ve](https://github.com/lagoshny/ngx-hateoas-client/tree/ng-ve) branch of the repo.

>I strongly recommend migrating to Angular Ivy compilation and use new lib version, because support two versions is not simple and in future old versions can not be supported.


## 2.3.0 (2021-12-23)
#### Updated angular
Updated Angular to 12 version.

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
