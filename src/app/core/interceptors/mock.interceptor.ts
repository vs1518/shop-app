import { HttpInterceptorFn } from '@angular/common/http';

export const mockInterceptor: HttpInterceptorFn = (req, next) => {
  
  return next(req);
};
