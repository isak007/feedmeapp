import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './login/service/auth.service';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {
  private baseURL = "http://localhost:8080/api/v1";

  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    console.log('Request Interceptor', request);

    const token = localStorage.getItem('TOKEN');
    const isLoggedIn = this.authService.isLoggedIn() && token;
    const isApiUrl = request.url.startsWith(this.baseURL);
    if (isLoggedIn && isApiUrl) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(request);
  }
}
