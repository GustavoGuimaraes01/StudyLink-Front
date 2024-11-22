import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

export interface Material {
  id?: number;
  imagemBanner: string;
  titulo: string;
  areaConhecimento: string;
  visibilidade: string;
}

export interface MaterialCreateDTO {
  imagemBanner: string;
  titulo: string;
  areaConhecimento: string;
  visibilidade: string;
}

export interface MaterialReadDTO {
  id?: number;
  imagemBanner: string;
  titulo: string;
  areaConhecimento: string;
  visibilidade: string;
}

export interface MaterialSearchDTO {
  id?: number;
  imagemBanner: string;
  titulo: string;
  areaConhecimento: string;
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
  
    if (!token) {
      throw new Error('Token não encontrado no sessionStorage');
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }


  listarMateriaisPublicos(): Observable<MaterialReadDTO[]> {
    const url = `${this.apiUrl}/materiais/descobrir`; 
    return this.http.get<MaterialReadDTO[]>(url, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          console.error('Erro ao listar materiais públicos:', error);
          return throwError(() => new Error('Erro ao listar materiais públicos.'));
        })
      );
  }
  


  pesquisarMateriais(titulo?: string): Observable<MaterialSearchDTO[]> {
    const url = titulo 
      ? `${this.apiUrl}/materiais/pesquisar?titulo=${encodeURIComponent(titulo)}`
      : `${this.apiUrl}/materiais/pesquisar`;  
    return this.http.get<MaterialSearchDTO[]>(url, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          console.error('Erro ao pesquisar materiais:', error);
          return throwError(() => new Error('Erro ao buscar materiais.'));
        })
      );
  }

  listarMateriais(): Observable<MaterialReadDTO[]> {
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
    console.log('Enviando material para API:', material);
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
      headers: this.getHeaders(),
      responseType: 'text' as 'json'
    });
  }
}
