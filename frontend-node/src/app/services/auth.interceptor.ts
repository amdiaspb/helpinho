import { HttpInterceptorFn } from '@angular/common/http';
import { UserInfo } from './context.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const stringInfo = localStorage.getItem("userInfo");
  const userInfo = stringInfo ? JSON.parse(stringInfo) as UserInfo : null;

  const authToken = userInfo?.token;

  if (authToken) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authToken}`
      }
    });

    return next(authReq);
  }

  return next(req);
};
