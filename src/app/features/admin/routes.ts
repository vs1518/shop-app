import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './components/admin-dashboard.component';
import { adminGuard } from '../auth/guards/admin.guard';

export const ADMIN_ROUTES: Routes = [
  { path: '', canActivate: [adminGuard], component: AdminDashboardComponent }
];
