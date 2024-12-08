import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth/auth.service'; // Ajuste o caminho conforme necessário

export interface CriarAnotacaoDTO {
  materialId?: number; 
  titulo: string;
  dataUltimaAlteracao?: string;
}

export interface AnotacaoDTO {
  id?: number;
  materialId?: number;
  titulo: string;
  dataUltimaAlteracao?: string; 
}

@Injectable({
  providedIn: 'root',
})
export class AtividadesService {
  private apiUrl = `${environment.apiBaseUrl}`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  criarAtividade(anotacao: CriarAnotacaoDTO): Observable<AnotacaoDTO> {
    const headers = this.authService.getHeaders();
    return this.http.post<AnotacaoDTO>(`${this.apiUrl}atividades`, {
      titulo: anotacao.titulo,
      materialId: anotacao.materialId,
      dataUltimaAlteracao: anotacao.dataUltimaAlteracao,
    }, { 
      headers,
    }).pipe(
      catchError((error) => {
        console.error('Erro ao criar atividade:', error);
        return throwError(() => error);
      })
    );
  }
  
  listarAtividadesPorMaterial(materialId: number): Observable<AnotacaoDTO[]> {
    const headers = this.authService.getHeaders();
    return this.http.get<AnotacaoDTO[]>(`${this.apiUrl}materiais/${materialId}/atividades`, { 
      headers,
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Erro ao listar atividades:', error);
        return throwError(() => new Error('Erro ao carregar atividades'));
      })
    );
  }

  atualizarAtividade(id: number, dto: CriarAnotacaoDTO): Observable<AnotacaoDTO> {
    const headers = this.authService.getHeaders();
    return this.http.put<AnotacaoDTO>(`${this.apiUrl}atividades/${id}`, dto, {
      headers,
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Erro ao atualizar atividades:', error);
        return throwError(() => new Error('Erro ao atualizar atividades'));
      })
    );
  }

  deletarAtividade(atividadeId: number): Observable<void> {
    const headers = this.authService.getHeaders();
    return this.http.delete<void>(`${this.apiUrl}atividades/${atividadeId}`, {
      headers,
    }).pipe(
      catchError((error) => {
        console.error('Erro ao deletar atividade:', error);
        return throwError(() => new Error('Erro ao deletar atividade. Por favor, tente novamente.'));
      })
    );
  }
}
