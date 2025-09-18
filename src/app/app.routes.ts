import { Routes } from '@angular/router';


export const routes: Routes = [
  { path: '', redirectTo: 'catalog', pathMatch: 'full' },
  {
    path: 'catalog',
    loadChildren: () => import('./features/catalog/routes').then(m => m.CATALOG_ROUTES)
  },
  {
    path: 'cart',
    loadChildren: () => import('./features/cart/routes').then(m => m.CART_ROUTES)
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/routes').then(m => m.ADMIN_ROUTES)
  },
  
  {
    path: 'categories',
  loadChildren: () => import('./features/categories/routes').then(m => m.CATEGORIES_ROUTES)
  },
  {
  path: 'checkout',
  loadChildren: () => import('./features/orders/routes').then(m => m.ORDERS_ROUTES)
},

  ];
