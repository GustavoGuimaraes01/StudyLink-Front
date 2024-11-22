import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

export interface Material {
  id?: number;
  imagem_banner: string;
  titulo: string;
  area_conhecimento: string;
  visibilidade: string;
}

export interface MaterialCreateDTO {
  imagem_banner: string;
  titulo: string;
  area_conhecimento: string;
  visibilidade: string;
}

export interface MaterialReadDTO {
  id?: number;
  imagem_banner: string;
  titulo: string;
  area_conhecimento: string;
  visibilidade: string;
}

export interface MaterialSearchDTO {
  id?: number;
  imagem_banner: string;
  titulo: string;
  area_conhecimento: string;
  visibilidade: string;
}

@Injectable({
  providedIn: 'root'
})
export class MaterialService {
  private apiUrl = 'http://localhost:8084/api'; 

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('auth-token');
    console.log('Token recuperado:', token); // Adicione este log
  
    if (!token) {
      throw new Error('Token não encontrado no sessionStorage');
    }
    return new HttpHeaders({
        'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  // Método para pesquisar materiais por título
  pesquisarMateriais(titulo?: string): Observable<MaterialSearchDTO[]> {
    const url = titulo 
      ? `${this.apiUrl}/materiais/pesquisar?titulo=${encodeURIComponent(titulo)}`
      : `${this.apiUrl}/materiais/pesquisar`;  // Altere para a rota de pesquisa
    return this.http.get<MaterialSearchDTO[]>(url, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          console.error('Erro ao pesquisar materiais:', error);
          return throwError(() => new Error('Erro ao buscar materiais.'));
        })
      );
  }

  listarTodosMateriais(): Observable<MaterialReadDTO[]> {
    const url = `${this.apiUrl}/materiais`; 
    return this.http.get<MaterialReadDTO[]>(url, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          console.error('Erro ao listar todos os materiais:', error);
          return throwError(() => new Error('Erro ao listar materiais.'));
        })
      );
  }

  criarMaterial(material: MaterialCreateDTO): Observable<MaterialReadDTO> {
    return this.http.post<MaterialReadDTO>(`${this.apiUrl}/materiais/add`, material, {      
      headers: this.getHeaders()
    });
  }

  atualizarMaterial(id: number, material: Material): Observable<MaterialReadDTO> {
    return this.http.put<MaterialReadDTO>(`${this.apiUrl}/materiais/${id}`, material, {
      headers: this.getHeaders()
    });
  }

  deletarMaterial(id: number): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/materiais/${id}`, {
      headers: this.getHeaders()
    });
  }
}
