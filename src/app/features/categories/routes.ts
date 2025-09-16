import { Routes } from '@angular/router';
import { CategoryListComponent } from './components/category-list.component';
import { CategoryFormComponent } from './components/category-form.component';
import { adminGuard } from '../auth/guards/admin.guard';

export const CATEGORIES_ROUTES: Routes = [
  { path: '',    canActivate: [adminGuard], component: CategoryListComponent },
  { path: 'new', canActivate: [adminGuard], component: CategoryFormComponent },
  { path: ':id', canActivate: [adminGuard], component: CategoryFormComponent },
];
