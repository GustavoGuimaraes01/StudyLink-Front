import { Component, ViewEncapsulation } from '@angular/core';
import { ScheduleModule, View, PopupOpenEventArgs, EventSettingsModel } from '@syncfusion/ej2-angular-schedule';
import { DayService, WeekService, MonthService, AgendaService } from '@syncfusion/ej2-angular-schedule';
import { registerLicense, L10n } from '@syncfusion/ej2-base';
import { loadCldr } from '@syncfusion/ej2-base';
import { TarefaService } from '../../services/tarefas/tarefa.service';
import { SchedulerEvent } from '../../types/tarefa';

import ptNumberData from '@syncfusion/ej2-cldr-data/main/pt/numbers.json';
import ptTimeZoneData from '@syncfusion/ej2-cldr-data/main/pt/timeZoneNames.json';
import ptGregorian from '@syncfusion/ej2-cldr-data/main/pt/ca-gregorian.json';
import ptNumberingSystem from '@syncfusion/ej2-cldr-data/supplemental/numberingSystems.json';

registerLicense('Ngo9BigBOggjHTQxAR8/V1NDaF1cX2hIfEx3Qnxbf1x0ZFRMZF1bRnBPMyBoS35RckRiWHhccHZTQmRYWUFz');

loadCldr(ptNumberData, ptTimeZoneData, ptGregorian, ptNumberingSystem);

// Tradução para o português
L10n.load({
  'pt': {
    'schedule': {
      'day': 'Dia',
      'week': 'Semana',
      'workWeek': 'Semana de Trabalho',
      'month': 'Mês',
      'agenda': 'Agenda',
      'today': 'Hoje',
      'noEvents': 'Nenhuma tarefa',
      'allDay': 'Dia inteiro',
      'start': 'Início',
      'end': 'Fim',
      'saveButton': 'Salvar',
      'cancelButton': 'Cancelar',
      'deleteButton': 'Excluir',
      'newEvent': 'Nova tarefa',
      'editEvent': 'Editar tarefa',
      'title': 'Título',
      'deleteEvent': 'Excluir tarefa',
      'confirmation': 'Confirmação',
      'deleteContent': 'Tem certeza de que deseja excluir esta tarefa?',
      'deleteMultipleContent': 'Tem certeza de que deseja excluir essas tarefas?',
      'moreDetails': 'Mais detalhes', 
      'edit': 'Editar',
      'add': 'Adicionar',
      'recurrence': 'Recorrência',
      'settings': 'Configurações',
      'subject': 'Assunto',
      'location': 'Local',
      'description': 'Descrição',
      'time': 'Horário',
      'eventTooltip': 'Dica de evento',
      'addTitle': 'Adicionar título',
      'save': 'Salvar',
      'delete': "Deletar",
      'cancel':'Cancelar'
    }
  }
});

@Component({
  selector: 'app-agendador',
  standalone: true,
  imports: [ScheduleModule],
  providers: [
    DayService, 
    WeekService, 
    MonthService, 
    AgendaService, 
    TarefaService
  ],
  template: `
    <ejs-schedule 
      #scheduleObj
      height="100%" 
      width="100%" 
      [selectedDate]="selectedDate" 
      locale="pt"
      [views]="views"
      [eventSettings]="eventSettings"
      (actionComplete)="onActionComplete($event)"
      (popupOpen)="onPopupOpen($event)"
      class="agendador">
    </ejs-schedule>
  `,
  styleUrls: ['./agendador.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class AgendadorComponent implements OnInit {
  @ViewChild('scheduleObj') 
  public scheduleObj!: ScheduleComponent;

  public selectedDate: Date = new Date();
  public views: View[] = ['Day', 'Week', 'Month', 'Agenda'];
  
  public eventSettings: EventSettingsModel = {
    dataSource: []
  };

  constructor(private tarefaService: TarefaService) {}

  ngOnInit() {
    this.carregarTarefas();
  }

  carregarTarefas() {
    const startOfMonth = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth(), 1);
    const endOfMonth = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth() + 1, 0);
  
    this.tarefaService.getTarefas(startOfMonth, endOfMonth)
      .subscribe({
        next: (tarefas: SchedulerEvent[]) => {
          // Antes de adicionar as tarefas no calendário, verificamos se não há duplicatas
          this.eventSettings = {
            dataSource: tarefas
          };
        },
        error: (erro) => {
          console.error('Erro ao carregar tarefas', erro);
        }
      });
  }
  

  onActionComplete(args: ActionEventArgs): void {
    if (Array.isArray(args.data) && args.data.length > 0) {
      const tarefa = args.data[0] as SchedulerEvent; // Obtém a tarefa que foi manipulada
  
      // Verifica o tipo de requisição e chama o método apropriado
      switch (args.requestType) {
        case 'eventCreated':
          this.criarTarefa(tarefa); // Chama o método para criar a tarefa
          break;
  
        case 'eventChanged':
          this.atualizarTarefa(tarefa); // Chama o método para atualizar a tarefa
          break;
  
        case 'eventRemoved':
          this.deletarTarefa(tarefa); // Chama o método para deletar a tarefa
          break;
  
        default:
          break;
      }
    }
  }
  

  onPopupOpen(args: PopupOpenEventArgs): void {
    // Lógica customizada para quando o popup do evento é aberto
  }

  criarTarefa(event: SchedulerEvent): void {
    this.tarefaService.criarTarefa(event).subscribe({
      next: () => {
        this.carregarTarefas(); // Recarrega as tarefas após a criação
      },
      error: (erro) => {
        console.error('Erro ao criar tarefa', erro);
      }
    });
  }

  atualizarTarefa(event: SchedulerEvent): void {
    this.tarefaService.updateTarefa(event).subscribe({
      next: () => {
        this.carregarTarefas(); 
      },
      error: (erro) => {
        console.error('Erro ao atualizar tarefa', erro);
      }
    });
  }

  deletarTarefa(event: SchedulerEvent): void {
    if (event.Id) {
      this.tarefaService.deletarTarefa(event.Id).subscribe({
        next: () => {
          this.carregarTarefas(); // Recarrega as tarefas após a exclusão
        },
        error: (erro) => {
          console.error('Erro ao deletar tarefa', erro);
        }
      });
    } else {
      console.error('ID da tarefa não definido');
    }
  }
}
