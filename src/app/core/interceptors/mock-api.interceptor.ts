import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

type MockProduct = { id: string; name: string; price: number; imageUrl: string; rating: number; tags?: string[] };

const PRODUCTS: MockProduct[] = [
  { id: 'p1', name: 'Sneakers Air',   price: 129, imageUrl: 'https://picsum.photos/seed/p1/600/600', rating: 4.5, tags: ['shoes','sport'] },
  { id: 'p2', name: 'Casque Sans Fil', price: 89,  imageUrl: 'https://picsum.photos/seed/p2/600/600', rating: 4.2, tags: ['audio'] },
  { id: 'p3', name: 'Sac à Dos Pro',   price: 59,  imageUrl: 'https://picsum.photos/seed/p3/600/600', rating: 4.0, tags: ['bag'] },
];

type Category = { id: string; name: string; slug: string; description?: string; isActive: boolean; createdAt: string; updatedAt: string; };

let CATEGORIES: Category[] = [
  { id: 'c1', name: 'Chaussures', slug: 'chaussures', description: 'Tout pour les pieds', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'c2', name: 'Audio',      slug: 'audio',      description: 'Casques, écouteurs, etc.', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

function slugify(s: string) {
  return s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
}


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

  // GET /api/categories?query=...
if (req.method === 'GET' && req.url.startsWith('/api/categories')) {
  const url = new URL('http://x' + req.url); // hack URL
  const idMatch = req.url.match(/^\/api\/categories\/([^/]+)$/);

  // Détail
  if (idMatch) {
    const cat = CATEGORIES.find(c => c.id === idMatch[1]);
    return cat ? respond(cat) : respond({ message: 'Not found' }, 404);
  }

  // Vérif d’unicité (ex: /api/categories?exists=name:Audio)
  const existsParam = url.searchParams.get('exists');
  if (existsParam?.startsWith('name:')) {
    const name = existsParam.slice(5).trim().toLowerCase();
    const exists = CATEGORIES.some(c => c.name.toLowerCase() === name);
    return respond({ exists });
  }

  // Liste filtrée
  const q = (url.searchParams.get('query') || '').toLowerCase();
  const list = !q ? CATEGORIES : CATEGORIES.filter(c =>
    c.name.toLowerCase().includes(q) ||
    c.slug.toLowerCase().includes(q) ||
    (c.description ?? '').toLowerCase().includes(q)
  );
  return respond(list);
}

// POST /api/categories
if (req.method === 'POST' && req.url === '/api/categories') {
  const body = req.body as Partial<Category>;
  const now = new Date().toISOString();
  const cat: Category = {
    id: crypto.randomUUID?.() ?? String(Date.now()),
    name: body.name ?? '',
    slug: body.slug ? slugify(body.slug) : slugify(body.name ?? ''),
    description: body.description ?? '',
    isActive: !!body.isActive,
    createdAt: now,
    updatedAt: now
  };
  if (CATEGORIES.some(c => c.name.toLowerCase() === cat.name.toLowerCase())) {
    return respond({ message: 'Category name must be unique' }, 400);
  }
  CATEGORIES = [cat, ...CATEGORIES];
  return respond(cat, 201);
}

// PUT /api/categories/:id
{
  const m = req.url.match(/^\/api\/categories\/([^/]+)$/);
  if (req.method === 'PUT' && m) {
    const body = req.body as Partial<Category>;
    let updated: Category | undefined;
    CATEGORIES = CATEGORIES.map(c => {
      if (c.id !== m[1]) return c;
      updated = {
        ...c,
        name: body.name ?? c.name,
        slug: body.slug ? slugify(body.slug) : c.slug,
        description: body.description ?? c.description,
        isActive: body.isActive ?? c.isActive,
        updatedAt: new Date().toISOString()
      };
      return updated;
    });
    return updated ? respond(updated) : respond({ message: 'Not found' }, 404);
  }
}

// DELETE /api/categories/:id
{
  const m = req.url.match(/^\/api\/categories\/([^/]+)$/);
  if (req.method === 'DELETE' && m) {
    const len = CATEGORIES.length;
    CATEGORIES = CATEGORIES.filter(c => c.id !== m[1]);
    return respond({ deleted: CATEGORIES.length < len });
  }
}

// --- ORDERS MOCK ---
type OrderItem = { productId: string; name: string; unitPrice: number; qty: number };
type Address   = { line1: string; line2?: string; city: string; postalCode: string; country: string };
type Order     = {
  id: string; userId: string; email: string; phone?: string;
  items: OrderItem[]; total: number; address: Address;
  createdAt: string; status: 'paid' | 'pending' | 'cancelled';
};

let ORDERS: Order[] = [];

// GET /api/orders (admin)
if (req.method === 'GET' && req.url === '/api/orders') {
  return respond(ORDERS, 300);
}

// GET /api/orders/:id
{
  const m = req.url.match(/^\/api\/orders\/([^/]+)$/);
  if (req.method === 'GET' && m) {
    const ord = ORDERS.find(o => o.id === m[1]);
    return ord ? respond(ord, 200, 250) : respond({ message: 'Not found' }, 404);
  }
}

// POST /api/orders
if (req.method === 'POST' && req.url === '/api/orders') {
  const body = req.body as Omit<Order, 'id' | 'createdAt' | 'status'>;
  if (!body || !Array.isArray(body.items) || body.items.length === 0) {
    return respond({ message: 'Cart is empty' }, 400);
  }
  const id = 'o' + (Date.now().toString(36));
  const order: Order = {
    id,
    userId: body.userId, email: body.email, phone: body.phone,
    items: body.items, total: body.total, address: body.address,
    createdAt: new Date().toISOString(), status: 'paid'
  };
  ORDERS = [order, ...ORDERS];
  return respond(order, 201, 500);
}


  return respond({ message: 'Not found' }, 404);
};
