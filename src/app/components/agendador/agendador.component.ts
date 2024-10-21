import { Component } from '@angular/core';
import { DatePicker } from '@syncfusion/ej2-calendars';
import { ScheduleModule, View } from '@syncfusion/ej2-angular-schedule';
import { WeekService, MonthService, WorkWeekService, DayService, AgendaService } from '@syncfusion/ej2-angular-schedule';
import { registerLicense, L10n } from '@syncfusion/ej2-base';
import { loadCldr } from '@syncfusion/ej2-base';
import ptNumberData from '@syncfusion/ej2-cldr-data/main/pt/numbers.json';
import ptTimeZoneData from '@syncfusion/ej2-cldr-data/main/pt/timeZoneNames.json';
import ptGregorian from '@syncfusion/ej2-cldr-data/main/pt/ca-gregorian.json';
import ptNumberingSystem from '@syncfusion/ej2-cldr-data/supplemental/numberingSystems.json';

// Registro da licença
registerLicense('Ngo9BigBOggjHTQxAR8/V1NDaF5cWWtCf1JpRGRGfV5ycEVAal5VTnJbUj0eQnxTdEFiWX5XcHJRT2VYV0VwXA==');

// Carregar os dados da cultura brasileira
loadCldr(ptNumberData, ptTimeZoneData, ptGregorian, ptNumberingSystem);

// Carregar as traduções para o português (pt-BR)
L10n.load({
  'pt': {
    'schedule': {
      'day': 'Dia',
      'week': 'Semana',
      'workWeek': 'Semana de Trabalho',
      'month': 'Mês',
      'agenda': 'Agenda',
      'today': 'Hoje',
      'noEvents': 'Nenhum evento',
      'allDay': 'Dia inteiro',
      'start': 'Início',
      'end': 'Fim',
      'more': 'mais',
      'saveButton': 'Salvar',
      'cancelButton': 'Cancelar',
      'deleteButton': 'Excluir',
      'newEvent': 'Novo evento',
      'editEvent': 'Editar evento',
      'deleteEvent': 'Excluir evento',
      'confirmation': 'Confirmação',
      'deleteContent': 'Tem certeza de que deseja excluir este evento?',
      'deleteMultipleContent': 'Tem certeza de que deseja excluir esses eventos?',
      'days': {
        'sunday': 'Domingo',
        'monday': 'Segunda-feira',
        'tuesday': 'Terça-feira',
        'wednesday': 'Quarta-feira',
        'thursday': 'Quinta-feira',
        'friday': 'Sexta-feira',
        'saturday': 'Sábado'
      }
    }
  }
});
let datepickerObject: DatePicker = new DatePicker({
  // sets the locale property.
  locale: 'pt',
  value: new Date()
});
datepickerObject.appendTo('#agendador');

@Component({
  selector: 'app-agendador',
  standalone: true,
  imports: [ScheduleModule],
  providers: [DayService, WeekService, WorkWeekService, MonthService, AgendaService],
  template: `
    <ejs-schedule 
      height="100%" 
      width="80%" 
      [selectedDate]="dataAtual" 
      locale="pt"
      class="agendador">
    </ejs-schedule>
  `,
  styleUrls: ['./agendador.component.css']
})
export class AgendadorComponent {
  public dataAtual: Date = new Date();
}
