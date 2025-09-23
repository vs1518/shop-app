import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

// ============================================================================
// PRODUCTS (picsum) — inchangé
// ============================================================================

interface MockProduct {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  rating: number;
  tags?: string[];
}

const PRODUCTS: MockProduct[] = [
  { id: 'p1', name: 'Sneakers Air',   price: 129, imageUrl: 'https://images.unsplash.com/photo-1602231379593-b85a472e3c99?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', rating: 4.5, tags: ['shoes','sport'] },
  { id: 'p2', name: 'Casque Sans Fil', price: 89,  imageUrl: 'https://plus.unsplash.com/premium_photo-1679913793289-d1ba3b9b0187?q=80&w=968&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', rating: 4.2, tags: ['audio'] },
  { id: 'p3', name: 'Sac à Dos Pro',   price: 159,  imageUrl: 'https://images.unsplash.com/photo-1736952323775-75714e0fdff5?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', rating: 4.0, tags: ['bag'] },
  { id: 'p4', name: 'Adidas Ultraboost',   price: 179, imageUrl: 'https://images.unsplash.com/photo-1613972798759-e677d3fb640f?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', rating: 4.5, tags: ['shoes','sport'] },
  { id: 'p5', name: 'New Balance 550 (White/Green)', price: 200,  imageUrl: 'https://images.unsplash.com/photo-1606890542452-aa022b9a15aa?q=80&w=928&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', rating: 4.4, tags: ['sport'] },
  { id: 'p6', name: 'Bose QuietComfort 45',   price: 450,  imageUrl: 'https://images.unsplash.com/photo-1705090212627-004b20f6a0fb?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', rating: 5.0, tags: ['earphones'] },
];

// ============================================================================
// CATEGORIES — PERSISTENCE localStorage
// ============================================================================

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const CATEGORIES_LS_KEY = 'mock.categories';

function loadCategories(): Category[] {
  try {
    const raw = localStorage.getItem(CATEGORIES_LS_KEY);
    return raw ? (JSON.parse(raw) as Category[]) : [];
  } catch {
    return [];
  }
}

function saveCategories(list: Category[]) {
  try {
    localStorage.setItem(CATEGORIES_LS_KEY, JSON.stringify(list));
  } catch {}
}

// charge depuis localStorage, puis seed si vide
let CATEGORIES: Category[] = loadCategories();
if (CATEGORIES.length === 0) {
  CATEGORIES = [
    { id: 'c1', name: 'Chaussures', slug: 'chaussures', description: 'Tout pour les pieds', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 'c2', name: 'Audio',      slug: 'audio',      description: 'Casques, écouteurs, etc.', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  ];
  saveCategories(CATEGORIES);
}

// ============================================================================
// HELPERS
// ============================================================================

function slugify(s: string) {
  return s.normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g,'-')
    .replace(/(^-|-$)/g,'');
}

// ============================================================================
// INTERCEPTOR
// ============================================================================

export const mockApiInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith('/api/')) return next(req);

  const respond = (body: unknown, status = 200, ms = 500) =>
    of(new HttpResponse({ status, body })).pipe(delay(ms));

  // ---------------- PRODUCTS ----------------

  // GET /api/products
  if (req.method === 'GET' && req.url === '/api/products') {
    return respond(PRODUCTS);
  }

  // GET /api/products/:id
  {
    const m = req.url.match(/^\/api\/products\/([^/]+)$/);
    if (req.method === 'GET' && m) {
      const prod = PRODUCTS.find(p => p.id === m[1]);
      return prod ? respond(prod) : respond({ message: 'Not found' }, 404);
    }
  }

  // ---------------- CATEGORIES --------------

  // GET /api/categories?query=... | /api/categories/:id | ?exists=name:Audio
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
      id: (globalThis.crypto as any)?.randomUUID?.() ?? String(Date.now()),
      name: body.name ?? '',
      slug: body.slug ? slugify(body.slug) : slugify(body.name ?? ''),
      description: body.description ?? '',
      isActive: !!body.isActive,
      createdAt: now,
      updatedAt: now
    };
    if (!cat.name) {
      return respond({ message: 'Name is required' }, 400);
    }
    if (CATEGORIES.some(c => c.name.toLowerCase() === cat.name.toLowerCase())) {
      return respond({ message: 'Category name must be unique' }, 400);
    }
    CATEGORIES = [cat, ...CATEGORIES];
    saveCategories(CATEGORIES);                 // ⬅️ PERSISTE
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
      if (updated) saveCategories(CATEGORIES);   // ⬅️ PERSISTE
      return updated ? respond(updated) : respond({ message: 'Not found' }, 404);
    }
  }

  // DELETE /api/categories/:id
  {
    const m = req.url.match(/^\/api\/categories\/([^/]+)$/);
    if (req.method === 'DELETE' && m) {
      const lenBefore = CATEGORIES.length;
      CATEGORIES = CATEGORIES.filter(c => c.id !== m[1]);
      const deleted = CATEGORIES.length < lenBefore;
      if (deleted) saveCategories(CATEGORIES);   // ⬅️ PERSISTE
      return respond({ deleted });
    }
  }

  // ---------------- ORDERS (persisté) ------

  interface OrderItem { productId: string; name: string; unitPrice: number; qty: number }
  interface Address   { line1: string; line2?: string; city: string; postalCode: string; country: string }
  interface Order {
    id: string; userId: string; email: string; phone?: string;
    items: OrderItem[]; total: number; address: Address;
    createdAt: string; status: 'paid' | 'pending' | 'cancelled';
  }

  const ORDERS_LS_KEY = 'mock.orders';

  function loadOrders(): Order[] {
    try {
      const raw = localStorage.getItem(ORDERS_LS_KEY);
      return raw ? (JSON.parse(raw) as Order[]) : [];
    } catch { return []; }
  }
  function saveOrders(list: Order[]) {
    try { localStorage.setItem(ORDERS_LS_KEY, JSON.stringify(list)); } catch {}
  }

  let ORDERS: Order[] = loadOrders();

  // GET /api/orders (admin)
  if (req.method === 'GET' && req.url === '/api/orders') {
    console.log('[mock-api] GET /api/orders ->', ORDERS.length);
    return respond(ORDERS, 200, 300);
  }

  // GET /api/orders/:id
  {
    const m2 = req.url.match(/^\/api\/orders\/([^/]+)$/);
    if (req.method === 'GET' && m2) {
      const ord = ORDERS.find(o => o.id === m2[1]);
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
    saveOrders(ORDERS);
    console.log('[mock-api] POST /api/orders -> saved id', id);
    return respond(order, 201, 400);
  }

  return respond({ message: 'Not found' }, 404);
};
