1) Change rootUrl to baseApiUrl
2) Delete proxyUrl
3) Delete ExternalConfigService
4) Add ato app module constructor with HalConfigurationService and invoke configure method with params
5) Changed HalParam and LinkParam deleted
6) Added logging verbose
7) Delete REST Service Type param and extend HalOperationService
8) Added standalone HalResourceService
9) Deleted page methods page, size, sort use customPage within
10) Deleted getProjectionArray / getProjection methods from Resource class
11) Deleted updateRelation / substituteRelation from Resource method it doesn't meet documentation
12) Change patch with Array<ResourceOptions> | Include to simple ResourceOptions

13) Change search signature (changed HalOption to RequestParam)
14) New customQuery method with support http method
16) Deleted getByRelationArray, getByRelation, getBySelfLink use getRelatedCollection, getRelation instead from Resource

17) Deleted totalElement, totalPages, hasFirst, hasNext, hasPrev, hasLast, next, prev, first, last, page methods from OldRestService use the analogs from PagedResourceCollection
18) Deleted getProjectionArray, getProjection from Resource, use getProjection, getProjectionCollection from HalResourceOperation

19) Deleted subTypes param, resourсe type holds in new property (resourceName) use isResourceOf method from Resource to recognize desired subtype
20) Deleted getProjectionArray / getProjection from OldRestService use HalOption param, projection instead
21) Changed body from anu type to RequestBody
22) OldRestService patch -> patchResource, post -> postResource, put -> putResource, delete -> deleteResource
23) Changed update/patch resource through service params
24) Deleted count query use customQuery or customSearchQuery
25) RestServie get -> getResource, getAll -> getCollection, getAllPage -> getPage

23) Changed update/patch resource through service method signature



Проверить
1) Правильность возвращаемых параметров и что будет если вернтся левый параметр
2) Subtypes
3) Paged методы
