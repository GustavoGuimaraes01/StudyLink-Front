import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';


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
  providedIn: 'root'
})
export class AtividadesService {
  private apiUrl = `${environment.apiBaseUrl}`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('auth-token');
  
    if (!token) {
      throw new Error('Token não encontrado no sessionStorage');
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
  }

  criarAtividade(anotacao: CriarAnotacaoDTO): Observable<AnotacaoDTO> {
    return this.http.post<AnotacaoDTO>(`${this.apiUrl}atividades`, {
      titulo: anotacao.titulo,
      materialId: anotacao.materialId,
      dataUltimaAlteracao: anotacao.dataUltimaAlteracao
    }, { 
      headers: this.getHeaders() 
    }).pipe(
      catchError((error) => {
        console.error('Erro ao criar atividade:', error);
        return throwError(() => error);
      })
    );
  }
  
  listarAtividadesPorMaterial(materialId: number): Observable<AnotacaoDTO[]> {
    return this.http.get<AnotacaoDTO[]>(`${this.apiUrl}materiais/${materialId}/atividades`, { 
      headers: this.getHeaders()
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Erro ao listar atividades:', error);
        return throwError(() => new Error('Erro ao carregar atividades'));
      })
    );
  }

  
  deletarAtividade(atividadeId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}atividades/${atividadeId}`, {
      headers: this.getHeaders()
    }).pipe(
      catchError((error) => {
        console.error('Erro ao deletar atividade:', error);
        return throwError(() => new Error('Erro ao deletar atividade. Por favor, tente novamente.'));
      })
    );
  }
}