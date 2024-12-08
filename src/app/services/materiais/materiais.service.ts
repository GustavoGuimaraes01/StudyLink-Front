import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MATERIAL_ENDPOINTS } from './endpoints';
import { AuthService } from '../auth/auth.service'; 
import { Material, MaterialCreateDTO, MaterialReadDTO, MaterialSearchDTO } from '../../types/materiais';

@Injectable({
  providedIn: 'root',
})
export class MateriaisService {
  private apiUrl = `${environment.apiBaseUrl}`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  listarMateriaisPublicos(): Observable<MaterialReadDTO[]> {
    const url = `${this.apiUrl}${MATERIAL_ENDPOINTS.descobrir}`;
    const headers = this.authService.getHeaders();
    return this.http.get<MaterialReadDTO[]>(url, { headers }).pipe(
      catchError((error) => {
        console.error('Erro ao listar materiais públicos:', error);
        return throwError(() => new Error('Erro ao listar materiais públicos.'));
      })
    );
  }

  pesquisarMateriais(termoPesquisa?: string): Observable<MaterialSearchDTO[]> {
    const url = termoPesquisa
      ? `${this.apiUrl}${MATERIAL_ENDPOINTS.pesquisar}?termoPesquisa=${encodeURIComponent(termoPesquisa)}`
      : `${this.apiUrl}${MATERIAL_ENDPOINTS.pesquisar}`;
    const headers = this.authService.getHeaders();
    return this.http.get<MaterialSearchDTO[]>(url, { headers }).pipe(
      catchError((error) => {
        console.error('Erro ao pesquisar materiais:', error);
        return throwError(() => new Error('Erro ao buscar materiais. Por favor, tente novamente mais tarde.'));
      })
    );
  }

  listarMateriais(): Observable<MaterialReadDTO[]> {
    const url = `${this.apiUrl}${MATERIAL_ENDPOINTS.listar}`;
    const headers = this.authService.getHeaders();
    return this.http.get<MaterialReadDTO[]>(url, { headers }).pipe(
      catchError((error) => {
        console.error('Erro ao listar todos os materiais:', error);
        return throwError(() => new Error('Erro ao listar materiais.'));
      })
    );
  }

  criarMaterial(material: MaterialCreateDTO): Observable<MaterialReadDTO> {
    const headers = this.authService.getHeaders();
    return this.http.post<MaterialReadDTO>(`${this.apiUrl}${MATERIAL_ENDPOINTS.adicionar}`, material, {
      headers,
    });
  }

  atualizarMaterial(id: number, material: Material): Observable<MaterialReadDTO> {
    const headers = this.authService.getHeaders();
    return this.http.put<MaterialReadDTO>(`${this.apiUrl}${MATERIAL_ENDPOINTS.atualizar(id)}`, material, {
      headers,
    });
  }

  deletarMaterial(id: number): Observable<string> {
    const headers = this.authService.getHeaders();
    return this.http.delete<string>(`${this.apiUrl}${MATERIAL_ENDPOINTS.deletar(id)}`, {
      headers,
      responseType: 'text' as 'json',
    });
  }
}
