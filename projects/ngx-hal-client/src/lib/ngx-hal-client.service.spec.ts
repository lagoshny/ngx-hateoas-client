import { TestBed } from '@angular/core/testing';

import { NgxHalClientService } from './ngx-hal-client.service';

describe('NgxHalClientService', () => {
  let service: NgxHalClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxHalClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
