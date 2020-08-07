import { BaseResource } from './base-resource';
import { CollectionResource } from './collection-resource';
import { EmbeddedResource } from './embedded-resource';

export const rawEmbeddedResource = {
  name: 'Test',
  _links: {
    resource: {
      href: 'http://localhost:8080/api/v1/resource/1'
    },
    anotherResource: {
      href: 'http://localhost:8080/api/v1/anotherResource/1'
    }
  }
};

export const rawResource = {
  name: 'Test',
  _links: {
    self: {
      href: 'http://localhost:8080/api/v1/resource/1'
    },
    resource: {
      href: 'http://localhost:8080/api/v1/resource/1'
    },
    anotherResource: {
      href: 'http://localhost:8080/api/v1/anotherResource/1'
    }
  }
};

export class SimpleResource extends BaseResource {

  // tslint:disable-next-line:variable-name
  _links = {
    self: {
      href: 'http://localhost:8080/api/v1/test/1'
    },
    test: {
      href: 'http://localhost:8080/api/v1/test/1'
    }
  };

}

export class SimpleEmbeddedResource extends EmbeddedResource {

  // tslint:disable-next-line:variable-name
  _links = {
    anotherResource: {
      href: 'http://localhost:8080/api/v1/anotherResource/1'
    }
  };

}

export const rawCollectionResource = {
  _embedded: {
    tests: [
      {
        text: 'hello world',
        _links: {
          self: {
            href: 'http://localhost:8080/api/v1/test'
          }
        }
      }
    ]
  },
  _links: {
    self: {
      href: 'http://localhost:8080/api/v1/collection'
    }
  }
};

export class SimpleCollectionResource extends CollectionResource<SimpleResource> {

  resources = [new SimpleResource()];

  // tslint:disable-next-line:variable-name
  _links = {
    self: {
      href: 'http://localhost:8080/api/v1/collectionResource/1'
    }
  };

}

export const rawPagedCollectionResource = {
  _embedded: {
    tests: [
      {
        text: 'hello world',
        _links: {
          self: {
            href: 'http://localhost:8080/api/v1/test'
          }
        }
      }
    ]
  },
  page: {
    totalElements: 100,
    number: 2,
    size: 10,
    totalPages: 10
  },
  _links: {
    self: {
      href: 'http://localhost:8080/api/v1/pagedCollection'
    },
    first: {
      href: 'http://localhost:8080/api/v1/pagedCollection?page=0&size=1'
    },
    next: {
      href: 'http://localhost:8080/api/v1/pagedCollection?page=1&size=1'
    },
    prev: {
      href: 'http://localhost:8080/api/v1/pagedCollection?page=0&size=1'
    },
    last: {
      href: 'http://localhost:8080/api/v1/pagedCollection?page=1&size=1'
    }
  }
};

export class SimplePagedCollectionResource extends SimpleCollectionResource {

  resources = [new SimpleResource()];

  // tslint:disable-next-line:variable-name
  _links = {
    self: {
      href: 'http://localhost:8080/api/v1/pagedCollectionResource'
    },
    first: {
      href: 'http://localhost:8080/api/v1/pagedCollectionResource?page=0&size=1'
    },
    next: {
      href: 'http://localhost:8080/api/v1/pagedCollectionResource?page=1&size=1'
    },
    prev: {
      href: 'http://localhost:8080/api/v1/pagedCollectionResource?page=0&size=1'
    },
    last: {
      href: 'http://localhost:8080/api/v1/pagedCollectionResource?page=1&size=1'
    }
  };

  page: {
    totalElements: 100,
    number: 2,
    size: 10,
    totalPages: 10
  };

}
