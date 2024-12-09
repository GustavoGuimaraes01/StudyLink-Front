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

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ocorreu um erro ao processar a requisição.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      errorMessage = `Código: ${error.status}, Mensagem: ${error.message}`;
    }
    console.error('Erro detalhado:', error);
    return throwError(() => new Error(errorMessage));
  }

  salvarConteudoAnotacao(request: AnotacaoConteudoDTO): Observable<AnotacaoConteudoDTO> {
    const headers = this.authService.getHeaders();
    console.log('Request enviado para salvar:', request);
  
    if (request.id) {
      console.log('Atualizando arquivo...');
    } else {
      console.log('Criando novo arquivo...');
    }
  
    return this.http.post<AnotacaoConteudoDTO>(`${this.apiUrl}/criar`, request, { headers }).pipe(
      catchError(error => {
        console.error('Erro no salvarConteudoAnotacao:', error);
        return this.handleError(error);
      })
    );
  }
  

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
