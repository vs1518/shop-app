import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

type MockProduct = { id: string; name: string; price: number; imageUrl: string; rating: number; tags?: string[] };

const PRODUCTS: MockProduct[] = [
  { id: 'p1', name: 'Sneakers Air',   price: 129, imageUrl: 'https://picsum.photos/seed/p1/600/600', rating: 4.5, tags: ['shoes','sport'] },
  { id: 'p2', name: 'Casque Sans Fil', price: 89,  imageUrl: 'https://picsum.photos/seed/p2/600/600', rating: 4.2, tags: ['audio'] },
  { id: 'p3', name: 'Sac à Dos Pro',   price: 59,  imageUrl: 'https://picsum.photos/seed/p3/600/600', rating: 4.0, tags: ['bag'] },
];

export const mockApiInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith('/api/')) return next(req);

  const respond = (body: unknown, status = 200, ms = 500) =>
    of(new HttpResponse({ status, body })).pipe(delay(ms));

  // GET /api/products
  if (req.method === 'GET' && req.url === '/api/products') {
    return respond(PRODUCTS);
  }

  // GET /api/products/:id
  const m = req.url.match(/^\/api\/products\/([^/]+)$/);
  if (req.method === 'GET' && m) {
    const prod = PRODUCTS.find(p => p.id === m[1]);
    return prod ? respond(prod) : respond({ message: 'Not found' }, 404);
  }

  // POST /api/orders  (exemple)
  if (req.method === 'POST' && req.url === '/api/orders') {
    return respond({ id: Date.now(), status: 'ok' }, 201);
  }

  return respond({ message: 'Not found' }, 404);
};
