import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { loginResponse } from '../../types/loginResponse.type';
import { tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginServiceService {
  private apiUrl = `${environment.apiBaseUrl}login`;

  constructor(private httpClient: HttpClient ) { }

  login(email: string, senha: string) {
    return this.httpClient.post<loginResponse>(this.apiUrl, { email, senha }).pipe(
      tap((value) => {
        console.log(value)
        sessionStorage.setItem("auth-token", value.token);
        sessionStorage.setItem("email", value.email);
        sessionStorage.setItem("nome_usuario", value.nome_usuario);

      })
    );
  }
  

  
}
