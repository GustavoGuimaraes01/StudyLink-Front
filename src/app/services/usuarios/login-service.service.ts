import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { loginResponse } from '../../types/loginResponse.type';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class LoginServiceService {
  private apiUrl = `${environment.apiBaseUrl}login`;
  
  constructor(private httpClient: HttpClient) { }

  getHeaders(): { [header: string]: string } {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sessionStorage.getItem('auth-token')}`,
    };
  }

  login(email: string, senha: string) {
    return this.httpClient.post<loginResponse>(this.apiUrl, { email, senha }).pipe(
      tap((value) => {
        sessionStorage.setItem("auth-token", value.token);
        sessionStorage.setItem("email", value.email);
        sessionStorage.setItem("nome_usuario", value.nome_usuario);
        
      })
    );
  }

  setCookie(name: string, value: string, days: number): void {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000)); 
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value};${expires};path=/`;
  }

  atualizarImagemPerfil(base64Image: string): Observable<string> {
    const url = `${this.apiUrl}/usuarios/imagem-perfil`;
    return this.httpClient.put<string>(url, base64Image, { headers: this.getHeaders() });
  }
  
}
