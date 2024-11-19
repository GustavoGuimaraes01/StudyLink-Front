import { Component, ViewEncapsulation } from '@angular/core';
import { ScheduleModule, View, PopupOpenEventArgs, EventSettingsModel } from '@syncfusion/ej2-angular-schedule';
import { DayService, WeekService, MonthService, AgendaService } from '@syncfusion/ej2-angular-schedule';
import { registerLicense, L10n } from '@syncfusion/ej2-base';
import { loadCldr } from '@syncfusion/ej2-base';
import ptNumberData from '@syncfusion/ej2-cldr-data/main/pt/numbers.json';
import ptTimeZoneData from '@syncfusion/ej2-cldr-data/main/pt/timeZoneNames.json';
import ptGregorian from '@syncfusion/ej2-cldr-data/main/pt/ca-gregorian.json';
import ptNumberingSystem from '@syncfusion/ej2-cldr-data/supplemental/numberingSystems.json';

// Chave da licença
registerLicense('Ngo9BigBOggjHTQxAR8/V1NDaF1cX2hIfEx3Qnxbf1x0ZFRMZF1bRnBPMyBoS35RckRiWHhccHZTQmRYWUFz');

// Carregamento de dados para o Brasil
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

  // Método para salvar evento no localStorage
  saveEventToLocalStorage(event: any): void {
    const events = JSON.parse(localStorage.getItem('events') || '[]');
    events.push(event);
    localStorage.setItem('events', JSON.stringify(events));
  }

  // Evento para abrir o Popup
  onPopupOpen(args: PopupOpenEventArgs): void {
    const popupElement = args.element;
    const eventData = args.data as { [key: string]: any };
  
    // Verificar o tamanho da janela (se a janela for pequena, não exibir o campo "Prioridade")
    const isSmallWindow = window.innerWidth <= 600; // Ajuste o limite de largura conforme necessário
  
    // Declara a variável priorityDropDown
    let priorityDropDown: HTMLElement | null = popupElement.querySelector('.e-dropdownlist-container');
  
    // Remover o campo "Prioridade" se a janela for pequena
    if (isSmallWindow) {
      if (priorityDropDown) {
        priorityDropDown.remove();  // Remove o campo de "Prioridade"
      }
    } else {
      // Adicionar o campo de Prioridade apenas se a janela for grande
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
  
        // Verificar se o evento já tem prioridade e definir no select
        if (eventData && eventData['Priority']) {
          prioritySelect.value = eventData['Priority'];
        }
  
        priorityDropDown.appendChild(prioritySelect);
      }
  
      // Verificar se o campo "Local" já foi substituído anteriormente
      const locationContainer = popupElement.querySelector('.e-location-container');
      const existingPriorityField = popupElement.querySelector('.e-dropdownlist-container');
      
      if (locationContainer && !existingPriorityField) {
        locationContainer.replaceWith(priorityDropDown);  // Substitui o campo "Local" por "Prioridade"
      } else if (!locationContainer) {
        const eventForm = popupElement.querySelector('.e-schedule-form');
        if (eventForm && !existingPriorityField) {
          eventForm.appendChild(priorityDropDown);  // Adiciona o campo "Prioridade"
        }
      }
    }
  
    // Ocultar o campo "Repetir"
    const repeatField = popupElement.querySelector('.e-float-input.e-control-wrapper.e-input-group.e-ddl.e-lib.e-keyboard.e-valid-input');
    if (repeatField) {
      (repeatField as HTMLElement).style.display = 'none';
    }
  
    // Ocultar os campos "Dia Inteiro" e "Fuso Horário"
    const allDayTimeZoneRow = popupElement.querySelector('.e-all-day-time-zone-row');
    if (allDayTimeZoneRow) {
      (allDayTimeZoneRow as HTMLElement).style.display = 'none';
    }
  
    const timeZoneRow = popupElement.querySelector('.e-time-zone-row');
    if (timeZoneRow) {
      (timeZoneRow as HTMLElement).style.display = 'none';
    }
  
    // Captura e salva a prioridade do evento no momento de salvar
    const saveButton = popupElement.querySelector('.e-save-btn') as HTMLButtonElement;
    if (saveButton && priorityDropDown) {
      saveButton.addEventListener('click', () => {
        // Verificar se priorityDropDown não é null antes de acessar o select
        const prioritySelect = priorityDropDown?.querySelector('select') as HTMLSelectElement;
        const selectedPriority = prioritySelect?.value; // Usar optional chaining
  
        // Salvar a prioridade no evento
        if (eventData && selectedPriority) {
          eventData['Priority'] = selectedPriority;
        }
      });
    }
  }

  // Exemplo de um evento com a propriedade "Priority"
  public addNewEvent(): void {
    const newEvent = {
      Id: 1,
      Subject: 'Estudar Angular',
      StartTime: new Date('2024-11-19T10:00:00'),
      EndTime: new Date('2024-11-19T12:00:00'),
      Priority: 'Alta' // Aqui definimos a prioridade
    };
  
    // Salve o evento no localStorage ou outro armazenamento, conforme necessário
    localStorage.setItem('evento', JSON.stringify(newEvent));


    console.log('Evento salvo:', localStorage.getItem('evento'));
   

    // Adicionar o evento ao calendário
    // (Utilize o método correspondente para adicionar o evento ao Schedule)
  }
}
