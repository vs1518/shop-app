import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CategoryService } from './category.service';
import { Category } from '../models/category.model';

describe('CategoryService', () => {
  let svc: CategoryService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    svc = TestBed.inject(CategoryService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('should loadAll', async () => {
    const promise = svc.loadAll();
    const req = http.expectOne('/api/categories');
    expect(req.request.method).toBe('GET');
    req.flush([{ id: 'c1', name: 'A', slug: 'a', isActive: true, createdAt: '', updatedAt: '' } as Category]);
    await promise;
    expect(svc.items().length).toBe(1);
  });
});
