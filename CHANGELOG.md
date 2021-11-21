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
