import { TestBed } from '@angular/core/testing';

import { GitDataService } from './git-data.service';

describe('GitDataService', () => {
  let service: GitDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GitDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
