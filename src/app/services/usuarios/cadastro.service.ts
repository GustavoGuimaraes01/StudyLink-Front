import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { Cadastro } from '../../components/types/cadastro';

@Injectable({
  providedIn: 'root'
})
export class CadastroService {
  apiUrl: string = "http://localhost:8084/auth/register"; 

  constructor(private httpClient: HttpClient) { }

  register(nome_usuario: string, email: string, senha: string) {
    const userRegister: Cadastro = { nome_usuario, email, senha }; 
    return this.httpClient.post(this.apiUrl, userRegister).pipe(
      tap(response => {
        console.log(response);
      })
    );
  }
}
