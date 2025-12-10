import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Get token from auth service
    const token = this.authService.getToken();

    // Clone request and add authorization header if token exists
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });

      if (environment.enableLogging) {
        console.log('HTTP Request:', request.method, request.url);
      }
    }

    // Handle the request and catch errors
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (environment.enableLogging) {
          console.error('HTTP Error:', error);
        }

        if (error.status === 401 || error.status === 403) {
          // Token expired or invalid, logout user
          if (environment.enableLogging) {
            console.log('Authentication error, logging out user');
          }
          this.authService.logout();
        }

        return throwError(() => error);
      })
    );
  }
}
