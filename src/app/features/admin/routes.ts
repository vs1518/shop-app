import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './components/admin-dashboard.component';
import { adminGuard } from '../auth/guards/admin.guard';
import { AdminOrdersComponent } from './components/admin-orders.component';

export const ADMIN_ROUTES: Routes = [
  { path: '',        title: 'Admin · Dashboard', canActivate: [adminGuard], component: AdminDashboardComponent },
  { path: 'orders',  title: 'Admin · Commandes', canActivate: [adminGuard], component: AdminOrdersComponent },
];
