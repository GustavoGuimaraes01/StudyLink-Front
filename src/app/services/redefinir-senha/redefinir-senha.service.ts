import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RedefinirSenhaService {
  private apiUrl = `${environment.apiBaseUrl}password-reset`;

  constructor(private httpClient: HttpClient) { }

  solicitarRedefinicaoSenha(email: string): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}/request`, { email });
  }

  redefinirSenha(token: string, novaSenha: string): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}/reset?token=${token}`, { 
      newPassword: novaSenha 
    });
  }
}