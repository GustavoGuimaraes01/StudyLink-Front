import { Component } from '@angular/core';
import { DatePicker } from '@syncfusion/ej2-calendars';
import { ScheduleModule, View } from '@syncfusion/ej2-angular-schedule';
import { EventSettingsModel,WeekService, MonthService,  DayService, AgendaService } from '@syncfusion/ej2-angular-schedule';
import { registerLicense, L10n } from '@syncfusion/ej2-base';
import { loadCldr } from '@syncfusion/ej2-base';
import ptNumberData from '@syncfusion/ej2-cldr-data/main/pt/numbers.json';
import ptTimeZoneData from '@syncfusion/ej2-cldr-data/main/pt/timeZoneNames.json';
import ptGregorian from '@syncfusion/ej2-cldr-data/main/pt/ca-gregorian.json';
import ptNumberingSystem from '@syncfusion/ej2-cldr-data/supplemental/numberingSystems.json';

//Chave da licença
registerLicense('Ngo9BigBOggjHTQxAR8/V1NDaF5cWWtCf1JpRGRGfV5ycEVAal5VTnJbUj0eQnxTdEFiWX5XcHJRT2VYV0VwXA==');

// O loadCldr carrega os dados no formato que o Brasil utiliza
loadCldr(ptNumberData, ptTimeZoneData, ptGregorian, ptNumberingSystem);
//ptNumberData = formato dos numeros usados no Brasil
//ptTimeZoneData = fuso horario brasileiro, 
//ptgregorian = formato de datas, calendario gragoriano 
//ptNumberSystem = algorismos dos numeros 0-9

//Traduz as informaç~çeos para o portugues
L10n.load({
  'pt': {
    'schedule': {
      'day': 'Dia',
      'week': 'Semana',
      'workWeek': 'Semana de Trabalho',
      'month': 'Mês',
      'agenda': 'Agenda',
      'today': 'Hoje',
      'noEvents': 'Nenhum tarefa',
      'allDay': 'Dia inteiro',
      'start': 'Início',
      'end': 'Fim',
      'saveButton': 'Salvar',
      'cancelButton': 'Cancelar',
      'deleteButton': 'Excluir',
      'newEvent': 'Novo tarefa',
      'editEvent': 'Editar tarefa',
      'title':'titulo',
      'deleteEvent': 'Excluir tarefa',
      'confirmation': 'Confirmação',
      'deleteContent': 'Tem certeza de que deseja excluir este tarefa?',
      'deleteMultipleContent': 'Tem certeza de que deseja excluir essa tarefa?',
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
  //Injeta as propriedades locais .
  locale: 'pt',
  value: new Date()
});
datepickerObject.appendTo('#agendador');
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
      class="agendador">
    </ejs-schedule>
  `,
  styleUrls: ['./agendador.component.css']
})
export class AgendadorComponent {
  public dataAtual: Date = new Date();

  //Ajusta oq sera mostrado no header do calendario
  public view: View[] = ['Day','Week','Month','Agenda'] 
}
