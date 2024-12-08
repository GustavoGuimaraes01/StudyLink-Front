import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface AnotacaoConteudoDTO {
  id?: number;
  conteudo: string;
  anotacaoId: number; 
}

@Injectable({
  providedIn: 'root'
})
export class RichTextService {
  private apiUrl = `${environment.apiBaseUrl}arquivo`;

  constructor(private http: HttpClient) {}

  // Método para obter os cabeçalhos com o token
  private getHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('auth-token');
    if (!token) {
      throw new Error('Token não encontrado no sessionStorage');
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Método para lidar com erros
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ocorreu um erro ao processar a requisição.';
    if (error.error instanceof ErrorEvent) {
      // Erro no lado do cliente
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      // Erro no lado do servidor
      errorMessage = `Código: ${error.status}, Mensagem: ${error.message}`;
    }
    console.error('Erro detalhado:', error);
    return throwError(() => new Error(errorMessage));
  }

  // Método para criar/atualizar o conteúdo de uma anotação
  salvarConteudoAnotacao(request: AnotacaoConteudoDTO): Observable<AnotacaoConteudoDTO> {
    console.log('Request enviado para salvar:', request);

    if (request.id) {
      // Atualiza o conteúdo existente
      return this.http.put<AnotacaoConteudoDTO>(`${this.apiUrl}/atualizar`, request, {
        headers: this.getHeaders()
      }).pipe(
        catchError(this.handleError)
      );
    } else {
      // Cria um novo conteúdo
      return this.http.post<AnotacaoConteudoDTO>(`${this.apiUrl}/criar`, request, {
        headers: this.getHeaders()
      }).pipe(
        catchError(this.handleError)
      );
    }
  }

  // Método para buscar o conteúdo de uma anotação pelo ID
  buscarConteudoPorAnotacaoId(anotacaoId: number): Observable<AnotacaoConteudoDTO> {
    console.log('Buscando conteúdo para anotação com ID:', anotacaoId);

    return this.http.get<AnotacaoConteudoDTO>(`${this.apiUrl}/anotacao/${anotacaoId}`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }
}
