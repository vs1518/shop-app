import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';   // ⬅️ depuis 'rxjs'
import { ErrorService } from '../services/error.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const errSvc = inject(ErrorService);
  return next(req).pipe(
    catchError((err: unknown) => {              // ⬅️ typé 'unknown' = propre en TS strict
      errSvc.handle(err);
      return throwError(() => err);
    })
  );
};
