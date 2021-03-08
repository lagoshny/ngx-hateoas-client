import { ResourceCollection } from './resource-collection';
import { EmbeddedResource } from './embedded-resource';
import { Resource } from './resource';
import { HateoasEmbeddedResource, HateoasProjection, HateoasResource, ProjectionRel } from '../decorators';
import { ProjectionRelType } from '../declarations';

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

@HateoasEmbeddedResource(['embedResTest'])
export class RawEmbeddedResource extends EmbeddedResource {
}

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

@HateoasResource('resource')
export class RawResource extends Resource {
}

@HateoasResource('test')
export class SimpleResource extends Resource {

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

@HateoasProjection(SimpleResource, 'simpleProjection')
export class SimpleResourceProjection extends Resource {
  @ProjectionRel(RawResource)
  public rawResource: ProjectionRelType<RawResource>;

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

@HateoasEmbeddedResource(['anotherResource'])
export class SimpleEmbeddedResource extends EmbeddedResource {

  // tslint:disable-next-line:variable-name
  _links = {
    anotherResource: {
      href: 'http://localhost:8080/api/v1/anotherResource/1'
    }
  };

}

export const rawResourceCollection = {
  _embedded: {
    tests: [
      {
        text: 'hello world',
        _links: {
          self: {
            href: 'http://localhost:8080/api/v1/test/1'
          }
        }
      },
      {
        text: 'Second object',
        _links: {
          self: {
            href: 'http://localhost:8080/api/v1/test/2'
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

export class SimpleResourceCollection extends ResourceCollection<SimpleResource> {

  resources = [new SimpleResource()];

  // tslint:disable-next-line:variable-name
  _links = {
    self: {
      href: 'http://localhost:8080/api/v1/resourceCollection/1'
    }
  };

}

export const rawPagedResourceCollection = {
  _embedded: {
    tests: [
      {
        text: 'hello world',
        _links: {
          self: {
            href: 'http://localhost:8080/api/v1/test/1'
          }
        }
      },
      {
        text: 'Second object',
        _links: {
          self: {
            href: 'http://localhost:8080/api/v1/test/2'
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

export class SimplePagedResourceCollection extends SimpleResourceCollection {

  resources = [new SimpleResource()];

  // tslint:disable-next-line:variable-name
  _links = {
    self: {
      href: 'http://localhost:8080/api/v1/pagedResourceCollection'
    },
    first: {
      href: 'http://localhost:8080/api/v1/pagedResourceCollection?page=0&size=1'
    },
    next: {
      href: 'http://localhost:8080/api/v1/pagedResourceCollection?page=1&size=1'
    },
    prev: {
      href: 'http://localhost:8080/api/v1/pagedResourceCollection?page=0&size=1'
    },
    last: {
      href: 'http://localhost:8080/api/v1/pagedResourceCollection?page=1&size=1'
    }
  };

  page: {
    totalElements: 100,
    number: 2,
    size: 10,
    totalPages: 10
  };

}
