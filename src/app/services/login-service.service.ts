import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { loginResponse } from '../components/types/LoginResponse.type';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginServiceService {
  apiUrl: string = "http://localhost:8084/auth/login"

  constructor(private httpClient: HttpClient ) { }

    login(email: string, senha: string){
      return this.httpClient.post<loginResponse>(this.apiUrl, {email, senha}).pipe(tap((value)=> {
        sessionStorage.setItem("auth-token",value.token)
        sessionStorage.setItem("nome_usuario",value.nome)
      }))
    }

  
}
