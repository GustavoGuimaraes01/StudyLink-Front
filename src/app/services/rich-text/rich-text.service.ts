import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth/auth.service'; // Ajuste o caminho conforme necessário

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

  constructor(private http: HttpClient, private authService: AuthService) {}

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
    const headers = this.authService.getHeaders();
    console.log('Request enviado para salvar:', request);

    if (request.id) {
      // Atualiza o conteúdo existente
      return this.http.put<AnotacaoConteudoDTO>(`${this.apiUrl}/atualizar`, request, {
        headers
      }).pipe(
        catchError(this.handleError)
      );
    } else {
      // Cria um novo conteúdo
      return this.http.post<AnotacaoConteudoDTO>(`${this.apiUrl}/criar`, request, {
        headers
      }).pipe(
        catchError(this.handleError)
      );
    }
  }

  // Método para buscar o conteúdo de uma anotação pelo ID
  buscarConteudoPorAnotacaoId(anotacaoId: number): Observable<AnotacaoConteudoDTO> {
    const headers = this.authService.getHeaders();
    console.log('Buscando conteúdo para anotação com ID:', anotacaoId);

    return this.http.get<AnotacaoConteudoDTO>(`${this.apiUrl}/anotacao/${anotacaoId}`, {
      headers
    }).pipe(
      catchError(this.handleError)
    );
  }
}
