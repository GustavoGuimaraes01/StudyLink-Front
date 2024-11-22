import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authToken = sessionStorage.getItem('auth-token');
    console.log('Interceptando requisição para:', request.url);
    console.log('Token encontrado:', authToken);

    if (authToken) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('Headers após clone:', request.headers.keys());
    }

    return next.handle(request).pipe(
      tap({
        next: (event) => {
          if (event instanceof HttpResponse) {
            console.log('Resposta recebida:', event.status);
          }
        },
        error: (error) => {
          console.error('Erro na requisição:', error);
          if (error.status === 403) {
            console.error('Erro de autorização - verifique se o token é válido');
          }
        }
      })
    );
  }
}