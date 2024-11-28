import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { Cadastro } from '../../types/cadastro';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CadastroService {
  private apiUrl = `${environment.apiBaseUrl}register`;

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
