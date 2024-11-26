import { Component, ViewEncapsulation } from '@angular/core';
import { ScheduleModule, View, PopupOpenEventArgs, EventSettingsModel } from '@syncfusion/ej2-angular-schedule';
import { DayService, WeekService, MonthService, AgendaService } from '@syncfusion/ej2-angular-schedule';
import { registerLicense, L10n } from '@syncfusion/ej2-base';
import { loadCldr } from '@syncfusion/ej2-base';
import ptNumberData from '@syncfusion/ej2-cldr-data/main/pt/numbers.json';
import ptTimeZoneData from '@syncfusion/ej2-cldr-data/main/pt/timeZoneNames.json';
import ptGregorian from '@syncfusion/ej2-cldr-data/main/pt/ca-gregorian.json';
import ptNumberingSystem from '@syncfusion/ej2-cldr-data/supplemental/numberingSystems.json';

registerLicense('Ngo9BigBOggjHTQxAR8/V1NDaF1cX2hIfEx3Qnxbf1x0ZFRMZF1bRnBPMyBoS35RckRiWHhccHZTQmRYWUFz');

loadCldr(ptNumberData, ptTimeZoneData, ptGregorian, ptNumberingSystem);

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
  providers: [DayService, WeekService, MonthService, AgendaService],
  template: `
    <ejs-schedule 
      height="100%" 
      width="100%" 
      [selectedDate]="dataAtual" 
      locale="pt"
      [views]="view"
      [eventSettings]="eventSettings"
      (popupOpen)="onPopupOpen($event)"
      class="agendador">
    </ejs-schedule>
  `,
  styleUrls: ['./agendador.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class AgendadorComponent {
  public dataAtual: Date = new Date();

  public view: View[] = ['Day', 'Week', 'Month', 'Agenda'];

  public eventSettings: EventSettingsModel = {
    fields: {
      id: 'Id',
      subject: { name: 'Subject', title: 'Título da Tarefa' },
      startTime: { name: 'StartTime', title: 'Início' },
      endTime: { name: 'EndTime', title: 'Fim' }
    }
  };

  saveEventToLocalStorage(event: any): void {
    const events = JSON.parse(localStorage.getItem('events') || '[]');
    events.push(event);
    localStorage.setItem('events', JSON.stringify(events));
  }

  onPopupOpen(args: PopupOpenEventArgs): void {
    const popupElement = args.element;
    const eventData = args.data as { [key: string]: any };
  
    
    const isSmallWindow = window.innerWidth <= 600; 

    let priorityDropDown: HTMLElement | null = popupElement.querySelector('.e-dropdownlist-container');
  
    if (isSmallWindow) {
      if (priorityDropDown) {
        priorityDropDown.remove();  
      }
    } else {
      if (!priorityDropDown) {
        priorityDropDown = document.createElement('div');
        priorityDropDown.classList.add('e-dropdownlist-container');
  
        const priorityLabel = document.createElement('label');
        priorityLabel.textContent = 'Prioridade:';
        priorityDropDown.appendChild(priorityLabel);
  
        const prioritySelect = document.createElement('select');
        const options = ['Baixa', 'Média', 'Alta'];
        options.forEach(option => {
          const optionElement = document.createElement('option');
          optionElement.value = option;
          optionElement.textContent = option;
          prioritySelect.appendChild(optionElement);
        });
  
        if (eventData && eventData['Priority']) {
          prioritySelect.value = eventData['Priority'];
        }
  
        priorityDropDown.appendChild(prioritySelect);
      }
  
      const locationContainer = popupElement.querySelector('.e-location-container');
      const existingPriorityField = popupElement.querySelector('.e-dropdownlist-container');
      
      if (locationContainer && !existingPriorityField) {
      } else if (!locationContainer) {
        const eventForm = popupElement.querySelector('.e-schedule-form');
        if (eventForm && !existingPriorityField) {
          eventForm.appendChild(priorityDropDown);  
        }
      }
    }
  
    const repeatField = popupElement.querySelector('.e-float-input.e-control-wrapper.e-input-group.e-ddl.e-lib.e-keyboard.e-valid-input');
    if (repeatField) {
      (repeatField as HTMLElement).style.display = 'none';
    }
  
    const allDayTimeZoneRow = popupElement.querySelector('.e-all-day-time-zone-row');
    if (allDayTimeZoneRow) {
      (allDayTimeZoneRow as HTMLElement).style.display = 'none';
    }
  
    const timeZoneRow = popupElement.querySelector('.e-time-zone-row');
    if (timeZoneRow) {
      (timeZoneRow as HTMLElement).style.display = 'none';
    }
  
    const saveButton = popupElement.querySelector('.e-save-btn') as HTMLButtonElement;
    if (saveButton && priorityDropDown) {
      saveButton.addEventListener('click', () => {
        const prioritySelect = priorityDropDown?.querySelector('select') as HTMLSelectElement;
        const selectedPriority = prioritySelect?.value; 

        if (eventData && selectedPriority) {
          eventData['Priority'] = selectedPriority;
        }
      });
    }
  }

  public addNewEvent(): void {
    const newEvent = {
      Id: 1,
      Subject: 'Estudar Angular',
      StartTime: new Date('2024-11-19T10:00:00'),
      EndTime: new Date('2024-11-19T12:00:00'),
      Priority: 'Alta' 
    };
  
    localStorage.setItem('evento', JSON.stringify(newEvent));


    console.log('Evento salvo:', localStorage.getItem('evento'));
   

  }
}
