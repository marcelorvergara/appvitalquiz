import {
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpParams,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable, exhaustMap, take } from 'rxjs';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return this.authService.user.pipe(
      take(1),
      exhaustMap((user) => {
        if (user?.token) {
          const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + user?.token,
          });
          // const modifiedReq = req.clone({
          //   params: new HttpParams().set('auth', user?.token),
          // });
          const modifiedReq = req.clone({
            headers: headers,
          });
          return next.handle(modifiedReq);
        }
        return next.handle(req);
      })
    );
  }
}
