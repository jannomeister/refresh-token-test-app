import {
  HttpClient,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, filter, switchMap, take, tap } from 'rxjs/operators';

import { TokenService } from './token.service';

@Injectable()
export class HeaderInterceptorService implements HttpInterceptor {
  private refreshTokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(
    null
  );

  private isRefreshing = false;

  constructor(private tokenService: TokenService, private http: HttpClient) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let newHeaders = req.headers;
    newHeaders = newHeaders.append('Content-Type', 'application/json');

    if (!window.navigator.onLine) {
      window.alert('no internet connection');

      return next.handle(req);
    }

    if (this.tokenService.getToken()) {
      newHeaders = this.appendBearerToken(newHeaders);
    }

    const authReq = req.clone({ headers: newHeaders });
    const isLoggedIn = !!this.tokenService.getToken();

    if (!isLoggedIn) {
      return next.handle(authReq);
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error instanceof HttpErrorResponse && error.status === 403) {
          return throwError(error);
        } else if (error instanceof HttpErrorResponse && error.status === 401) {
          // this will catch the unauthorized code
          if (req.url === 'http://localhost:3000/api/user/token/refresh') {
            // logout if the reply of refresh token endpoint is unauthorized
            // means the refresh token is invalid and hence, user's session is expired
            return throwError(error);
          } else {
            return this.unauthorizedError(req, next);
          }
        } else {
          window.alert('unknown error');
          return throwError(error);
        }
      })
    );
  }

  appendBearerToken(headers: HttpHeaders): HttpHeaders {
    return headers.append(
      'Authorization',
      `Bearer ${this.tokenService.getToken()}`
    );
  }

  private unauthorizedError(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (this.isRefreshing) {
      return this.refreshTokenSubject.pipe(
        filter((token) => token !== null),
        take(1),
        switchMap((accessToken) => {
          const newReq = request.clone({
            setHeaders: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          return next.handle(newReq);
        })
      );
    }

    // Call the endpoint for refreshing the token
    // and attached it to the request's header
    // and request again
    this.isRefreshing = true;
    this.refreshTokenSubject.next(null);

    const url = 'http://localhost:3000/api/user/token/refresh';

    return this.http.post(url, {}, { withCredentials: true }).pipe(
      tap((newToken: { access_token: string }) => {
        this.tokenService.storeToken(newToken.access_token);
      }),
      switchMap((newToken: { access_token: string }) => {
        this.isRefreshing = false;
        this.refreshTokenSubject.next(newToken.access_token);

        this.tokenService.storeToken(newToken.access_token);

        const newReq = request.clone({
          setHeaders: {
            Authorization: `Bearer ${newToken.access_token}`,
          },
        });

        return next.handle(newReq);
      })
    );
  }
}
