import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { 
  TarefaDTO, 
  TarefaCreateDTO, 
  TarefaUpdateDTO, 
  SchedulerEvent 
} from '../../types/tarefa';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TarefaService {
  private apiUrl = `${environment.apiBaseUrl}tarefas`;

  constructor(private http: HttpClient) {}

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

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocorreu um erro na operação.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      errorMessage = `Código: ${error.status}, Mensagem: ${error.error || error.message}`;
    }
    console.error('Erro completo:', error);
    return throwError(() => new Error(errorMessage));
  }

  private toSchedulerEvent(tarefa: TarefaDTO): SchedulerEvent {
    return {
      Id: tarefa.id,
      Subject: tarefa.titulo,
      Description: tarefa.descricao || '',
      StartTime: new Date(tarefa.dataInicio),
      EndTime: new Date(tarefa.dataFim),
      RecurrenceRule: tarefa.recurrenceRule || undefined,
      RecurrenceID: tarefa.recurrenceID || undefined,
      RecurrenceException: tarefa.recurrenceException || undefined
    };
  }

  private formatLocalDateTime(date: Date | string): string {
    const d = date instanceof Date ? date : new Date(date);
    return this.formatDateForSpring(d);
  }

  private formatDateForSpring(date: Date): string {
    const pad = (n: number) => n < 10 ? `0${n}` : `${n}`;
    
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${
      pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  }

  private toCreateDTO(event: SchedulerEvent): TarefaCreateDTO {
    if (!event.Subject || !event.StartTime || !event.EndTime) {
      throw new Error('Dados obrigatórios ausentes no evento');
    }

    return {
      titulo: event.Subject,
      descricao: event.Description || '',
      dataInicio: this.formatLocalDateTime(event.StartTime),
      dataFim: this.formatLocalDateTime(event.EndTime),
      recurrenceRule: event.RecurrenceRule || undefined,
      recurrenceID: event.RecurrenceID || undefined,
      recurrenceException: event.RecurrenceException || undefined
    };
  }

  private toUpdateDTO(event: SchedulerEvent): TarefaDTO {
    return {
      id: event.Id || '',
      titulo: event.Subject,  
      descricao: event.Description || '', 
      dataInicio: this.formatLocalDateTime(new Date(event.StartTime)), 
      dataFim: this.formatLocalDateTime(new Date(event.EndTime)),  // Formatação da data de fim
      recurrenceID: event.RecurrenceID, 
      recurrenceRule: event.RecurrenceRule,  // Regra de recorrência (por exemplo, semanal)
      recurrenceException: event.RecurrenceException,  // Exceção de recorrência, se houver
    };
  }
  

  private getStartOfDay(date: Date): Date {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    return startOfDay;
  }

  private getEndOfDay(date: Date): Date {
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    return endOfDay;
  }

  getTarefas(dataInicio: Date, dataFim: Date): Observable<SchedulerEvent[]> {
    const startDate = this.formatLocalDateTime(this.getStartOfDay(dataInicio));
    const endDate = this.formatLocalDateTime(this.getEndOfDay(dataFim));
  
    return this.http.get<TarefaDTO[]>(`${this.apiUrl}/${startDate}/${endDate}`, { 
      headers: this.getHeaders() 
    }).pipe(
      map(tarefas => {
        console.log('Tarefas recebidas:', tarefas);
  
        const eventoSet = new Set<string>();
        return tarefas
          .map(tarefa => this.toSchedulerEvent(tarefa))
          .filter(tarefa => {
            const identificador = tarefa.RecurrenceException || tarefa.StartTime.toString();
            
            if (eventoSet.has(identificador)) {
              return false;
            }
  
            eventoSet.add(identificador);
            return true;
          });
      }),
      catchError(this.handleError)
    );
  }
  
  

  criarTarefa(event: SchedulerEvent): Observable<SchedulerEvent> {
    const tarefaDTO = this.toCreateDTO(event);
    console.log('TarefaDTO enviado:', tarefaDTO);
    
    return this.http.post<TarefaDTO>(this.apiUrl, tarefaDTO, { 
      headers: this.getHeaders() 
    }).pipe(
      map(response => {
        console.log('Resposta do backend:', response);
        return this.toSchedulerEvent(response);
      }),
      catchError(this.handleError)
    );
  }

  updateTarefa(event: SchedulerEvent): Observable<SchedulerEvent> {
    const tarefaDTO = this.toUpdateDTO(event);
    console.log('TarefaDTO editada:', tarefaDTO);
  
    return this.http.put<TarefaDTO>(`${this.apiUrl}/${event.Id}`, tarefaDTO, { 
      headers: this.getHeaders(),
      params: {
        editOccurrence: 'true' 
      }
    }).pipe(
      map(response => this.toSchedulerEvent(response)),
      catchError(this.handleError)
    );
  }
  
  

  deletarTarefa(id: string, recurrenceException?: string): Observable<void> {
    const url = recurrenceException 
      ? `${this.apiUrl}/${id}?recurrenceException=${encodeURIComponent(recurrenceException)}` 
      : `${this.apiUrl}/${id}`;

    return this.http.delete<void>(url, { 
      headers: this.getHeaders() 
    }).pipe(
      catchError(this.handleError)
    );
  }
}