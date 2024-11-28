export interface SchedulerEvent {
  Id?:  string; 
  Subject: string;
  Description?: string;
  StartTime: Date | string;
  EndTime: Date | string;
  RecurrenceRule?: string;  
  RecurrenceID?: string | number;
  RecurrenceException?: string;
}

export interface TarefaDTO {
  id:  string;
  titulo: string;
  descricao: string;
  dataInicio: string;
  dataFim: string;
  recurrenceRule?: string;  
  recurrenceID?: string | number;
  recurrenceException?: string;
}


export interface TarefaCreateDTO {
  titulo: string;
  descricao: string;
  dataInicio: string;
  dataFim: string; 
  recurrenceRule?: string;  
  recurrenceID?: string | number;
  recurrenceException?: string;
}


export interface TarefaUpdateDTO {
  id: string;
  titulo: string;
  descricao: string;
  dataInicio: string;
  dataFim: string;
  recurrenceRule?: string;  
  recurrenceID?: string | number;
  recurrenceException?: string;
}