import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../features/auth/services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const user = auth.current();
  if (user) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${btoa(`${user.id}:${user.email}`)}`,
      },
    });
  }
  return next(req);
};
